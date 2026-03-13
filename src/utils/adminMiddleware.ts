import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';

export interface AuthenticatedRequest extends NextApiRequest {
    user?: {
        userId: string;
        role: string;
    };
}

export const adminMiddleware = (handler: any) => {
    return async (req: AuthenticatedRequest, res: NextApiResponse) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized - No token provided' });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;

            if (decoded.role !== 'admin') {
                return res.status(403).json({ message: 'Forbidden - Admin access required' });
            }

            req.user = decoded;
            return handler(req, res);
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }
    };
};
