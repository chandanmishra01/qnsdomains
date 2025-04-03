// pages/api/domains/has-domain.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { quais } from 'quais';
import { baseRegistrarImplementationAbi } from '@/abis/BaseImplementation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Accept GET requests only
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get address from query parameters
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }
    
    // Setup provider and contract
    const provider = new quais.JsonRpcProvider('https://orchard.rpc.quai.network', undefined, { usePathing: true });
    const contractAddress = '0x004f00be85d2d0AE4316026c25E93C8Da74A68B8';
    const contract = new quais.Contract(contractAddress, baseRegistrarImplementationAbi, provider);
    
    // Check if the address owns any domains by checking its balance
    const balanceResponse = await contract.balanceOf(address);
    const balance = Number(balanceResponse);
    
    // Return the result
    return res.status(200).json({
      address: address,
      hasDomain: balance > 0,
      domainCount: balance
    });
    
  } catch (error) {
    console.error('Error checking if address owns domains:', error);
    return res.status(500).json({ 
      error: 'Failed to check domain ownership', 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
}