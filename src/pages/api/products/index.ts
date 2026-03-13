import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/db';
import Product from '@/models/Product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await dbConnect();

        const { search, brand, minPrice, maxPrice, sort } = req.query;

        const query: any = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } }
            ];
        }

        if (brand) {
            query.brand = brand;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let sortQuery: any = { createdAt: -1 };
        if (sort === 'price_asc') sortQuery = { price: 1 };
        if (sort === 'price_desc') sortQuery = { price: -1 };
        if (sort === 'popularity') sortQuery = { popularity: -1 };

        const products = await Product.find(query).sort(sortQuery);
        res.status(200).json(products);
    } catch (error: any) {
        console.error('Database connection failed, falling back to sample data:', error.message);
        const { SAMPLE_PRODUCTS } = require('@/data/products');
        res.status(200).json(SAMPLE_PRODUCTS);
    }
}
