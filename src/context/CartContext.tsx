import { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
    _id: string;
    name: string;
    brand: string;
    slug: string;
    price: number;
    image: string;
    size: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string, size: string) => void;
    updateQuantity: (id: string, size: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = (newItem: CartItem) => {
        setItems(prev => {
            const existing = prev.find(i => i._id === newItem._id && i.size === newItem.size);
            if (existing) {
                return prev.map(i =>
                    i._id === newItem._id && i.size === newItem.size
                        ? { ...i, quantity: i.quantity + newItem.quantity }
                        : i
                );
            }
            return [...prev, newItem];
        });
    };

    const removeItem = (id: string, size: string) => {
        setItems(prev => prev.filter(i => !(i._id === id && i.size === size)));
    };

    const updateQuantity = (id: string, size: string, quantity: number) => {
        if (quantity < 1) { removeItem(id, size); return; }
        setItems(prev => prev.map(i => i._id === id && i.size === size ? { ...i, quantity } : i));
    };

    const clearCart = () => setItems([]);

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
};
