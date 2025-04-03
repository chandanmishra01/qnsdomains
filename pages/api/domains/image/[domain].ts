// pages/api/domains/image/[domain].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createCanvas } from 'canvas';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Accept GET requests only
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get domain from path
    const { domain } = req.query;
    
    if (!domain) {
      return res.status(400).json({ error: 'Domain name is required' });
    }
    
    // Create a canvas for the domain image
    const canvas = createCanvas(500, 500);
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = '#1f1f1f';
    ctx.fillRect(0, 0, 500, 500);
    
    // Add a gradient border
    const gradient = ctx.createLinearGradient(0, 0, 500, 500);
    gradient.addColorStop(0, '#991b1b');
    gradient.addColorStop(1, '#dc2626');
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, 490, 490);
    
    // Add domain text
    ctx.font = 'bold 36px IBM Plex Mono';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    
    // Handle long domain names
    const domainText = domain as string;
    if (domainText.length > 20) {
      ctx.font = 'bold 24px IBM Plex Mono';
    }
    
    ctx.fillText(domainText, 250, 250);
    
    // Set response headers
    res.setHeader('Content-Type', 'image/png');
    
    // Convert canvas to buffer and send response
    const buffer = canvas.toBuffer('image/png');
    res.send(buffer);
    
  } catch (error) {
    console.error('Error generating domain image:', error);
    return res.status(500).json({ error: 'Failed to generate domain image' });
  }
}