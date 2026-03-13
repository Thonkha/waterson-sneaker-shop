import type { NextApiResponse } from 'next';
import dbConnect from '@/utils/db';
import Product from '@/models/Product';
import { adminMiddleware, AuthenticatedRequest } from '@/utils/adminMiddleware';

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
    await dbConnect();
    const { id } = req.query;

    if (req.method === 'PUT') {
        try {
            const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
            if (!product) return res.status(404).json({ message: 'Product not found' });
            return res.status(200).json(product);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const product = await Product.findByIdAndDelete(id);
            if (!product) return res.status(404).json({ message: 'Product not found' });
            return res.status(200).json({ message: 'Product deleted' });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
};

export default adminMiddleware(handler);
