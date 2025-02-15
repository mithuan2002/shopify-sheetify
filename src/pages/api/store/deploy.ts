
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

    const deployedUrl = `${storeName.toLowerCase().replace(/\s+/g, '-')}.shop.link`;
    localStorage.setItem(`store_${storeId}_status`, 'deployed');
    localStorage.setItem(`store_${storeId}_url`, deployedUrl);

    return res.status(200).json({ 
      url: `https://${deployedUrl}`,
      status: 'deployed'
    });
  } catch (error) {
    console.error('Deployment error:', error);
    return res.status(500).json({ error: 'Failed to deploy store' });
  }
}
