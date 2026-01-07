import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCategoryStore } from "../store/useCategoryStore";

const Categories = () => {
  const { authUser } = useAuthStore();
  const { getAllCategories, categories } = useCategoryStore();
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  // Filtering logic: Senior tip - always handle null/undefined cases for safety
  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleDelete = (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      // alert(`Deleting category with ID: ${categoryId}`);
      // call your store action here
    }
  };

  const handleCreate = () => {
    alert('Creating a new category...');
  };

  return (
    <div className="min-h-screen bg-white p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
          
          {/* 1. Title */}
          <h1 className="text-2xl font-bold text-slate-800 shrink-0">
            Browse Categories
          </h1>

          {/* 2. Search Bar - Positioned in the middle */}
          <div className="relative w-full max-w-md group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400 group-focus-within:text-sky-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search for a topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* 3. Create Button */}
          <div className="shrink-0">
            {authUser?.user?.role === "ADMIN" && (
              <button 
                onClick={handleCreate} 
                className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-md shadow-sky-100 transition-all hover:-translate-y-0.5"
              >
                <Plus size={18} />
                <span>New Category</span>
              </button>
            )}
          </div>
        </div>

        {/* CATEGORY LIST */}
        <div className="divide-y divide-slate-100 bg-slate-20 p-2">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div 
                key={category.id} 
                className="py-6 flex justify-between items-center group hover:bg-slate-50/50 px-4 -mx-4 transition-all rounded-xl  border border-sky-100"
              >
                <Link 
                  to={`/category/${category.id}`} 
                  className="text-lg text-black group-hover:text-sky-600 transition-colors font-medium "
                >
                  {category.name}
                </Link>
                
                <div className="flex items-center gap-6">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">
                    Interactive Quizzes
                  </span>
                  <button 
                    onClick={() => handleDelete(category.id)} 
                    className="text-slate-200 hover:text-red-500 transition-colors transform group-hover:scale-110"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            /* EMPTY STATE */
            <div className="py-20 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                <Search size={24} className="text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">No categories matching "{searchQuery}"</p>
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-2 text-sky-500 text-sm font-semibold hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;