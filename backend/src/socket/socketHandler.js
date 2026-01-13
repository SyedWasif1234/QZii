import { v4 as uuidv4 } from "uuid"; 
import redis from "../lib/redis.js";
import { FetchQuizData } from "../quiz/quiz.controller.js";

export const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`🙎‍♂️ User connected ✅: ${socket.id}`);

    // --- 1. CREATE CHALLENGE (Host) ---
    socket.on("create_challenge", async ({ quizId, username }) => {
      try {
        const quiz = await FetchQuizData(quizId);

        if (!quiz) {
          socket.emit("room_error", { message: "Quiz not found!" });
          return;
        }

        const roomId = uuidv4().slice(0, 8);
        const roomKey = `room:${roomId}`;

        // 1. Extract Correct Answer Indices (e.g., [2, 0, 1])
        const correctAnswers = quiz.questions.map((question) => {
          return question.options.findIndex((option) => option.isCorrect === true);
        });

        // 2. Prepare Client Questions (Hide correct answer)
        const clientQuestions = quiz.questions.map((q) => ({
          text: q.title,
          options: q.options.map((o) => o.text),
        }));

        const roomData = {
          roomId,
          hostSocketId: socket.id,
          hostName: username || "Player 1",
          quizId,
          status: "waiting",
          
          // Store data in Redis as strings
          correctAnswers: JSON.stringify(correctAnswers),
          questions: JSON.stringify(clientQuestions),
          totalQuestions: quiz.questions.length,

          p1_score: 0,
          p2_score: 0,
          p1_answered: "false",
          p2_answered: "false",
        };

        await redis.hset(roomKey, roomData);
        await redis.expire(roomKey, 3600);
        await redis.set(`socket:${socket.id}`, roomId);
        await redis.expire(`socket:${socket.id}`, 3600);

        socket.join(roomId);
        console.log(`[Redis] Room Created: ${roomId} by ${username}`);

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
    socket.on("join_challenge", async ({ roomId, username }) => {
      try {
        const roomKey = `room:${roomId}`;
        const room = await redis.hgetall(roomKey);

        if (!room || Object.keys(room).length === 0) {
          socket.emit("room_error", { message: "Room not found or expired." });
          return;
        }

        // --- RE-JOIN LOGIC ---

        // 1. IS THIS THE HOST?
        if (room.hostName === username) {
          await redis.hset(roomKey, { hostSocketId: socket.id });
          await redis.set(`socket:${socket.id}`, roomId);
          socket.join(roomId);

          if (room.status === "active") {
            // FIX: Passing room.questions
            emitStartGame(io, roomId, room.questions, room.quizId, socket.id, room.hostName, room.player2SocketId, room.player2Name);
          }
          return;
        }

        // 2. IS THIS PLAYER 2?
        if (room.player2Name === username) {
          await redis.hset(roomKey, { player2SocketId: socket.id });
          await redis.set(`socket:${socket.id}`, roomId);
          socket.join(roomId);

          // FIX: Passing room.questions
          emitStartGame(io, roomId, room.questions, room.quizId, room.hostSocketId, room.hostName, socket.id, room.player2Name);
          return;
        }

        // 3. IS ROOM FULL?
        if (room.status !== "waiting") {
          socket.emit("room_error", { message: "Match already started or full." });
          return;
        }

        // 4. NEW PLAYER JOINING
        await redis.hset(roomKey, {
          player2SocketId: socket.id,
          player2Name: username,
          status: "active",
        });

        await redis.set(`socket:${socket.id}`, roomId);
        socket.join(roomId);

        console.log(`[Redis] Player Joined Room: ${roomId}`);

        // FIX: Passing room.questions
        emitStartGame(io, roomId, room.questions, room.quizId, room.hostSocketId, room.hostName, socket.id, username);

      } catch (error) {
        console.error("Redis Error joining room:", error);
      }
    });

    // --- 3. SUBMIT ANSWER ---
    socket.on("submit_answer", async ({ roomId, questionIndex, selectedOption, timeTaken }) => {
        try {
          const roomKey = `room:${roomId}`;
          const room = await redis.hgetall(roomKey);

          if (!room || Object.keys(room).length === 0) return;

          // 1. Get Correct Answer from Redis
          const correctAnswers = JSON.parse(room.correctAnswers);
          const actualCorrectIndex = correctAnswers[questionIndex];

          const isHost = room.hostSocketId === socket.id;
          const playerKey = isHost ? "p1" : "p2";

          // 2. Calculate Score
          let points = 0;
          // Compare indices (ensure they are numbers)
          if (parseInt(selectedOption) === parseInt(actualCorrectIndex)) {
            const speedBonus = Math.max(0, (15 - timeTaken) * 2);
            points = 10 + speedBonus;
          }

          // 3. Update Redis
          const updateData = {};
          updateData[`${playerKey}_score`] = parseInt(room[`${playerKey}_score`] || 0) + points;
          updateData[`${playerKey}_answered`] = "true";

          await redis.hset(roomKey, updateData);

          // 4. Check if Both Answered
          const updatedRoom = await redis.hgetall(roomKey);

          if (updatedRoom.p1_answered === "true" && updatedRoom.p2_answered === "true") {
            
            // Reset flags
            await redis.hset(roomKey, { p1_answered: "false", p2_answered: "false" });

            const nextIndex = questionIndex + 1;
            
            // FIX: Get real total from Redis
            const totalQuestions = parseInt(updatedRoom.totalQuestions);

            if (nextIndex >= totalQuestions) {
              // GAME OVER
              io.to(roomId).emit("game_over", {
                p1: { score: updatedRoom.p1_score },
                p2: { score: updatedRoom.p2_score },
              });
              // Optional: Delete room or save to DB here
            } else {
              // NEXT QUESTION
              io.to(roomId).emit("next_question", {
                nextIndex: nextIndex,
                scores: {
                  p1: updatedRoom.p1_score,
                  p2: updatedRoom.p2_score,
                },
              });
            }
          } else {
            // One player waiting
            socket.to(roomId).emit("opponent_answered");
          }

        } catch (error) {
          console.error("Submit Answer Error:", error);
        }
      }
    );

    // --- 4. DISCONNECT ---
    socket.on("disconnect", async () => {
      console.log(`❌ User disconnected: ${socket.id}`);
      try {
        const socketKey = `socket:${socket.id}`;
        const roomId = await redis.get(socketKey);

        if (roomId) {
          const roomKey = `room:${roomId}`;
          const room = await redis.hgetall(roomKey);

          // If Host leaves a waiting room -> Delete it
          if (room && room.status === "waiting" && room.hostSocketId === socket.id) {
            await redis.del(roomKey);
          }
          await redis.del(socketKey);
        }
      } catch (error) {
        console.error("Disconnect Error:", error);
      }
    });
  });
};

// --- HELPER FUNCTION ---
// Handles parsing questions before sending
const emitStartGame = (io, roomId, questionsString, quizId, hostId, hostName, p2Id, p2Name) => {
  let questions = [];
  try {
     questions = typeof questionsString === 'string' ? JSON.parse(questionsString) : questionsString;
  } catch (e) {
     console.error("Error parsing questions:", e);
  }

  io.to(roomId).emit("start_game", {
    roomId,
    quizId,
    players: {
      p1: { id: hostId, name: hostName },
      p2: { id: p2Id, name: p2Name },
    },
    questions: questions, 
  });
};