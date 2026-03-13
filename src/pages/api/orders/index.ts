import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/db';
import Order from '@/models/Order';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method === 'GET') {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized - No token provided' });
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            const orders = await Order.find({ user: decoded.userId }).sort({ createdAt: -1 });
            return res.status(200).json(orders);
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await dbConnect();

        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
        } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Optional: Check for logged in user
        let userId = null;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, JWT_SECRET) as any;
                userId = decoded.userId;
            } catch (err) {
                console.error('Invalid token in order creation:', err);
            }
        }

        const order = new Order({
            user: userId,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    } catch (error: any) {
        console.error('Order creation error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
