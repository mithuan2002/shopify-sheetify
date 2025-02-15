
import { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  if (req.method === 'GET') {
    try {
      // Return store data from localStorage for now
      // In a real app, this would come from a database
      const storeData = {
        name: localStorage.getItem('storeName') || '',
        template: localStorage.getItem('storeTemplate') || 'minimal',
        products: JSON.parse(localStorage.getItem('storeProducts') || '[]'),
      };
      res.status(200).json(storeData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch store data' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, template, whatsapp } = req.body;
      // Store data in localStorage for now
      // In a real app, this would be saved to a database
      localStorage.setItem('storeName', name);
      localStorage.setItem('storeTemplate', template);
      localStorage.setItem('shopkeeperWhatsapp', whatsapp);
      
      res.status(200).json({ 
        id: Date.now().toString(),
        name,
        template,
        whatsapp
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save store data' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
