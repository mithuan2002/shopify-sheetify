
import { prisma } from '@/lib/db';

export default async function handler(req: Request) {
  if (req.method === 'GET') {
    const url = new URL(req.url);
    const storeId = url.searchParams.get('storeId');

    if (storeId) {
      try {
        const store = await prisma.store.findUnique({
          where: { id: storeId },
          include: { products: true }
        });

        if (!store) {
          return new Response(JSON.stringify({ error: 'Store not found' }), { 
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify(store), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error('Store fetch error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch store data' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const { name, template, whatsapp, products } = body;
      
      const store = await prisma.store.create({
        data: {
          id: Date.now().toString(),
          name,
          template,
          whatsapp,
          products: {
            create: products
          },
          status: 'preview'
        },
        include: { products: true }
      });

      return new Response(JSON.stringify(store), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Store creation error:', error);
      return new Response(JSON.stringify({ error: 'Failed to create store' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
}
