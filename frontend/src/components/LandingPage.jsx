import React, { useEffect, useRef, useState } from "react";
import {
  Zap,
  Trophy,
  Users,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Code,
  Terminal,
  BarChart3,
  Globe,
  UserIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import Profile from "./Profile";

const LandingPage = () => {

  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const { authUser } = useAuthStore();

  console.log(authUser?.user?.name);

  const handleQuizzPage = () => {
    navigate("/EachCategoryPage");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (profileRef.current && !profileRef.current.contains(event.target)) {
          setIsProfileOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100">
      {/* 1. NAVIGATION (Minimalist SaaS Style) */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Trophy className="text-white" size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight">QuizMaster</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="/" className="hover:text-indigo-600 transition">
              Home
            </a>
            <a href="#" className="hover:text-indigo-600 transition">
              Leaderboard
            </a>
            <a href="#" className="hover:text-indigo-600 transition">
              For Teams
            </a>
          </div>
          <div className="flex items-center gap-4">
            {authUser ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-slate-800 border-2 border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:scale-105 transition-all overflow-hidden"
                >
                  {authUser.profilePic ? (
                    <img
                      src={authUser.profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
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
              <>
                <button
                  className="text-sm font-semibold px-4 py-2 text-slate-600 hover:cursor-pointer hover:text-indigo-600 transition-colors"
                  onClick={handleLogin}
                >
                  Log in
                </button>
                <button className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100">
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION (Gamified + Modern Clean) */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold mb-6">
              <Zap size={14} fill="currentColor" />
              <span>THE #1 QUIZ PLATFORM OF 2026</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Assess your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                true potential.
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
              Beautifully designed quizzes for developers, students, and teams.
              From AI-generated coding challenges to interactive trivia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-200"
              >
                Start Your First Quiz
                <motion.div animate={{ x: isHovered ? 5 : 0 }}>
                  <ArrowRight size={20} />
                </motion.div>
              </button>
              <button className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                <Play size={20} fill="currentColor" />
                Watch Demo
              </button>
            </div>

            {/* Social Proof (Community Element) */}
            <div className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white bg-slate-200"
                  />
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-slate-500 font-medium">
                  Joined by 50,000+ quiz takers
                </p>
              </div>
            </div>
          </motion.div>

          {/* 3. INTERACTIVE PREVIEW (Tech/Cyber Edge) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 blur-3xl rounded-full" />
            <div className="relative bg-slate-900 rounded-3xl p-4 shadow-2xl border border-slate-800">
              {/* Mock Terminal Header */}
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  QUIZ_SESSION: ACTIVE
                </div>
              </div>
              {/* Question UI */}
              <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="text-emerald-400 font-mono text-sm mb-2">
                  $ question --current
                </div>
                <h3 className="text-xl font-semibold text-white mb-6">
                  Which React hook is used for side effects?
                </h3>
                <div className="space-y-3">
                  {["useState", "useEffect", "useMemo"].map((opt, i) => (
                    <div
                      key={opt}
                      className={`p-4 rounded-lg border flex justify-between items-center ${
                        i === 1
                          ? "bg-indigo-500/10 border-indigo-500 text-indigo-300"
                          : "bg-slate-800 border-slate-700 text-slate-400"
                      }`}
                    >
                      <span className="font-medium text-sm">{opt}</span>
                      {i === 1 && <CheckCircle size={16} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. FEATURE GRID (Clean Information Architecture) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Everything you need to master concepts
            </h2>
            <p className="text-slate-500">
              Powerful features to help you learn faster and track progress.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Terminal className="text-indigo-600" />}
              title="Coding Sandboxes"
              desc="Answer technical questions by writing real code in our integrated IDE."
            />
            <FeatureCard
              icon={<BarChart3 className="text-indigo-600" />}
              title="In-depth Analytics"
              desc="Visualize your growth with detailed performance heatmaps and metrics."
            />
            <FeatureCard
              icon={<Globe className="text-indigo-600" />}
              title="Global Battles"
              desc="Compete in real-time with users across the globe in themed tournaments."
            />
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA (High Impact) */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 relative z-10">
            Stop guessing. Start knowing.
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Join the elite community of learners today. No credit card required
            to start your first session.
          </p>
          <button className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-xl hover:bg-indigo-50 transition-colors shadow-2xl">
            GET STARTED FOR FREE
          </button>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-200 text-center text-slate-400 text-sm font-medium">
        © 2026 QuizMaster Platform. Built for the modern web.
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;
