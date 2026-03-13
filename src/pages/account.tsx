import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Package, Heart, MapPin, Settings, LogOut, Loader2 } from 'lucide-react';
import { useRouter } from 'next/router';

const fetcher = async (url: string) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${user.token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
};

const AccountPage: NextPage = () => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const { data: orders, isLoading: ordersLoading } = useSWR('/api/orders', fetcher);
    const { data: wishlist, isLoading: wishlistLoading } = useSWR('/api/wishlist', fetcher);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            router.push('/login');
        } else {
            setUser(JSON.parse(userStr));
        }
    }, [router]);

    const handleSignOut = () => {
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (!user) return null;

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
                            <p className="text-zinc-500 text-sm mt-1">Welcome back, {user.name}</p>
                        </div>
                        <button onClick={handleSignOut} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-red-500 transition-colors">
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
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

                                {ordersLoading ? (
                                    <div className="flex py-10 justify-center"><Loader2 className="w-6 h-6 animate-spin text-zinc-300" /></div>
                                ) : !orders || orders.length === 0 ? (
                                    <div className="bg-white border border-dashed border-zinc-200 py-12 text-center">
                                        <p className="text-zinc-400 text-sm">You haven't placed any orders yet.</p>
                                        <Link href="/shop" className="text-brand-green font-bold text-sm mt-2 inline-block">Start Shopping</Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order: any) => (
                                            <div key={order._id} className="bg-white border border-zinc-100 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                <div>
                                                    <p className="font-bold text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                                                    <p className="text-sm text-zinc-500 mt-0.5">
                                                        {order.orderItems.map((i: any) => i.name).join(', ')}
                                                    </p>
                                                    <p className="text-xs text-zinc-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {order.status}
                                                    </span>
                                                    <span className="font-black">R{order.totalPrice.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* Wishlist */}
                            <section id="wishlist">
                                <h2 className="font-outfit font-black text-xl mb-6 flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-brand-green" /> Saved Sneakers
                                </h2>

                                {wishlistLoading ? (
                                    <div className="flex py-10 justify-center"><Loader2 className="w-6 h-6 animate-spin text-zinc-300" /></div>
                                ) : !wishlist || wishlist.length === 0 ? (
                                    <div className="bg-white border border-dashed border-zinc-200 py-12 text-center">
                                        <p className="text-zinc-400 text-sm">Your wishlist is empty.</p>
                                        <Link href="/shop" className="text-brand-green font-bold text-sm mt-2 inline-block">Find your next pair</Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {wishlist.map((p: any) => (
                                            <Link key={p._id} href={`/product/${p.slug}`} className="bg-white border border-zinc-100 p-4 hover:border-brand-green transition-colors flex items-center gap-4 group">
                                                <div className="relative w-20 h-20 bg-zinc-100 flex-shrink-0 overflow-hidden">
                                                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{p.brand}</p>
                                                    <p className="font-bold text-sm line-clamp-1">{p.name}</p>
                                                    <p className="text-brand-green font-black text-base mt-1">R{p.price.toFixed(2)}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AccountPage;
