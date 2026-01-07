import React from "react";
import { Link } from "react-router-dom";
import { Loader2, LogOut, User, Settings, UserStar } from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";

const Profile = ({ closeDropdown }) => {
  const { authUser, logout, isLoggingOut } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    closeDropdown?.();
  };

  return (
    <div className="p-2 w-full bg-white dark:bg-slate-900">
      {/* User Info Header */}
      <div className="px-3 py-3 mb-2 border-b border-slate-100 dark:border-slate-800">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account</p>
        <p className="text-sm font-semibold truncate dark:text-white">{authUser?.fullName || "User"}</p>
      </div>

      <div className="flex flex-col gap-1">
        <Link 
          to="/profile" 
          onClick={closeDropdown}
          className="flex items-center gap-3 p-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          <User className="h-4 w-4" />
          Profile
        </Link>

        <Link 
          to="/settings" 
          onClick={closeDropdown}
          className="flex items-center gap-3 p-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>

        {authUser?.role === "ADMIN" && (
          <Link 
            to="/admin" 
            onClick={closeDropdown}
            className="flex items-center gap-3 p-2.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-colors"
          >
            <UserStar className="h-4 w-4" />
            Admin Dashboard
          </Link>
        )}

        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>

        <button
          className="flex items-center gap-3 w-full p-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-200"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
          ) : (
            <>
              <LogOut className="h-4 w-4" />
              Logout
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Profile;