import React from "react";
import SearchBar from "./SearchBar";

type Props = {};

function Hero({}: Props) {
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Implement your search logic here
  };

  return (
    <div className="flex flex-col">
      <div className="space-y-0 flex flex-col">
        {/* Maintaining original alignment with tech styling */}
        <div className="text-7xl font-bold font-grotesk tracking-tight leading-none whitespace-nowrap relative">
          <span className="text-white">Mint</span>
          <span className="text-gray-400 px-1">&</span>
          <span className="text-white">Unveil</span>
        </div>
        
        <div className="text-7xl font-bold font-grotesk tracking-tight pt-6 pb-2 leading-none">
          <span className="relative">
            Your
          </span>
        </div>
        
        <div className="text-6xl font-medium font-grotesk tracking-tight pt-6 leading-none relative">
  <span className="relative">
    <span className="text-red-600 font-semibold">.Quai</span>
    <span className="bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent font-bold tracking-wide"> Identity</span>
  </span>
</div>
      </div>
      
      <div className="pt-10 pb-14 font-[500] text-base text-gray-300">
        <div className="relative bg-black bg-opacity-50 p-4 border-l border-red-800">
          Digital identities natively issued on Quai Network, enabling seamless connectivity across all chains in Web3
          <div className="absolute top-0 right-0 w-4 h-[1px] bg-red-700"></div>
          <div className="absolute bottom-0 left-0 w-4 h-[1px] bg-red-700"></div>
        </div>
      </div>
      
      {/* Search Bar Component */}
      <SearchBar onSearch={handleSearch} />
    </div>
  );
}

export default Hero;