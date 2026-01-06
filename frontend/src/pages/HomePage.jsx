import { useEffect } from 'react';
import { useCategoryStore } from '../store/useCategoryStore'
import Categories from '../components/Categories';
import LandingPage from '../components/LandingPage';


const HomePage = () => {

  

    const{getAllCategories,categories,isCategoriesLoading} = useCategoryStore();
    

    useEffect(()=>{
        getAllCategories()
    },[getAllCategories])

    console.log(categories)

    
    if(isCategoriesLoading){
    return (
      <div className="flex items-center justify-center h-screen">
           <span className="text-gray-500 loading loading-dots loading-xl"></span>
      </div>
    )
  }

  return (
    <div className="min-h-screen  items-center   ">

    {
        categories.length > 0 ? <Categories categories = {categories} /> : (
            <p className="mt-10 text-center text-lg font-semibold text-gray-500 dark:text-gray-400 z-10 border border-primary px-4 py-2 rounded-md border-dashed">
          No Category found
        </p>
        )
    }
  </div>
  )
}

export default HomePage
