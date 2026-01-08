import React, { useState, useRef, useEffect } from "react";
import { Trophy, Moon, Sun, User as UserIcon } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

import Profile from "./Profile";
const Navbar = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLandingPage = () => {
    console.log("button clicked")
    navigate("/LandingPage");
  };


  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 ">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => navigate("/LandingPage")}
         >
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none group-hover:rotate-12 transition-transform">
            <Trophy className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-black" >
            QuizMaster
          </span>
        </div>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Home</Link>
          <Link to="/leaderboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Leaderboard</Link>
          <Link to="/Battle" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">BattleMode</Link>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}

          {authUser ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-slate-800 border-2 border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:scale-105 transition-all overflow-hidden"
              >
                {authUser.profilePic ? (
                  <img src={authUser.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={20} />
                )}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-200">
                  <Profile closeDropdown={() => setIsProfileOpen(false)} />
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate("/login")}
                className="text-sm font-bold px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition"
              >
                Log in
              </button>
              <button 
                onClick={() => navigate("/signup")}
                className="bg-slate-900 dark:bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-all shadow-lg"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;