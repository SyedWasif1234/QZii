import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useQuiz_QuesStore = create((set)=>({

    questions:[],
    question:null,
    isQuestionsLoading:false ,
    isQuestionLoding:false,

    quiz:null,
    isQuizLoading:false,

    getQuizById:async(quizId)=>{
        try {
            set({isQuizLoading:true});
            const result = await axiosInstance.get(`/quiz/getQuizById/${quizId}`);
            console.log("result from usequiz component:",result.data)
            set({quiz:result.data.quiz})
            
        } catch (error) {
            console.log("error occured while fetching quiz ");
            toast.error("error occured while fetching quiz")
        } finally{
            set({isQuizLoading:false});
        }
    },

    getAllQuestions: async(quizId)=>{
        try {

            set({isQuestionsLoading:true});
            const result = await axiosInstance.get(`/question/get-questions/${quizId}`);
            console.log("categories:",result)
            set({questions:result.data.questions})
            
        } catch (error) {
            console.log("error occured while fetchig all questions")
        } finally{
             set({isQuestionsLoading:false});
        }
    }


}))