import React, { useState } from "react";
import "./Home.css";
import Header from "../../components/header/Header";
import ExploreMenu from "../../components/exploreMenu/ExploreMenu";
import FoodDisplay from "../../components/food-display/FoodDisplay";
import AppDownload from "../../components/app-download/AppDownload";

const Home = () => {
  const [category, setCategory] = useState("All");
  return (
    <>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      <AppDownload />
    </>
  );
};

export default Home;
