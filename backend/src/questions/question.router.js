import express from 'express';
import { AuthMiddleware } from '../middleware/auth.middleware.js';
import { checkFaculty } from '../middleware/admin&faculty.middleware.js';
import { addQuestions, deleteQuestions, getallQuestions, submitAnswer } from './Questions.controller.js';

const questionRouter = express.Router();

questionRouter.post("/add-questions/:categoryId/:quizId", AuthMiddleware , checkFaculty , addQuestions);
questionRouter.get("/get-questions/:quizId", AuthMiddleware ,  getallQuestions);

questionRouter.post("/submit-answer/:quizId" , AuthMiddleware , submitAnswer)
questionRouter.delete("/delete",AuthMiddleware , checkFaculty , deleteQuestions)

export default questionRouter;