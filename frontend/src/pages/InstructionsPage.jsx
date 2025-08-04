import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const InstructionsPage = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();

  const handleStartQuiz = async () => {
    try {
      // Request fullscreen for a better, more controlled experience
      await document.documentElement.requestFullscreen();
      // Navigate to the questions page after entering fullscreen
      navigate(`/quiz/${quizId}/questions`);
    } catch (error) {
      console.error("Fullscreen request failed:", error);
      alert("Please enable fullscreen mode to start the quiz.");
    }
  };

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
                           { 'Quiz Instructions'}
                        </h1>

                        {/* Instruction Box */}
                        <div className="bg-gray-100 p-6 rounded-lg w-full max-w-2xl min-h-[150px] flex items-center justify-center">
                            <p className="text-base sm:text-lg text-gray-700">
                                <li>  <ul className="list-disc list-inside text-left space-y-2 mb-6">
                                    <li>This quiz must be completed in fullscreen mode.</li>
                                    <li>Do not exit fullscreen or switch tabs during the quiz.</li>
                                    <li>Copying and pasting is disabled.</li>
                                    <li>Each question has a time limit.</li>
                                    <li>Your final score will be calculated upon submission.</li>
                                </ul></li>
                              
                            </p>
                        </div>

                        {/* Start Button */}
                        <button
                        onClick={handleStartQuiz}
                         className="bg-[#0077b6] text-white font-bold text-lg sm:text-xl py-3 px-12 rounded-full shadow-lg hover:bg-[#005a8d] transition-colors duration-300 ease-in-out transform hover:scale-105"
                        >
                            Start Quiz
                        </button>
                    </div>
                </div>
            </div>
    </div>
  );
};

export default InstructionsPage;