/* eslint-disable */
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const DomainRegistration = () => {
  const router = useRouter();
  const { domain } = router.query;
  const [yearCount, setYearCount] = useState(1);
  
  // Parse domain name from URL
  const domainName = domain ? String(domain) : '';
  
  // Calculate fee based on years (example rate, adjust as needed)
  const fee = 0.0007884 * yearCount;
  
  // Increment/decrement year counter
  const incrementYears = () => {
    setYearCount(prev => Math.min(prev + 1, 10)); // Max 10 years
  };
  
  const decrementYears = () => {
    setYearCount(prev => Math.max(prev - 1, 1)); // Min 1 year
  };
  
  // Handle registration
  const handleRegister = () => {
    // Implement your registration logic here
    console.log(`Registering ${domainName} for ${yearCount} years`);
    // This would typically involve a contract call or API request
  };
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Domain Icon/Image */}
      <div className="mb-8">
  <div className="w-20 h-20 bg-gradient-to-r from-red-800 to-red-600 rounded-full flex items-center justify-center">
    <span className="text-2xl">🌐</span>
  </div>
</div>
      
      {/* Domain Name */}
      <h1 className="text-2xl font-bold mb-2">{domainName}</h1>
      
      {/* Domain Hash (example) */}
      <p className="text-gray-400 text-sm mb-8 break-all max-w-md text-center">
        0x2068A863eF1c2CA6Ebad2E2d028341937DD9F1
      </p>
      
      {/* Registration Form */}
      <div className="w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Register {domainName}</h2>
        
        {/* Year Selector */}
        <div className="bg-gray-900 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={decrementYears}
              className="w-10 h-10 bg-gray-800 rounded-md flex items-center justify-center"
            >
              -
            </button>
            <div className="text-center">
              <span className="text-xl">{yearCount} year{yearCount > 1 ? 's' : ''}</span>
            </div>
            <button 
              onClick={incrementYears}
              className="w-10 h-10 bg-gray-800 rounded-md flex items-center justify-center"
            >
              +
            </button>
          </div>
          
          <p className="text-gray-400 text-sm mt-4">
            NOTE: Extending for multiple years saves on network costs by avoiding yearly transactions.
          </p>
        </div>
        
        {/* Fee Information */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-bold mb-2">Fees</h3>
          <div className="flex justify-between">
            <span>{yearCount} year registration</span>
            <span>{fee.toFixed(7)} qZETA</span>
          </div>
        </div>
        
        {/* Register Button */}
        <button 
          onClick={handleRegister}
          className="w-full py-3 rounded-full bg-gradient-to-r from-red-800 to-red-600 
                    hover:from-red-600 hover:to-red-800 
                    transition-all duration-300 
                    transform hover:scale-105
                    font-medium"
        >
          Register
        </button>
      </div>
      
      {/* Footer Links (optional, based on screenshot) */}
      <div className="mt-12 flex gap-6">
        <a href="/" className="text-gray-400 hover:text-white">Home</a>
        <a href="/referral" className="text-gray-400 hover:text-white">Referral</a>
        <a href="/docs" className="text-gray-400 hover:text-white">Docs</a>
      </div>
    </div>
  );
};

export default DomainRegistration;