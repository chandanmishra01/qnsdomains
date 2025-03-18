/* eslint-disable */
import {quais} from 'quais';
import BigNumber from 'bignumber.js';
import { useProvider } from './useProvider';
import { baseRegistrarImplementationAbi } from '@/abis/BaseImplementation';
var namehash = require('eth-ens-namehash')


function generateTokenId(inputName: any) {
  if (inputName.endsWith('.quai')) {
    // throw new Error("Contains tld")
    const inputNameNoTld = inputName.slice(0, inputName.length - 5);
    const tid = quais.keccak256(quais.toUtf8Bytes(inputNameNoTld));
    const tidNum = new BigNumber(tid).toFormat().replaceAll(',', '');
    return tidNum;
  }
  if (inputName) {
    const tid = quais.keccak256(quais.toUtf8Bytes(inputName));
    const tidNum = new BigNumber(tid).toFormat().replaceAll(',', '');
    return tidNum;
  }
  return 0;
}

export const checkAvailability = async (label: any) => {
  const contractAddress = '0x004f00be85d2d0AE4316026c25E93C8Da74A68B8';
  const provider = useProvider();

  const contract = new quais.Contract(contractAddress, baseRegistrarImplementationAbi, provider);
  const normaliseDomain = namehash.normalize(label)
  const tokenId = generateTokenId(normaliseDomain);
  const availableDomain = await contract.available(tokenId)
  console.log("DOMAIN AVAILABLE: ", availableDomain)

  return availableDomain
};
