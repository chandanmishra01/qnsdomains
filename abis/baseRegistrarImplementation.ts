// This is a sample ABI for an ENS-like registrar implementation
// Replace this with your actual contract ABI
/* eslint-disable */

const baseRegistrarImplementationAbi = [
    // Basic ERC721 Functions
    "function balanceOf(address owner) view returns (uint256)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
    
    // ENS-specific Functions
    "function available(uint256 tokenId) view returns (bool)",
    "function nameExpires(uint256 tokenId) view returns (uint256)",
    "function getName(uint256 tokenId) view returns (string)",
    "function registrationDate(uint256 tokenId) view returns (uint256)",
    "function primaryDomain(address owner) view returns (uint256)", 
    "function setPrimaryDomain(uint256 tokenId)",
    "function renew(uint256 tokenId, uint256 duration) payable",
    
    // Events
    "event NameRegistered(string name, uint256 indexed tokenId, address indexed owner, uint256 expires)",
    "event NameRenewed(string name, uint256 indexed tokenId, uint256 expires)"
  ];
  
  export default baseRegistrarImplementationAbi;