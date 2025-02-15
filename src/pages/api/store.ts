
import { prisma } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { name, template, whatsapp } = req.body;
      if (!name || !whatsapp) {
        return res.status(400).json({ error: 'Name and WhatsApp number are required' });
      }
      
      const store = await prisma.store.create({
        data: {
          name,
          template: template || 'minimal',
          whatsapp
        }
      });
      return res.status(200).json(store);
    }

    if (req.method === 'GET') {
      const store = await prisma.store.findFirst({
        orderBy: { createdAt: 'desc' },
        include: {
          products: true
        }
      });
      
      if (!store) {
        return res.status(404).json({ error: 'No store found' });
      }
      
      return res.status(200).json(store);
    }
  } catch (error) {
    console.error('Store API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
