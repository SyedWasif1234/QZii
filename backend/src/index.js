import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser" 
import cors from "cors"
import http from "http"
import { Server } from "socket.io"

import { initializeSocket } from "./socket/socketHandler.js"

import authRouter from "./auth/auth.router.js";
import categoryRouter from "./category/category.router.js"
import quizRouter from "./quiz/quiz.router.js"
import questionRouter from "./questions/question.router.js"



dotenv.config({
    path:"./.env"
})


const port = process.env.PORT
const app = express()

const server =  http.createServer(app)

const io = new Server(server , {
  cors : {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  }
})


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);



app.use(express.json())
app.use(cookieParser())


app.use("/api/v1/auth" , authRouter)
app.use("/api/v1/category" ,categoryRouter )
app.use("/api/v1/quiz" ,quizRouter )
app.use("/api/v1/question" ,questionRouter )

initializeSocket(io);

server.listen(port , ()=>{
    console.log(`server started at port ${port}`)
})
