import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useCategoryStore = create((set)=>({

    categories:[],
    category:null,
    isCategoriesLoading:false ,
    isCategoryLoding:false,

    getAllCategories: async()=>{
        try {

            set({isCategoriesLoading:true});
            const result = await axiosInstance.get("/category/all-categories");
            console.log("categories:",result)
            set({categories:result.data.categories})
            
        } catch (error) {
            console.log("error occured while fetchig all categories")
        } finally{
             set({isCategoriesLoading:false});
        }
    },

    getCategoryById: async(categoryId) =>{
        try {
            
            console.log("category id from store:",categoryId)
            set({isCategoryLoding:true})
            const result = await axiosInstance.get(`/category/getCategoryById/${categoryId}`)
            console.log("result",result.data.category)
            set({category:result.data.category})
        } catch (error) {
            console.log("error occured while fetching cateory")
        }finally{
              set({isCategoryLoding:false})
        }
    }
}))