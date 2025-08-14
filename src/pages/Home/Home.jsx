import React from "react";
import UrlShortener from "../UrlShortener/UrlShortener";

const Home = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center bg-gray-100">
      <UrlShortener/>
    </div>
  );
};

export default Home;
