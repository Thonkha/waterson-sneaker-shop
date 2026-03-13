import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { CreditCard, CheckCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/router';

const CheckoutPage: NextPage = () => {
    const { items, total, clearCart } = useCart();
    const router = useRouter();
    const [step, setStep] = useState<'shipping' | 'review' | 'success'>('shipping');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ fullName: '', address: '', city: '', state: '', zip: '', country: '' });
    const [createdOrder, setCreatedOrder] = useState<any>(null);

    const subtotal = total;
    const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 99.99;
    const finalTotal = subtotal + shipping;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleShipping = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('review');
        window.scrollTo(0, 0);
    };

    const handleOrder = async () => {
        setError('');
        setLoading(true);

        try {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            const token = user?.token;

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    orderItems: items.map(i => ({
                        product: i._id,
                        name: i.name,
                        quantity: i.quantity,
                        image: i.image,
                        price: i.price,
                        size: i.size,
                    })),
                    shippingAddress: {
                        fullName: form.fullName,
                        address: form.address,
                        city: form.city,
                        postalCode: form.zip,
                        country: form.country,
                    },
                    paymentMethod: 'WhatsApp Notification',
                    itemsPrice: subtotal,
                    shippingPrice: shipping,
                    totalPrice: finalTotal,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to place order');
            }

            setCreatedOrder(data);
            clearCart();
            setStep('success');
            window.scrollTo(0, 0);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getWhatsAppLink = () => {
        if (!createdOrder) return '#';
        const phone = "26657541412";
        const itemsList = createdOrder.orderItems.map((i: any) => `- ${i.name} (Size ${i.size}) x${i.quantity}`).join('\n');
        const text = `*New Order from Waterson Drip Store*\n\n*Order ID:* ${createdOrder._id.slice(-6).toUpperCase()}\n*Customer:* ${createdOrder.shippingAddress.fullName}\n\n*Items:*\n${itemsList}\n\n*Total:* R${createdOrder.totalPrice.toFixed(2)}\n\n*Address:*\n${createdOrder.shippingAddress.address}, ${createdOrder.shippingAddress.city}`;
        return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    };

    if (step === 'success') {
        return (
            <>
                <Head><title>Order Confirmed — Waterson Drip Store</title></Head>
                <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
                    <div className="max-w-md w-full text-center py-20 bg-white border border-zinc-100 p-8 shadow-sm">
                        <div className="w-20 h-20 rounded-full bg-brand-green flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-outfit font-black mb-3">Order Placed!</h1>
                        <p className="text-zinc-500 mb-8">Your order has been recorded. Please click below to send your order details to us on WhatsApp to finalize delivery.</p>

                        <div className="space-y-4">
                            <a
                                href={getWhatsAppLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-[#25D366] text-white py-4 rounded font-bold flex items-center justify-center gap-3 hover:bg-[#128C7E] transition-colors"
                            >
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                Notify Shop via WhatsApp
                            </a>
                            <Link href="/shop" className="w-full btn-outline py-4 flex items-center justify-center">Back to Shop</Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>Checkout — Waterson Drip Store</title>
                <meta name="description" content="Complete your sneaker order securely." />
            </Head>

            <div className="min-h-screen bg-zinc-50 py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-outfit font-black mb-8">Checkout</h1>

                    <div className="flex items-center gap-4 mb-10 text-sm font-semibold">
                        <span className={step === 'shipping' ? 'text-brand-green' : 'text-zinc-400'}>1. Shipping</span>
                        <div className="flex-1 h-px bg-zinc-200" />
                        <span className={step === 'review' ? 'text-brand-green' : 'text-zinc-400'}>2. Review</span>
                        <div className="flex-1 h-px bg-zinc-200" />
                        <span className="text-zinc-400">3. Success</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
                        {/* Form */}
                        <div className="bg-white border border-zinc-100 p-8">
                            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 mb-6">{error}</div>}
                            {step === 'shipping' && (
                                <form onSubmit={handleShipping} className="space-y-5">
                                    <h2 className="font-outfit font-black text-xl mb-4">Shipping Address</h2>
                                    <input name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Full Name" className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors" />
                                    <input name="address" value={form.address} onChange={handleChange} required placeholder="Street Address" className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input name="city" value={form.city} onChange={handleChange} required placeholder="City" className="border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors" />
                                        <input name="state" value={form.state} onChange={handleChange} placeholder="State / Province" className="border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input name="zip" value={form.zip} onChange={handleChange} required placeholder="ZIP / Postal Code" className="border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors" />
                                        <input name="country" value={form.country} onChange={handleChange} required placeholder="Country" className="border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors" />
                                    </div>
                                    <button type="submit" className="btn-primary w-full mt-2">Continue to Review</button>
                                </form>
                            )}

                            {step === 'review' && (
                                <div className="space-y-6">
                                    <h2 className="font-outfit font-black text-xl mb-4">Review Your Order</h2>

                                    <div className="bg-zinc-50 p-6 space-y-4">
                                        <div>
                                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Shipping To</p>
                                            <p className="text-sm font-semibold">{form.fullName}</p>
                                            <p className="text-sm text-zinc-600">{form.address}, {form.city}, {form.zip}, {form.country}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Payment Method</p>
                                            <p className="text-sm font-semibold">WhatsApp Notification / Cash on Delivery</p>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 p-4 rounded text-sm text-blue-700">
                                        <p className="font-bold mb-1">How it works:</p>
                                        By clicking "Confirm Order", your details will be saved. On the next screen, you'll be prompted to message us on WhatsApp to finalize your delivery.
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button type="button" onClick={() => setStep('shipping')} className="btn-outline flex-1">← Back</button>
                                        <button
                                            onClick={handleOrder}
                                            disabled={loading}
                                            className="btn-primary flex-[2] disabled:opacity-50"
                                        >
                                            {loading ? 'Confirming...' : `Confirm Order — R${finalTotal.toFixed(2)}`}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white border border-zinc-100 p-6 h-fit space-y-4">
                            <h2 className="font-outfit font-black text-lg">Order Summary</h2>
                            <div className="space-y-3">
                                {items.map(item => (
                                    <div key={`${item._id}-${item.size}`} className="flex gap-3 items-center">
                                        <div className="relative w-14 h-14 bg-zinc-100 flex-shrink-0 overflow-hidden">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-zinc-800 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{item.quantity}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate">{item.name}</p>
                                            <p className="text-xs text-zinc-400">Size {item.size}</p>
                                        </div>
                                        <span className="text-sm font-bold">R{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-zinc-100 pt-4 space-y-2 text-sm">
                                <div className="flex justify-between text-zinc-500"><span>Subtotal</span><span>R{subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between text-zinc-500">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? <span className="text-brand-green font-semibold">Free</span> : `R${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between font-black text-base pt-1">
                                    <span>Total</span><span>R{finalTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CheckoutPage;
