import { quais } from 'quais';

export const useProvider = () => {
  const provider = new quais.JsonRpcProvider('https://orchard.rpc.quai.network', undefined, { usePathing: true });
  return provider;
};
