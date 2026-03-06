import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        brand: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
        images: [{ type: String }],
        sizes: [{ type: String }],
        colors: [{ type: String }],
        stock: { type: Number, required: true, default: 0 },
        isTrending: { type: Boolean, default: false },
        isNewArrival: { type: Boolean, default: false },
        isLimitedRelease: { type: Boolean, default: false },
        releaseDate: { type: Date },
        materials: { type: String },
        popularity: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
