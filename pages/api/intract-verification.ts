// pages/api/intract-verification.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { quais } from 'quais';
import { baseRegistrarImplementationAbi } from '@/abis/BaseImplementation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Accept POST requests only
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed. Use POST for verification.'
    });
  }

  try {
    // Get address from request body
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ 
        success: false,
        message: 'Address is required'
      });
    }
    
    // Setup provider and contract
    const provider = new quais.JsonRpcProvider('https://orchard.rpc.quai.network', undefined, { usePathing: true });
    const contractAddress = '0x004f00be85d2d0AE4316026c25E93C8Da74A68B8';
    const contract = new quais.Contract(contractAddress, baseRegistrarImplementationAbi, provider);
    
    // Check if the address owns any domains by checking its balance
    const balanceResponse = await contract.balanceOf(address);
    const balance = Number(balanceResponse);
    
    // Simplified response format for Intract
    return res.status(200).json({
      success: balance > 0,
      message: balance > 0 
        ? `Address owns ${balance} QNS domain(s)` 
        : 'Address does not own any QNS domains'
    });
    
  } catch (error) {
    console.error('Error in QNS domain verification:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to verify domain ownership'
    });
  }
}