import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertTriangle, User, Swords } from "lucide-react";
import { useSocketStore } from "../store/useSocketStore";
import { useAuthStore } from "../store/useAuthStore";

const BattleArena = () => {
  const { roomId } = useParams(); // 1. Get Room ID from URL
  const navigate = useNavigate();
  
  const { authUser } = useAuthStore();

  console.log("auth user name :" , authUser?.user.name);
  
  const { 
    socket,
    isConnected,
    joinChallengeRoom, 
    activeRoom, 
    gameStarted, 
    error 
  } = useSocketStore();

  // --- THE JOIN LOGIC ---
  useEffect(() => {
    // Only attempt to join if:
    // 1. We have a Room ID
    // 2. We are logged in
    // 3. Socket is connected
    if (roomId && authUser && isConnected && socket) {
      console.log(`🔗 Attempting to join room: ${roomId} as ${authUser?.user.name}`);
      joinChallengeRoom(roomId, authUser?.user.name);
    }
  }, [roomId, authUser, isConnected, socket]); // Dependencies ensure this runs once connection is ready


  // --- UI STATE 1: ERROR ---
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Battle Error</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/battle')}
            className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            Return to Lobby
          </button>
        </div>
      </div>
    );
  }

  // --- UI STATE 2: LOADING / JOINING ---
  if (!gameStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-sky-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-white p-4 rounded-full shadow-md">
              <Loader2 className="animate-spin text-sky-600" size={40} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Entering Arena...</h2>
          <p className="text-slate-500">Connecting to Room: <span className="font-mono font-bold">{roomId}</span></p>
          
          {/* Show who is waiting if data is available */}
          {activeRoom && (
            <div className="mt-8 p-4 bg-white rounded-xl shadow-sm border border-slate-100 inline-block">
               <p className="text-sm text-slate-400 uppercase tracking-wider font-bold mb-2">Host</p>
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                    {activeRoom.hostName?.[0] || "H"}
                 </div>
                 <span className="font-medium">{activeRoom.hostName || "Host"}</span>
               </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- UI STATE 3: THE GAME (Real Battle) ---
  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto pt-10">
        
        {/* HEADER: PLAYER VS PLAYER */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
           {/* Player 1 (Host) */}
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700 font-bold text-xl">
                {activeRoom?.players?.p1?.name?.[0]}
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-800">{activeRoom?.players?.p1?.name}</p>
                <p className="text-xs text-indigo-500 font-bold uppercase">Host</p>
              </div>
           </div>

           {/* VS Badge */}
           <div className="flex flex-col items-center">
             <Swords className="text-slate-300 mb-1" size={32} />
             <span className="text-xl font-black text-slate-800">VS</span>
           </div>

           {/* Player 2 (You/Friend) */}
           <div className="flex items-center gap-4 flex-row-reverse text-right">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-700 font-bold text-xl">
                {activeRoom?.players?.p2?.name?.[0]}
              </div>
              <div>
                <p className="font-bold text-slate-800">{activeRoom?.players?.p2?.name}</p>
                <p className="text-xs text-pink-500 font-bold uppercase">Challenger</p>
              </div>
           </div>
        </div>

        {/* GAME AREA PLACEHOLDER */}
        <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Game Started!</h1>
          <p className="text-slate-500">
            Quiz ID: <span className="font-mono text-sky-600">{activeRoom?.quizId}</span>
          </p>
          <div className="mt-8 p-4 bg-yellow-50 text-yellow-800 rounded-lg inline-block">
             Game logic (Questions/Timer) goes here in the next step.
          </div>
        </div>

      </div>
    </div>
  );
};

export default BattleArena;