import { create } from "zustand";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:8000";

export const useSocketStore = create((set, get) => ({
  // --- CONNECTION STATE ---
  socket: null,
  isConnected: false,
  error: null,

  // --- BATTLE STATE ---
  isFindingMatch: false,
  activeRoom: null,          // Stores { roomId, players: {p1, p2}, quizId, ... }
  gameStarted: false,        // True when both players are connected
  
  // --- GAMEPLAY STATE (NEW) ---
  questions: [],             // Array of question objects from backend
  currentQuestionIndex: 0,   // Tracks which question we are on (0, 1, 2...)
  opponentStatus: "thinking",// 'thinking' | 'answered' (Visual feedback)
  battleResult: null,        // Stores final scores when game ends

  // 1. INITIALIZE CONNECTION
  connectSocket: () => {
    const { socket } = get();
    if (socket?.connected) return; // Prevent double connections

    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: true,
    });

    // ---- GLOBAL LISTENERS ----
    newSocket.on("connect", () => {
      console.log("🟢 Socket Connected:", newSocket.id);
      set({ isConnected: true, error: null });
    });

    newSocket.on("disconnect", () => {
      console.log("🔴 Socket Disconnected");
      set({ isConnected: false, activeRoom: null, gameStarted: false });
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket Error:", err);
      set({ error: "Connection failed" });
    });

    // ---- BATTLE LISTENERS ----

    // A. Room Created (Host Only)
    newSocket.on("room_created", (data) => {
      set({ activeRoom: data, isFindingMatch: false });
    });

    // B. Game Started (Both Players)
    newSocket.on("start_game", (data) => {
      console.log("🚀 Game Started! Data:", data);
      set({ 
        activeRoom: data, 
        gameStarted: true,
        questions: data.questions || [], // Store the fetched questions
        currentQuestionIndex: 0,         // Reset to first question
        opponentStatus: "thinking",
        battleResult: null
      });
    });

    // C. Next Question (Both Players moved to next round)
    newSocket.on("next_question", (data) => {
      console.log("⏭️ Next Question:", data);
      
      const { activeRoom } = get();
      
      // Update scores in activeRoom without mutating deeply
      const updatedPlayers = {
        p1: { ...activeRoom.players.p1, score: data.scores.p1, hasAnswered: false },
        p2: { ...activeRoom.players.p2, score: data.scores.p2, hasAnswered: false }
      };

      set({
        activeRoom: { ...activeRoom, players: updatedPlayers },
        currentQuestionIndex: data.nextIndex,
        opponentStatus: "thinking" // Reset opponent status for new round
      });
    });

    // D. Opponent Answered (Visual Feedback)
    newSocket.on("opponent_answered", () => {
       console.log("⏳ Opponent has answered.");
       set({ opponentStatus: "answered" });
    });

    // E. Game Over (Final Results)
    newSocket.on("game_over", (data) => {
      console.log("🏆 Game Over:", data);
      set({ battleResult: data }); // { p1: {score}, p2: {score} }
    });

    // F. Error Handling
    newSocket.on("room_error", (err) => {
      set({ error: err.message, isFindingMatch: false });
      alert(err.message); 
    });

    set({ socket: newSocket });
  },

  // 2. CLEANUP
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ 
        socket: null, 
        isConnected: false, 
        activeRoom: null, 
        questions: [],
        gameStarted: false 
      });
    }
  },

  // --- ACTIONS (Emitting Events) ---

  createChallengeRoom: (quizId, username) => {
    console.log("Creating Room as:", username);
    const { socket } = get();
    if (!socket) return;
    
    set({ isFindingMatch: true, error: null, activeRoom: null, gameStarted: false });
    socket.emit("create_challenge", { quizId, username });
  },

  joinChallengeRoom: (roomId, username) => {
    console.log("Joining Room as:", username);
    const { socket } = get();
    if (!socket) return;

    set({ error: null });
    socket.emit("join_challenge", { roomId, username });
  },

  submitAnswer: (roomId, questionIndex, selectedOption, timeTaken) => {
    const { socket } = get();
    if (!socket) return;

    console.log(`📤 Submitting Answer: Opt ${selectedOption} in ${timeTaken}s`);
    socket.emit("submit_answer", { 
        roomId, 
        questionIndex, 
        selectedOption, 
        timeTaken 
    });
  },

  resetBattleState: () => {
    set({ 
      activeRoom: null, 
      gameStarted: false, 
      error: null,
      questions: [],
      currentQuestionIndex: 0,
      battleResult: null
    });
  }

}));