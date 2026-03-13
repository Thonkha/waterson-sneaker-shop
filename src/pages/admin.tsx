import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { Package, ShoppingBag, TrendingUp, DollarSign, Plus, Pencil, Trash2, BarChart2, Loader2, Upload } from 'lucide-react';
import { SAMPLE_PRODUCTS } from '@/data/products';
import { uploadToCloudinary } from '@/utils/cloudinary';

import { useEffect } from 'react';
import { useRouter } from 'next/router';

const AdminPage: NextPage = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
    const [products, setProducts] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({ totalRevenue: 0, totalProducts: 0, totalOrders: 0, avgOrderValue: 0 });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', brand: '', price: '', stock: '', description: '', images: '' });

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        if (!user || user.role !== 'admin') {
            router.push('/login');
            return;
        }
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = user.token;
        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            if (activeTab === 'overview') {
                const [statsRes, ordersRes] = await Promise.all([
                    fetch('/api/admin/stats', { headers }),
                    fetch('/api/admin/orders', { headers })
                ]);
                setStats(await statsRes.json());
                setOrders(await ordersRes.json());
            } else if (activeTab === 'products') {
                const res = await fetch('/api/admin/products', { headers });
                setProducts(await res.json());
            } else if (activeTab === 'orders') {
                const res = await fetch('/api/admin/orders', { headers });
                setOrders(await res.json());
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Delete this product?')) return;
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = user.token;

        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchData();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            setNewProduct(p => ({ ...p, images: url }));
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Image upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = user.token;

        const productData = {
            ...newProduct,
            price: parseFloat(newProduct.price),
            stock: parseInt(newProduct.stock),
            slug: newProduct.name.toLowerCase().replace(/\s+/g, '-'),
            images: [newProduct.images || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop'],
            sizes: ['7', '8', '9', '10', '11', '12'],
        };

        try {
            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });
            if (res.ok) {
                fetchData();
                setNewProduct({ name: '', brand: '', price: '', stock: '', description: '', images: '' });
                setShowAddForm(false);
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleUpdateOrderStatus = async (id: string, status: string) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = user.token;

        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id, status })
            });
            if (res.ok) fetchData();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    return (
        <>
            <Head>
                <title>Admin Dashboard — Waterson Drip Store</title>
            </Head>

            <div className="min-h-screen bg-zinc-950 text-white">
                <div className="flex">
                    {/* Sidebar */}
                    <aside className="w-56 min-h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col">
                        <div className="px-6 py-6 border-b border-zinc-800">
                            <span className="text-xl font-outfit font-black">Waterson Drip Store</span>
                            <p className="text-xs text-brand-green mt-0.5 uppercase tracking-widest font-bold">Admin Panel</p>
                        </div>
                        <nav className="flex-1 px-3 py-4 space-y-1">
                            {([
                                { id: 'overview', icon: BarChart2, label: 'Overview' },
                                { id: 'products', icon: ShoppingBag, label: 'Products' },
                                { id: 'orders', icon: Package, label: 'Orders' },
                            ] as const).map(({ id, icon: Icon, label }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded transition-colors text-left ${activeTab === id ? 'bg-brand-green text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                                >
                                    <Icon className="w-4 h-4" /> {label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Main */}
                    <main className="flex-1 p-8">
                        {/* Overview */}
                        {activeTab === 'overview' && (
                            <div>
                                <h1 className="text-2xl font-outfit font-black mb-8">Dashboard Overview</h1>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                                    {[
                                        { label: 'Total Revenue', value: `R${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-brand-green' },
                                        { label: 'Total Products', value: stats.totalProducts, icon: ShoppingBag, color: 'bg-blue-500' },
                                        { label: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'bg-purple-500' },
                                        { label: 'Avg Order Value', value: `R${stats.avgOrderValue.toFixed(2)}`, icon: TrendingUp, color: 'bg-orange-500' },
                                    ].map(({ label, value, icon: Icon, color }) => (
                                        <div key={label} className="bg-zinc-900 border border-zinc-800 p-6 rounded">
                                            <div className={`${color} w-10 h-10 rounded flex items-center justify-center mb-4`}>
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                            <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">{label}</p>
                                            <p className="text-3xl font-outfit font-black">{value}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded">
                                    <h2 className="font-outfit font-bold text-lg mb-4">Recent Orders</h2>
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-800">
                                                <th className="text-left pb-3">Order ID</th>
                                                <th className="text-left pb-3">Customer</th>
                                                <th className="text-left pb-3">Date</th>
                                                <th className="text-left pb-3">Status</th>
                                                <th className="text-right pb-3">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-800">
                                            {orders.slice(0, 5).map(o => (
                                                <tr key={o._id}>
                                                    <td className="py-3 font-mono text-brand-green line-clamp-1">#{o._id.slice(-6).toUpperCase()}</td>
                                                    <td className="py-3">{o.shippingAddress.fullName}</td>
                                                    <td className="py-3 text-zinc-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                                                    <td className="py-3">
                                                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${o.isDelivered ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'}`}>
                                                            {o.isDelivered ? 'Delivered' : 'Processing'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-right font-bold">R{o.totalPrice.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Products */}
                        {activeTab === 'products' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-outfit font-black">Products ({products.length})</h1>
                                    <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary flex items-center gap-2">
                                        <Plus className="w-4 h-4" /> Add Product
                                    </button>
                                </div>

                                {showAddForm && (
                                    <form onSubmit={handleAddProduct} className="bg-zinc-900 border border-zinc-800 rounded p-6 mb-6 grid grid-cols-2 gap-4">
                                        <input required value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} placeholder="Product Name" className="bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm focus:outline-none focus:border-brand-green col-span-2" />
                                        <input required value={newProduct.brand} onChange={e => setNewProduct(p => ({ ...p, brand: e.target.value }))} placeholder="Brand" className="bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm focus:outline-none focus:border-brand-green" />
                                        <input required type="number" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))} placeholder="Price (R)" className="bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm focus:outline-none focus:border-brand-green" />
                                        <input required type="number" value={newProduct.stock} onChange={e => setNewProduct(p => ({ ...p, stock: e.target.value }))} placeholder="Stock" className="bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm focus:outline-none focus:border-brand-green" />

                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Product Image</label>
                                            <div className="flex gap-4 items-center">
                                                <div className="relative w-24 h-24 bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
                                                    {uploading ? <Loader2 className="w-6 h-6 animate-spin text-brand-green" /> : newProduct.images ? <img src={newProduct.images} className="w-full h-full object-cover" /> : <Upload className="w-6 h-6 text-zinc-600" />}
                                                </div>
                                                <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-brand-green hover:file:bg-zinc-700" />
                                            </div>
                                        </div>

                                        <div className="col-span-2 flex gap-3 mt-4">
                                            <button type="submit" disabled={uploading} className="btn-primary px-6 disabled:opacity-50">Save Product</button>
                                            <button type="button" onClick={() => setShowAddForm(false)} className="btn-outline border-zinc-600 text-zinc-400 px-6">Cancel</button>
                                        </div>
                                    </form>
                                )}

                                <div className="bg-zinc-900 border border-zinc-800 rounded overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-800">
                                                <th className="text-left px-6 py-4">Product</th>
                                                <th className="text-left px-4 py-4">Brand</th>
                                                <th className="text-left px-4 py-4">Price</th>
                                                <th className="text-left px-4 py-4">Stock</th>
                                                <th className="text-right px-6 py-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-800">
                                            {products.map(p => (
                                                <tr key={p._id} className="hover:bg-zinc-800/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-zinc-800 relative flex-shrink-0 overflow-hidden">
                                                                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                                                            </div>
                                                            <span className="font-semibold">{p.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-zinc-400">{p.brand}</td>
                                                    <td className="px-4 py-4 font-bold text-brand-green">R{p.price.toFixed(2)}</td>
                                                    <td className="px-4 py-4">
                                                        <span className={`text-xs font-bold ${p.stock < 10 ? 'text-red-400' : 'text-green-400'}`}>{p.stock}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <button className="text-zinc-400 hover:text-brand-green transition-colors"><Pencil className="w-4 h-4" /></button>
                                                            <button onClick={() => handleDeleteProduct(p._id)} className="text-zinc-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Orders */}
                        {activeTab === 'orders' && (
                            <div>
                                <h1 className="text-2xl font-outfit font-black mb-6">Orders ({orders.length})</h1>
                                <div className="bg-zinc-900 border border-zinc-800 rounded overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-800">
                                                <th className="text-left px-6 py-4">Order ID</th>
                                                <th className="text-left px-4 py-4">Customer</th>
                                                <th className="text-left px-4 py-4">Date</th>
                                                <th className="text-left px-4 py-4">Status</th>
                                                <th className="text-right px-6 py-4">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-800">
                                            {orders.map(o => (
                                                <tr key={o._id} className="hover:bg-zinc-800/50 transition-colors">
                                                    <td className="px-6 py-4 font-mono text-brand-green">#{o._id.slice(-6).toUpperCase()}</td>
                                                    <td className="px-4 py-4">{o.shippingAddress.fullName}</td>
                                                    <td className="px-4 py-4 text-zinc-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-4 py-4">
                                                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${o.isDelivered ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'}`}>
                                                            {o.isDelivered ? 'Delivered' : 'Processing'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-bold">R{o.totalPrice.toFixed(2)}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        {!o.isDelivered && (
                                                            <button
                                                                onClick={() => handleUpdateOrderStatus(o._id, 'Delivered')}
                                                                className="text-xs text-brand-green hover:underline"
                                                            >
                                                                Mark Delivered
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
};

export default AdminPage;
