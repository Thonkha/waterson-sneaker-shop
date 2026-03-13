import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useMemo, useEffect } from 'react';
import useSWR from 'swr';
import { SlidersHorizontal, X, Loader2, Search } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

const BRANDS = ['All', 'Nike', 'Adidas', 'New Balance', 'PUMA', 'Fila', 'Jordan'];
const ALL_SIZES = ['6', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'];
const PRICE_RANGES = [
    { label: 'Under R1000', min: 0, max: 1000 },
    { label: 'R1000 – R2500', min: 1000, max: 2500 },
    { label: 'R2500 – R5000', min: 2500, max: 5000 },
    { label: 'Over R5000', min: 5000, max: Infinity },
];

const fetcher = (url: string) => fetch(url).then(res => res.json());

const Shop: NextPage = () => {
    const router = useRouter();
    const { filter, q } = router.query;

    const [selectedBrand, setSelectedBrand] = useState('All');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedPriceRange, setSelectedPriceRange] = useState<typeof PRICE_RANGES[number] | null>(null);
    const [sortBy, setSortBy] = useState('popular');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(q as string || '');

    const apiUrl = useMemo(() => {
        let url = `/api/products?`;
        if (searchQuery) url += `search=${searchQuery}&`;
        if (selectedBrand !== 'All') url += `brand=${selectedBrand}&`;
        if (selectedPriceRange) {
            url += `minPrice=${selectedPriceRange.min}&maxPrice=${selectedPriceRange.max}&`;
        }
        if (sortBy) url += `sort=${sortBy.replace('-', '_')}&`;
        return url;
    }, [searchQuery, selectedBrand, selectedPriceRange, sortBy]);

    const { data: dbProducts, error, isLoading } = useSWR(apiUrl, fetcher);

    const filteredProducts = useMemo(() => {
        if (!dbProducts) return [];
        let products = [...dbProducts];

        // URL context filters (still applied client-side for immediate feedback if needed, but API handles core)
        if (filter === 'new') products = products.filter((p: any) => p.isNewArrival);
        if (filter === 'trending') products = products.filter((p: any) => p.isTrending);
        if (filter === 'sale') products = products.filter((p: any) => p.price < 120);

        // Client side size filtering as it's more efficient than complex mongo arrays for this scale
        if (selectedSize) products = products.filter((p: any) => p.sizes.includes(selectedSize));

        return products;
    }, [dbProducts, filter, selectedSize]);

    const clearFilters = () => {
        setSelectedBrand('All');
        setSelectedSize('');
        setSelectedPriceRange(null);
        setSortBy('popular');
        setSearchQuery('');
    };

    const FilterPanel = () => (
        <div className="space-y-8">
            {/* Brands */}
            <div>
                <h3 className="font-outfit font-bold uppercase tracking-widest text-sm mb-4">Brand</h3>
                <div className="space-y-2">
                    {BRANDS.map(b => (
                        <button
                            key={b}
                            onClick={() => setSelectedBrand(b)}
                            className={`block text-sm w-full text-left py-1.5 px-3 transition-colors ${selectedBrand === b ? 'bg-brand-green text-white font-bold' : 'text-zinc-600 hover:text-zinc-900'}`}
                        >
                            {b}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price */}
            <div>
                <h3 className="font-outfit font-bold uppercase tracking-widest text-sm mb-4">Price</h3>
                <div className="space-y-2">
                    {PRICE_RANGES.map(r => (
                        <button
                            key={r.label}
                            onClick={() => setSelectedPriceRange(selectedPriceRange?.label === r.label ? null : r)}
                            className={`block text-sm w-full text-left py-1.5 px-3 transition-colors ${selectedPriceRange?.label === r.label ? 'bg-brand-green text-white font-bold' : 'text-zinc-600 hover:text-zinc-900'}`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sizes */}
            <div>
                <h3 className="font-outfit font-bold uppercase tracking-widest text-sm mb-4">Size (US)</h3>
                <div className="flex flex-wrap gap-2">
                    {ALL_SIZES.map(s => (
                        <button
                            key={s}
                            onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                            className={`w-12 h-10 text-sm border font-semibold transition-colors ${selectedSize === s ? 'bg-brand-black text-white border-brand-black' : 'border-zinc-300 hover:border-brand-black'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <button onClick={clearFilters} className="text-xs text-zinc-400 hover:text-red-400 underline transition-colors">
                Clear all filters
            </button>
        </div>
    );

    if (error) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <p className="text-red-500 font-bold">Failed to load products. Please try again later.</p>
        </div>
    );

    return (
        <>
            <Head>
                <title>Shop Sneakers — Waterson Drip Store</title>
                <meta name="description" content="Browse our full collection of authentic premium sneakers in South Africa at Waterson Drip Store. Filter by brand, size, price and colour." />
            </Head>

            {/* Page Header */}
            <div className="bg-zinc-950 text-white py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <p className="text-brand-green text-xs font-bold uppercase tracking-[0.3em] mb-2">
                        {filter ? String(filter).charAt(0).toUpperCase() + String(filter).slice(1) : 'All'} Collection
                    </p>
                    <h1 className="text-5xl font-outfit font-black">
                        {filter === 'new' ? 'New Arrivals' : filter === 'trending' ? 'Trending' : filter === 'sale' ? 'On Sale' : 'All Sneakers'}
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-12">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block">
                        <FilterPanel />
                    </aside>

                    {/* Main Grid */}
                    <div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-zinc-100 gap-4">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="relative flex-1 md:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <input
                                        type="text"
                                        placeholder="Search sneakers..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 text-sm border border-zinc-200 focus:outline-none focus:border-brand-green"
                                    />
                                </div>
                                <p className="hidden md:block text-sm text-zinc-500">
                                    {isLoading ? 'Loading...' : `${filteredProducts.length} products`}
                                </p>
                            </div>
                            <div className="flex items-center gap-4 w-full md:w-auto justify-between">
                                <select
                                    value={sortBy}
                                    onChange={e => setSortBy(e.target.value)}
                                    className="text-sm border border-zinc-200 px-3 py-2 focus:outline-none focus:border-brand-green bg-white flex-1 md:flex-none"
                                >
                                    <option value="popular">Most Popular</option>
                                    <option value="newest">Newest</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                </select>
                                <button
                                    className="lg:hidden flex items-center gap-2 text-sm font-semibold border border-zinc-200 px-4 py-2"
                                    onClick={() => setMobileFiltersOpen(true)}
                                >
                                    <SlidersHorizontal className="w-4 h-4" /> Filters
                                </button>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="w-10 h-10 text-brand-green animate-spin" />
                                <p className="text-zinc-500 font-medium">Crunching the numbers...</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-zinc-400 text-lg">No sneakers match your filters.</p>
                                <button onClick={clearFilters} className="mt-4 btn-secondary">Clear Filters</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredProducts.map(p => (
                                    <ProductCard key={p._id} product={{ ...p, image: p.images[0] }} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filters Drawer */}
            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
                    <div className="relative ml-auto w-80 max-w-full bg-white h-full overflow-y-auto p-6 z-10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-outfit font-black text-lg">Filters</h2>
                            <button onClick={() => setMobileFiltersOpen(false)}><X className="w-5 h-5" /></button>
                        </div>
                        <FilterPanel />
                    </div>
                </div>
            )}
        </>
    );
};

export default Shop;
