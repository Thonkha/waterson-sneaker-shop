import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Search, User, Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { itemCount } = useCart();

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="relative w-52 h-16">
                            <Image
                                src="/logo.png"
                                alt="Waterson Drip Store"
                                fill
                                className="object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <Link href="/" className="text-sm font-semibold hover:text-brand-green transition-colors">Home</Link>
                        <Link href="/shop" className="text-sm font-semibold hover:text-brand-green transition-colors">Shop</Link>
                        <Link href="/shop?filter=new" className="text-sm font-semibold hover:text-brand-green transition-colors">New Drops</Link>
                        <Link href="/shop?filter=sale" className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors">Sale</Link>
                    </nav>

                    {/* Icons */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button className="text-zinc-900 hover:text-brand-green transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                        <Link href="/account">
                            <User className="w-5 h-5 text-zinc-900 hover:text-brand-green transition-colors" />
                        </Link>
                        <Link href="/wishlist">
                            <Heart className="w-5 h-5 text-zinc-900 hover:text-brand-green transition-colors" />
                        </Link>
                        <Link href="/cart" className="text-zinc-900 hover:text-brand-green transition-colors relative">
                            <ShoppingBag className="w-5 h-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-brand-green text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <Link href="/cart" className="text-zinc-900 hover:text-brand-green transition-colors relative">
                            <ShoppingBag className="w-5 h-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-brand-green text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-zinc-900 hover:text-brand-green focus:outline-none"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-zinc-100 px-4 pt-2 pb-6 space-y-4">
                    <Link href="/" className="block text-base font-semibold hover:text-brand-green">Home</Link>
                    <Link href="/shop" className="block text-base font-semibold hover:text-brand-green">Shop</Link>
                    <Link href="/shop?filter=new" className="block text-base font-semibold hover:text-brand-green">New Drops</Link>
                    <Link href="/shop?filter=sale" className="block text-base font-semibold text-red-500 hover:text-red-600">Sale</Link>

                    <div className="pt-4 border-t border-zinc-100 flex space-x-6">
                        <button className="text-zinc-900 hover:text-brand-green flex items-center gap-2">
                            <Search className="w-5 h-5" /> <span className="text-sm font-medium">Search</span>
                        </button>
                        <Link href="/account" className="text-zinc-900 hover:text-brand-green flex items-center gap-2">
                            <User className="w-5 h-5" /> <span className="text-sm font-medium">Account</span>
                        </Link>
                        <Link href="/wishlist" className="text-zinc-900 hover:text-brand-green flex items-center gap-2">
                            <Heart className="w-5 h-5" /> <span className="text-sm font-medium">Wishlist</span>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
