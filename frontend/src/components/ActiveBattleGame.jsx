import React, { useState, useEffect } from "react";
import { CheckCircle2, Send, Loader2 } from "lucide-react";

const ActiveBattleGame = ({ 
  roomData,        
  currentQuestion, 
  totalQuestions,  
  questionIndex,   
  timeLeft,        
  onAnswerSubmit   
}) => {
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // RESET LOGIC: When questionIndex changes (server says next question), unlock UI
  useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
  }, [questionIndex]);

  const handleOptionSelect = (index) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true); // Lock the UI locally immediately
    onAnswerSubmit(selectedOption); // Tell controller to notify server
  };

  // Visual Timer Calculation
  const progressPercent = (timeLeft / 15) * 100; 
  let timerColor = "bg-sky-500";
  if (timeLeft < 10) timerColor = "bg-yellow-500";
  if (timeLeft < 5) timerColor = "bg-red-500";

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-full font-sans">
      
      {/* 1. HEADER & SCORES */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
           <div className={`h-full transition-all duration-1000 ease-linear ${timerColor}`} style={{ width: `${progressPercent}%` }} />
        </div>

        <div className="flex justify-between items-center mt-2">
          {/* P1 Stats */}
          <div className="flex items-center gap-4">
             <div className="relative w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700 font-bold text-xl border-2 border-indigo-50">
                {roomData?.players?.p1?.name?.[0] || "1"}
                {roomData?.players?.p1?.hasAnswered && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                )}
             </div>
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase">Host</p>
               <p className="text-2xl font-black text-indigo-600">{roomData?.players?.p1?.score || 0}</p>
             </div>
          </div>

          {/* Clock */}
          <div className="flex flex-col items-center">
            <div className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">
              Q{questionIndex + 1} / {totalQuestions}
            </div>
            <div className={`text-4xl font-black font-mono tracking-tight ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-slate-800'}`}>
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </div>
          </div>

          {/* P2 Stats */}
          <div className="flex items-center gap-4 flex-row-reverse text-right">
             <div className="relative w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center text-pink-700 font-bold text-xl border-2 border-pink-50">
                {roomData?.players?.p2?.name?.[0] || "2"}
                {roomData?.players?.p2?.hasAnswered && (
                  <span className="absolute -top-1 -left-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                )}
             </div>
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase">Challenger</p>
               <p className="text-2xl font-black text-pink-500">{roomData?.players?.p2?.score || 0}</p>
             </div>
          </div>
        </div>
      </div>

      {/* 2. QUESTION & OPTIONS */}
      <div className="flex-1 flex flex-col justify-center mb-24">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center mb-6 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50"></div>
           <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug">
             {currentQuestion?.text || "Loading Question..."}
           </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion?.options?.map((option, idx) => {
            const isSelected = selectedOption === idx;
            return (
              <button 
                key={idx}
                disabled={isSubmitted} 
                onClick={() => handleOptionSelect(idx)}
                className={`
                  group relative p-6 rounded-2xl border-2 text-left shadow-sm transition-all duration-200 active:scale-[0.98]
                  ${isSelected ? "border-sky-500 bg-sky-50 text-sky-800 ring-2 ring-sky-500/20" : "border-slate-200 bg-white hover:border-sky-300 hover:bg-slate-50 text-slate-700"}
                  ${isSubmitted ? "opacity-60 cursor-not-allowed" : ""}
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">{option}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-sky-500 bg-sky-500" : "border-slate-300"}`}>
                    {isSelected && <CheckCircle2 size={16} className="text-white" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* 3. FLOATING SUBMIT BUTTON */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 shadow-lg z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="text-sm font-semibold text-slate-500 hidden sm:block">
                {isSubmitted ? (
                    <span className="flex items-center gap-2 text-green-600">
                        <Loader2 className="animate-spin" size={16} /> Waiting for opponent...
                    </span>
                ) : "Select an option to confirm"}
            </div>
            <button
                disabled={selectedOption === null || isSubmitted}
                onClick={handleSubmit}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-lg transition-all w-full sm:w-auto justify-center ${selectedOption !== null && !isSubmitted ? "bg-slate-900 text-white hover:bg-slate-800 shadow-lg" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
            >
                {isSubmitted ? <>Locked <CheckCircle2 size={20}/></> : <>Lock & Submit <Send size={20}/></>}
            </button>
        </div>
      </div>

    </div>
  );
};

export default ActiveBattleGame;