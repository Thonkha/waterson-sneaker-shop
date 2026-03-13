import type { NextApiResponse } from 'next';
import dbConnect from '@/utils/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { adminMiddleware, AuthenticatedRequest } from '@/utils/adminMiddleware';

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            const totalOrders = await Order.countDocuments();
            const totalProducts = await Product.countDocuments();

            const orders = await Order.find({});
            const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

            const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

            return res.status(200).json({
                totalOrders,
                totalProducts,
                totalRevenue,
                avgOrderValue
            });
        } catch (error: any) {
            return res.status(500).json({ message: 'Error fetching stats' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
};

export default adminMiddleware(handler);
