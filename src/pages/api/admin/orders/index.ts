import type { NextApiResponse } from 'next';
import dbConnect from '@/utils/db';
import Order from '@/models/Order';
import { adminMiddleware, AuthenticatedRequest } from '@/utils/adminMiddleware';

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
    await dbConnect();

    if (req.method === 'GET') {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        return res.status(200).json(orders);
    }

    if (req.method === 'PUT') {
        const { id, status } = req.body;
        try {
            const order = await Order.findById(id);
            if (!order) return res.status(404).json({ message: 'Order not found' });

            if (status === 'Delivered') {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            } else if (status === 'Paid') {
                order.isPaid = true;
                order.paidAt = Date.now();
            }

            const updatedOrder = await order.save();
            return res.status(200).json(updatedOrder);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
};

export default adminMiddleware(handler);
