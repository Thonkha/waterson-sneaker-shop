import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Zap, Star, Shield, Loader2 } from 'lucide-react';
import useSWR from 'swr';
import ProductCard from '@/components/ProductCard';
import CountdownTimer from '@/components/CountdownTimer';
import { Product } from '@/data/products';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const BRANDS = [
    { name: 'Nike', logo: 'NIKE' },
    { name: 'Adidas', logo: 'ADIDAS' },
    { name: 'New Balance', logo: 'NB' },
    { name: 'PUMA', logo: 'PUMA' },
    { name: 'Fila', logo: 'FILA' },
    { name: 'Jordan', logo: 'JORDAN' },
];

const TESTIMONIALS = [
    { name: 'Lerato M.', review: 'Best sneaker store in Limpopo. Authentic, fast shipping, and an incredible selection.', rating: 5, location: 'Polokwane, Limpopo' },
    { name: 'Thabo K.', review: 'Got the limited Phantom GT Elite. Can\'t believe I actually copped — site was lightning fast.', rating: 5, location: 'Johannesburg, SA' },
    { name: 'Nkhabu N.', review: 'Waterson Drip Store is the real deal. No fakes, no drama. My go-to for every drop.', rating: 5, location: 'Limpopo, SA' },
];

const Home: NextPage = () => {
    const { data: products, error, isLoading } = useSWR<Product[]>('/api/products', fetcher);

    if (isLoading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-brand-black text-white">
            <Loader2 className="w-12 h-12 text-brand-green animate-spin mb-4" />
            <p className="font-outfit font-bold tracking-widest uppercase">Loading the heat...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-brand-black text-white">
            <p className="text-red-500 font-bold">Failed to load sneakers. Try refreshing.</p>
        </div>
    );

    const featured = products?.slice(0, 4) || [];
    const newArrivals = products?.filter(p => p.isNewArrival) || [];
    const trending = products?.filter(p => p.isTrending) || [];
    const limitedRelease = products?.find(p => p.isLimitedRelease);

    return (
        <>
            <Head>
                <title>Waterson Drip Store — Step Into Sneaker Culture</title>
                <meta name="description" content="Discover the latest sneaker drops, exclusive releases and premium streetwear in South Africa. Shop Nike, Adidas, Jordan, PUMA and more at Waterson Drip Store." />
                <meta property="og:title" content="Waterson Drip Store — Step Into Sneaker Culture" />
                <meta property="og:description" content="Premium sneaker marketplace in South Africa. Authentic. Fast shipping. No fakes." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* ===== HERO ===== */}
            <section className="relative min-h-[92vh] flex items-center bg-brand-black overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1600"
                        alt="Hero sneaker background"
                        fill
                        className="object-cover object-center opacity-20"
                        priority
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/80 to-transparent" />
                </div>

                {/* Animated green accent */}
                <div className="absolute top-10 right-0 w-96 h-96 bg-brand-green rounded-full blur-[120px] opacity-20 z-0 animate-pulse" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="max-w-2xl">
                        <p className="text-brand-green text-sm font-bold uppercase tracking-[0.3em] mb-6">
                            ✦ New Season Drops
                        </p>
                        <h1 className="text-5xl sm:text-7xl font-outfit font-black text-white leading-none mb-6">
                            Step Into The{' '}
                            <span className="text-brand-green">Future</span>{' '}
                            of Sneaker Culture
                        </h1>
                        <p className="text-zinc-300 text-xl mb-10 max-w-lg leading-relaxed">
                            Discover the latest sneaker drops and exclusive streetwear releases — curated for the culture.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
                                Shop Now <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/shop?filter=new" className="btn-outline border-white text-white hover:bg-white hover:text-brand-black inline-flex items-center gap-2">
                                Explore New Drops <Zap className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="flex items-center gap-8 mt-12 pt-8 border-t border-zinc-700">
                            <div><p className="text-3xl font-bold font-outfit text-white">10K+</p><p className="text-zinc-400 text-sm">Products</p></div>
                            <div className="w-px h-10 bg-zinc-700" />
                            <div><p className="text-3xl font-bold font-outfit text-white">500+</p><p className="text-zinc-400 text-sm">Brands</p></div>
                            <div className="w-px h-10 bg-zinc-700" />
                            <div><p className="text-3xl font-bold font-outfit text-white">99%</p><p className="text-zinc-400 text-sm">Authentic</p></div>
                        </div>
                    </div>
                </div>


            </section>

            {/* ===== BRAND BADGE BAR ===== */}
            <section className="bg-zinc-950 py-6 border-y border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                        {BRANDS.map((b) => (
                            <span key={b.name} className="font-outfit font-black text-xl text-zinc-500 hover:text-white transition-colors cursor-pointer tracking-widest">
                                {b.logo}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FEATURED SNEAKERS ===== */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <p className="text-brand-green text-xs font-bold uppercase tracking-[0.3em] mb-2">Curated For You</p>
                            <h2 className="text-4xl font-outfit font-black">Featured Sneakers</h2>
                        </div>
                        <Link href="/shop" className="text-sm font-semibold flex items-center gap-2 group hover:text-brand-green transition-colors">
                            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featured.map((p) => (
                            <ProductCard key={p._id} product={{ ...p, image: p.images[0] }} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== LIMITED RELEASE COUNTDOWN ===== */}
            {limitedRelease && (
                <section className="bg-brand-black py-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/30 via-transparent to-transparent" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <p className="text-brand-green text-xs font-bold uppercase tracking-[0.3em] mb-4">⚡ Limited Drop</p>
                                <h2 className="text-5xl font-outfit font-black text-white leading-tight mb-4">
                                    {limitedRelease.name}
                                </h2>
                                <p className="text-zinc-400 mb-8 max-w-md">Only {limitedRelease.stock} pairs remaining worldwide. Once they're gone, they're gone.</p>
                                <div className="mb-10">
                                    <p className="text-zinc-500 text-xs uppercase tracking-wider mb-3">Release In</p>
                                    <CountdownTimer targetDate={limitedRelease.releaseDate || new Date(Date.now() + 86400000 * 5).toISOString()} />
                                </div>
                                <Link href={`/product/${limitedRelease.slug}`} className="btn-primary inline-flex items-center gap-2">
                                    Reserve Now <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="relative h-80 lg:h-[400px]">
                                <Image
                                    src={limitedRelease.images[0]}
                                    alt={limitedRelease.name}
                                    fill
                                    className="object-contain drop-shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ===== NEW ARRIVALS ===== */}
            {newArrivals.length > 0 && (
                <section className="py-20 bg-zinc-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <p className="text-brand-green text-xs font-bold uppercase tracking-[0.3em] mb-2">Just Landed</p>
                                <h2 className="text-4xl font-outfit font-black">New Arrivals</h2>
                            </div>
                            <Link href="/shop?filter=new" className="text-sm font-semibold flex items-center gap-2 group hover:text-brand-green transition-colors">
                                View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {newArrivals.slice(0, 3).map((p) => (
                                <ProductCard key={p._id} product={{ ...p, image: p.images[0] }} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ===== TRENDING ===== */}
            {trending.length > 0 && (
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <p className="text-brand-green text-xs font-bold uppercase tracking-[0.3em] mb-2">On Fire Right Now</p>
                                <h2 className="text-4xl font-outfit font-black">Trending Sneakers</h2>
                            </div>
                            <Link href="/shop?filter=trending" className="text-sm font-semibold flex items-center gap-2 group hover:text-brand-green transition-colors">
                                View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {trending.slice(0, 3).map((p) => (
                                <ProductCard key={p._id} product={{ ...p, image: p.images[0] }} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ===== WHY US ===== */}
            <section className="py-20 bg-brand-black text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-outfit font-black">Why Waterson Drip Store?</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Shield, title: '100% Authentic', desc: 'Every sneaker verified by our expert authentication team.' },
                            { icon: Zap, title: 'Fastest Shipping', desc: 'Orders shipped within 24 hours to anywhere in the world.' },
                            { icon: Star, title: 'Exclusive Drops', desc: 'First access to limited releases before they hit the market.' },
                        ].map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="flex flex-col items-center text-center p-8 border border-zinc-800 hover:border-brand-green transition-colors">
                                <div className="w-14 h-14 rounded-full bg-brand-green flex items-center justify-center mb-5">
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-outfit font-bold mb-2">{title}</h3>
                                <p className="text-zinc-400 text-sm">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <section className="py-20 bg-zinc-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-brand-green text-xs font-bold uppercase tracking-[0.3em] mb-2">Happy Customers</p>
                        <h2 className="text-4xl font-outfit font-black">What They Say</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {TESTIMONIALS.map((t) => (
                            <div key={t.name} className="bg-white p-8 border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex mb-4">
                                    {Array.from({ length: t.rating }).map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-brand-green fill-brand-green" />
                                    ))}
                                </div>
                                <p className="text-zinc-600 mb-6 italic">"{t.review}"</p>
                                <div>
                                    <p className="font-bold text-zinc-900">{t.name}</p>
                                    <p className="text-zinc-400 text-sm">{t.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== NEWSLETTER ===== */}
            <section className="py-20 bg-brand-green">
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-outfit font-black text-white mb-4">Never Miss A Drop</h2>
                    <p className="text-white/80 mb-8">Get exclusive access to limited releases, early bird offers and sneaker news directly to your inbox.</p>
                    <form className="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-1 px-5 py-4 text-zinc-900 bg-white focus:outline-none sm:rounded-none"
                            required
                        />
                        <button type="submit" className="bg-brand-black text-white font-bold uppercase tracking-widest px-8 py-4 hover:bg-zinc-800 transition-colors">
                            Join
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
};

export default Home;
