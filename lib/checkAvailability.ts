/* eslint-disable */
import { quais } from 'quais';
import BigNumber from 'bignumber.js';
import { useProvider } from './useProvider';
import { baseRegistrarImplementationAbi } from '@/abis/BaseImplementation';
var namehash = require('eth-ens-namehash')


function generateTokenId(inputName: any) {
  if (inputName.endsWith('quai')) {
    // throw new Error("Contains tld")
    const inputNameNoTld = inputName.slice(0, inputName.length - 4);
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
  const contractAddress = '0x00699ee782cb24b7d466E690ec2d14A91B7C636c';
  const provider = useProvider();

  const contract = new quais.Contract(contractAddress, baseRegistrarImplementationAbi, provider);
  const normaliseDomain = namehash.normalize(label)
  const tokenId = generateTokenId(normaliseDomain);
  const availableDomain = await contract.available(tokenId)
  console.log("DOMAIN AVAILABLE: ", availableDomain)

  return availableDomain
};
