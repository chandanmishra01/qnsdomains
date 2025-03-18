import { quais } from 'quais';
import baseRegistrarImplementationAbi from '@/abis/baseRegistrarImplementation';

// Function to generate tokenId from domain name
export const generateTokenId = (label: string) => {
  return quais.keccak256(quais.toUtf8Bytes(label));
};

// Type for domain data
export type Domain = {
  id: string;
  name: string;
  tokenId: string;
  expiryDate: Date;
  isAvailable: boolean;
  isPrimary: boolean;
  registrationDate: Date;
};

// Callback type for sequential loading
type DomainCallback = (domain: Domain) => void;

// Function to fetch all domains owned by an address with sequential loading
export const getDomainsForAddress = async (
  address: string, 
  provider: any, 
  onDomainFetched?: DomainCallback // Optional callback for each domain fetched
) => {
  try {
    console.log("Fetching domains for address:", address);

    const contractAddress = '0x004f00be85d2d0AE4316026c25E93C8Da74A68B8';
    
    // Updated ABI with correct function signatures from the contract
    const abi = [ 
      "function balanceOf(address owner) view returns (uint256)",
      "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
      "function idToNames(uint256 tokenId) view returns (bytes)",
      "function nameExpires(uint256 id) view returns (uint256)",
      "function available(uint256 id) view returns (bool)"
    ];

    const contract = new quais.Contract(contractAddress, abi, provider);

    // Fetch balance
    const domainCount = await contract.balanceOf(address);
    console.log("Total domains owned:", domainCount.toString());

    // Convert domainCount safely
    const domainCountNumber = Number(domainCount);
    if (isNaN(domainCountNumber)) {
      console.error("Failed to convert domainCount to a number:", domainCount);
      return [];
    }

    if (domainCountNumber === 0) {
      console.log("No domains found.");
      return [];
    }

    const domains: Domain[] = [];

    // Fetch domains sequentially so they appear one by one
    for (let i = 0; i < domainCountNumber; i++) {
      try {
        const tokenId = await contract.tokenOfOwnerByIndex(address, i);
        console.log(`Fetching data for token ID: ${tokenId.toString()}`);

        // Fetch domain name bytes and convert to string
        const nameBytes = await contract.idToNames(tokenId);
        const domainName = quais.toUtf8String(nameBytes);
        console.log(`Domain name: ${domainName}`);

        // Fetch expiry timestamp using the correct function
        const expiryTimestamp = await contract.nameExpires(tokenId);
        console.log(`Expiry timestamp: ${expiryTimestamp.toString()}`);

        // Check if domain is available (expired + grace period)
        const isAvailable = await contract.available(tokenId);

        // Create domain object
        const domain: Domain = {
          id: tokenId.toString(),
          name: domainName,
          tokenId: tokenId.toString(),
          expiryDate: new Date(Number(expiryTimestamp) * 1000),
          isAvailable: isAvailable,
          isPrimary: i === 0, // Assume first domain is primary
          registrationDate: new Date() // Replace if actual registration date is available
        };

        // Add to our local array
        domains.push(domain);

        // Call the callback immediately for each domain as it's loaded
        if (onDomainFetched) {
          onDomainFetched(domain);
        }
      } catch (tokenError) {
        console.error(`Error fetching token at index ${i}:`, tokenError);
      }
    }
    
    console.log("Final domains list:", domains);
    return domains;
  } catch (error) {
    console.error("Error fetching domains:", error);
    return [];
  }
};