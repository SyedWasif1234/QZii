
import jwt from "jsonwebtoken"
import { db } from "../lib/db.js";

export const AuthMiddleware = async (req , res , next) => {

    const token = req.cookies.jwt;

    if(!token) {
        return res.status(401).json({message : "Unauthorized"})
    }

    try {

        const DecodeToken = jwt.verify(token , process.env.JWT_SECRET)

        console.log("decoded token : ",DecodeToken)
        console.log("decoded token name : ",DecodeToken.id)


        const user = await db.user.findUnique({
            where : {
                id : DecodeToken.id
            } ,
            select:{
                id : true ,
                name : true ,
                email: true ,
                role: true
            }
        }) 


        if(!user){
            return res.status(500).json({message : "Unauthorized"}) 
        }
        
        req.user = user

        next()


    } catch (error) {

        console.log("error occured in auth middleware : " , error)

        res.status(500).json({message : "Error authenticating user"})
        
    }
}

