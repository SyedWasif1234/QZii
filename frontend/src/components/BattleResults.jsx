import React from "react";
import { Trophy, Home, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSocketStore } from "../store/useSocketStore";

const BattleResults = () => {
  const navigate = useNavigate();
  const { battleResult, resetBattleState } = useSocketStore();

  if (!battleResult) return null;

  const { p1, p2 } = battleResult;
  // Determine Winner (Simple comparison)
  const isP1Winner = p1.score > p2.score;
  const isDraw = p1.score === p2.score;

  const handleLeave = () => {
    resetBattleState(); // Clean up store
    navigate("/battle");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 text-center">
        
        {/* Header Background */}
        <div className={`p-8 ${isDraw ? "bg-slate-800" : "bg-gradient-to-r from-indigo-500 to-purple-600"} text-white`}>
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Trophy size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-wider">
            {isDraw ? "It's a Draw!" : (isP1Winner ? "Player 1 Wins!" : "Player 2 Wins!")}
          </h1>
          <p className="text-white/80 font-medium mt-2">Game Over</p>
        </div>

        {/* Score Board */}
        <div className="p-8 grid grid-cols-2 gap-8 relative">
          {/* VS Divider */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-100 text-slate-400 font-bold text-xs p-2 rounded-full z-10">
            VS
          </div>

          {/* Player 1 */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase">Player 1</p>
            <p className={`text-4xl font-black ${isP1Winner ? "text-indigo-600" : "text-slate-700"}`}>
              {p1.score}
            </p>
            <p className="text-sm font-medium text-slate-500">Points</p>
          </div>

          {/* Player 2 */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase">Player 2</p>
            <p className={`text-4xl font-black ${!isP1Winner && !isDraw ? "text-pink-600" : "text-slate-700"}`}>
              {p2.score}
            </p>
            <p className="text-sm font-medium text-slate-500">Points</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
          <button 
            onClick={handleLeave}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-100 transition"
          >
            <Home size={18} /> Lobby
          </button>
          <button 
             disabled 
             className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold opacity-50 cursor-not-allowed"
          >
            <RefreshCw size={18} /> Rematch
          </button>
        </div>
      </div>
    </div>
  );
};

export default BattleResults;