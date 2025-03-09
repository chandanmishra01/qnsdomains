/* eslint-disable */
import React, { useState } from 'react';
import { quais } from 'quais';
import { useContext } from 'react';
import { StateContext } from '@/store';

import { useRouter } from 'next/router';
import { useRentFees } from '@/lib/getRentFees';
import { ETHRegistrarControllerAbi } from '@/abis/ETHRegistrarController';
import { checkAvailability } from '@/lib/checkAvailability';
import Image from 'next/image';

function encodeRegisterCall(name: any, owner: any, durationInSeconds: any) {
  const registerABI = ETHRegistrarControllerAbi.find(
    item => item.name === 'register' && item.inputs.length === 3 && item.stateMutability === 'payable'
  );

  if (name.endsWith('quai')) {
    name = name.slice(0, name.length - 5);
  }

  // @ts-ignore
  const iface = new quais.Interface([registerABI]);
  return iface.encodeFunctionData('register', [name, owner, durationInSeconds]);
}

const DomainRegistration = () => {
  const router = useRouter();
  const { domain } = router.query;
  const [yearCount, setYearCount] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isPrimary, setIsPrimary] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);
  const [fee, setFee] = useState(0);
  // @ts-ignore
  const { account, balance, connectWallet } = useContext(StateContext);
  const [txnHash, setTxnHash] = useState('');
  const [registerStatus, setRegisterStatus] = useState({
    loading: false,
    success: false,
    error: false,
  });

  // Parse domain name from URL
  var domainName = domain ? String(domain) : '';

  // Calculate fee based on years
  useRentFees(domainName, yearCount).then(fees => {
    setFee(Number(quais.formatQuai(fees)));
  });

  if (domainName.endsWith('quai')) {
    domainName = domainName.slice(0, domainName.length - 5);
  }
  checkAvailability(domainName).then(result => {
    setIsAvailable(result);
  });

  // Increment/decrement year counter
  const incrementYears = () => {
    setYearCount(prev => Math.min(prev + 1, 10)); // Max 10 years
  };

  const decrementYears = () => {
    setYearCount(prev => Math.max(prev - 1, 1)); // Min 1 year
  };

  // Handle registration
  const handleRegister = () => {
    if (!account || !account.addr) {
      // If wallet is not connected, try to connect it
      if (typeof connectWallet === 'function') {
        connectWallet();
      } else {
        console.error('connectWallet function not available');
      }
    } else {
      // If wallet is connected, show the registration modal
      setShowModal(true);
    }
  };

  // Handle confirmation in modal
  const handleConfirm = async () => {
    // Set loading state
    setRegisterStatus({
      loading: true,
      success: false,
      error: false,
    });

    if (!account || !account.addr) {
      console.error('No account connected');
      console.log('No account connected. Please connect your wallet.');
      setRegisterStatus({
        loading: false,
        success: false,
        error: true,
      });
      return;
    }

    if (!window.pelagus) {
      console.error('Pelagus not found');
      console.log('Pelagus wallet not found. Please install Pelagus extension.');
      setRegisterStatus({
        loading: false,
        success: false,
        error: true,
      });
      return;
    }

    try {
      const encodedata = encodeRegisterCall(domainName, account?.addr, yearCount * 31536000);

      console.log(encodedata);
      const feeinWei = quais.parseQuai(fee.toString());
      const valueHex = '0x' + feeinWei.toString(16);
      const txData = {
        from: account.addr, // The user's address
        to: '0x001A260BEF07ce24Fc5288B4C1d08537C7B04463', // Contract address
        value: valueHex, // Required when sending quai to an externally owned account
        data: encodedata, // encoded function call data
      };

      await window.pelagus
        .request({
          method: 'quai_sendTransaction',
          params: [txData],
        })
        .then((txHash: any) => {
          console.log('Transaction Hash: ', txHash);
          console.log(`Transaction submitted! Hash: ${txHash}`);

          // Set txnHash and success state after a delay to simulate processing
          setTxnHash(txHash);

          setTimeout(() => {
            setRegisterStatus({
              loading: false,
              success: true,
              error: false,
            });
          }, 5000);
        })
        .catch((error: any) => {
          console.error(error);
          console.log(`Transaction failed: ${error.message}`);
          setRegisterStatus({
            loading: false,
            success: false,
            error: true,
          });
        });

      console.log(
        `Confirmed registration for ${domainName} for ${yearCount} years as ${isPrimary ? 'primary' : 'secondary'} name`
      );
    } catch (error: any) {
      console.log(error);
      setRegisterStatus({
        loading: false,
        success: false,
        error: true,
      });
    }
  };

  // Toggle primary switch
  const togglePrimary = () => {
    setIsPrimary(!isPrimary);
  };

  // Reset registration status and close modal
  const resetAndClose = () => {
    setRegisterStatus({
      loading: false,
      success: false,
      error: false,
    });
    setShowModal(false);
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
      <h1 className="text-2xl font-bold mb-2">{domainName}.quai</h1>

      {/* Domain Hash (example) */}
      {account && account.addr && (
        <p className="text-gray-400 text-sm mb-8 break-all max-w-md text-center">{account.addr}</p>
      )}

      {/* Registration Form */}
      <div className="w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Register {domainName}.quai</h2>

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
              <span className="text-xl">
                {yearCount} year{yearCount > 1 ? 's' : ''}
              </span>
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
            <span>{fee.toFixed(7)} QUAI</span>
          </div>
        </div>

        {/* Register Button - Keep same styling but change text and behavior based on connection */}
        <button
          onClick={handleRegister}
          className={`w-full py-3 rounded-full font-medium transition-all duration-300 transform 
            ${
              isAvailable && account && account.addr
                ? 'bg-gradient-to-r from-red-800 to-red-600 hover:from-red-600 hover:to-red-800 hover:scale-105'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          disabled={account && account.addr ? !isAvailable : false}
        >
          {account && account.addr ? 'Register' : 'Connect Wallet'}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 relative">
            {/* Close button - only show when not in loading state */}
            {!registerStatus.loading && (
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
            {registerStatus.loading && (
              <div className="flex flex-col justify-center mx-auto">
                <h3 className="mx-auto text-xl font-semibold text-center">Pending Transaction</h3>
                <div className="flex justify-center">
                  <div className="my-8 w-16 h-16 border-t-4 border-white border-solid rounded-full animate-spin"></div>
                </div>
                <p className="text-center text-gray-400">Please wait while your transaction is being processed...</p>
              </div>
            )}

            {/* Success State */}
            {registerStatus.success && (
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-center">Transaction Successful</h3>
                <p className="mt-2 mb-4 text-md text-center">
                  Your registration transaction of {domainName} domain was successful
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
                      window.open(`https://orchard.quaiscan.io/tx/${txnHash}`, '_blank');
                    }}
                  >
                    View on Explorer
                  </button>
                  <button
                    className="px-4 py-2 text-sm border border-gray-400 w-fit bg-gray-800 hover:bg-gray-700 rounded-full"
                    onClick={() => {
                      resetAndClose();
                      router.push(`/`);
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Error State */}
            {registerStatus.error && (
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-center">Transaction Failed</h3>
                <p className="mt-2 mb-4 text-md text-center">Something went wrong... Try Again!</p>
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
            {!registerStatus.loading && !registerStatus.success && !registerStatus.error && (
              <>
                {/* Modal title */}
                <h2 className="text-2xl font-bold mb-2 text-center">Confirm Details</h2>
                <p className="text-center text-gray-400 mb-6">
                  Double check these details before confirming in your wallet.
                </p>

                {/* Details */}
                <div className="space-y-4">
                  {/* Name */}
                  <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                    <span className="text-lg">Name</span>
                    <span className="text-lg font-medium">{domainName}</span>
                  </div>

                  {/* Action */}
                  <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                    <span className="text-lg">Action</span>
                    <span className="text-lg font-medium">Register Name</span>
                  </div>

                  {/* Fee */}
                  <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                    <span className="text-lg">Fee</span>
                    <span className="text-lg font-medium">{fee.toFixed(7)} QUAI</span>
                  </div>

                  {/* Duration */}
                  <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                    <span className="text-lg">Duration</span>
                    <span className="text-lg font-medium">
                      {yearCount} year{yearCount > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Primary toggle */}
                  <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                    <span className="text-lg">Primary</span>
                    <div
                      className={`w-12 h-6 rounded-full flex items-center ${isPrimary ? 'bg-red-700 justify-end' : 'bg-gray-700 justify-start'} p-1 cursor-pointer`}
                      onClick={togglePrimary}
                    >
                      <div className="h-4 w-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Confirm button */}
                <button
                  onClick={handleConfirm}
                  className="w-full mt-6 py-3 rounded-full bg-gray-800 hover:bg-gray-700 
                            transition-colors duration-300
                            font-medium text-white"
                >
                  Confirm
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainRegistration;