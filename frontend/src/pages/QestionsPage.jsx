import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz_QuesStore } from '../store/useQuiz_QuesStore';
import { ArrowRight } from 'lucide-react';

// Helper function to format time
const formatTime = (seconds) => {
    if (seconds === null || isNaN(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const QestionsPage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const { getAllQuestions, questions, isQuestionsLoading } = useQuiz_QuesStore();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null); // Will hold the entire option object
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(null);
    const [isQuizOver, setIsQuizOver] = useState(false);

    useEffect(() => {
        getAllQuestions(quizId);
    }, [getAllQuestions, quizId]);

    // Sets/resets the timer for each question using `timeLimit` from the data
    useEffect(() => {
        if (questions && questions.length > 0) {
            const timeForCurrentQuestion = questions[currentQuestionIndex].timeLimit;
            setTimeLeft(timeForCurrentQuestion);
        }
    }, [currentQuestionIndex, questions]);

    // Handles the countdown and auto-advances on timeout
    useEffect(() => {
        if (isQuizOver || timeLeft === null) return;

        if (timeLeft === 0) {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            } else {
                setIsQuizOver(true);
            }
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, isQuizOver, currentQuestionIndex, questions.length]);

    const handleNextQuestion = () => {
        // --- MODIFIED LOGIC ---
        // 1. Check if the selected option is the correct one
        if (selectedOption?.isCorrect) {
            // 2. Add dynamic marks from the question object to the score
            setScore(prevScore => prevScore + questions[currentQuestionIndex].marks);
        }
        
        setSelectedOption(null);
        
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            setIsQuizOver(true);
        }
    };
    
    // --- RENDER STATES ---

    if (isQuestionsLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <span className="text-gray-500 loading loading-dots loading-xl"></span>
            </div>
        );
    }
    
    if (!questions || questions.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-700">
                <h2 className="text-2xl font-bold mb-4">No Questions Found</h2>
                <p>Could not load questions for this quiz.</p>
                <button onClick={() => navigate('/')} className="mt-6 bg-[#0077b6] text-white py-2 px-6 rounded-lg">Go Home</button>
            </div>
        )
    }

    if (isQuizOver) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0077b6]">
                <div className="text-center bg-white p-10 rounded-xl shadow-2xl">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>
                    <p className="text-xl text-gray-600 mb-6">You've reached the end of the quiz.</p>
                    <div className="text-5xl font-bold text-[#0077b6]">
                       Final Score: {score}
                    </div>
                     <button onClick={() => navigate('/')} className="mt-8 bg-[#0077b6] text-white font-bold py-3 px-8 rounded-full hover:bg-[#005a8d] transition-colors">
                        Back to Home
                    </button>
                </div>
            </div>
        )
    }

    const currentQuestion = questions[currentQuestionIndex];
    
    return (
        <div className="min-h-screen bg-[#e0f7fa] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 w-full max-w-4xl">
                
                <div className="flex justify-between items-center mb-6">
                    <div className="bg-blue-100 text-[#0077b6] text-lg font-bold px-4 py-2 rounded-lg">
                        Marks: {score}
                    </div>
                    <div className="bg-red-100 text-red-600 text-lg font-bold px-4 py-2 rounded-lg">
                        Timer: {formatTime(timeLeft)}
                    </div>
                </div>

                {/* --- MODIFIED TO USE `title` --- */}
                <div className="bg-gray-100 p-6 rounded-lg mb-6 min-h-[120px] flex items-center">
                    <p className="text-xl font-medium text-gray-800">
                        <span className="font-bold">Q{currentQuestionIndex + 1}:</span> {currentQuestion.title}
                    </p>
                </div>
                
                <div className="space-y-4">
                    {/* --- MODIFIED TO MAP `options` CORRECTLY --- */}
                    {currentQuestion.options.map((option) => (
                        <div
                            key={option.id} // Use unique option ID for the key
                            onClick={() => setSelectedOption(option)}
                            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                selectedOption?.id === option.id // Compare by ID for selection style
                                    ? 'bg-blue-100 border-[#0077b6] ring-2 ring-[#0077b6]'
                                    : 'bg-white hover:bg-gray-50 border-gray-200'
                            }`}
                        >
                            <div className="w-6 h-6 border-2 border-gray-400 rounded-full flex-shrink-0 flex items-center justify-center mr-4">
                               {selectedOption?.id === option.id && <div className="w-3 h-3 bg-[#0077b6] rounded-full"></div>}
                            </div>
                            <span className="text-lg text-gray-700">{option.text}</span> {/* Display option text */}
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-end">
                    <button 
                        onClick={handleNextQuestion}
                        disabled={selectedOption === null}
                        className="bg-[#0077b6] text-white font-bold text-lg py-3 px-8 rounded-lg flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-[#005a8d] transition-colors"
                    >
                        Next
                        <ArrowRight className="h-5 w-5" /> 
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QestionsPage;