import React from 'react'
import { Routes , Route ,Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'


import Layout from './layout/Layout'
import { useAuthstore } from './store/useAuthStore'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import EachCategoryPage from './pages/EachCategoryPage'
import QuizPage from './pages/QuizPage'
import QuizStartingPage from './pages/QuizStartingPage'
import QestionsPage from './pages/QestionsPage'

const App = () => {

  const {authUser} = useAuthstore();

  return (
    <div>
      <Toaster/> 
        <Routes>

          <Route path="/" element={<Layout />} > 
            <Route path="/" element = {authUser ? <HomePage/> : <Navigate to = "/Login" />} />
            <Route path="/category/:categoryId" element = {authUser ? <EachCategoryPage/> : <Navigate to = "/Login" />} />
            <Route path="/quiz/:quizId" element = {authUser ? <QuizStartingPage/> : <Navigate to = "/Login" />} />
          </Route>

          <Route path="/quiz/:quizId/questions" element = {authUser ? <QestionsPage/> : <Navigate to = "/Login" />} />
          <Route path="/SignUp" element={ !authUser ? <SignupPage/> : <Navigate to = "/" /> } />
          <Route path="/login" element={ !authUser ? <LoginPage/> : <Navigate to = "/" /> } />
        </Routes>
      
    </div>
  )
}

export default App
