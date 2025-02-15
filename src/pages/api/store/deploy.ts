
import { prisma } from '@/lib/db';

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { storeId } = await req.json();
    
    const store = await prisma.store.findUnique({
      where: { id: storeId }
    });

    if (!store) {
      return new Response(JSON.stringify({ error: 'Store not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const sanitizedStoreName = store.name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    const deployedUrl = `${sanitizedStoreName}.mystore.shop`;

    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: {
        status: 'public',
        url: deployedUrl
      }
    });

    return new Response(JSON.stringify({ 
      url: `https://${deployedUrl}`,
      status: 'deployed'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Deployment error:', error);
    return new Response(JSON.stringify({ error: 'Failed to deploy store' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
