import React from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuiz_QuesStore } from '../store/useQuiz_QuesStore'
import { Link } from 'react-router-dom'

const QuizStartingPage = () => {
    const {quizId} = useParams();
    console.log(quizId)
    const{getQuizById ,quiz ,isQuizLoading} = useQuiz_QuesStore();

    useEffect(()=>{
        getQuizById(quizId);
    },[getQuizById]);

    if(isQuizLoading){
        return (
        <div className="flex items-center justify-center h-screen">
            <span className="text-gray-500 loading loading-dots loading-xl"></span>
        </div>
    )}

    console.log("quiz from page.jsx",quiz)

  return (
     <div className="min-h-screen bg-white flex items-center justify-center p-4">
            
            {/* Outer blue frame */}
            <div className=" p-4 sm:p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-4xl boarder border-primary">
                
                {/* Inner white content card */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl">
                    
                    {/* Flex container for content: stacks items vertically and centers them */}
                    <div className="flex flex-col items-center gap-6 md:gap-8 text-center">

                        {/* Quiz Title */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800">
                           {quiz?.title || 'Quiz Title'}
                        </h1>

                        {/* Instruction Box */}
                        <div className="bg-gray-100 p-6 rounded-lg w-full max-w-2xl min-h-[150px] flex items-center justify-center">
                            <p className="text-base sm:text-lg text-gray-700">
                                {quiz?.instructions || 'Read the instructions carefully before you begin the quiz. Good luck!'}
                            </p>
                        </div>

                        {/* Start Button */}
                        <Link
                            // Note: Update this link to your actual quiz-playing route
                            to={`/quiz/${quizId}/questions`}
                            className="bg-[#0077b6] text-white font-bold text-lg sm:text-xl py-3 px-12 rounded-full shadow-lg hover:bg-[#005a8d] transition-colors duration-300 ease-in-out transform hover:scale-105"
                        >
                            Start
                        </Link>

                    </div>
                </div>
            </div>
    </div>
  )
}

export default QuizStartingPage
