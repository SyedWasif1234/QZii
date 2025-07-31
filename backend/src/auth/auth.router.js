
import express from 'express';
import { check, login, logout, Register } from './auth.controller.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';



const AuthRouter = express.Router()

AuthRouter.post("/register" , Register)
AuthRouter.post("/login" , login)
AuthRouter.post("/logout" , AuthMiddleware , logout)
AuthRouter.get("/check" ,AuthMiddleware ,  check)


export default AuthRouter