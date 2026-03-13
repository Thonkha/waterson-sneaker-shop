import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await dbConnect();

        // Check if any admin already exists
        const adminExists = await User.findOne({ role: 'admin' });
        if (adminExists) {
            return res.status(403).json({ message: 'Admin setup already completed. Contact the system administrator.' });
        }

        const { name, email, password, setupKey } = req.body;

        // Simple setup key check for extra security (can be anything the user chooses)
        // This prevents random people who find the endpoint from using it before the owner
        if (setupKey !== 'waterson_init_2026') {
            return res.status(401).json({ message: 'Invalid setup key.' });
        }

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        res.status(201).json({
            message: 'Admin account created successfully.',
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error: any) {
        console.error('Setup error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
