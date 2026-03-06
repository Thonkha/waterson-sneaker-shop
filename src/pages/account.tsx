import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Package, Heart, MapPin, Settings, LogOut } from 'lucide-react';
import { SAMPLE_PRODUCTS } from '@/data/products';

const MOCK_ORDERS = [
    { id: '#WAT82710', date: '2026-02-28', status: 'Delivered', total: 189.99, items: ['Air Hyper Eclipse'] },
    { id: '#WAT91234', date: '2026-03-01', status: 'In Transit', total: 279.98, items: ['Cloud Runner X x2'] },
];

const mockUser = { name: 'Jordan Mitchell', email: 'jordan@example.com' };
const wishlist = SAMPLE_PRODUCTS.filter(p => p.isTrending).slice(0, 3);

const AccountPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>My Account — Waterson Drip Store</title>
                <meta name="description" content="Manage your Waterson Drip Store account — orders, wishlist, and addresses." />
            </Head>

            <div className="min-h-screen bg-zinc-50 py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="text-3xl font-outfit font-black">My Account</h1>
                            <p className="text-zinc-500 text-sm mt-1">Welcome back, {mockUser.name}</p>
                        </div>
                        <Link href="/login" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-red-500 transition-colors">
                            <LogOut className="w-4 h-4" /> Sign Out
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
                        {/* Sidebar Nav */}
                        <aside className="space-y-1">
                            {[
                                { icon: Package, label: 'Orders', href: '#orders' },
                                { icon: Heart, label: 'Wishlist', href: '#wishlist' },
                                { icon: MapPin, label: 'Addresses', href: '#addresses' },
                                { icon: Settings, label: 'Settings', href: '#settings' },
                            ].map(({ icon: Icon, label, href }) => (
                                <a key={label} href={href} className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-zinc-600 hover:bg-white hover:text-brand-green transition-colors border border-transparent hover:border-zinc-100">
                                    <Icon className="w-4 h-4" /> {label}
                                </a>
                            ))}
                        </aside>

                        {/* Main Content */}
                        <div className="space-y-10">
                            {/* Orders */}
                            <section id="orders">
                                <h2 className="font-outfit font-black text-xl mb-4 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-brand-green" /> Order History
                                </h2>
                                <div className="space-y-4">
                                    {MOCK_ORDERS.map(order => (
                                        <div key={order.id} className="bg-white border border-zinc-100 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div>
                                                <p className="font-bold text-sm">{order.id}</p>
                                                <p className="text-sm text-zinc-500 mt-0.5">{order.items.join(', ')}</p>
                                                <p className="text-xs text-zinc-400 mt-1">{order.date}</p>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {order.status}
                                                </span>
                                                <span className="font-black">R{order.total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Wishlist */}
                            <section id="wishlist">
                                <h2 className="font-outfit font-black text-xl mb-4 flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-brand-green" /> Saved Sneakers
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {wishlist.map(p => (
                                        <Link key={p._id} href={`/product/${p.slug}`} className="bg-white border border-zinc-100 p-4 hover:border-brand-green transition-colors flex items-center gap-4">
                                            <div className="relative w-16 h-16 bg-zinc-100 flex-shrink-0">
                                                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-400">{p.brand}</p>
                                                <p className="font-bold text-sm">{p.name}</p>
                                                <p className="text-brand-green font-bold text-sm">R{p.price}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>

                            {/* Addresses */}
                            <section id="addresses">
                                <h2 className="font-outfit font-black text-xl mb-4 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-brand-green" /> Saved Addresses
                                </h2>
                                <div className="bg-white border border-zinc-100 p-5 inline-block">
                                    <p className="font-bold">{mockUser.name}</p>
                                    <p className="text-sm text-zinc-500 mt-1">45 Drip Street, Polokwane, Limpopo, South Africa</p>
                                    <span className="inline-block mt-2 text-xs font-bold text-brand-green uppercase tracking-wider">Default</span>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AccountPage;
