import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/db';
import User from '@/models/User';
import Product from '@/models/Product';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    const token = authHeader.split(' ')[1];
    let userId;
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        userId = decoded.userId;
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }

    if (req.method === 'GET') {
        try {
            const user = await User.findById(userId).populate('wishlist');
            if (!user) return res.status(404).json({ message: 'User not found' });
            return res.status(200).json(user.wishlist);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    if (req.method === 'POST') {
        const { productId } = req.body;
        if (!productId) return res.status(400).json({ message: 'Product ID required' });

        try {
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: 'User not found' });

            const index = user.wishlist.indexOf(productId);
            if (index > -1) {
                // Remove if exists
                user.wishlist.splice(index, 1);
                await user.save();
                return res.status(200).json({ message: 'Removed from wishlist', action: 'removed' });
            } else {
                // Add if not exists
                user.wishlist.push(productId);
                await user.save();
                return res.status(200).json({ message: 'Added to wishlist', action: 'added' });
            }
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
