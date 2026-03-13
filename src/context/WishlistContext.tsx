import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistContextType {
    wishlist: string[];
    toggleWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<string[]>([]);

    useEffect(() => {
        const fetchWishlist = async () => {
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const { token } = JSON.parse(userStr);
            try {
                const res = await fetch('/api/wishlist', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setWishlist(data.map((p: any) => p._id));
                }
            } catch (err) {
                console.error('Failed to fetch wishlist', err);
            }
        };
        fetchWishlist();
    }, []);

    const toggleWishlist = async (productId: string) => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            window.location.href = '/login';
            return;
        }
        const { token } = JSON.parse(userStr);

        try {
            const res = await fetch('/api/wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.action === 'added') {
                    setWishlist(prev => [...prev, productId]);
                } else {
                    setWishlist(prev => prev.filter(id => id !== productId));
                }
            }
        } catch (err) {
            console.error('Wishlist toggle failed', err);
        }
    };

    const isInWishlist = (productId: string) => wishlist.includes(productId);

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
