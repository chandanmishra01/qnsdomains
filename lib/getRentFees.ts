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

  const contractAddress = "0x001A260BEF07ce24Fc5288B4C1d08537C7B04463"
  const provider = useProvider()
  label = getDomainWitoutTld(label)
  console.log("VANSH LABEL IS", label)
  duration *= 31536000
  // create a contract
  const contract = new quais.Contract(contractAddress, ETHRegistrarControllerAbi, provider);

  // // call a read-only contract function
  // const symbol = await contract.symbol();
  // console.log("VANSH SYMBOL IS", symbol);
  const rentPrice = await contract.rentPrice(label, duration)

  return rentPrice[0];
};
