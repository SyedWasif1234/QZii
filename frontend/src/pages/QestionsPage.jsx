import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz_QuesStore } from '../store/useQuiz_QuesStore';
import { ArrowRight, ShieldAlert, CopyX } from 'lucide-react';

const formatTime = (seconds) => {
    if (seconds === null || isNaN(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const QestionsPage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const {
        getAllQuestions,
        submitQuizResult,
        questions,
        isQuestionsLoading
    } = useQuiz_QuesStore();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [finalScore, setFinalScore] = useState(null);
    const [showWarning, setShowWarning] = useState(false);

    
    useEffect(() => {
        
        if (quizId) {
            getAllQuestions(quizId);
        }
    }, [quizId, getAllQuestions]); // Depend on quizId

    useEffect(() => {
      if (finalScore !== null) {
        return; 
      }

    const preventCheating = (e) => e.preventDefault();
    const handleFullscreenChange = () => {
        if (!document.fullscreenElement) setShowWarning(true);
    };
    const handleVisibilityChange = () => {
        if (document.hidden) setShowWarning(true);
    };

    document.addEventListener('copy', preventCheating);
    document.addEventListener('paste', preventCheating);
    document.addEventListener('contextmenu', preventCheating);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // This cleanup function will run when the component unmounts OR when finalScore is set
    return () => {
        document.removeEventListener('copy', preventCheating);
        document.removeEventListener('paste', preventCheating);
        document.removeEventListener('contextmenu', preventCheating);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
}, [finalScore]); // <-- Add finalScore to the dependency array

    const handleNext = useCallback(() => {
        setAnswers(prev => [...prev, {
            questionId: questions[currentQuestionIndex].id,
            selectedOptionId: selectedOption?.id || null,
        }]);

        setSelectedOption(null);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setIsSubmitting(true);
        }
    }, [currentQuestionIndex, questions, selectedOption]);

    // --- Timer Logic ---
    useEffect(() => {
        if (!questions || questions.length === 0 || finalScore !== null) return;

        const timeForCurrentQuestion = questions[currentQuestionIndex].timeLimit;
        const timer = setTimeout(() => {
            setTimeLeft(timeForCurrentQuestion);
        }, 500);

        return () => clearTimeout(timer);
    }, [currentQuestionIndex, questions, finalScore]);

    // --- Countdown Effect ---
    useEffect(() => {
        if (timeLeft === 0) {
            handleNext();
        }
        if (timeLeft === null || finalScore !== null) return;

        const intervalId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft, finalScore, handleNext]);

    // --- Final Submission Logic ---
    useEffect(() => {
        if (isSubmitting) {
            const submitAndShowResults = async () => {
                const result = await submitQuizResult(quizId, answers);
                if (result.success) {
                    setFinalScore(result.finalScore);
                    if (document.fullscreenElement) document.exitFullscreen();
                } else {
                    alert("Submission failed. Please try again.");
                    setIsSubmitting(false);
                }
            };
            submitAndShowResults();
        }
    }, [isSubmitting, quizId, answers, submitQuizResult]);

    
    if (isQuestionsLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <span className="text-gray-500 loading loading-dots loading-xl"></span>
            </div>
        );
    }

    if (showWarning) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-red-100 text-red-700">
                <ShieldAlert className="w-24 h-24 mb-4" />
                <h2 className="text-3xl font-bold">Quiz Rules Violated</h2>
                <p className="mt-2 text-lg">You have exited fullscreen or switched tabs.</p>
                <button onClick={() => navigate('/')} className="mt-6 bg-red-600 text-white py-2 px-6 rounded-lg">Go Home</button>
            </div>
        );
    }

    if (finalScore !== null) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0077b6]">
                <div className="text-center bg-white p-10 rounded-xl shadow-2xl">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>
                    <p className="text-xl text-gray-600 mb-6">Your results have been submitted.</p>
                    <div className="text-5xl font-bold text-[#0077b6]">
                        Final Score: {finalScore}
                    </div>
                    <button onClick={() => navigate('/')} className="mt-8 bg-[#0077b6] text-white font-bold py-3 px-8 rounded-full hover:bg-[#005a8d] transition-colors">
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }
    
    // This check must come after the loading check
    if (!questions || questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl font-bold mb-4">No Questions Found</h2>
                <p>Could not load questions for this quiz, or the quiz is empty.</p>
            </div>
        );
    }
    
    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-[#e0f7fa] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 w-full max-w-4xl relative">
                <div className="absolute top-4 right-4 text-xs text-gray-400 flex items-center gap-1">
                    <CopyX className="w-3 h-3" /> Cheating protection enabled
                </div>
                <div className="flex justify-between items-center mb-6">
                    <div className="bg-blue-100 text-[#0077b6] text-lg font-bold px-4 py-2 rounded-lg">
                        Marks: {currentQuestion?.marks}
                    </div>
                    <div className="bg-red-100 text-red-600 text-lg font-bold px-4 py-2 rounded-lg">
                        Timer: {formatTime(timeLeft)}
                    </div>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg mb-6 min-h-[120px] flex items-center">
                    <p className="text-xl font-medium text-gray-800">
                        <span className="font-bold">Q{currentQuestionIndex + 1}:</span> {currentQuestion.title}
                    </p>
                </div>
                <div className="space-y-4">
                    {currentQuestion.options.map((option) => (
                        <div
                            key={option.id}
                            onClick={() => setSelectedOption(option)}
                            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                selectedOption?.id === option.id
                                    ? 'bg-blue-100 border-[#0077b6] ring-2 ring-[#0077b6]'
                                    : 'bg-white hover:bg-gray-50 border-gray-200'
                            }`}
                        >
                            <div className="w-6 h-6 border-2 border-gray-400 rounded-full flex-shrink-0 flex items-center justify-center mr-4">
                                {selectedOption?.id === option.id && <div className="w-3 h-3 bg-[#0077b6] rounded-full"></div>}
                            </div>
                            <span className="text-lg text-gray-700">{option.text}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleNext}
                        disabled={selectedOption === null}
                        className="bg-[#0077b6] text-white font-bold text-lg py-3 px-8 rounded-lg flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-[#005a8d] transition-colors"
                    >
                        {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish & Submit"}
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QestionsPage;