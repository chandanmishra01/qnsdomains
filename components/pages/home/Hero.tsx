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
        <div className="text-7xl font-bold font-grotesk tracking-tight leading-none whitespace-nowrap">
          Mint And Unveil
        </div>
        
        <div className="text-7xl font-bold font-grotesk tracking-tight pt-6 pb-2 leading-none">
          Your
        </div>
        
        <div className="text-6xl font-medium font-grotesk tracking-tight pt-6 
                  bg-gradient-to-r from-red-500 to-red-900 
                  bg-clip-text text-transparent leading-none">
          .Quai Identity
        </div>
      </div>
      
      <div className="pt-10 pb-14 font-[500] text-base text-gray-300">
        Digital identities natively issued on Quai Network, enabling seamless connectivity across all chains in Web3
      </div>
      
      {/* Search Bar Component */}
      <SearchBar onSearch={handleSearch} />
    </div>
  );
}

export default Hero;