/* eslint-disable */
import { quais } from 'quais';
import { contractABI } from '../abis/ecr20abi';
import { useProvider } from './useProvider';

export const useContract = async () => {

  const contractAddress = "0x002684b31777c432648d5f7c9ba7f3e4dbfeb12f"
  const provider = useProvider()
  // create a contract
  const contract = new quais.Contract(contractAddress, contractABI, provider);

  return provider;
};
