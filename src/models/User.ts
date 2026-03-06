import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: 'user', enum: ['user', 'admin'] },
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
        addresses: [
            {
                fullName: String,
                address: String,
                city: String,
                state: String,
                zipCode: String,
                country: String,
                isDefault: Boolean,
            }
        ]
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
