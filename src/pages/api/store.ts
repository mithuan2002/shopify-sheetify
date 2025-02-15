
import express from 'express';
import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
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
        console.error('Store fetch error:', error);
        return res.status(500).json({ error: 'Failed to fetch store data' });
      }
    }

    // Return default store data if no ID provided
    try {
      const defaultData = {
        name: localStorage.getItem('storeName'),
        template: localStorage.getItem('storeTemplate'),
        products: JSON.parse(localStorage.getItem('storeProducts') || '[]'),
        whatsapp: localStorage.getItem('shopkeeperWhatsapp')
      };
      return res.status(200).json(defaultData);
    } catch (error) {
      console.error('Default store fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch store data' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, template, whatsapp, products } = req.body;
      const storeId = Date.now().toString();

      // Save store data
      localStorage.setItem(`store_${storeId}_name`, name);
      localStorage.setItem(`store_${storeId}_template`, template);
      localStorage.setItem(`store_${storeId}_whatsapp`, whatsapp);
      localStorage.setItem(`store_${storeId}_products`, JSON.stringify(products || []));

      // Also save as default store
      localStorage.setItem('storeName', name);
      localStorage.setItem('storeTemplate', template);
      localStorage.setItem('shopkeeperWhatsapp', whatsapp);
      localStorage.setItem('storeProducts', JSON.stringify(products || []));

      const storeUrl = `${process.env.VITE_APP_URL || window.location.origin}/${storeId}`;

      return res.status(200).json({ 
        id: storeId, 
        name, 
        template, 
        whatsapp, 
        products,
        url: storeUrl
      });
    } catch (error) {
      console.error('Store creation error:', error);
      return res.status(500).json({ error: 'Failed to create store' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
