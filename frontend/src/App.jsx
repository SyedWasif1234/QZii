import React from 'react'
import { Routes , Route ,Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'


import Layout from './layout/Layout'
import { useAuthStore } from './store/useAuthStore'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import EachCategoryPage from './pages/EachCategoryPage'
import QuizPage from './pages/QuizPage'
import QuizStartingPage from './pages/QuizStartingPage'
import InstructionsPage from './pages/InstructionsPage'
import QestionsPage from './pages/QestionsPage'
import { useEffect } from 'react'
import { Loader } from 'lucide-react'
import LandingPage from './components/LandingPage'

import BattleMode from './pages/BattleMode'
import BattleArena from './pages/BattleArena'

const App = () => {

  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // IMPORTANT: Show a loading spinner while checking auth
  // This prevents the <Navigate /> from running prematurely
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }


  return (
    <div>
      <Toaster/> 
        <Routes>
          <Route path='/LandingPage' element={<LandingPage />} />
          <Route path="/" element={<Layout />} > 
            <Route path="/" element = {authUser ? <HomePage/> : <Navigate to = "/LandingPage" />} />
            <Route path="/category/:categoryId" element = {authUser ? <EachCategoryPage/> : <Navigate to = "/LandingPage" />} />
            <Route path="/quiz/:quizId" element = {authUser ? <InstructionsPage/> : <Navigate to = "/LandingPage" />} />
            <Route path = "/Battle" element = {authUser ? <BattleMode/> : <Navigate to = "/LandingPage" />} />
          </Route>
          <Route path="/battle/room/:roomId" element={<BattleArena />} />
          <Route path="/quiz/:quizId/questions" element = {authUser ? <QestionsPage/> : <Navigate to = "/LandingPage" />} />
          <Route path="/SignUp" element={ !authUser ? <SignupPage/> : <Navigate to = "/" /> } />
          <Route path="/login" element={ !authUser ? <LoginPage/> : <Navigate to = "/" /> } />
        </Routes>
      
    </div>
  )
}

export default App
