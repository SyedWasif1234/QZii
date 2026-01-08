import { db } from "../lib/db.js";
//import redis from "../lib/redis.js";

export const initializeSocket = (io) =>{
    io.on("connection" , (socket) => {
        console.log(`🙎‍♂️ User connected ✅ with a socket id : ${socket.id}`) ;

    })
}