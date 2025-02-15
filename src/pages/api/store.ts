
import { prisma } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'Database configuration missing' });
  }

  if (req.method === 'POST') {
    const { name, template, whatsapp } = req.body;
    if (!name || !whatsapp) {
      return res.status(400).json({ error: 'Name and WhatsApp number are required' });
    }
    try {
      const store = await prisma.store.create({
        data: {
          name,
          template: template || 'minimal',
          whatsapp
        }
      });
      return res.status(200).json(store);
    } catch (error) {
      console.error('Store creation error:', error);
      return res.status(500).json({ error: 'Failed to create store' });
    }
  }

  if (req.method === 'GET') {
    try {
      const store = await prisma.store.findFirst({
        orderBy: { createdAt: 'desc' },
        include: {
          products: true
        }
      });
      return res.status(200).json(store);
    } catch (error) {
      console.error('Store fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch store' });
    }
  }
}
