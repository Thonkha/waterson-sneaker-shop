import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/db';
import Product from '@/models/Product';
import { SAMPLE_PRODUCTS } from '@/data/products';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await dbConnect();

        // Optional: Clear existing products
        // await Product.deleteMany({});

        // Remove _id from sample products to let MongoDB generate new ones
        const productsToSeed = SAMPLE_PRODUCTS.map(({ _id, ...rest }) => rest);

        // Use upsert or clear-and-insert
        // For development, let's just clear and insert
        await Product.deleteMany({});
        const createdProducts = await Product.insertMany(productsToSeed);

        res.status(200).json({
            message: 'Database seeded successfully',
            count: createdProducts.length
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error seeding database', error: error.message });
    }
}
