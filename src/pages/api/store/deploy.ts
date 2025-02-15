
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { storeId } = req.body;
  
  try {
    const storeName = localStorage.getItem(`store_${storeId}_name`);
    if (!storeName) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const sanitizedStoreName = storeName
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-') // Replace invalid chars with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    const deployedUrl = `${sanitizedStoreName}.mystore.shop`;
    localStorage.setItem(`store_${storeId}_status`, 'public');
    localStorage.setItem(`store_${storeId}_url`, deployedUrl);
    localStorage.setItem(`store_${storeId}_visibility`, 'public');

    return res.status(200).json({ 
      url: `https://${deployedUrl}`,
      status: 'deployed'
    });
  } catch (error) {
    console.error('Deployment error:', error);
    return res.status(500).json({ error: 'Failed to deploy store' });
  }
}
