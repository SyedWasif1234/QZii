import React, { useState } from "react";
import {
  Swords,
  Users,
  Zap,
  Trophy,
  Timer,
  Search,
  ArrowRight,
  Keyboard, // Added Keyboard icon for the Join section
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Ensure these components exist in your components folder
import MatchmakingModal from "../components/MatchmakingModal";
import ChallengeFriendModal from "../components/ChallengeFriendModal";

const BattleMode = () => {
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isChallengeOpen, setIsChallengeOpen] = useState(false); // Controls the Friend Modal
  const [joinCode, setJoinCode] = useState(""); // NEW: For manual join input

  // --- 1. DUMMY DATA ---
  const currentUserStats = {
    rank: "Diamond III",
    wins: 142,
    battles: 200,
    winRate: "71%",
  };

  const activeCategories = [
    {
      id: 1,
      name: "JavaScript",
      activePlayers: 124,
      color: "bg-yellow-50 text-yellow-600 border-yellow-200",
    },
    {
      id: 2,
      name: "System Design",
      activePlayers: 85,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      id: 3,
      name: "Python",
      activePlayers: 200,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      id: 4,
      name: "SQL",
      activePlayers: 56,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
  ];

  const liveBattles = [
    {
      id: 101,
      p1: "AlexDev",
      p2: "CodeMaster",
      category: "React JS",
      status: "In Progress",
    },
    {
      id: 102,
      p1: "Sarah_01",
      p2: "BugHunter",
      category: "Node.js",
      status: "In Progress",
    },
    {
      id: 103,
      p1: "Junior_Dev",
      p2: "Sr_Engineer",
      category: "DSA",
      status: "In Progress",
    },
  ];

  // --- HANDLERS ---
  
  const handleQuickMatch = () => {
    setSelectedCategory(null); // Random category
    setIsSearching(true);
  };

  const handleCategoryClick = (catName) => {
    setSelectedCategory(catName);
    setIsSearching(true);
  };

  // NEW: Handle joining by text input
  const handleJoinByCode = (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    // Logic to handle both full URLs and raw IDs
    // If input is "http://localhost:5173/battle/room/abc-123" -> extracts "abc-123"
    // If input is "abc-123" -> keeps "abc-123"
    const code = joinCode.split('/').pop();

    navigate(`/battle/room/${code}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-10 px-4 sm:px-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* --- HEADER SECTION --- */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-bold uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            Live Arena
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
            Competitive <span className="text-sky-600">Battle Mode</span>
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Challenge real players in real-time 1v1 quizzes. Climb the
            leaderboard and prove your mastery.
          </p>
        </div>

        {/* --- HERO GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 1. Left Col: User Stats Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-full">
            <div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Your Season Stats
              </p>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
                  <Trophy size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">
                    {currentUserStats.rank}
                  </p>
                  <p className="text-sm text-slate-500">Current Rank</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-lg font-bold text-slate-700">
                    {currentUserStats.wins}
                  </p>
                  <p className="text-xs text-slate-500">Total Wins</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-lg font-bold text-sky-600">
                    {currentUserStats.winRate}
                  </p>
                  <p className="text-xs text-slate-500">Win Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Right Col: Action Area */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* A. PRIMARY ACTIONS (Hero Card) */}
            <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-8 text-white shadow-lg shadow-sky-200 flex flex-col justify-center relative overflow-hidden">
              
              {/* Background Decorations */}
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500 opacity-20 rounded-full blur-2xl"></div>

              <div className="relative z-10 space-y-6 max-w-xl">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Ready to battle?</h2>
                  <p className="text-sky-100 text-lg">
                    Prove your mastery. Play ranked matches or challenge your friends directly.
                  </p>
                </div>

                {/* BUTTONS CONTAINER */}
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  
                  {/* QUICK MATCH BUTTON */}
                  <button
                    onClick={handleQuickMatch}
                    disabled={isSearching}
                    className="flex-1 group flex items-center justify-center gap-3 bg-white text-sky-600 px-6 py-4 rounded-xl font-bold hover:bg-sky-50 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                  >
                    {isSearching ? (
                      <>
                        <Timer className="animate-spin" size={20} />
                        Finding...
                      </>
                    ) : (
                      <>
                        <Swords
                          size={20}
                          className="group-hover:rotate-12 transition-transform"
                        />
                        Quick Match
                      </>
                    )}
                  </button>

                  {/* CHALLENGE FRIEND BUTTON */}
                  <button
                    onClick={() => setIsChallengeOpen(true)}
                    className="flex-1 flex items-center justify-center gap-3 bg-sky-700/40 text-white border-2 border-sky-400/30 px-6 py-4 rounded-xl font-bold hover:bg-sky-700/60 transition-all active:scale-95 shadow-md backdrop-blur-sm"
                  >
                    <Users size={20} />
                    Challenge Friend
                  </button>
                  
                </div>
              </div>

              {/* Zap Illustration */}
              <div className="hidden md:block absolute bottom-0 right-0 z-0 opacity-20 pointer-events-none">
                <Zap size={140} className="text-white rotate-12 translate-x-10 translate-y-10" />
              </div>
            </div>

            {/* B. SECONDARY ACTION: JOIN WITH CODE */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-4">
               <div className="flex items-center gap-3 text-slate-700 min-w-max">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Keyboard size={20} />
                  </div>
                  <span className="font-bold">Have a code?</span>
               </div>
               
               <form onSubmit={handleJoinByCode} className="flex-1 w-full flex gap-2">
                 <input 
                   type="text" 
                   placeholder="Enter Room ID or Paste Link..."
                   value={joinCode}
                   onChange={(e) => setJoinCode(e.target.value)}
                   className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                 />
                 <button 
                   type="submit"
                   disabled={!joinCode}
                   className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                 >
                   Join
                 </button>
               </form>
            </div>

          </div>
        </div>

        {/* --- LIVE CATEGORIES GRID --- */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Search size={18} className="text-slate-400" />
            Browse Battle Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeCategories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md hover:-translate-y-1 ${cat.color} bg-white border-transparent hover:border-current`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg">{cat.name}</h4>
                  <Users size={16} className="opacity-70" />
                </div>
                <div className="flex items-center gap-1.5 text-sm opacity-80">
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                  {cat.activePlayers} searching
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- ACTIVE MATCHES TICKER --- */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            Live Battles Happening Now
          </h3>
          <div className="space-y-3">
            {liveBattles.map((battle) => (
              <div
                key={battle.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                      {battle.p1[0]}
                    </div>
                    <span className="font-medium text-slate-700">
                      {battle.p1}
                    </span>
                  </div>
                  <span className="text-slate-400 font-bold text-xs">VS</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-700">
                      {battle.p2}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-xs font-bold text-pink-600">
                      {battle.p2[0]}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-semibold text-slate-500">
                    {battle.category}
                  </span>
                  <button className="text-sky-500 hover:text-sky-700 text-sm font-medium flex items-center gap-1">
                    Watch <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      
      {/* 1. Public Matchmaking */}
      <MatchmakingModal
        isOpen={isSearching}
        onClose={() => setIsSearching(false)}
        category={selectedCategory}
      />

      {/* 2. Challenge Friend */}
      <ChallengeFriendModal
        isOpen={isChallengeOpen}
        onClose={() => setIsChallengeOpen(false)}
      />
    </div>
  );
};

export default BattleMode;