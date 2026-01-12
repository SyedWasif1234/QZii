import {create} from "zustand";
import {io} from "socket.io-client";

const SOCKET_URL = "http://localhost:8000";


export const useSocketStore = create((set , get) => ({

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

    // A. When YOU create a room, backend sends this back
    newSocket.on("room_created", (data) => {
      set({ activeRoom: data, isFindingMatch: false }); 
    });

    // B. When the FRIEND joins your room
    newSocket.on("start_game", (data) => {
      console.log("start_game", data);
      set({ activeRoom: data, gameStarted: true });
    });

    // C. Error Handling
    newSocket.on("room_error", (err) => {
      set({ error: err.message, isFindingMatch: false });
      alert(err.message); // Simple alert for now
    });

    set({ socket: newSocket });
  },

  // 2. CLEANUP
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false, activeRoom: null });
    }
  },

  createChallengeRoom: (quizId, username) => {

    console.log("user name from createchallange room :" , username)
    const { socket } = get();
    if (!socket) return;
    
    set({ isFindingMatch: true, error: null, activeRoom: null, gameStarted: false });
    socket.emit("create_challenge", { quizId, username });
  },

  joinChallengeRoom: (roomId, username) => {

    console.log("user name from join challange room : " , username);
    const { socket } = get();
    if (!socket) return;

    set({ error: null });
    socket.emit("join_challenge", { roomId, username });
  },

  resetBattleState: () => {
    set({ activeRoom: null, gameStarted: false, error: null });
  }
 
}))