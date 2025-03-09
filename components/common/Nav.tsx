import { useContext } from 'react';
import Image from 'next/image';

import { shortenAddress, sortedQuaiShardNames } from '@/lib/utils';
import { DispatchContext, StateContext } from '@/store';
import requestAccounts from '@/lib/requestAccounts';
import useGetAccounts from '@/lib/useGetAccounts';
import useGetBalance from '@/lib/getBalance';
import { Button } from '@/components/ui/button';
import { useContract } from '@/lib/useContract';

const NavButtonContent = [
  {
    name: 'Home',
    link: '/',
  },
  // {
  //   name: 'My Account',
  //   link: '/account',
  // },
  // {
  //   name: 'Tokens',
  //   link: '/tokens',
  // },
];

const Nav = () => {
  const { account, balance } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  useGetAccounts();
  
  const connectHandler = () => {
    if (account) {
      // If account exists, disconnect
      dispatch({ type: 'SET_ACCOUNT', payload: null });
      dispatch({ type: 'SET_BALANCE', payload: '0' });
      // You might want to clear any other wallet-related state here
      
      // If you need to notify the user
      console.log('Wallet disconnected');
    } else {
      // If no account, connect as before
      requestAccounts(dispatch);
    }
  };
  
  useGetBalance(account?.addr);
  useContract();
  
  return (
    <div className="flex justify-between items-center fixed top-0 left-0 w-full p-[15px] max-h-[70px] bg-[rgba(5,5,5,0.95)] backdrop-blur-[10px] z-[100] border-b border-gray-800">
      {/* Logo on the left */}
      <div className="flex items-center">
        <Image src="/QNSFull.png" alt="QNS Logo" width={50} height={50} />
      </div>

      {/* Navigation and Connect button on the right */}
      <div className="flex items-center gap-6">
        {/* Navigation links */}
        <div className="flex gap-4">
          {NavButtonContent.map((item, key) => (
            <Button 
              key={key} 
              variant="ghost" 
              size="sm" 
              className="font-bold text-base text-gray-400 hover:text-white hover:bg-gray-800" 
              href={item.link} 
              newTab={false}
            >
              {item.name}
            </Button>
          ))}
        </div>

        {/* Connect/Disconnect button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={connectHandler}
          className="relative px-6 py-2 
                     text-white font-medium
                     rounded-3xl
                     bg-gradient-to-r from-red-800 to-red-600
                     hover:from-red-600 hover:to-red-800
                     transition-all duration-300
                     transform hover:scale-105
                     shadow-lg hover:shadow-xl
                     focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50
                     border-0"
        >
          {account ? (
            <div className="flex gap-[10px] items-center">
              <p className="text-white text-md font-semibold">{sortedQuaiShardNames[account.shard].name}</p>
              <p className="text-gray-300 font-light">{shortenAddress(account.addr)}</p>
              <p className="text-orange-100 border-l border-gray-600 pl-2">| {balance} QUAI</p>
            </div>
          ) : (
            'Connect'
          )}
        </Button>
      </div>
    </div>
  );
};

export default Nav;