/* eslint-disable */
import { quais } from 'quais';
import { ETHRegistrarControllerAbi } from '@/abis/ETHRegistrarController';
import { useProvider } from './useProvider';

export const registerDomain = async (label:any, owner: any, duration: any, quaiVaule: any) => {
  const contractAddress = '0x000D79133C15D76677df001CB5aE60fE809AF976';
  const provider = useProvider();

  const contract = new quais.Contract(contractAddress, ETHRegistrarControllerAbi, provider);
  const registerDomainTld = await contract.register(label, owner, duration, {
    value: quais.parseQuai(quaiVaule),
  })

  return registerDomainTld
};
