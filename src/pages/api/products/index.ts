import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/db';
import Product from '@/models/Product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await dbConnect();
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error: any) {
        console.error('Database connection failed, falling back to sample data:', error.message);
        const { SAMPLE_PRODUCTS } = require('@/data/products');
        res.status(200).json(SAMPLE_PRODUCTS);
    }
}
