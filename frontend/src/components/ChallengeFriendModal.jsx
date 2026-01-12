import React, { useState, useEffect } from "react";
import { X, Copy, Check, Link as LinkIcon, Play, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuiz_QuesStore } from "../store/useQuiz_QuesStore";
import { useSocketStore } from "../store/useSocketStore";
import { useAuthStore } from "../store/useAuthStore";

const ChallengeFriendModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  
  // --- STORE ACCESS ---
  const { authUser } = useAuthStore();
  const { quizes, isQuizesLoading, getAllQuizes } = useQuiz_QuesStore();
  const { 
    createChallengeRoom, 
    activeRoom, 
    gameStarted, 
    resetBattleState,
    isFindingMatch // Use this to show loading state on button
  } = useSocketStore();

  // --- LOCAL STATE ---
  const [step, setStep] = useState('config'); // 'config' | 'invite'
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [copied, setCopied] = useState(false);

  // --- 1. OPTIMIZED DATA FETCHING ---
  // Only fetch if modal is OPEN and we don't have quizzes yet
  // This prevents unnecessary server calls on every render or mount
  useEffect(() => {
    if (isOpen && quizes.length === 0) {
      getAllQuizes();
    }
  }, [isOpen, quizes.length, getAllQuizes]);

  // --- 2. SOCKET STATE SYNC ---
  
  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('config');
      setSelectedQuizId(""); // Reset selection
      resetBattleState(); // Clear any old room data
    }
  }, [isOpen, resetBattleState]);

  // If Room Created -> Move to Invite Step
  useEffect(() => {
    if (activeRoom && activeRoom.roomId && step === 'config') {
      setStep('invite');
    }
  }, [activeRoom, step]);

  // If Game Started -> Navigate to Arena
  useEffect(() => {
    if (gameStarted && activeRoom?.roomId) {
      onClose(); // Close modal first
      navigate(`/battle/room/${activeRoom.roomId}`);
    }
  }, [gameStarted, activeRoom, navigate, onClose]);


  // --- HANDLERS ---

  const handleCreate = () => {
    if (!selectedQuizId) return;
    
    // Call Socket Store Action
    createChallengeRoom(selectedQuizId, authUser?.user.name || "Player 1");
  };

  const handleCopy = () => {
    // Construct Link dynamically
    const link = `${window.location.origin}/battle/room/${activeRoom?.roomId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleManualJoin = () => {
    if (activeRoom?.roomId) {
      navigate(`/battle/room/${activeRoom.roomId}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">
            {step === 'config' ? 'Setup Private Battle' : 'Invite Friend'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          
          {/* STEP 1: CONFIGURATION */}
          {step === 'config' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Select Topic / Quiz
                </label>
                
                {/* Real Quiz List */}
                <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {isQuizesLoading ? (
                    <div className="flex justify-center py-8 text-slate-400">
                      <Loader2 className="animate-spin" />
                    </div>
                  ) : quizes.length > 0 ? (
                    quizes.map((quiz) => (
                      <div 
                        key={quiz.id}
                        onClick={() => setSelectedQuizId(quiz.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all ${
                          selectedQuizId === quiz.id 
                            ? "border-sky-500 bg-sky-50" 
                            : "border-slate-100 hover:border-slate-300"
                        }`}
                      >
                        <div>
                          <p className="font-bold text-slate-800">{quiz.title}</p>
                          <p className="text-xs text-slate-500">
                            {quiz.questions ? quiz.questions.length : 0} Questions • {quiz.Totalmarks || 0} Marks
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedQuizId === quiz.id ? "border-sky-500" : "border-slate-300"
                        }`}>
                          {selectedQuizId === quiz.id && <div className="w-2.5 h-2.5 bg-sky-500 rounded-full" />}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-slate-500 py-4">No quizzes available.</p>
                  )}
                </div>
              </div>

              <button 
                disabled={!selectedQuizId || isFindingMatch}
                onClick={handleCreate}
                className="w-full py-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-md shadow-sky-200 flex justify-center items-center gap-2"
              >
                {isFindingMatch ? (
                   <>
                     <Loader2 className="animate-spin" size={20} /> Creating Room...
                   </>
                ) : (
                   "Create Room & Get Link"
                )}
              </button>
            </div>
          )}

          {/* STEP 2: INVITE */}
          {step === 'invite' && activeRoom && (
            <div className="space-y-6 text-center animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <LinkIcon size={32} />
              </div>
              
              <div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">Room Created!</h4>
                <p className="text-slate-500 text-sm">
                  Share this link with your friend. The game will start automatically when they join.
                </p>
              </div>

              {/* Copy Link Box */}
              <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-xl border border-slate-200">
                <input 
                  type="text" 
                  readOnly 
                  value={`${window.location.origin}/battle/room/${activeRoom.roomId}`}
                  className="bg-transparent border-none focus:ring-0 text-sm text-slate-600 flex-1 w-full"
                />
                <button 
                  onClick={handleCopy}
                  className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
                >
                  {copied ? <Check size={18} className="text-green-500"/> : <Copy size={18} />}
                </button>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <p className="text-xs text-slate-400 mb-4 animate-pulse flex items-center justify-center gap-2">
                   <Loader2 size={12} className="animate-spin" /> Waiting for opponent to join...
                </p>
                
                <button 
                  onClick={handleManualJoin}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2"
                >
                  <Play size={18} /> Enter Room Manually
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ChallengeFriendModal;