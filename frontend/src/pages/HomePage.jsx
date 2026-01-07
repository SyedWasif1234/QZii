import React, { useEffect } from "react";
import Categories from "../components/Categories";
import { useCategoryStore } from "../store/useCategoryStore";

const HomePage = () => {
  return (
    <div className="pt-10">
      <Categories />
    </div>
  );
};

export default HomePage;
