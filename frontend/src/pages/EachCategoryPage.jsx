import { useEffect } from 'react';
import { useCategoryStore } from '../store/useCategoryStore'
import { useParams } from 'react-router-dom';
import { Plus , Trash2 } from 'lucide-react';
import {Link} from "react-router-dom"
import { useAuthstore } from '../store/useAuthStore';


const EachCategoryPage = () => {
 
    const {categoryId} = useParams();
    const {getCategoryById ,category ,isCategoryLoding} = useCategoryStore();
    const{authUser} = useAuthstore();

    console.log(categoryId)

    useEffect(()=>{
        getCategoryById(categoryId)
    },[getCategoryById])

    console.log(category)

    if(isCategoryLoding){
       return (
      <div className="flex items-center justify-center h-screen">
           <span className="text-gray-500 loading loading-dots loading-xl"></span>
      </div>
    )
    }

    const Quizes = category?.quizzes;
    console.log("category from each category componenet:",Quizes)

    const handleDelete = (quizId) => {
        //here we will call deleting api
        alert(`Deleting category with ID: ${quizId}`);
    };

    // Placeholder function for handling category creation
    const handleCreate = () => {
        // here i will call the add categoty api
        alert('Creating a new category...');
    };

 
  return (
    <div className="bg-white min-h-screen sm:p-6 lg:p-8 text-slate-900 font-sans">
           <div className="max-w-3xl mx-auto"> {/* Adjusted max-width for a list view */}
        
        {/* Header Section: Title and Create Button */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
            <h1 className="text-3xl sm:text-4xl font-bold">Quizes</h1>
           {authUser.role === "ADMIN" && (
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
          {Quizes && Quizes?.length > 0 ? (
            <div className="flex flex-col gap-4"> {/* Changed from grid to flex-col */}
              {Quizes?.map((quiz) => (
                 <div
                  key={quiz?.id}
                  // Classes updated for a row layout
                  className="group bg-gray-100 rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md hover:bg-gray-200 hover:-translate-y-1 transition-all duration-300 ease-in-out"
                  
                > 
                  {/* Category Name */}
                     <h2 className="font-semibold text-lg text-slate-800">
                   <Link to={`/quiz/${quiz.id}`}>{quiz.title}</Link>
                  </h2>
                  {/* Delete Button (appears on hover) */}
                  <button
                    onClick={() => handleDelete(quiz.id)}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    aria-label={`Delete category ${quiz.title}`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div> 
              ))}
              
            </div>
          ) : (
            // Fallback message when there are no categories
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-600 text-lg">No quiz found.</p>
              <p className="text-gray-400 mt-2">Click "Create" to add your first one!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default EachCategoryPage
