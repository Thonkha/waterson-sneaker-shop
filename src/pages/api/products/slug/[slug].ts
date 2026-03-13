import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/db';
import Product from '@/models/Product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { slug } = req.query;

    try {
        const product = await Product.findOne({ slug });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
