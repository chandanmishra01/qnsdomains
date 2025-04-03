// pages/api/domains/metadata.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { quais } from 'quais';
import { baseRegistrarImplementationAbi } from '@/abis/BaseImplementation';

// Function to generate tokenId from domain name
function generateTokenId(inputName: string) {
  // Remove .quai TLD if present
  if (inputName.endsWith('.quai')) {
    const inputNameNoTld = inputName.slice(0, inputName.length - 5);
    const tid = quais.keccak256(quais.toUtf8Bytes(inputNameNoTld));
    return tid;
  }
  if (inputName) {
    const tid = quais.keccak256(quais.toUtf8Bytes(inputName));
    return tid;
  }
  return '0';
}

// Function to normalize token ID to the format expected by the contract
function normalizeTokenId(tokenId: string) {
    try {
      // Handle BigNumber format - if already hex, return as is
      if (tokenId.startsWith('0x')) {
        return tokenId;
      } 
      
      // If it's a decimal string (even a very large one)
      // Convert to hex string manually since quais might not have BigNumber directly
      return '0x' + BigInt(tokenId).toString(16);
    } catch (error) {
      console.error('Error normalizing token ID:', error);
      
      // If BigInt fails, try a fallback approach
      try {
        // Try using ethers.BigNumber if quais doesn't have it
        // This creates a hex string from the large number
        return '0x' + tokenId
          .split('')
          .reduce((acc, digit) => {
            return (BigInt(acc) * BigInt(10) + BigInt(digit)).toString(16);
          }, '0');
      } catch (innerError) {
        console.error('Fallback normalization failed:', innerError);
        return tokenId; // Return as-is as last resort
      }
    }
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Accept GET requests only
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get query parameters
    const { domain, tokenId } = req.query;
    
    if (!domain && !tokenId) {
      return res.status(400).json({ error: 'Domain name or tokenId is required' });
    }
    
    // Setup provider and contract
    const provider = new quais.JsonRpcProvider('https://orchard.rpc.quai.network', undefined, { usePathing: true });
    const contractAddress = '0x004f00be85d2d0AE4316026c25E93C8Da74A68B8';
    const contract = new quais.Contract(contractAddress, baseRegistrarImplementationAbi, provider);
    
    // Determine the tokenId
    let domainTokenId: string;
    
    if (tokenId) {
      // Use provided tokenId but normalize it first
      domainTokenId = normalizeTokenId(tokenId as string);
      console.log(`Using provided token ID: ${tokenId}, normalized to: ${domainTokenId}`);
    } else {
      // Generate tokenId from domain name
      domainTokenId = generateTokenId(domain as string);
      console.log(`Generated token ID: ${domainTokenId} from domain: ${domain}`);
    }
    
    // Fetch domain metadata with better error handling
    let ownerAddress = null;
    let expiryTimestamp = 0;
    let nameBytes = '0x';
    let isAvailable = true;
    
    try {
      ownerAddress = await contract.ownerOf(domainTokenId);
    } catch (error) {
      console.log(`No owner found for token ID: ${domainTokenId}`);
    }
    
    try {
      expiryTimestamp = await contract.nameExpires(domainTokenId);
    } catch (error) {
      console.log(`No expiry timestamp found for token ID: ${domainTokenId}`);
    }
    
    try {
      nameBytes = await contract.idToNames(domainTokenId);
    } catch (error) {
      console.log(`No name bytes found for token ID: ${domainTokenId}`);
    }
    
    try {
      isAvailable = await contract.available(domainTokenId);
    } catch (error) {
      console.log(`Could not check availability for token ID: ${domainTokenId}`);
    }
    
    // Convert nameBytes to string if valid
    let domainName = '';
    try {
      if (nameBytes && nameBytes !== '0x') {
        domainName = quais.toUtf8String(nameBytes);
        console.log(`Successfully converted nameBytes to domain name: ${domainName}`);
      } else {
        console.log(`No valid name bytes found for token ID: ${domainTokenId}`);
      }
    } catch (error) {
      console.error('Error converting nameBytes to string:', error);
    }
    
    // Use the image URL from request host if available
    const baseUrl = req.headers.host ? `http://${req.headers.host}` : 'https://yourdomain.com';
    const imageUrl = `${baseUrl}/api/domains/image/${encodeURIComponent(domainName || 'unknown')}.quai`;
    
    // Format the response
    const metadata = {
      tokenId: tokenId,
      name: domainName ? `${domainName}.quai` : '',
      description: `This NFT represents ${domainName}.quai in QNS Domains Protocol.`,
      owner: ownerAddress,
      expiryDate: expiryTimestamp > 0 ? new Date(Number(expiryTimestamp) * 1000).toISOString() : null,
      image: "",
      attributes: [
        {
          trait_type: "Registration Date",
          value: "Unknown" // We don't have this data from the contract directly
        },
        {
          trait_type: "Expiration Date",
          value: expiryTimestamp > 0 ? new Date(Number(expiryTimestamp) * 1000).toISOString() : "Unknown"
        },
        {
          trait_type: "Length",
          value: domainName ? domainName.length : 0
        },
        {
          trait_type: "Resolved Address",
          value: ownerAddress
        }
      ]
    };
    
    // Return the metadata
    return res.status(200).json(metadata);
    
  } catch (error) {
    console.error('Error fetching domain metadata:', error);
    return res.status(500).json({ error: 'Failed to fetch domain metadata', details: error instanceof Error ? error.message : String(error) });
  }
}