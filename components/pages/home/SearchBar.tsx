import React, { useState, useCallback } from "react";
import { useRouter } from "next/router"; // Import router
import { checkAvailability } from "@/lib/checkAvailability";
// import { DEFAULT_TLD } from "@/configs"; // Import your TLD config if available

type SearchBarProps = {
  placeholder?: string;
  onSearch?: (query: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Enter your domain...",
  onSearch = () => {},
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter(); // Initialize router
  checkAvailability(searchQuery)
    .then((result) => {
        setIsAvailable(result);
    })
  
  // Basic validation functions
  const hasSpecialCharacters = (input: string): boolean => {
    const regex = /[!@#$%^&*()+\=\[\]{};':"\\|,<>\/?]+/;
    return regex.test(input);
  };
  
  // Handle input changes with validation
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Reset errors
    setIsValid(true);
    setErrorMessage("");
    
    // Validate length
    if (value.length >= 65) {
      setIsValid(false);
      setErrorMessage("Domain length must be less than 65 characters");
      setSearchQuery(value);
      return;
    }
    
    // Validate special characters
    if (hasSpecialCharacters(value)) {
      setIsValid(false);
      setErrorMessage("Please avoid special characters");
      setSearchQuery(value);
      return;
    }
    
    // Update search query
    setSearchQuery(value.replace(/\s+/g, "").trim());
    
    // Show dropdown if there's input
    setShowDropdown(value.trim() !== "");
  }, []);
  
  // Handle domain selection (similar to reference code)
  const handleDomainSelect = () => {
    if(!isAvailable) {
        return
    }

    if (!isValid || searchQuery.trim() === "") {
      return;
    }
    
    // Call onSearch prop if needed
    onSearch(searchQuery);
    
    // Navigate to domain page (using the format from the reference code)
    router.push(`/register-domain/${searchQuery}.quai`);
  };
  
  // Handle search button click
  const handleSearch = () => {
    handleDomainSelect();
  };
  
  // Handle key press (Enter)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  
  // Handle clicking outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(false);
    };
    
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative max-w-xl">
      <div className="flex rounded-full overflow-hidden shadow-lg">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-5 flex items-center">
            <svg
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onClick={(e) => {
              e.stopPropagation(); // Prevent closing dropdown when clicking input
              setShowDropdown(searchQuery.trim() !== "");
            }}
            className="w-full bg-gray-800 text-white py-4 pl-12 pr-4 rounded-l-full focus:outline-none text-lg"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-4 px-8 rounded-r-full focus:outline-none transition-colors"
        >
          Search
        </button>
      </div>
      
      {/* Simple Dropdown for results */}
      {showDropdown && (
        <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
          {searchQuery.trim() === "" ? (
            <p className="p-3 text-white text-sm">Type domain name to search</p>
          ) : (
            <div 
              className="p-3 cursor-pointer hover:bg-gray-700" 
              onClick={handleDomainSelect} 
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-600 to-red-800"></div>
                <span className="text-white text-sm">
                  {searchQuery}{!hasSpecialCharacters(searchQuery) ? ".quai" : ""}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  isValid && isAvailable ? "bg-green-600 text-white" : "bg-red-600 text-white"
                }`}>
                  {isValid ?  isAvailable ? "Available" : "Unavailable" : "Invalid"}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Error message */}
      {!isValid && errorMessage && (
        <div className="absolute left-0 mt-1 text-sm text-red-500">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default SearchBar;