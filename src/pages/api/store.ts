
import { prisma } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, template, whatsapp, products } = req.body;
    try {
      const store = await prisma.store.create({
        data: {
          name,
          template,
          whatsapp,
          products: {
            create: products.map((product: any) => ({
              name: product.name,
              price: product.price,
              description: product.description,
              image: product.imageUrl
            }))
          }
        },
        include: {
          products: true
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
