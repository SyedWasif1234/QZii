import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertTriangle } from "lucide-react";

// Stores
import { useSocketStore } from "../store/useSocketStore";
import { useAuthStore } from "../store/useAuthStore";

// Components
import ActiveBattleGame from "../components/ActiveBattleGame";

const BattleArena = () => {
  const { roomId } = useParams(); // Get Room ID from URL
  const navigate = useNavigate();
  
  const { authUser } = useAuthStore();
  
  const { 
    socket,
    isConnected,
    joinChallengeRoom, 
    activeRoom, 
    gameStarted, 
    error 
  } = useSocketStore();

  // --- GAME STATE (Local Simulation for UI Testing) ---
  // In the next step, these will be replaced by data from the socket store
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  
  // Mock Question Data (Will be replaced by real questions from backend)
  const dummyQuestions = [
    {
       text: "What is the output of typeof null in JavaScript?",
       options: ["'object'", "'null'", "'undefined'", "'number'"],
       correct: 0
    },
    {
       text: "Which hook is used for side effects in React?",
       options: ["useState", "useReducer", "useEffect", "useMemo"],
       correct: 2
    },
    {
       text: "Which SQL statement is used to extract data from a database?",
       options: ["OPEN", "GET", "EXTRACT", "SELECT"],
       correct: 3
    }
  ];

  // --- 1. JOIN LOGIC ---
  useEffect(() => {
    // Only attempt to join if:
    // 1. We have a Room ID
    // 2. We are logged in
    // 3. Socket is connected
    if (roomId && authUser && isConnected && socket) {
      console.log(`🔗 Attempting to join room: ${roomId} as ${authUser?.user?.name}`);
      
      // FIX: Use optional chaining to prevent crash if authUser is null
      // IMPORTANT: sending fullName/name exactly as stored in DB
      joinChallengeRoom(roomId, authUser?.user?.name || "Guest");
    }
  }, [roomId, authUser, isConnected, socket, joinChallengeRoom]); 


  // --- 2. TIMER LOGIC (Mock) ---
  useEffect(() => {
    if (gameStarted) {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    // Auto move to next question for demo
                    setCurrentQIndex(curr => (curr + 1) % dummyQuestions.length);
                    return 15;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }
  }, [gameStarted, dummyQuestions.length]);


  // --- UI STATE 1: ERROR ---
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Battle Error</h2>
          <p className="text-slate-500 mb-6 text-sm">{error}</p>
          <button 
            onClick={() => navigate('/battle')}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition active:scale-95"
          >
            Return to Lobby
          </button>
        </div>
      </div>
    );
  }

  // --- UI STATE 2: WAITING LOBBY (Before P2 Joins) ---
  if (!gameStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans p-4">
        <div className="text-center space-y-6 max-w-sm w-full">
          
          {/* Animated Loader */}
          <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 bg-sky-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-white p-6 rounded-full shadow-lg border border-sky-100">
              <Loader2 className="animate-spin text-sky-600" size={40} />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Waiting for Opponent...</h2>
            <p className="text-slate-500 text-sm">
              Room Code: <span className="font-mono font-bold text-slate-700 bg-slate-200 px-2 py-1 rounded ml-1">{roomId}</span>
            </p>
          </div>
          
          {/* Host Info Card */}
          {activeRoom && (
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Host</span>
               <div className="flex items-center gap-3">
                 <span className="font-bold text-slate-700 text-sm">{activeRoom.hostName || "Unknown"}</span>
                 <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                    {activeRoom.hostName?.[0] || "H"}
                 </div>
               </div>
            </div>
          )}

          <button 
             onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link Copied!");
             }}
             className="text-sky-600 text-sm font-semibold hover:underline cursor-pointer"
          >
            Copy Invite Link
          </button>
        </div>
      </div>
    );
  }

  // --- UI STATE 3: ACTIVE GAME ---
  return (
    <div className="min-h-screen bg-slate-50 p-4 pt-6 md:pt-10 font-sans">
      <ActiveBattleGame 
        roomData={activeRoom}
        currentQuestion={dummyQuestions[currentQIndex]}
        totalQuestions={dummyQuestions.length}
        questionIndex={currentQIndex}
        timeLeft={timeLeft}
        onAnswerSubmit={(selectedIndex) => {
            console.log("User selected option index:", selectedIndex);
            // In next step: socket.emit('submit_answer', { roomId, answer: selectedIndex })
        }}
      />
    </div>
  );
};

export default BattleArena;