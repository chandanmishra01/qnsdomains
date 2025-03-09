/* eslint-disable */
import { useEffect, useContext } from 'react';
import { quais } from 'quais';
import { useProvider } from './useProvider';

import { DispatchContext } from '@/store';

// ---- get balance ---- //
// Gets user balance if pelagus is connected

const useGetBalance = (address: any) => {
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    const fetchBalance = async () => {

      const provider = useProvider();
      await provider.getBalance(address).then((result: any) => {
        dispatch({ type: 'SET_BALANCE', payload: quais.formatQuai(result) });
      })
      .catch((error) => {
        console.log(error)
      });
    };
    fetchBalance();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);
};

export default useGetBalance;
