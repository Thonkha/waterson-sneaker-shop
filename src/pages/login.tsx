import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { useRouter } from 'next/router';
import { useEffect } from 'react';

const LoginPage: NextPage = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (router.query.registered === 'true') {
            setSuccessMsg('Account created successfully! Please sign in.');
        }
    }, [router.query]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Invalid email or password');
            }

            // Save user data/token (In real app, use a more secure way or CartContext/AuthContext)
            localStorage.setItem('user', JSON.stringify(data));

            // Redirect to home or account
            router.push('/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
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
                        {successMsg && <div className="bg-green-50 border border-green-200 text-green-600 text-sm p-4 mb-6">{successMsg}</div>}
                        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 mb-6">{error}</div>}
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
                            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
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
