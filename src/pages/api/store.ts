import { prisma } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, whatsapp } = req.body;

    try {
      const store = await prisma.store.create({
        data: { name, whatsapp }
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
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json(store || null);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch store' });
    }
  }
}