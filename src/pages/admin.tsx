import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { Package, ShoppingBag, TrendingUp, DollarSign, Plus, Pencil, Trash2, BarChart2 } from 'lucide-react';
import { SAMPLE_PRODUCTS } from '@/data/products';

const MOCK_ORDERS = [
    { id: '#WAT82710', customer: 'Jordan M.', date: '2026-02-28', status: 'Delivered', total: 189.99 },
    { id: '#WAT91234', customer: 'Priya K.', date: '2026-03-01', status: 'In Transit', total: 220.00 },
    { id: '#WAT99001', customer: 'Tyler N.', date: '2026-03-03', status: 'Processing', total: 99.99 },
];

const AdminPage: NextPage = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
    const [products, setProducts] = useState(SAMPLE_PRODUCTS);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', brand: '', price: '', stock: '' });

    const handleDeleteProduct = (id: string) => {
        if (confirm('Delete this product?')) setProducts(prev => prev.filter(p => p._id !== id));
    };

    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault();
        const product = {
            ...SAMPLE_PRODUCTS[0],
            _id: String(Date.now()),
            name: newProduct.name,
            brand: newProduct.brand,
            price: parseFloat(newProduct.price),
            stock: parseInt(newProduct.stock),
            slug: newProduct.name.toLowerCase().replace(/\s+/g, '-'),
        };
        setProducts(prev => [product, ...prev]);
        setNewProduct({ name: '', brand: '', price: '', stock: '' });
        setShowAddForm(false);
    };

    const totalRevenue = MOCK_ORDERS.reduce((s, o) => s + o.total, 0);

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
                                        { label: 'Total Revenue', value: `R${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-brand-green' },
                                        { label: 'Total Products', value: products.length, icon: ShoppingBag, color: 'bg-blue-500' },
                                        { label: 'Total Orders', value: MOCK_ORDERS.length, icon: Package, color: 'bg-purple-500' },
                                        { label: 'Avg Order Value', value: `R${(totalRevenue / MOCK_ORDERS.length).toFixed(2)}`, icon: TrendingUp, color: 'bg-orange-500' },
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
                                            {MOCK_ORDERS.map(o => (
                                                <tr key={o.id}>
                                                    <td className="py-3 font-mono text-brand-green">{o.id}</td>
                                                    <td className="py-3">{o.customer}</td>
                                                    <td className="py-3 text-zinc-400">{o.date}</td>
                                                    <td className="py-3">
                                                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${o.status === 'Delivered' ? 'bg-green-900 text-green-400' : o.status === 'In Transit' ? 'bg-blue-900 text-blue-400' : 'bg-yellow-900 text-yellow-400'}`}>
                                                            {o.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-right font-bold">R{o.total.toFixed(2)}</td>
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
                                        <div className="col-span-2 flex gap-3">
                                            <button type="submit" className="btn-primary px-6">Save Product</button>
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
                                <h1 className="text-2xl font-outfit font-black mb-6">Orders ({MOCK_ORDERS.length})</h1>
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
                                            {MOCK_ORDERS.map(o => (
                                                <tr key={o.id} className="hover:bg-zinc-800/50 transition-colors">
                                                    <td className="px-6 py-4 font-mono text-brand-green">{o.id}</td>
                                                    <td className="px-4 py-4">{o.customer}</td>
                                                    <td className="px-4 py-4 text-zinc-400">{o.date}</td>
                                                    <td className="px-4 py-4">
                                                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${o.status === 'Delivered' ? 'bg-green-900 text-green-400' : o.status === 'In Transit' ? 'bg-blue-900 text-blue-400' : 'bg-yellow-900 text-yellow-400'}`}>
                                                            {o.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-bold">R{o.total.toFixed(2)}</td>
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
