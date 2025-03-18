/* eslint-disable */
import { quais } from 'quais';
import { ETHRegistrarControllerAbi } from '@/abis/ETHRegistrarController';
import { useProvider } from './useProvider';

export const getDomainWitoutTld = (label: string) => {
    try {
      return label
        ?.split(".")
        ?.slice(0, -1)
        ?.toLocaleString()
        ?.replaceAll(",", ".");
    } catch (error) {
      console.log(`🚀 ~ file: index.ts:62 ~ error:`, error);
      return label;
    }
  };

export const useRentFees = async (label: any, duration: any) => {

  const contractAddress = "0x000D79133C15D76677df001CB5aE60fE809AF976"
  const provider = useProvider()
  label = getDomainWitoutTld(label)
  duration *= 31536000
  // create a contract
  const contract = new quais.Contract(contractAddress, ETHRegistrarControllerAbi, provider);

  // // call a read-only contract function
  // const symbol = await contract.symbol();
  const rentPrice = await contract.rentPrice(label, duration)

  return rentPrice[0];
};
