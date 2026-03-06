import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
    product: Product & { image: string };
}

const ProductCard = ({ product }: ProductCardProps) => {
    const { addItem } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            brand: product.brand,
            slug: product.slug,
            size: '10', // Default size for demo
            quantity: 1
        });
    };

    return (
        <Link href={`/product/${product.slug}`} className="group block h-full">
            <div className="bg-zinc-50 relative aspect-[4/5] overflow-hidden mb-4 border border-zinc-100 group-hover:border-brand-green transition-colors">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isNewArrival && (
                        <span className="bg-brand-green text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1">New</span>
                    )}
                    {product.isLimitedRelease && (
                        <span className="bg-brand-black text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1">Limited</span>
                    )}
                </div>

                {/* Add to Cart Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform bg-gradient-to-t from-black/80 to-transparent">
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-white text-black py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-green hover:text-white transition-colors"
                    >
                        <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </button>
                </div>
            </div>

            <div className="space-y-1">
                <div className="flex justify-between items-start">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em]">{product.brand}</p>
                    <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-brand-green fill-brand-green" />
                        <span className="text-[10px] font-bold">4.9</span>
                    </div>
                </div>
                <h3 className="font-outfit font-black text-lg leading-tight group-hover:text-brand-green transition-colors">{product.name}</h3>
                <div className="flex items-baseline gap-2">
                    <span className="font-outfit font-black text-xl">R{product.price.toFixed(2)}</span>
                    {product.isLimitedRelease && (
                        <span className="text-[10px] text-zinc-400 line-through">R{(product.price * 1.2).toFixed(2)}</span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
