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

  // Accept POST requests only (to match Intract's format)
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed. Use POST for verification.',
      data: null
    });
  }

  try {
    // Get address from request body (Intract format)
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ 
        success: false, 
        message: 'Address is required',
        data: null
      });
    }
    
    // Setup provider and contract (same as your working code)
    const provider = new quais.JsonRpcProvider('https://orchard.rpc.quai.network', undefined, { usePathing: true });
    const contractAddress = '0x004f00be85d2d0AE4316026c25E93C8Da74A68B8';
    const contract = new quais.Contract(contractAddress, baseRegistrarImplementationAbi, provider);
    
    // Check if the address owns any domains by checking its balance
    const balanceResponse = await contract.balanceOf(address);
    const balance = Number(balanceResponse);
    
    // Format response in Intract-compatible format
    if (balance > 0) {
      return res.status(200).json({
        success: true,
        message: `Address owns ${balance} QNS domain(s)`,
        data: {
          verified: true,
          address: address,
          domainCount: balance
        }
      });
    } else {
      return res.status(200).json({
        success: false,
        message: 'Address does not own any QNS domains',
        data: {
          verified: false,
          address: address
        }
      });
    }
    
  } catch (error) {
    console.error('Error in QNS domain verification:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to verify domain ownership',
      data: null
    });
  }
}