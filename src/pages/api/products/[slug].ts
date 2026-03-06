import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/db';
import Product from '@/models/Product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { slug } = req.query;

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await dbConnect();
        const product = await Product.findOne({ slug });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error: any) {
        console.error('Database error, falling back to sample data:', error.message);
        const { SAMPLE_PRODUCTS } = require('@/data/products');
        const product = SAMPLE_PRODUCTS.find((p: any) => p.slug === slug);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    }
}
