import type { NextApiResponse } from 'next';
import dbConnect from '@/utils/db';
import Product from '@/models/Product';
import { adminMiddleware, AuthenticatedRequest } from '@/utils/adminMiddleware';

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
    await dbConnect();

    if (req.method === 'GET') {
        const products = await Product.find({}).sort({ createdAt: -1 });
        return res.status(200).json(products);
    }

    if (req.method === 'POST') {
        try {
            const product = new Product(req.body);
            const createdProduct = await product.save();
            return res.status(201).json(createdProduct);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
};

export default adminMiddleware(handler);
