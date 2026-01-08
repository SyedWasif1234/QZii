import React, { useState, useEffect } from 'react';
import { X, Loader2, User, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // IMPORT THIS

const MatchmakingModal = ({ isOpen, onClose, category }) => {
  const navigate = useNavigate(); // HOOK
  const [matchStatus, setMatchStatus] = useState('searching'); // 'searching', 'found'
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (isOpen && matchStatus === 'searching') {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
      
      // MOCK SOCKET: Simulate match found after 3 seconds
      setTimeout(() => {
        setMatchStatus('found');
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isOpen, matchStatus]);

  // --- NEW: HANDLE REDIRECT WHEN MATCH IS FOUND ---
  useEffect(() => {
    if (matchStatus === 'found') {
      // Wait 1.5s so user sees the "Match Found" screen, then go to Arena
      const redirectTimer = setTimeout(() => {
        // USING DUMMY ROOM ID "demo-123"
        navigate('/battle/room/demo-123'); 
      }, 1500);

      return () => clearTimeout(redirectTimer);
    }
  }, [matchStatus, navigate]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        
        {/* Close Button (Only allowed if searching) */}
        {matchStatus === 'searching' && (
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        )}

        <div className="p-8 flex flex-col items-center text-center">
          
          {/* SEARCHING STATE */}
          {matchStatus === 'searching' && (
            <>
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-sky-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative bg-sky-50 p-6 rounded-full border-2 border-sky-100">
                  <Loader2 className="h-10 w-10 text-sky-500 animate-spin" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-2">Looking for Opponent...</h3>
              <p className="text-slate-500 text-sm mb-6">
                Category: <span className="font-semibold text-sky-600">{category || "Random"}</span>
              </p>
              
              <div className="bg-slate-50 px-4 py-2 rounded-full border border-slate-200 text-xs font-mono text-slate-500">
                Time elapsed: 00:0{timer}
              </div>
            </>
          )}

          {/* FOUND STATE */}
          {matchStatus === 'found' && (
            <div className="animate-in zoom-in duration-300 w-full">
              <div className="flex items-center justify-between mb-8 w-full px-4">
                {/* YOU */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full mb-2 flex items-center justify-center border-4 border-white shadow-lg">
                    <User className="text-indigo-600" />
                  </div>
                  <span className="font-bold text-slate-700 text-sm">You</span>
                </div>

                {/* VS */}
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-200 italic">VS</span>
                </div>

                {/* OPPONENT */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-pink-100 rounded-full mb-2 flex items-center justify-center border-4 border-white shadow-lg">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Opponent" className="w-full h-full rounded-full" />
                  </div>
                  <span className="font-bold text-slate-700 text-sm">DevSlayer</span>
                </div>
              </div>

              <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 mb-2 border border-green-100">
                <Zap size={16} fill="currentColor" /> Match Found!
              </div>
              <p className="text-xs text-slate-400">Starting battle in 3s...</p>
            </div>
          )}

        </div>
        
        {/* Progress Bar for Visual Flair */}
        <div className="h-1.5 w-full bg-slate-100">
          <div className="h-full bg-sky-500 animate-[loading_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
};

export default MatchmakingModal;