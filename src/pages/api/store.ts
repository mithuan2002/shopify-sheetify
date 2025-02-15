import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const storeId = req.query.storeId?.toString();

    if (storeId) {
      try {
        const storeData = {
          id: storeId,
          name: localStorage.getItem(`store_${storeId}_name`),
          template: localStorage.getItem(`store_${storeId}_template`),
          products: JSON.parse(localStorage.getItem(`store_${storeId}_products`) || '[]'),
          whatsapp: localStorage.getItem(`store_${storeId}_whatsapp`)
        };

        if (!storeData.name) {
          return res.status(404).json({ error: 'Store not found' });
        }

        return res.status(200).json(storeData);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch store data' });
      }
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, template, whatsapp, products } = req.body;
      const storeId = Date.now().toString();

      localStorage.setItem(`store_${storeId}_name`, name);
      localStorage.setItem(`store_${storeId}_template`, template);
      localStorage.setItem(`store_${storeId}_products`, JSON.stringify(products || []));
      localStorage.setItem(`store_${storeId}_whatsapp`, whatsapp);

      return res.status(200).json({ id: storeId, name, template, whatsapp, products });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create store' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}