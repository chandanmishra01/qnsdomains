import { quais } from 'quais';
import { ETHRegistrarControllerAbi } from '@/abis/ETHRegistrarController';
import { useProvider } from './useProvider';

export const registerDomain = async (label:any, owner: any, duration: any, quaiVaule: any) => {
  const contractAddress = '0x001A260BEF07ce24Fc5288B4C1d08537C7B04463';
  const provider = useProvider();

  const contract = new quais.Contract(contractAddress, ETHRegistrarControllerAbi, provider);
  const registerDomainTld = await contract.register(label, owner, duration, {
    value: quais.parseQuai(quaiVaule),
  })

  return registerDomainTld
};
