import React from "react";
import UrlShortener from "../UrlShortener/UrlShortener";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <UrlShortener/>
      
      <footer className="absolute bottom-0 left-0 right-0 py-4 text-sm text-gray-400">
        <p>A simple tool to shorten your URLs</p>
      </footer>
    </div>
  );
};

export default Home;