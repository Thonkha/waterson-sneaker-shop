import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage: NextPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ email: '', password: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Login submitted! (Connect to your auth backend.)');
    };

    return (
        <>
            <Head>
                <title>Login — Waterson Drip Store</title>
                <meta name="description" content="Sign in to your Waterson Drip Store account to track orders and manage your wishlist." />
            </Head>

            <div className="min-h-screen bg-zinc-50 flex items-center justify-center py-20 px-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <Link href="/" className="text-3xl font-outfit font-black">Waterson Drip Store</Link>
                        <h1 className="text-2xl font-outfit font-black mt-4">Welcome Back</h1>
                        <p className="text-zinc-500 text-sm mt-1">Sign in to access your account</p>
                    </div>

                    <div className="bg-white border border-zinc-100 p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-1.5">Email</label>
                                <input
                                    type="email" name="email" value={form.email} onChange={handleChange} required
                                    placeholder="you@example.com"
                                    className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-1.5">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required
                                        placeholder="••••••••"
                                        className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors pr-12"
                                    />
                                    <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <div className="text-right mt-1.5">
                                    <a href="#" className="text-xs text-zinc-400 hover:text-brand-green transition-colors">Forgot password?</a>
                                </div>
                            </div>
                            <button type="submit" className="btn-primary w-full">Sign In</button>
                        </form>

                        <div className="mt-6 text-center text-sm text-zinc-500">
                            Don't have an account?{' '}
                            <Link href="/register" className="font-semibold text-zinc-900 hover:text-brand-green transition-colors">Create one</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
