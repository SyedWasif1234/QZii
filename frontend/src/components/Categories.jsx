import React, { useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import  {useCategoryStore} from "../store/useCategoryStore"
/*
  This component expects a 'categories' prop, which should be an array of objects.
  Each object should have at least an 'id' and a 'name'.
  Example:
  const myCategories = [
    { id: 1, name: 'Science & Nature' },
    { id: 2, name: 'History' },
    { id: 3, name: 'Mathematics' },
    { id: 4, name: 'Art & Culture' },
    { id: 5, name: 'Sports' },
  ];
*/

const Categories = () => {

  const{authUser} = useAuthStore();

    const {getAllCategories , categories} = useCategoryStore();
  
    useEffect(()=>{
      getAllCategories();
    },[getAllCategories])
  

  console.log(authUser)

  console.log("gettign categoories from categories component" , categories);
  // Placeholder function for handling category deletion
  const handleDelete = (categoryId) => {
    //here we will call deleting api
    alert(`Deleting category with ID: ${categoryId}`);
  };

  // Placeholder function for handling category creation
  const handleCreate = () => {
    // here i will call the add categoty api
    alert('Creating a new category...');
  };

  return (
    // Main container with a light theme
    <div className="bg-gray-100 min-h-screen sm:p-6 lg:p-8 text-slate-900 font-sans ">
      <div className="max-w-3xl mx-auto"> {/* Adjusted max-width for a list view */}
        
        {/* Header Section: Title and Create Button */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
            <h1 className="text-3xl sm:text-4xl font-bold">Categories</h1>
         {authUser?.user?.role === "ADMIN" && (
            <button
              onClick={handleCreate}
              className="flex items-center justify-center gap-2 bg-[#0077b6] hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md"
            >
              <Plus size={20} />
              <span>Create</span>
            </button>
        )}
          </div>
        </header>

        {/* List of Category Rows */}
        <main>
          {categories && categories.length > 0 ? (
            <div className="flex flex-col gap-4"> {/* Changed from grid to flex-col */}
              {categories.map((category) => (
                 <div
                  key={category.id}
                  // Classes updated for a row layout
                  className="group bg-gray-100 rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md hover:bg-gray-200 hover:-translate-y-1 transition-all duration-300 ease-in-out"
                  
                > 
                  {/* Category Name */}
                  
                  <h2 className="font-semibold text-lg text-slate-800">
                   <Link to={`/category/${category.id}`}>{category.name}</Link>
                  </h2>
                  
                  {/* Delete Button (appears on hover) */}
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    aria-label={`Delete category ${category.name}`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div> 
              ))}
              
            </div>
          ) : (
            // Fallback message when there are no categories
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-600 text-lg">No categories found.</p>
              <p className="text-gray-400 mt-2">Click "Create" to add your first one!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Categories;