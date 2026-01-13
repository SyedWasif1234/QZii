import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertTriangle } from "lucide-react";

// Stores
import { useSocketStore } from "../store/useSocketStore";
import { useAuthStore } from "../store/useAuthStore";

// Components
import ActiveBattleGame from "../components/ActiveBattleGame";
import BattleResults from "../components/BattleResults";

const BattleArena = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  
  // Destructure everything we need from the store
  const { 
    socket,
    isConnected,
    joinChallengeRoom, 
    submitAnswer,
    activeRoom, 
    gameStarted, 
    battleResult, // New: Checks if game ended
    questions,    // New: The real questions from Redis
    currentQuestionIndex,
    error 
  } = useSocketStore();

  // --- LOCAL VISUAL TIMER ---
  // We use this to show a countdown. 
  // It resets every time 'currentQuestionIndex' changes (Server moves to next round)
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    // Reset timer when question index changes
    setTimeLeft(15);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (gameStarted && !battleResult) {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }
  }, [gameStarted, battleResult, currentQuestionIndex]);


  // --- JOIN LOGIC ---
  useEffect(() => {
    if (roomId && authUser && isConnected && socket) {
      console.log(`🔗 Joining room: ${roomId}`);
      // Important: Name must match exactly what was used to create room
      joinChallengeRoom(roomId, authUser?.user?.name || authUser?.fullName);
    }
  }, [roomId, authUser, isConnected, socket, joinChallengeRoom]);


  // --- RENDER 1: ERRORS ---
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Battle Error</h2>
          <p className="text-slate-500 mb-6 text-sm">{error}</p>
          <button onClick={() => navigate('/battle')} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold">Return to Lobby</button>
        </div>
      </div>
    );
  }

  // --- RENDER 2: GAME OVER (RESULTS) ---
  if (battleResult) {
    return <BattleResults />;
  }

  // --- RENDER 3: WAITING ROOM ---
  if (!gameStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans p-4">
        <div className="text-center space-y-6 max-w-sm w-full">
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
          
          {/* Host Info */}
          {activeRoom && (
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Host</span>
               <div className="flex items-center gap-3">
                 <span className="font-bold text-slate-700 text-sm">{activeRoom.hostName}</span>
                 <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                    {activeRoom.hostName?.[0]}
                 </div>
               </div>
            </div>
          )}
          
          <button 
             onClick={() => {navigator.clipboard.writeText(window.location.href); alert("Copied!");}}
             className="text-sky-600 text-sm font-semibold hover:underline cursor-pointer"
          >
            Copy Invite Link
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER 4: ACTIVE GAME ---
  return (
    <div className="min-h-screen bg-slate-50 p-4 pt-6 md:pt-10 font-sans">
      <ActiveBattleGame 
        roomData={activeRoom}
        // Safely access questions array from store
        currentQuestion={questions && questions[currentQuestionIndex]}
        totalQuestions={questions ? questions.length : 0}
        questionIndex={currentQuestionIndex}
        timeLeft={timeLeft}
        onAnswerSubmit={(selectedIndex) => {
            // Calculate time taken (inverse of time left)
            const timeTaken = 15 - timeLeft; 
            submitAnswer(roomId, currentQuestionIndex, selectedIndex, timeTaken);
        }}
      />
    </div>
  );
};

export default BattleArena;