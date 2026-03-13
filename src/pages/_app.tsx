import type { AppProps } from "next/app";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Inter, Outfit } from 'next/font/google';
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export default function App({ Component, pageProps }: AppProps) {
    return (
        <CartProvider>
            <WishlistProvider>
                <div className={`${inter.variable} ${outfit.variable} font-sans min-h-screen flex flex-col`}>
                    <Navbar />
                    <main className="flex-grow">
                        <Component {...pageProps} />
                    </main>
                    <Footer />
                </div>
            </WishlistProvider>
        </CartProvider>
    );
}
