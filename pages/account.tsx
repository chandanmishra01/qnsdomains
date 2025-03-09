import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useContext } from 'react';
import { StateContext } from '@/store'; // Assuming you're using the same store as in Nav

const MyAccount = () => {
  const { account } = useContext(StateContext);
  const router = useRouter();
  const [domains, setDomains] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration - replace with actual data fetching
  useEffect(() => {
    // This would be replaced with your actual API call or contract interaction
    const fetchRegisteredDomains = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - replace with real API call
        if (account) {
          // Example domains data
          const mockDomains = [
            { 
              id: 1, 
              name: 'example.quai', 
              expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), 
              isPrimary: true,
              registrationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            },
            { 
              id: 2, 
              name: 'mydomain.quai', 
              expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), 
              isPrimary: false,
              registrationDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
            }
          ];
          setDomains(mockDomains);
        } else {
          setDomains([]);
        }
      } catch (error) {
        console.error('Error fetching domains:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegisteredDomains();
  }, [account]);

  // Format date to readable string
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate days left until expiry
  const getDaysLeft = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = Math.abs(expiry - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Account Header */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-lime-400 to-green-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">😊</span>
          </div>
          
          {account ? (
            <>
              <p className="text-gray-400 break-all text-center mb-2">
                {account.addr}
              </p>
              
              <h1 className="text-2xl font-bold mb-6 text-center">
                Registered Domains
              </h1>
            </>
          ) : (
            <div className="text-center">
              <p className="text-xl mb-4">Connect your wallet to view your domains</p>
              <button 
                onClick={() => router.push('/')}
                className="py-2 px-6 rounded-full bg-gradient-to-r from-red-800 to-red-600 
                          hover:from-red-600 hover:to-red-800 transition-all duration-300"
              >
                Connect Wallet
              </button>
            </div>
          )}
        </div>

        {/* Domains List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : account && domains.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {domains.map((domain) => (
              <div key={domain.id} className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-lime-400 to-green-500 flex items-center justify-center mr-3">
                      <span className="text-sm">🔤</span>
                    </div>
                    <div>
                      <h3 className="font-bold">{domain.name}</h3>
                      <p className="text-xs text-gray-400">Registered on {formatDate(domain.registrationDate)}</p>
                    </div>
                  </div>
                  {domain.isPrimary && (
                    <span className="bg-green-600 text-xs rounded-full px-3 py-1">Primary</span>
                  )}
                </div>
                
                <div className="flex justify-between text-sm text-gray-300 mt-4">
                  <span>Expires: {formatDate(domain.expiryDate)}</span>
                  <span>{getDaysLeft(domain.expiryDate)} days left</span>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button className="text-xs px-3 py-1 border border-gray-600 rounded-full hover:bg-gray-700">
                    Renew
                  </button>
                  {!domain.isPrimary && (
                    <button className="text-xs px-3 py-1 border border-gray-600 rounded-full hover:bg-gray-700">
                      Set as Primary
                    </button>
                  )}
                  <button className="text-xs px-3 py-1 border border-gray-600 rounded-full hover:bg-gray-700">
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : account ? (
          <div className="text-center py-12">
            <p className="text-xl mb-4">You don't have any registered domains yet</p>
            <button 
              onClick={() => router.push('/')}
              className="py-2 px-6 rounded-full bg-gradient-to-r from-red-800 to-red-600 
                        hover:from-red-600 hover:to-red-800 transition-all duration-300"
            >
              Search for a Domain
            </button>
          </div>
        ) : null}
      </div>
      
      {/* Footer Links */}
     
    </div>
  );
};

export default MyAccount;