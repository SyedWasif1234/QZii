import React from 'react'
import { Home, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthstore } from '../store/useAuthStore'

const Navbar = () => {
  const {authUser} = useAuthstore();
  const navigate = useNavigate();

  const handleLandingPage = () => {  
    navigate('/LandingPage');
  };

  const handleQuizzPage = () => {  
    navigate('/Quizz');
  };



  return (
    <div className="pb-5 bg-slate-50 text-slate-900 selection:bg-indigo-100">
          <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Trophy className="text-white" size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight hover:cursor-pointer" onClick={handleLandingPage}>QuizMaster</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <span className='hover:text-indigo-600 transition' onClick={handleQuizzPage}>Quizes</span>
            <a href="#" className="hover:text-indigo-600 transition">Leaderboard</a>
            <a href="#" className="hover:text-indigo-600 transition">For Teams</a>
          </div>
          <div className="flex items-center gap-4">
           {
            authUser?.user ? ( authUser?.user?.name) :(
                <>
                <button className="text-sm font-semibold px-4 py-2 text-slate-600">Log in</button>
            <button className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100">
              Get Started
            </button>
                </>
            )
           }
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
