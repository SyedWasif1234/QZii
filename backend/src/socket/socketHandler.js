import { v4 as uuidv4 } from "uuid"; // to generate unique room Id
import redis from "../lib/redis.js";

export const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`🙎‍♂️ User connected ✅: ${socket.id}`);

    // --- 1. CREATE CHALLENGE (Host) ---
    socket.on("create_challenge", async ({ quizId, username }) => {
      try {
        //username - logedIn user
        //quizId - selected quiz
        //these two will come from frontend that is from client side like something client.emit("create-challange" , data)
        //data = {quizId , username}

        // Generate a short unique Room ID
        const roomId = uuidv4().slice(0, 8);
        const roomKey = `room:${roomId}`;

        // Prepare Room Data
        const roomData = {
          roomId,
          hostSocketId: socket.id,
          hostName: username || "Player 1",
          quizId,
          status: "waiting", // waiting | active
          created_at: Date.now(),
        };

        console.log("ROOME DATA :", roomData);

        // A. Store Room in Redis (Hash)

        // We use JSON.stringify for some values if needed, but Upstash handles flat objects well in hset
        //flat objects are objects that have no nested objects or arrays.

        //hset key field value: To store the room object (e.g., room:123).

        await redis.hset(roomKey, roomData);

        // B. Set Expiry (Room dies after 1 hour to save space)
        await redis.expire(roomKey, 3600);

        // C. Map Socket ID to Room ID (So we handle disconnects easily)
        await redis.set(`socket:${socket.id}`, roomId);
        await redis.expire(`socket:${socket.id}`, 3600);

        // D. Join Socket Room
        socket.join(roomId);

        console.log(`[Redis] Room Created: ${roomId} by ${username}`);

        // E. Reply to Client
        socket.emit("room_created", {
          roomId,
          link: `/battle/room/${roomId}`,
        });
      } catch (error) {
        console.error("Redis Error creating room:", error);
        socket.emit("room_error", { message: "Failed to create room." });
      }
    });

    // --- 2. JOIN CHALLENGE (Friend) ---
    // --- 2. JOIN CHALLENGE (Friend) ---
    socket.on("join_challenge", async ({ roomId, username }) => {
      try {
        const roomKey = `room:${roomId}`;
        const room = await redis.hgetall(roomKey);

        console.log("ROOM DATA IN THE VARIABLE room : ", room);

        // Validation
        if (!room || Object.keys(room).length === 0) {
          socket.emit("room_error", { message: "Room not found or expired." });
          return;
        }

        // --- LOGIC: HANDLE RE-JOINS & ROLES ---

        console.log(`🔍 DEBUG JOIN:`);
        console.log(`- Incoming User: ${username}`);
        console.log(`- Stored Host: ${room.hostName}`);
        console.log(`- Match? ${room.hostName === username}`);

        // 1. IS THIS THE HOST?
        if (room.hostName === username) {
          // Update Host's latest socket ID
          await redis.hset(roomKey, { hostSocketId: socket.id });
          await redis.set(`socket:${socket.id}`, roomId);
          socket.join(roomId);

          // If game is already running, just put them back in
          if (room.status === "active") {
            emitStartGame(
              io,
              roomId,
              room.quizId,
              socket.id,
              room.hostName,
              room.player2SocketId,
              room.player2Name
            );
          }
          return; // STOP EXECUTION
        }

        // 2. IS THIS PLAYER 2 RE-JOINING? (Fixes "Lobby Full" on refresh)
        if (room.player2Name === username) {
          // Update P2's latest socket ID
          await redis.hset(roomKey, { player2SocketId: socket.id });
          await redis.set(`socket:${socket.id}`, roomId);
          socket.join(roomId);

          emitStartGame(
            io,
            roomId,
            room.quizId,
            room.hostSocketId,
            room.hostName,
            socket.id,
            room.player2Name
          );
          return; // STOP EXECUTION
        }

        // 3. IS ROOM FULL? (New Player trying to enter)
        if (room.status !== "waiting") {
          socket.emit("room_error", {
            message: "Match already started or full.",
          });
          return;
        }

        // 4. NEW PLAYER JOINING (Success Case)
        await redis.hset(roomKey, {
          player2SocketId: socket.id,
          player2Name: username,
          status: "active",
        });

        await redis.set(`socket:${socket.id}`, roomId);
        socket.join(roomId);

        console.log(`[Redis] Player Joined Room: ${roomId}`);

        // Notify Everyone
        emitStartGame(
          io,
          roomId,
          room.quizId,
          room.hostSocketId,
          room.hostName,
          socket.id,
          username
        );
      } catch (error) {
        console.error("Redis Error joining room:", error);
      }
    });

    socket.on(
      "submit_answer",
      async ({ roomId, questionIndex, time_taken, selectedOption }) => {
        try {
          const roomKey = `room:${roomId}`;

          // fetch all the data of the specific room
          const room = await redis.hgetall(roomKey);

          // check if  the room exist
          if (!room || Object.keys(room).length === 0) {
            socket.emit("room_error", {
              message: "Room not found or expired.",
            });
            return;
          }

          //we will find which player answered if he is host or player 2
          const isHost = room.hostSocketId === socket.id;
          const playerKey = isHost ? "p1" : "p2";

          // Ideally, we stored the full quiz in Redis when room was created.
          // IN PRODUCTION WE WILL CALL THE DATABASE FOR THE CORRECT ANSWER
          // const correctAnswer = await getCorrectAnswer(room.quizId, questionIndex);

          const correctAnswer = 0; // DUMMY: Assume option 0 is always correct for testing

          // 3. Calculating Bonous Score
          let points = 0;
          if (selectedOption === correctAnswer) {
            const speedBonus = Math.max(0, (15 - time_taken) * 2); // More time left = more points
            points = 10 + speedBonus;
          }

          // 4. Update Redis State
          // Storing that this player is "Ready" for next round
          const updateData = {};
          updateData[`${playerKey}_score`] =
            parseInt(room[`${playerKey}_score`] || 0) + points;
          updateData[`${playerKey}_answered`] = "true"; // Mark as done

          await redis.hset(roomKey, updateData);

          const updatedRoom = await redis.hgetall(roomKey);

          if (
            updatedRoom.p1_answered === "true" &&
            updatedRoom.p2_answered === "true"
           ) {
            //MOVE TO THE NEXT QUESTION
            await redis.hset(roomKey, {
              p1_answered: "false",
              p2_answered: "false",
            });

            const next_Index = questionIndex + 1;

            // HERE I WILL STORE Total_Questions variable in room
            // But as of now i am storing hard coded variable here

            const Total_Questions = 5;

            if (next_Index >= Total_Questions) {
              io.to(roomId).emit("game_over", {
                p1: { score: updatedRoom.p1_score },
                p2: { score: updatedRoom.p2_score },
              });
            } else {
              io.to(roomId).emit("next_question", {
                next_Index: next_Index,
                scores: {
                  p1: updatedRoom.p1_score,
                  p2: updatedRoom.p2_score,
                },
              });
            }
          } else {
            // ONLY ONE ANSWERED -> Notify opponent "Waiting for you..."
            socket.to(roomId).emit("opponent_answered");
          }
        } catch (error) {
          console.log("REDIS ERROR SUBMITTING ANSWER :", error);
        }
      }
    );

    // --- 3. DISCONNECT HANDLER ---
    socket.on("disconnect", async () => {
      console.log(`❌ User disconnected: ${socket.id}`);

      try {
        // A. Find which room this user was in
        const socketKey = `socket:${socket.id}`;
        const roomId = await redis.get(socketKey);

        if (roomId) {
          const roomKey = `room:${roomId}`;
          const room = await redis.hgetall(roomKey);

          // If room exists and status is 'waiting', and the HOST left -> Delete Room
          if (
            room &&
            room.status === "waiting" &&
            room.hostSocketId === socket.id
          ) {
            await redis.del(roomKey);
            console.log(`[Redis] Room ${roomId} deleted (Host left).`);
          }

          // Cleanup the socket mapping
          await redis.del(socketKey);
        }
      } catch (error) {
        console.error("Redis Cleanup Error:", error);
      }
    });
  });
};

const emitStartGame = (io, roomId, quizId, hostId, hostName, p2Id, p2Name) => {
  io.to(roomId).emit("start_game", {
    roomId,
    quizId,
    players: {
      p1: { id: hostId, name: hostName },
      p2: { id: p2Id, name: p2Name },
    },
  });
};
