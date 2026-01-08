import React, { useState, useEffect } from "react";
import { Timer, Trophy, Shield, XCircle, CheckCircle2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const BattleArena = () => {
  const { roomId } = useParams(); // Gets the ID from URL
  const navigate = useNavigate();
  
  // --- DUMMY GAME STATE ---
  const [timeLeft, setTimeLeft] = useState(15);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  
  // Dummy Players
  const me = { name: "You", score: 1450, avatar: null };
  const opponent = { 
    name: "DevSlayer", 
    score: 1200, 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
  };

  // Dummy Question Data
  const questions = [
    {
      id: 1,
      text: "Which hook is used to perform side effects in functional components?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      correct: 1 // index of correct answer
    },
    {
      id: 2,
      text: "What does the virtual DOM improve in React?",
      options: ["Memory Usage", "Network Speed", "Performance", "SEO"],
      correct: 2
    }
  ];

  const currentQ = questions[currentQuestionIndex];

  // Timer Countdown Effect
  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Handle Answer Selection
  const handleOptionClick = (index) => {
    if (selectedOption !== null) return; // Prevent double clicking
    setSelectedOption(index);
    
    // Simulate moving to next question after 2 seconds
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setTimeLeft(15); // Reset timer
      } else {
        alert("Battle Finished! (Demo)");
        navigate('/battle'); // Go back to lobby
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* --- 1. HUD / HEADER (Scoreboard) --- */}
      <header className="bg-white border-b border-slate-200 h-20 shadow-sm relative z-20">
        <div className="max-w-5xl mx-auto h-full px-4 flex items-center justify-between">
          
          {/* PLAYER 1 (YOU) */}
          <div className="flex items-center gap-4 transition-all">
            <div className="relative">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700 font-bold border-2 border-indigo-50 shadow-sm">You</div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</p>
              <p className="text-2xl font-black text-indigo-600 leading-none">{me.score}</p>
            </div>
          </div>

          {/* TIMER CENTER */}
          <div className="flex flex-col items-center absolute left-1/2 transform -translate-x-1/2">
            <div className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 mb-1">
              Round {currentQuestionIndex + 1}/{questions.length}
            </div>
            <div className={`text-3xl font-black font-mono tracking-tight ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-slate-800'}`}>
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </div>
          </div>

          {/* PLAYER 2 (OPPONENT) */}
          <div className="flex items-center gap-4 text-right flex-row-reverse">
             <div className="relative">
              <img src={opponent.avatar} alt="Opp" className="w-12 h-12 rounded-xl bg-pink-100 border-2 border-pink-50 shadow-sm" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Opponent</p>
              <p className="text-2xl font-black text-pink-500 leading-none">{opponent.score}</p>
            </div>
          </div>
        </div>
        
        {/* TIMER PROGRESS BAR */}
        <div className="absolute bottom-0 left-0 h-1.5 bg-slate-100 w-full">
          <div 
            className={`h-full transition-all duration-1000 ease-linear ${timeLeft < 5 ? 'bg-red-500' : 'bg-sky-500'}`} 
            style={{ width: `${(timeLeft / 15) * 100}%` }}
          ></div>
        </div>
      </header>

      {/* --- 2. MAIN BATTLEFIELD --- */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 w-full max-w-4xl mx-auto">
        
        {/* Question Card */}
        <div className="w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 mb-8 text-center relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500"></div>
          <h2 className="text-xl md:text-3xl font-bold text-slate-800 leading-snug">
            {currentQ.text}
          </h2>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {currentQ.options.map((option, index) => {
            
            // Logic to determine button styling based on selection
            let statusClass = "border-slate-200 hover:border-sky-400 hover:bg-sky-50";
            let icon = null;

            if (selectedOption !== null) {
              if (index === currentQ.correct) {
                statusClass = "border-green-500 bg-green-50 text-green-700 shadow-[0_0_0_2px_rgba(34,197,94,0.2)]";
                icon = <CheckCircle2 size={20} className="text-green-600" />;
              } else if (selectedOption === index) {
                statusClass = "border-red-500 bg-red-50 text-red-700";
                icon = <XCircle size={20} className="text-red-600" />;
              } else {
                statusClass = "opacity-50 border-slate-100 grayscale";
              }
            }

            return (
              <button 
                key={index}
                disabled={selectedOption !== null}
                onClick={() => handleOptionClick(index)}
                className={`group relative p-6 rounded-2xl border-2 text-left shadow-sm transition-all duration-200 active:scale-[0.98] ${statusClass}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">
                    {option}
                  </span>
                  {icon ? icon : (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-sky-400 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-sky-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* --- 3. FOOTER INFO --- */}
      <footer className="p-6 text-center text-slate-400 text-xs font-medium uppercase tracking-widest">
        <p className="flex items-center justify-center gap-2">
           <Shield size={14} /> Room ID: {roomId || "DEMO"} • Server: US-East
        </p>
      </footer>
    </div>
  );
};

export default BattleArena;