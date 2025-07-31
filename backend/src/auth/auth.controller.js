
import { db } from "../lib/db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {UserRole} from "../generated/prisma/index.js"


const Register = async (req , res) => {

    const {name , email , password} = req.body

    console.log(name , email , password)
    
    if(!name || !email || !password) {
        return res.status(400).json({message : "All fields are required"})
    }

    try {

        const ExistingUser = await db.user.findUnique({
            where : {
                email
            }
        })

        if(ExistingUser) {
            return res.status(400).json({message : "User already exists"})
        }

        const HashedPassword = await bcrypt.hash(password , 10)

        const newUser = await db.user.create({
            data:{
                name,
                email,
                password:HashedPassword ,
                role : UserRole.USER 
            }
        })

        console.log(newUser)
        
        const token = jwt.sign( {id:newUser.id} , process.env.JWT_SECRET , { expiresIn:"2d"} )

        res.cookie( "jwt" , token , {
            httpOnly : true,
            secure : process.env.NODE_ENV !== "development",
            sameSite : "strict",
            maxAge : 1000 * 60 * 60 * 24 * 7
        })
        
        res.status(200).json({
            success:true ,
            message: "user registered successfully",
            user:{
                id:newUser.id ,
                name:newUser.name ,
                email:newUser.email,
                role:newUser.role
            }
        })
        
        
    } catch (error) {

        console.log("error occured while registering user : " , error)
        
        res.status(500).json({
            error:"Error creating user"
        })
    }
}


const login = async (req , res) => {
     
    const {email , password} = req.body

    if(!email || !password) {
        return res.status(400).json({message : "All fields are required"})
    }

    try {

        const user = await db.user.findUnique({
            where : {
                email
            }
        })

        if(!user) {
            return res.status(400).json({message : "User does not exist"})
        }

        const isMatch = await bcrypt.compare(password , user.password)
        
        if(!isMatch) {

            res.status(400).json({message : "Invalid password Plz try again"})
        }

        const token  = jwt.sign({id:user.id} , process.env.JWT_SECRET , {expiresIn:"7d"})
        
        res.cookie("jwt" , token , {
            httpOnly : true,
            secure : process.env.NODE_ENV !== "development",
            sameSite : "strict",
            maxAge : 1000 * 60 * 60 * 24 * 7
        })
        
        res.status(200).json({
            success:true ,
            message: "user logged in successfully",
            user:{
                id:user.id ,
                name:user.name ,
                email:user.email,
                role:user.role
            }
        })
        
    } catch (error) {

        console.log("error occured while login : " , error) 
        res.status(500).json({
            error:"Error logging in user"
        })
        
    }
}


const logout = async (req, res) =>{

     try {
        res.clearCookie("jwt" , {
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV !== "development",
        })

        res.status(200).json({
            success:true,
            message:"User logged out successfully"
        })
    } catch (error) {
        console.error("Error logging out user:", error);
        res.status(500).json({
            error:"Error logging out user"
        })
    }

}

 const check = async (req , res)=>{
    try {
        res.status(200).json({
            success:true,
            message:"User authenticated successfully",
            user:req.user
        });
    } catch (error) {
        console.error("Error checking user:", error);
        res.status(500).json({
            error:"Error checking user"
        })
    }
}

export {
    Register,
    login,
    logout,
    check
}