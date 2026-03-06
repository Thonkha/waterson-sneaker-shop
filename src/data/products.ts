export interface Product {
    _id: string;
    name: string;
    brand: string;
    slug: string;
    price: number;
    description: string;
    materials: string;
    images: string[];
    sizes: string[];
    colors: string[];
    stock: number;
    isTrending: boolean;
    isNewArrival: boolean;
    isLimitedRelease: boolean;
    releaseDate?: string;
    popularity: number;
    reviews?: Review[];
}

export interface Review {
    name: string;
    rating: number;
    comment: string;
    date: string;
}

export const SAMPLE_PRODUCTS: Product[] = [
    {
        _id: '1',
        name: 'Air Hyper Eclipse',
        brand: 'Nike',
        slug: 'nike-air-hyper-eclipse',
        price: 189.99,
        description: 'A revolutionary sneaker that combines cutting-edge air cushioning technology with a sleek silhouette. The Air Hyper Eclipse features a lightweight mesh upper, full-length Air unit, and a durable rubber outsole.',
        materials: 'Flyknit upper, Air Zoom cushioning, rubber outsole',
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800',
        ],
        sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'],
        colors: ['Black', 'White'],
        stock: 24,
        isTrending: true,
        isNewArrival: true,
        isLimitedRelease: false,
        popularity: 95,
        reviews: [{ name: 'Jordan M.', rating: 5, comment: 'Absolutely incredible comfort and style.', date: '2026-02-12' }],
    },
    {
        _id: '2',
        name: 'Boost Ultra Strike',
        brand: 'Adidas',
        slug: 'adidas-boost-ultra-strike',
        price: 159.99,
        description: 'Experience peak performance with the Boost Ultra Strike. Featuring Adidas Boost technology for unparalleled energy return and a Primeknit upper that molds to your foot like a glove.',
        materials: 'Primeknit, Boost midsole, continental rubber',
        images: [
            'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1556906781-9a412961d28e?auto=format&fit=crop&q=80&w=800',
        ],
        sizes: ['6', '7', '8', '8.5', '9', '10', '11', '12'],
        colors: ['White', 'Gray'],
        stock: 18,
        isTrending: false,
        isNewArrival: true,
        isLimitedRelease: false,
        popularity: 88,
        reviews: [{ name: 'Alex K.', rating: 4, comment: 'Great shoe for everyday wear.', date: '2026-01-20' }],
    },
    {
        _id: '3',
        name: 'Cloud Runner X',
        brand: 'New Balance',
        slug: 'newbalance-cloud-runner-x',
        price: 139.99,
        description: 'The Cloud Runner X brings together classic New Balance design language with modern cushioning tech. Perfect for the streets or the track.',
        materials: 'Engineered mesh, ABZORB midsole, NDurance outsole',
        images: [
            'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=800',
        ],
        sizes: ['7', '8', '9', '10', '11'],
        colors: ['Green', 'Black'],
        stock: 10,
        isTrending: true,
        isNewArrival: false,
        isLimitedRelease: false,
        popularity: 82,
        reviews: [],
    },
    {
        _id: '4',
        name: 'Phantom GT Elite',
        brand: 'Nike',
        slug: 'nike-phantom-gt-elite',
        price: 220.00,
        description: 'Limited to 500 pairs worldwide. The Phantom GT Elite is a collector\'s dream, featuring hand-stitched details and premium full-grain leather.',
        materials: 'Full-grain leather, carbon fibre plate, foam midsole',
        images: [
            'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?auto=format&fit=crop&q=80&w=800',
        ],
        sizes: ['8', '9', '10', '11'],
        colors: ['Black', 'Gold'],
        stock: 4,
        isTrending: false,
        isNewArrival: false,
        isLimitedRelease: true,
        releaseDate: '2026-03-15T00:00:00.000Z',
        popularity: 99,
        reviews: [{ name: 'Sam R.', rating: 5, comment: 'Worth every single penny!', date: '2026-01-05' }],
    },
    {
        _id: '5',
        name: 'Suede Classic Heritage',
        brand: 'PUMA',
        slug: 'puma-suede-classic-heritage',
        price: 99.99,
        description: 'An iconic silhouette reborn. The PUMA Suede Classic Heritage brings back the original with premium suede construction and heritage branding.',
        materials: 'Suede leather, EVA foam midsole, rubber outsole',
        images: [
            'https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=800',
        ],
        sizes: ['6', '7', '8', '9', '10', '11', '12'],
        colors: ['Blue', 'White'],
        stock: 30,
        isTrending: false,
        isNewArrival: false,
        isLimitedRelease: false,
        popularity: 74,
        reviews: [],
    },
    {
        _id: '6',
        name: 'RS-X³ Puzzle',
        brand: 'PUMA',
        slug: 'puma-rsx3-puzzle',
        price: 129.99,
        description: 'Bold, chunky and loud — the RS-X³ Puzzle pushes the retro runner aesthetic to the limit with layered panels and multi-tonal colour blocking.',
        materials: 'Mesh and leather upper, RS cushioning, rubber outsole',
        images: [
            'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1556906781-9a412961d28e?auto=format&fit=crop&q=80&w=800',
        ],
        sizes: ['7', '8', '9', '10', '11'],
        colors: ['White', 'Multi'],
        stock: 15,
        isTrending: true,
        isNewArrival: true,
        isLimitedRelease: false,
        popularity: 79,
        reviews: [],
    },
    {
        _id: '7',
        name: 'Forum 84 Low',
        brand: 'Adidas',
        slug: 'adidas-forum-84-low',
        price: 110.00,
        description: 'The Forum 84 Low returns with its legendary design. Premium leather upper, basketball-inspired detail and a chunky tooling make this a streetwear essential.',
        materials: 'Leather upper, EVA midsole, rubber cupsole',
        images: [
            'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1508835277982-1c1b0e205603?auto=format&fit=crop&q=80&w=800',
        ],
        sizes: ['7', '7.5', '8', '9', '10', '11', '12'],
        colors: ['White', 'Black'],
        stock: 22,
        isTrending: false,
        isNewArrival: true,
        isLimitedRelease: false,
        popularity: 85,
        reviews: [{ name: 'Lena J.', rating: 4, comment: 'Clean and timeless.', date: '2026-02-01' }],
    },
    {
        _id: '8',
        name: 'MegaBounce Volt',
        brand: 'Fila',
        slug: 'fila-megabounce-volt',
        price: 89.99,
        description: 'A bold statement piece from Fila. The MegaBounce Volt combines retro running DNA with an electric colour palette for maximum eye-catching appeal.',
        materials: 'Mesh and synthetic upper, CMEVAmidsole, rubber outsole',
        images: [
            'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800',
        ],
        sizes: ['6', '7', '8', '9', '10', '11'],
        colors: ['Yellow', 'Black'],
        stock: 8,
        isTrending: false,
        isNewArrival: false,
        isLimitedRelease: false,
        popularity: 65,
        reviews: [],
    },
];
