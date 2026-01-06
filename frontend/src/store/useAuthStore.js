import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"


//variable and methods which we will use globally 
export const useAuthstore = create((set)=>({

    //variable which we use globally
    authUser : null ,
    isSigningUp :false ,
    isLogedIn : false,
    isCheckingAuth : true ,
    isGettingMe:false ,
    isLoggingOut:false,
    //function shich we use globally
 
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data, isCheckingAuth: false });
    } catch (error) {
      set({ authUser: null, isCheckingAuth: false });
    }
  },

    signUp: async (data) =>{
        set({isSigningUp:true})
        try {
            const res = await axiosInstance.post("/auth/register",data)
            set({authUser:res.data.user})
            toast.success(res.data.message)
        } catch (error) {
            console.log("error signing up" , error);
            toast.error("error signign up");
        }
        finally{
            set({isSigningUp:false})
        }
    },

    login: async(data) => {
        set({isLogedIn:true})
        try {
            console.log(data)
            const res = await axiosInstance.post("/auth/login",data)
            set({authUser:res.data.user})
            toast.success(res.data.message)
        } catch (error) {
            console.log("error loging In");
            toast.error("error loging In")
        }
        finally{
            set({isLogedIn:false})
        }
    },

    logout: async()=>{
        try {
            await axiosInstance.post("/auth/logout")
        } catch (error) {
            toast.error("error logging out")
        }
        finally{
            set({authUser:null , isLogedIn:false})
            toast.success("Logout successful")
        }
     } ,

    me:async () => {
        set({isGettingMe:true})
        try {
            const res = await axiosInstance.get("/auth/me")
            console.log("responce: ",res)
            set({authUser:res.data.user})  
            toast.success(res.data.message)  
        } catch (error) {
            console.log("error while fetching profile")
        }
        finally{
            set({isGettingMe:false})
        }
    }



}))
