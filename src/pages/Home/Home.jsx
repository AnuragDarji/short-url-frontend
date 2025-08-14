import React from "react";
import UrlShortener from "../UrlShortener/UrlShortener";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">

      
      {/* <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-center">
        <h2 className="text-xl font-bold text-indigo-600">Short.ly</h2>
      </div> */}
      
      <UrlShortener/>
      
      <footer className="absolute bottom-0 left-0 right-0 py-4 text-sm text-gray-500">
        <p>A simple tool to shorten your URLs</p>
      </footer>
    </div>
  );
};

export default Home;