/* eslint-disable */
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { StateContext } from '@/store';
import { useProvider } from '@/lib/useProvider';
import { getDomainsForAddress, Domain } from '@/lib/fetchDomains';
import { quais } from 'quais';
import { shortenAddress } from '@/lib/utils';

// Import necessary constants for your app
const DEFAULT_TLD = 'quai';

// ReverseRegistrar contract address
const REVERSE_REGISTRAR_ADDRESS = '0x003B8a0258B019FF9B08982868164741463ba6da';

// We don't need to redeclare the Window interface
// It's likely already declared elsewhere in the codebase
// with a more specific type for pelagus

const MyAccount = () => {
   // @ts-ignore
  const { account, connectWallet } = useContext(StateContext);
  const router = useRouter();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetchedAddress, setLastFetchedAddress] = useState<string | null>(null);
  const [totalDomainCount, setTotalDomainCount] = useState<number | null>(null);
  const [settingPrimary, setSettingPrimary] = useState<string | null>(null);
  const [primaryDomain, setPrimaryDomain] = useState<string | null>(null);
  const [txnHash, setTxnHash] = useState('');
  const [setNameStatus, setSetNameStatus] = useState({
    loading: false,
    success: false,
    error: false,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
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

  // Function to open modal for setting primary domain
  const openSetPrimaryModal = (domain: Domain) => {
    setSelectedDomain(domain);
    setShowModal(true);
    // Reset any previous status
    setSetNameStatus({
      loading: false,
      success: false,
      error: false, 
    });
    setErrorMessage('');
  };

  // Function to encode setName function call (similar to the pattern in DomainRegistration.tsx)
  function encodeSetNameCall(name: string) {
    // Prepare the full domain name if it doesn't already have the TLD
    // const fullDomainName = name.endsWith(`.${DEFAULT_TLD}`) ? name : `${name}.${DEFAULT_TLD}`;
    
    // Set up the function signature and create interface
    const setNameABI = ["function setName(string memory name) public returns (bytes32)"];
    const iface = new quais.Interface(setNameABI);
    
    // Encode the function call with the domain name
    const encodedData = iface.encodeFunctionData('setName', [name]);
    console.log("Encoded data for setName:", encodedData);
    return encodedData;
  }

  // Function to set a domain as primary
  const setName = async () => {
    if (!selectedDomain) return;
    
    // Reset error message
    setErrorMessage('');

    // Set loading state
    setSetNameStatus({
      loading: true,
      success: false,
      error: false,
    });

    if (!account || !account.addr) {
      console.error('No account connected');
      setErrorMessage('No account connected. Please connect your wallet.');
      setSetNameStatus({
        loading: false,
        success: false,
        error: true,
      });
      return;
    }

    if (!window.pelagus) {
      console.error('Pelagus wallet not found');
      setErrorMessage('Pelagus wallet not found. Please install Pelagus extension.');
      setSetNameStatus({
        loading: false,
        success: false,
        error: true,
      });
      return;
    }

    try {
      // Set loading state for this domain
      setSettingPrimary(selectedDomain.tokenId);

      // Prepare the full domain name
      const fullDomainName = `${selectedDomain.name}.${DEFAULT_TLD}`;
      console.log("CHANDAN", fullDomainName)
      
      // Get encoded function data using similar pattern to DomainRegistration.tsx
      const encodedata = encodeSetNameCall(fullDomainName);
      
      // Create transaction data - matching format from DomainRegistration.tsx
      const txData = {
        from: account.addr, // The user's address
        to: REVERSE_REGISTRAR_ADDRESS, // Contract address
        data: encodedata, // encoded function call data
        gas: '0x55555', // Providing a higher gas limit
      };

      console.log("Sending transaction with data:", txData);

      // Send the transaction through Pelagus - using same approach as in DomainRegistration.tsx
      const txHash = await window.pelagus.request({
        method: 'quai_sendTransaction',
        params: [txData],
      });
      
      console.log("Transaction sent successfully:", txHash);
      
      // Set txnHash for the explorer link
      setTxnHash(txHash);

      // Update the UI to show the new primary domain after a delay to simulate processing
      setTimeout(() => {
        setPrimaryDomain(fullDomainName);
        
        // Update domains list to reflect the new primary domain
        setDomains(currentDomains => 
          currentDomains.map(d => ({
            ...d,
            isPrimary: d.id === selectedDomain.id
          }))
        );
        
        setSetNameStatus({
          loading: false,
          success: true,
          error: false,
        });
      }, 3000);
    } catch (error: any) {
      console.error('Unexpected error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred.');
      setSetNameStatus({
        loading: false,
        success: false,
        error: true,
      });
    } finally {
      setSettingPrimary(null);
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

  // Reset modal status and close it
  const resetAndClose = () => {
    setSetNameStatus({
      loading: false,
      success: false,
      error: false,
    });
    setErrorMessage('');
    setShowModal(false);
    setSelectedDomain(null);
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

  // Check if user has multiple domains to show primary domain options
  const hasMultipleDomains = domains.length > 1;

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
                {shortenAddress(account.addr)}
              </p>
              
              <h1 className="text-2xl font-bold mb-2 text-center">
                Registered Domains
              </h1>
              
              {/* Primary Domain Badge - only show if a primary domain is set */}
              {primaryDomain && (
                <div className="bg-red-900/30 text-red-400 text-sm rounded-full px-4 py-1 mb-4">
                  Primary: {primaryDomain}
                </div>
              )}
              
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
                onClick={connectWallet}
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
                  {domain.isPrimary && (
                    <span className="bg-red-600 text-xs rounded-full px-3 py-1">Primary</span>
                  )}
                </div>
                
                <div className="flex justify-between text-sm mt-4">
                  <span className="text-gray-300">Expires: {formatDate(domain.expiryDate)}</span>
                  <span className={isExpiringSoon(domain.expiryDate) ? "text-red-400" : "text-gray-300"}>
                    {getDaysLeft(domain.expiryDate)} days left
                  </span>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button 
                    onClick={() => renewDomain(domain.name, domain.tokenId)}
                    className="text-xs px-3 py-1 border border-gray-600 rounded-full hover:bg-gray-700 hover:border-red-600"
                  >
                    Renew
                  </button>
                  {hasMultipleDomains && !domain.isPrimary && (
                    <button 
                      onClick={() => openSetPrimaryModal(domain)}
                      disabled={settingPrimary === domain.tokenId}
                      className={`text-xs px-3 py-1 border border-gray-600 rounded-full hover:bg-gray-700 hover:border-red-600 ${
                        settingPrimary === domain.tokenId ? "opacity-50 cursor-not-allowed" : ""
                      }`}
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
                </div>
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

      {/* Set Primary Domain Modal */}
      {showModal && selectedDomain && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 relative">
            {/* Close button - only show when not in loading state */}
            {!setNameStatus.loading && (
              <button onClick={resetAndClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Loading State */}
            {setNameStatus.loading && (
              <div className="flex flex-col justify-center mx-auto">
                <h3 className="mx-auto text-xl font-semibold text-center">Setting Primary Domain</h3>
                <div className="flex justify-center">
                  <div className="my-8 w-16 h-16 border-t-4 border-white border-solid rounded-full animate-spin"></div>
                </div>
                <p className="text-center text-gray-400">
                  Please wait while your transaction is being processed...
                </p>
              </div>
            )}

            {/* Success State */}
            {setNameStatus.success && (
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-center">Transaction Successful</h3>
                <p className="mt-2 mb-4 text-md text-center">
                  Your primary domain is now set to {selectedDomain.name}.{DEFAULT_TLD}
                </p>
                <div className="flex justify-center my-8">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-row mx-auto space-x-3 justify-center">
                  <button
                    className="px-4 py-2 text-sm border border-gray-400 w-fit bg-gray-800 hover:bg-gray-700 rounded-full"
                    onClick={() => {
                      window.open(`https://quaiscan.io/tx/${txnHash}`, '_blank');
                    }}
                  >
                    View on Explorer
                  </button>
                  <button
                    className="px-4 py-2 text-sm border border-gray-400 w-fit bg-gray-800 hover:bg-gray-700 rounded-full"
                    onClick={resetAndClose}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Error State */}
            {setNameStatus.error && (
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-center">Transaction Failed</h3>
                <p className="mt-2 mb-4 text-md text-center">
                  {errorMessage || 'Something went wrong... Try Again!'}
                </p>
                <div className="flex justify-center my-8">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <button
                  className="px-4 py-2 mx-auto mt-5 text-sm border border-gray-400 w-fit bg-gray-800 hover:bg-gray-700 rounded-full"
                  onClick={resetAndClose}
                >
                  Close
                </button>
              </div>
            )}

            {/* Confirmation Details - only show when not in any special state */}
            {!setNameStatus.loading && !setNameStatus.success && !setNameStatus.error && (
              <>
                {/* Modal title */}
                <h2 className="text-2xl font-bold mb-2 text-center">Set Primary Domain</h2>
                <p className="text-center text-gray-400 mb-6">
                  This domain will represent your identity on the Quai network.
                </p>

                {/* Domain details */}
                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-bold mb-4">Domain</h3>
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-800 to-red-600 flex items-center justify-center mr-3">
                      <span className="text-lg">🔤</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedDomain.name}.{DEFAULT_TLD}</h3>
                    </div>
                  </div>
                  <div className="text-sm text-center text-gray-400">
                    Setting this domain as your primary identity will allow other users and applications to resolve your address using {selectedDomain.name}.{DEFAULT_TLD}
                  </div>
                </div>

                {/* Warning about gas fees */}
                <div className="bg-yellow-900/20 border border-yellow-900/50 rounded-lg p-4 mb-6">
                  <p className="text-yellow-500 text-sm">
                    This action will require a transaction to be sent to the blockchain. You will need to confirm this transaction in your wallet and pay gas fees.
                  </p>
                </div>

                {/* Confirm button */}
                <button
                  onClick={setName}
                  className="w-full py-3 rounded-full font-medium bg-gradient-to-r from-red-800 to-red-600 
                            hover:from-red-600 hover:to-red-800 transition-all duration-300"
                >
                  Set as Primary Domain
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccount;