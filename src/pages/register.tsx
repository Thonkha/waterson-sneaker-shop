import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/router';

const RegisterPage: NextPage = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            // Redirect to login on success
            router.push('/login?registered=true');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Create Account — Waterson Drip Store</title>
                <meta name="description" content="Create your Waterson Drip Store account and get access to exclusive drops and order tracking in South Africa." />
            </Head>

            <div className="min-h-screen bg-zinc-50 flex items-center justify-center py-20 px-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <Link href="/" className="text-3xl font-outfit font-black">Waterson Drip Store</Link>
                        <h1 className="text-2xl font-outfit font-black mt-4">Create Account</h1>
                        <p className="text-zinc-500 text-sm mt-1">Join the culture — exclusive drops and more</p>
                    </div>

                    <div className="bg-white border border-zinc-100 p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-1.5">Full Name</label>
                                <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Your full name" className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors" />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-1.5">Email</label>
                                <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors" />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-1.5">Password</label>
                                <div className="relative">
                                    <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required placeholder="Min 8 characters" className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors pr-12" />
                                    <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-1.5">Confirm Password</label>
                                <input type="password" name="confirm" value={form.confirm} onChange={handleChange} required placeholder="Repeat your password" className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors" />
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-zinc-500">
                            Already have an account?{' '}
                            <Link href="/login" className="font-semibold text-zinc-900 hover:text-brand-green transition-colors">Sign in</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
