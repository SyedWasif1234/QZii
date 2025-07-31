import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser" 
import cors from "cors"

import authRouter from "./auth/auth.router.js";
import categoryRouter from "./category/category.router.js"
import quizRouter from "./quiz/quiz.router.js"
import questionRouter from "./questions/question.router.js"



dotenv.config({
    path:"./.env"
})


const port = process.env.PORT
const app = express()


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



app.listen(port , ()=>{
    console.log(`server started at port ${port}`)
})
