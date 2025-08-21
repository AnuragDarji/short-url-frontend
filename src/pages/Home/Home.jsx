import React from "react";
import UrlShortener from "../UrlShortener/UrlShortener";
// import { calcLength } from "framer-motion";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-gradient-to-br from-gray-900 to-gray-800 p-4" style={{ minHeight: "calc(100vh - 102px)" }}>
      <UrlShortener />
    </div>
  );
};

export default Home;
