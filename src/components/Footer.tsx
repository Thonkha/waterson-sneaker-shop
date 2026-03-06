import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-brand-black text-white pt-16 pb-8 border-t border-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Col */}
                    <div className="space-y-4">
                        <Link href="/" className="text-3xl font-bold font-outfit tracking-tighter">
                            Waterson Drip Store
                        </Link>
                        <p className="text-zinc-400 text-sm max-w-xs">
                            Step into the future of sneaker culture. The premium marketplace for authentic sneakers in Limpopo, South Africa.
                        </p>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-4 font-outfit uppercase tracking-wider">Shop</h4>
                        <ul className="space-y-3">
                            <li><Link href="/shop" className="text-zinc-400 hover:text-brand-green transition-colors text-sm">All Sneakers</Link></li>
                            <li><Link href="/shop?filter=new" className="text-zinc-400 hover:text-brand-green transition-colors text-sm">New Arrivals</Link></li>
                            <li><Link href="/shop?filter=trending" className="text-zinc-400 hover:text-brand-green transition-colors text-sm">Trending</Link></li>
                            <li><Link href="/shop?filter=sale" className="text-zinc-400 hover:text-brand-green transition-colors text-sm">Sale Items</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-4 font-outfit uppercase tracking-wider">Support</h4>
                        <ul className="space-y-3">
                            <li><Link href="/contact" className="text-zinc-400 hover:text-brand-green transition-colors text-sm">Contact Us</Link></li>
                            <li><Link href="/shipping" className="text-zinc-400 hover:text-brand-green transition-colors text-sm">Shipping Info</Link></li>
                            <li><Link href="/returns" className="text-zinc-400 hover:text-brand-green transition-colors text-sm">Returns & Exchanges</Link></li>
                            <li><Link href="/faq" className="text-zinc-400 hover:text-brand-green transition-colors text-sm">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold text-lg mb-4 font-outfit uppercase tracking-wider">Never Miss A Drop</h4>
                        <p className="text-zinc-400 text-sm mb-4">Subscribe for early access and exclusive releases.</p>
                        <form className="flex flex-col space-y-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-zinc-900 border border-zinc-800 text-white px-4 py-3 focus:outline-none focus:border-brand-green transition-colors"
                                required
                            />
                            <button type="submit" className="btn-primary w-full text-center hover:bg-white hover:text-brand-black">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-zinc-500 text-xs text-center md:text-left">
                    <p>&copy; {new Date().getFullYear()} Waterson Drip Store. All rights reserved.</p>
                    <div className="flex space-x-4">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
