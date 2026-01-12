import express from 'express';
import { addQuiz, deleteQuiz, finishQuiz, getAllQuizes, getAllQuizes_without_category, getQuizById, getUserScoreForQuiz } from './quiz.controller.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';
import { checkFaculty } from '../middleware/admin&faculty.middleware.js';

const QuizRouter = express.Router();

QuizRouter.post("/add-quiz/:categoryId" ,AuthMiddleware ,checkFaculty ,  addQuiz );
QuizRouter.get("/get-all-quiz/:categoryId",AuthMiddleware , getAllQuizes);
QuizRouter.get("/getQuizById/:quizId",AuthMiddleware , getQuizById)
QuizRouter.post("/get-score/:quizId" , AuthMiddleware ,getUserScoreForQuiz)
QuizRouter.delete("/delete-quiz/:quizId" , AuthMiddleware , checkFaculty , deleteQuiz);

QuizRouter.get("/get-all-quiz-without-category" , getAllQuizes_without_category);

export default QuizRouter;