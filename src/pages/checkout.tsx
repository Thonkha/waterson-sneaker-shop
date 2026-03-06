import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { CreditCard, CheckCircle } from 'lucide-react';
import { SAMPLE_PRODUCTS } from '@/data/products';

const MOCK_ITEMS = [
    { _id: '1', name: 'Air Hyper Eclipse', brand: 'Nike', price: 189.99, image: SAMPLE_PRODUCTS[0].images[0], size: '10', quantity: 1 },
    { _id: '3', name: 'Cloud Runner X', brand: 'New Balance', price: 139.99, image: SAMPLE_PRODUCTS[2].images[0], size: '9', quantity: 2 },
];

const subtotal = MOCK_ITEMS.reduce((s, i) => s + i.price * i.quantity, 0);
const shipping = subtotal > 1500 ? 0 : 99.99;
const total = subtotal + shipping;

const CheckoutPage: NextPage = () => {
    const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
    const [form, setForm] = useState({ fullName: '', address: '', city: '', state: '', zip: '', country: '', cardNumber: '', cardExpiry: '', cardCvc: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleShipping = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('payment');
        window.scrollTo(0, 0);
    };

    const handleOrder = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('success');
        window.scrollTo(0, 0);
    };

    if (step === 'success') {
        return (
            <>
                <Head><title>Order Confirmed — Waterson Drip Store</title></Head>
                <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
                    <div className="max-w-md w-full text-center py-20">
                        <div className="w-20 h-20 rounded-full bg-brand-green flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-outfit font-black mb-3">Order Confirmed!</h1>
                        <p className="text-zinc-500 mb-8">Your order has been placed successfully. We'll send you a confirmation email shortly.</p>
                        <Link href="/shop" className="btn-primary inline-block">Continue Shopping</Link>
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

                    {/* Step Indicator */}
                    <div className="flex items-center gap-4 mb-10 text-sm font-semibold">
                        <span className={step === 'shipping' ? 'text-brand-green' : 'text-zinc-400'}>1. Shipping</span>
                        <div className="flex-1 h-px bg-zinc-200" />
                        <span className={step === 'payment' ? 'text-brand-green' : 'text-zinc-400'}>2. Payment</span>
                        <div className="flex-1 h-px bg-zinc-200" />
                        <span className="text-zinc-400">3. Confirmation</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
                        {/* Form */}
                        <div className="bg-white border border-zinc-100 p-8">
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
                                    <button type="submit" className="btn-primary w-full mt-2">Continue to Payment</button>
                                </form>
                            )}

                            {step === 'payment' && (
                                <form onSubmit={handleOrder} className="space-y-5">
                                    <h2 className="font-outfit font-black text-xl mb-4">Payment Method</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        {(['card', 'paypal'] as const).map(method => (
                                            <button
                                                key={method}
                                                type="button"
                                                onClick={() => setPaymentMethod(method)}
                                                className={`flex items-center justify-center gap-2 border-2 py-4 font-semibold text-sm transition-colors ${paymentMethod === method ? 'border-brand-green text-brand-green' : 'border-zinc-200 text-zinc-500 hover:border-zinc-400'}`}
                                            >
                                                <CreditCard className="w-4 h-4" />
                                                {method === 'card' ? 'Credit Card' : 'PayPal'}
                                            </button>
                                        ))}
                                    </div>

                                    {paymentMethod === 'card' && (
                                        <div className="space-y-4 pt-2">
                                            <input name="cardNumber" value={form.cardNumber} onChange={handleChange} required placeholder="Card Number (16 digits)" maxLength={19} className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors" />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input name="cardExpiry" value={form.cardExpiry} onChange={handleChange} required placeholder="MM/YY" className="border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors" />
                                                <input name="cardCvc" value={form.cardCvc} onChange={handleChange} required placeholder="CVC" className="border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors" />
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === 'paypal' && (
                                        <div className="bg-blue-50 border border-blue-200 p-4 text-center text-sm text-blue-600 font-medium rounded">
                                            You will be redirected to PayPal to complete your payment.
                                        </div>
                                    )}

                                    <div className="flex gap-3 pt-2">
                                        <button type="button" onClick={() => setStep('shipping')} className="btn-outline flex-1">← Back</button>
                                        <button type="submit" className="btn-primary flex-1">Place Order — R{total.toFixed(2)}</button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white border border-zinc-100 p-6 h-fit space-y-4">
                            <h2 className="font-outfit font-black text-lg">Order Summary</h2>
                            <div className="space-y-3">
                                {MOCK_ITEMS.map(item => (
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
                                    <span>Total</span><span>R{total.toFixed(2)}</span>
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
