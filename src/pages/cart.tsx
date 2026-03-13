import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ShoppingBag, ArrowRight, Tag, Truck, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { SAMPLE_PRODUCTS } from '@/data/products';

import { useCart } from '@/context/CartContext';

const CartPage: NextPage = () => {
    const { items, updateQuantity, removeItem, total } = useCart();
    const [promo, setPromo] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);

    const subtotal = total;
    const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 99.99;
    const discount = promoApplied ? subtotal * 0.1 : 0;
    const finalTotal = subtotal + shipping - discount;

    const applyPromo = (e: React.FormEvent) => {
        e.preventDefault();
        if (promo.toUpperCase() === 'DROP10') setPromoApplied(true);
    };

    return (
        <>
            <Head>
                <title>Your Cart — Waterson Drip Store</title>
                <meta name="description" content="Review your cart items and proceed to checkout." />
            </Head>

            <div className="bg-zinc-50 py-20 min-h-screen">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-outfit font-black mb-10">
                        Your Cart <span className="text-zinc-400 font-normal text-2xl">({items.length} items)</span>
                    </h1>

                    {items.length === 0 ? (
                        <div className="text-center py-28">
                            <ShoppingBag className="w-16 h-16 text-zinc-200 mx-auto mb-4" />
                            <p className="text-xl text-zinc-400 mb-6">Your cart is empty.</p>
                            <Link href="/shop" className="btn-primary inline-flex items-center gap-2">Browse Sneakers <ArrowRight className="w-4 h-4" /></Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
                            {/* Items */}
                            <div className="space-y-4">
                                {items.map(item => (
                                    <div key={`${item._id}-${item.size}`} className="bg-white border border-zinc-100 p-5 flex gap-5 items-start">
                                        <div className="relative w-28 h-28 flex-shrink-0 bg-zinc-100 overflow-hidden">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">{item.brand}</p>
                                            <Link href={`/product/${item.slug}`} className="font-outfit font-black text-lg hover:text-brand-green transition-colors">{item.name}</Link>
                                            <p className="text-sm text-zinc-500 mt-1">Size: <span className="font-semibold text-zinc-700">{item.size}</span></p>
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex border border-zinc-200">
                                                    <button onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)} className="w-9 h-9 flex items-center justify-center hover:bg-zinc-50">−</button>
                                                    <span className="w-9 h-9 flex items-center justify-center font-bold text-sm">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)} className="w-9 h-9 flex items-center justify-center hover:bg-zinc-50">+</button>
                                                </div>
                                                <span className="font-bold text-lg">R{(item.price * item.quantity).toFixed(2)}</span>
                                                <button onClick={() => removeItem(item._id, item.size)} className="text-zinc-300 hover:text-red-400 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary */}
                            <div className="bg-white border border-zinc-100 p-6 h-fit space-y-5">
                                <h2 className="font-outfit font-black text-xl">Order Summary</h2>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-zinc-600"><span>Subtotal</span><span>R{subtotal.toFixed(2)}</span></div>
                                    <div className="flex justify-between text-zinc-600">
                                        <span>Shipping</span>
                                        <span>{shipping === 0 ? <span className="text-brand-green font-semibold">Free</span> : `R${shipping.toFixed(2)}`}</span>
                                    </div>
                                    {promoApplied && (
                                        <div className="flex justify-between text-brand-green font-semibold">
                                            <span>Promo (DROP10)</span><span>-R{discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-zinc-100 pt-3 flex justify-between font-bold text-lg">
                                        <span>Total</span><span>R{finalTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Promo Code */}
                                {!promoApplied ? (
                                    <form onSubmit={applyPromo} className="flex gap-2">
                                        <div className="flex-1 flex items-center border border-zinc-200 px-3 gap-2">
                                            <Tag className="w-4 h-4 text-zinc-400" />
                                            <input
                                                type="text"
                                                placeholder="Promo code"
                                                value={promo}
                                                onChange={e => setPromo(e.target.value)}
                                                className="flex-1 py-2.5 text-sm focus:outline-none"
                                            />
                                        </div>
                                        <button type="submit" className="btn-secondary px-4 py-2 text-xs">Apply</button>
                                    </form>
                                ) : (
                                    <p className="text-brand-green text-sm font-semibold">✓ Promo code applied — 10% off!</p>
                                )}

                                {shipping > 0 && (
                                    <p className="text-xs text-zinc-400">Add R{(1500 - subtotal).toFixed(2)} more for free shipping.</p>
                                )}

                                <Link href="/checkout" className="btn-primary block text-center w-full">
                                    Proceed to Checkout <ArrowRight className="inline w-4 h-4 ml-1" />
                                </Link>
                                <Link href="/shop" className="block text-center text-xs text-zinc-400 hover:text-brand-green transition-colors mt-2">
                                    ← Continue shopping
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartPage;
