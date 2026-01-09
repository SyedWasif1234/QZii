import {create} from "zustand";
import {io} from "socket.io-client";

const SOCKET_URL = "http://localhost:8000";


export const useSocketStore = create((set) => ({

socket: null,
  isConnected: false,
  
  // Battle State
  isFindingMatch: false,
  activeRoom: null, // Will store { roomId, link, ... } when created
  gameStarted: false, // Will turn true when friend joins
  error: null,

  connectSocket : ()=> {
    const{socket} = get();
    if(socket?.connected) return ;  // prevent double connection 

    const newSocket = io(SOCKET_URL , {
        withCredentials:true ,
        autoConnect : true
    });

    // ---- GLOBAL LISTENER-----
    newSocket.on("connect", () => {
      console.log("🟢 Socket Connected:", newSocket.id);
      set({ isConnected: true, error: null });
    });

    newSocket.on("disconnect", () => {
      console.log("🔴 Socket Disconnected");
      set({ isConnected: false, activeRoom: null, gameStarted: false });
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket Error:", err);
      set({ error: "Connection failed" });
    });

    

  },

  disconnectSocket : ()=>{

  }


}))