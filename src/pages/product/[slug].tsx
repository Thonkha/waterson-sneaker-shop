import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, Heart, Star, ChevronRight, Truck, RefreshCw } from 'lucide-react';
import { Product } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useRouter } from 'next/router';
import dbConnect from '@/utils/db';
import ProductModel from '@/models/Product';

interface Props {
    product: any;
    related: any[];
}

const ProductPage: NextPage<Props> = ({ product, related }) => {
    const { addItem } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [sizeError, setSizeError] = useState(false);

    const handleWishlist = async () => {
        setWishlistLoading(true);
        await toggleWishlist(product._id);
        setWishlistLoading(false);
    };

    const isFav = isInWishlist(product._id);

    const handleAddToCart = () => {
        if (!selectedSize) { setSizeError(true); return; }
        setSizeError(false);

        addItem({
            _id: product._id,
            name: product.name,
            brand: product.brand,
            slug: product.slug,
            price: product.price,
            image: product.images[0],
            size: selectedSize,
            quantity: quantity
        });

        router.push('/cart');
    };

    return (
        <>
            <Head>
                <title>{product.name} — Waterson Drip Store</title>
                <meta name="description" content={product.description?.slice(0, 155)} />
                <meta property="og:title" content={`${product.name} | Waterson Drip Store`} />
                <meta property="og:image" content={product.images[0]} />
            </Head>

            {/* Breadcrumb */}
            <div className="bg-zinc-50 border-b border-zinc-100 py-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center gap-2 text-xs text-zinc-400">
                        <Link href="/" className="hover:text-brand-green">Home</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href="/shop" className="hover:text-brand-green">Shop</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-zinc-700 font-medium">{product.name}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Left: Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-square bg-zinc-100 overflow-hidden group">
                            <Image
                                src={product.images[selectedImage]}
                                alt={product.name}
                                fill
                                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                priority
                            />
                            {product.isLimitedRelease && (
                                <div className="absolute top-4 left-4 bg-brand-green text-white text-xs font-bold px-3 py-1 uppercase tracking-widest">
                                    Limited Release
                                </div>
                            )}
                        </div>
                        {/* Thumbnails */}
                        {product.images.length > 1 && (
                            <div className="flex gap-3">
                                {product.images.map((img: string, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`relative w-20 h-20 flex-shrink-0 border-2 transition-colors overflow-hidden ${selectedImage === i ? 'border-brand-green' : 'border-zinc-200 hover:border-zinc-400'}`}
                                    >
                                        <Image src={img} alt="" fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col">
                        <p className="text-brand-green text-xs font-bold uppercase tracking-[0.3em] mb-2">{product.brand}</p>
                        <h1 className="text-4xl font-outfit font-black leading-tight mb-3">{product.name}</h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-5">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'text-brand-green fill-brand-green' : 'text-zinc-200 fill-zinc-200'}`} />
                                ))}
                            </div>
                            <span className="text-sm text-zinc-400">({(product.reviews?.length ?? 0)} reviews)</span>
                        </div>

                        <div className="flex items-baseline gap-4 mb-6">
                            <span className="text-4xl font-black font-outfit">R{product.price.toFixed(2)}</span>
                            {product.stock < 10 && (
                                <span className="text-red-500 text-sm font-semibold">Only {product.stock} left!</span>
                            )}
                        </div>

                        <p className="text-zinc-600 leading-relaxed mb-8">{product.description}</p>

                        {/* Size Selector */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-sm uppercase tracking-wider">Select Size (US)</h3>
                                <button className="text-xs text-zinc-400 underline hover:text-brand-green transition-colors">Size Guide</button>
                            </div>
                            {sizeError && <p className="text-red-500 text-xs mb-2">Please select a size</p>}
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((s: string) => (
                                    <button
                                        key={s}
                                        onClick={() => { setSelectedSize(s); setSizeError(false); }}
                                        className={`w-14 h-12 text-sm border-2 font-semibold transition-all ${selectedSize === s ? 'bg-brand-black text-white border-brand-black' : 'border-zinc-200 hover:border-brand-black'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity + CTA */}
                        <div className="flex gap-3 mb-6">
                            <div className="flex border border-zinc-200">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-14 flex items-center justify-center text-xl hover:bg-zinc-50 transition-colors">−</button>
                                <span className="w-12 h-14 flex items-center justify-center font-bold text-lg">{quantity}</span>
                                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="w-12 h-14 flex items-center justify-center text-xl hover:bg-zinc-50 transition-colors">+</button>
                            </div>
                            <button onClick={handleAddToCart} className="flex-1 btn-primary flex items-center justify-center gap-2 py-4">
                                <ShoppingBag className="w-5 h-5" /> Add to Cart
                            </button>
                            <button
                                onClick={handleWishlist}
                                disabled={wishlistLoading}
                                className={`w-14 border-2 flex items-center justify-center transition-colors ${isFav ? 'border-red-400 text-red-400' : 'border-zinc-200 hover:border-red-400 hover:text-red-400'}`}
                            >
                                <Heart className={`w-5 h-5 ${isFav ? 'fill-red-400' : ''}`} />
                            </button>
                        </div>

                        {/* Shipping & Returns */}
                        <div className="border-t border-zinc-100 pt-6 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-zinc-600">
                                <Truck className="w-5 h-5 text-brand-green flex-shrink-0" />
                                <span>Free shipping on orders over R1500. Delivered in 3–5 business days.</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-zinc-600">
                                <RefreshCw className="w-5 h-5 text-brand-green flex-shrink-0" />
                                <span>30-day free returns. Unworn and in original packaging.</span>
                            </div>
                        </div>

                        {/* Materials */}
                        {product.materials && (
                            <div className="border-t border-zinc-100 pt-6 mt-2">
                                <h3 className="font-bold text-sm uppercase tracking-wider mb-2">Materials</h3>
                                <p className="text-sm text-zinc-500">{product.materials}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews */}
                {product.reviews && product.reviews.length > 0 && (
                    <div className="mt-20">
                        <h2 className="text-3xl font-outfit font-black mb-8">Customer Reviews</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {product.reviews.map((r: any, i: number) => (
                                <div key={i} className="bg-zinc-50 border border-zinc-100 p-6">
                                    <div className="flex mb-3">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star key={s} className={`w-4 h-4 ${s <= r.rating ? 'text-brand-green fill-brand-green' : 'text-zinc-200 fill-zinc-200'}`} />
                                        ))}
                                    </div>
                                    <p className="text-zinc-600 italic text-sm mb-4">"{r.comment}"</p>
                                    <div>
                                        <p className="font-bold text-sm">{r.name}</p>
                                        <p className="text-zinc-400 text-xs">{new Date(r.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Related Products */}
                {related.length > 0 && (
                    <div className="mt-20">
                        <h2 className="text-3xl font-outfit font-black mb-8">You Might Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {related.map(p => (
                                <ProductCard key={p._id} product={{ ...p, image: p.images[0] }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    await dbConnect();
    const productData = await ProductModel.findOne({ slug: params?.slug }).lean();

    if (!productData) return { notFound: true };

    const relatedData = await ProductModel.find({
        brand: productData.brand,
        _id: { $ne: productData._id }
    }).limit(4).lean();

    return {
        props: {
            product: JSON.parse(JSON.stringify(productData)),
            related: JSON.parse(JSON.stringify(relatedData))
        }
    };
};

export default ProductPage;
