import React from "react";
import Image from "next/image";

const ImagePlaceholder = () => {
  return (
    <div className="flex-col items-baseline justify-between w-full text-center bg-black py-7 h-120 rounded-2xl shadow-xl">
      {/* Smiley Face Icon Container */}
      <div className="flex items-center justify-center p-6">
        {/* If you have the Input8.svg file */}
        {/* <Image src="/Input8.svg" alt="Identity Icon" width={250} height={250} /> */}
        
        {/* Alternatively, create the icon using CSS if SVG is not available */}
        <div className="relative w-48 h-48 md:w-64 md:h-64">
          <div className="absolute inset-0 bg-gray-800 rounded-full p-3 flex items-center justify-center">
            <div className="relative w-full h-full rounded-full bg-green-400 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-white opacity-70"></div>
              <div className="text-4xl">😊</div>
              <div className="absolute top-4 right-4 w-4 h-4 bg-black rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Minting Text */}
      <p className="mb-6 font-semibold text-white uppercase tracking-wider">MINTING...</p>
      
      {/* Percentage with curved line */}
      <div className="relative z-20 mb-6 font-semibold text-white text-6xl md:text-7xl">
        {/* If you have the Input7.png file */}
        {/* <Image
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 -z-10"
          src="/Input7.png"
          alt="Curved Line"
          width={500}
          height={125}
        /> */}
        
        {/* Alternatively, create a simple curved line effect */}
        <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 -z-10">
          <div className="relative h-6 mx-14">
            <div className="absolute inset-0 border-t-2 border-b-2 border-gray-700 rounded-full"></div>
          </div>
        </div>
        60%
      </div>
      
      {/* Domain Name */}
      <div className="border-gray-800 border-b-[1px] w-32 mx-auto">
        <p className="my-1 font-bold text-white text-xl">Alice.zeta</p>
      </div>
      
      {/* Owner Address */}
      <p className="my-2 text-gray-400 text-sm">Owned by 0x23..D1</p>
    </div>
  );
};

export default ImagePlaceholder;