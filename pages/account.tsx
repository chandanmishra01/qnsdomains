/* eslint-disable */
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { StateContext } from '@/store';
import { useProvider } from '@/lib/useProvider';
import { getDomainsForAddress, Domain } from '@/lib/fetchDomains';
import { quais } from 'quais';

// Import necessary constants for your app
const DEFAULT_TLD = 'quai';

const MyAccount = () => {
  const { account } = useContext(StateContext);
  const router = useRouter();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetchedAddress, setLastFetchedAddress] = useState<string | null>(null);
  const [totalDomainCount, setTotalDomainCount] = useState<number | null>(null);
  const provider = useProvider();

  // Track if the component is mounted to prevent state updates after unmount
  const isMounted = React.useRef(true);
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Callback for when a domain is fetched - will be called for each domain as it loads
  const handleDomainFetched = useCallback((domain: Domain) => {
    if (!isMounted.current) return;
    
    setDomains(currentDomains => {
      // Check if this domain is already in the list to avoid duplicates
      const exists = currentDomains.some(d => d.id === domain.id);
      if (exists) return currentDomains;
      
      // Add new domain to the list immediately
      return [...currentDomains, domain];
    });
  }, []);

  // Fetch registered domains from the contract when account or provider changes
  useEffect(() => {
    // Skip if no account, no provider, or we've already fetched for this address
    if (!account?.addr || !provider || account.addr === lastFetchedAddress) {
      return;
    }

    const fetchRegisteredDomains = async () => {
      // Reset domains and start loading
      setDomains([]);
      setIsLoading(true);
      setLastFetchedAddress(account.addr);
      
      try {
        console.log("Fetching domains for address:", account.addr);
        
        // First, get the balance to show a counter
        const contractAddress = '0x004f00be85d2d0AE4316026c25E93C8Da74A68B8';
        const abi = ["function balanceOf(address owner) view returns (uint256)"];
        const contract = new quais.Contract(contractAddress, abi, provider);
        const domainCount = await contract.balanceOf(account.addr);
        
        if (isMounted.current) {
          setTotalDomainCount(Number(domainCount));
        }
        
        // Then progressively fetch domains
        await getDomainsForAddress(account.addr, provider, handleDomainFetched);
        
        // Mark loading as complete when done
        if (isMounted.current) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching domains:', error);
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    fetchRegisteredDomains();
  }, [account?.addr, provider, lastFetchedAddress, handleDomainFetched]);

  // Function to set a domain as primary
  const setPrimaryDomain = async (tokenId: string) => {
    try {
      if (!account || !account.addr) {
        console.error('No account connected');
        return;
      }

      const contractAddress = '0x006f5b630A3a59257f6aA57065bc271Dcd10B274';
      
      // ABI just for the setPrimaryDomain function
      const abi = ["function setPrimaryDomain(uint256 tokenId)"];
      
      const contract = new quais.Contract(contractAddress, abi, provider);
      
      // Call the setPrimary function
      const tx = await contract.setPrimaryDomain(tokenId);
      await tx.wait();
      
      // Mark the current domains with updated primary status
      setDomains(currentDomains => 
        currentDomains.map(domain => ({
          ...domain,
          isPrimary: domain.tokenId === tokenId
        }))
      );
    } catch (error) {
      console.error('Error setting primary domain:', error);
      alert('Failed to set primary domain. See console for details.');
    }
  };

  // Function to renew a domain
  const renewDomain = async (name: string, tokenId: string) => {
    try {
      if (!account || !account.addr) {
        console.error('No account connected');
        return;
      }

      const contractAddress = '0x006f5b630A3a59257f6aA57065bc271Dcd10B274';
      
      // ABI just for the renew function
      const abi = ["function renew(uint256 tokenId, uint256 duration) payable"];
      
      const contract = new quais.Contract(contractAddress, abi, provider);
      
      // Get renewal period - 1 year in seconds
      const renewalPeriod = 365 * 24 * 60 * 60;
      
      // Call the renew function
      const tx = await contract.renew(tokenId, renewalPeriod);
      await tx.wait();
      
      // Update just this domain's expiry date
      setDomains(currentDomains => 
        currentDomains.map(domain => {
          if (domain.tokenId === tokenId) {
            // Calculate new expiry date (1 year from now)
            const newExpiryDate = new Date();
            newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);
            
            return {
              ...domain,
              expiryDate: newExpiryDate
            };
          }
          return domain;
        })
      );
      
      alert(`Successfully renewed ${name}.${DEFAULT_TLD}`);
    } catch (error) {
      console.error('Error renewing domain:', error);
      alert('Failed to renew domain. See console for details.');
    }
  };

  // Function to manage domain
  const manageDomain = (domain: Domain) => {
    // Navigate to domain management page
    router.push(`/manage-domain/${domain.name}.${DEFAULT_TLD}`);
  };

  // Format date to readable string
  const formatDate = (date: any) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return 'Invalid Date';
    }
  };

  // Calculate days left until expiry
  const getDaysLeft = (expiryDate: any) => {
    try {
      const today = new Date().getTime();
      const expiry = new Date(expiryDate).getTime();
      const diffTime = Math.abs(expiry - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (error) {
      console.error('Error calculating days left:', error, expiryDate);
      return 0;
    }
  };

  // Check if a domain is expiring soon (less than 30 days)
  const isExpiringSoon = (expiryDate: any) => {
    const daysLeft = getDaysLeft(expiryDate);
    return daysLeft <= 30;
  };
  
  // Calculate progress percentage for loading indicator
  const loadingProgress = totalDomainCount 
    ? Math.round((domains.length / totalDomainCount) * 100) 
    : 0;

  // Determine if we're still waiting for the first domain or still loading more domains
  const isInitialLoading = isLoading && domains.length === 0;
  const isLoadingMore = isLoading && domains.length > 0 && totalDomainCount && domains.length < totalDomainCount;

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Account Header */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-red-800 to-red-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">😊</span>
          </div>
          
          {account ? (
            <>
              <p className="text-gray-400 break-all text-center mb-2">
                {account.addr}
              </p>
              
              <h1 className="text-2xl font-bold mb-2 text-center">
                Registered Domains
              </h1>
              
              {/* Loading progress indicator */}
              {isLoadingMore && (
                <div className="w-full max-w-md mb-6">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Loading domains...</span>
                    <span>{domains.length} of {totalDomainCount}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${loadingProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
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

        {/* Domains Grid - Show domains as they load */}
        {domains.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {domains.map((domain) => (
              <div key={domain.id} className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors animate-fadeIn">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-800 to-red-600 flex items-center justify-center mr-3">
                      <span className="text-sm">🔤</span>
                    </div>
                    <div>
                      <h3 className="font-bold">{domain.name}.{DEFAULT_TLD}</h3>
                      <p className="text-xs text-gray-400">Registered on {formatDate(domain.registrationDate)}</p>
                    </div>
                  </div>
                  {/* {domain.isPrimary && (
                    <span className="bg-red-600 text-xs rounded-full px-3 py-1">Primary</span>
                  )} */}
                </div>
                
                <div className="flex justify-between text-sm mt-4">
                  <span className="text-gray-300">Expires: {formatDate(domain.expiryDate)}</span>
                  <span className={isExpiringSoon(domain.expiryDate) ? "text-red-400" : "text-gray-300"}>
                    {getDaysLeft(domain.expiryDate)} days left
                  </span>
                </div>
                
                {/* <div className="mt-4 flex space-x-2">
                  <button 
                    onClick={() => renewDomain(domain.name, domain.tokenId)}
                    className="text-xs px-3 py-1 border border-gray-600 rounded-full hover:bg-gray-700 hover:border-red-600"
                  >
                    Renew
                  </button>
                  {!domain.isPrimary && (
                    <button 
                      onClick={() => setPrimaryDomain(domain.tokenId)}
                      className="text-xs px-3 py-1 border border-gray-600 rounded-full hover:bg-gray-700 hover:border-red-600"
                    >
                      Set as Primary
                    </button>
                  )}
                  <button 
                    onClick={() => manageDomain(domain)}
                    className="text-xs px-3 py-1 border border-gray-600 rounded-full hover:bg-gray-700 hover:border-red-600"
                  >
                    Manage
                  </button>
                </div> */}
              </div>
            ))}
          </div>
        )}

        {/* Initial Loading Spinner - Only shown before any domains load */}
        {isInitialLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        )}

        {/* No Domains Message */}
        {!isLoading && domains.length === 0 && account && (
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
        )}
      </div>
    </div>
  );
};

export default MyAccount;