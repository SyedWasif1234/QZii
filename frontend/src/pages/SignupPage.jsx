
import { User, Lock ,Mail} from 'lucide-react';
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod";
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';


const SignUpSchema = z.object({
    email:z.string().email("Enter a valid email"),
    password:z.string().min(6 , "Password must be atleast of 6 characters"),
    name:z.string().min(3 , "Name must be atleast 3 character")
})

const SignupPage = () => {

    const{register , handleSubmit , formState:{errors}} = useForm({resolver:zodResolver(SignUpSchema)})

    const {signUp , isSigningUp } = useAuthStore();

    const onSubmit = async(data)=>{
        try {
            await signUp(data);
            console.log("signup data" , data)
            toast.success("signed up successfully")
        } catch (error) {
            console.log("error occured while signing up" , error);
        }
    }

  return (
    // Main container with background gradient and centering
    <div className="min-h-screen flex items-center justify-center bg-[url(./public/bg2.avif)] bg-cover bg-no-repeat bg-center p-4 font-sans">
      {/* Note: The background in the image has a forest silhouette. 
        For simplicity, this example uses a gradient. You could achieve the
        exact look by adding a background-image to this div.
      */}
      
      {/* Login Form Container */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
        <h2 className="text-4xl   text-yellow-400 font-bold  text-center mb-8">
          QZii
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Username Input */}
          <div className="mb-5 relative">
            <User 
              className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-300" 
              size={20} 
            />
            <input
              type="text"
              {...register("name")}
              placeholder="Username"
              className="w-full bg-white/20 rounded-lg py-3 px-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent pr-12"
            />
            
          </div>

           <div className="mb-5 relative">
            <input
              type="text"
              {...register("email")}
              placeholder="email"
              className="w-full bg-white/20 rounded-lg py-3 px-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent pr-12"
            />
            <Mail 
              className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-300" 
              size={20} 
            />
          </div>

          {/* Password Input */}
          <div className="mb-5 relative">
            <input
              type="password"
              {...register("password")}
              placeholder="Password"
              className="w-full bg-white/20 rounded-lg py-3 px-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent pr-12"
            />
            <Lock 
              className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-300" 
              size={20} 
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mb-6 text-sm">
            <div className="flex items-center">
              <input 
                id="remember-me" 
                type="checkbox" 
                className="h-4 w-4 rounded border-gray-300 bg-white/30 text-purple-600 focus:ring-purple-500 cursor-pointer" 
              />
              <label htmlFor="remember-me" className="ml-2 text-gray-200 cursor-pointer">
                Remember me
              </label>
            </div>
            <a href="#" className="font-medium text-gray-300 hover:text-white">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className=" flex items-center justify-center w-full bg-white text-purple-900 font-bold py-3 rounded-full hover:bg-gray-200 transition-colors duration-300 ease-in-out"
            disabled={isSigningUp}
          >
            {isSigningUp ? (
                  <>
                    <span className="loading loading-dots loading-xl"></span>
                  </>
                ) : (
                  "SignUp"
                )}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-300 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-white hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;