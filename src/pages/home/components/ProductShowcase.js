import React, { useState } from 'react';

const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative bg-white p-4 border border-gray-200 rounded-md transition-shadow duration-300 hover:shadow-lg"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Contenedor de imagen con tamaño fijo */}
            <div className="w-full h-96 flex items-center justify-center mb-2 overflow-hidden">
                <div className="w-96 h-96 relative">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-contain"
                    />
                </div>
            </div>
            <h3 className="text-sm font-medium text-gray-800">{product.name}</h3>

            {/* Info overlay que se muestra al pasar el ratón */}
            {isHovered && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-end p-4 rounded-md text-black transition-opacity duration-300">
                    <p className="text-sm mb-1 text-black">Desde ${product.price}</p>
                    {product.rating && (
                        <div className="flex items-center mb-1 text-black">
                            <span className="mr-1">★</span>
                            <span>{product.rating}</span>
                            <span className="text-xs ml-1">({product.reviews} reseñas)</span>
                        </div>
                    )}
                    {product.variants && (
                        <p className="text-xs text-black">{product.variants} variantes</p>
                    )}
                </div>
            )}
        </div>
    );
};

const ProductShowcase = () => {
    const products = [
        {
            id: 1,
            name: "Anillo Inspirado en Vintage con Zafiro",
            price: "420.00",
            imageUrl: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png",
            rating: "4.85",
            reviews: "11",
            variants: "5"
        },
        {
            id: 2,
            name: "Altavoz Bluetooth de Malla Redondo",
            price: "215.00",
            imageUrl: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png",
            rating: "4.7",
            reviews: "24",
            variants: "3"
        },
        {
            id: 3,
            name: "Parlante Portátil Minimalista",
            price: "145.00",
            imageUrl: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png",
            variants: "2"
        },
        {
            id: 4,
            name: "Gafas de Sol Clásicas",
            price: "95.00",
            imageUrl: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png",
            rating: "4.9",
            reviews: "37",
            variants: "4"
        },
        {
            id: 5,
            name: "Plato Decorativo Mármol",
            price: "125.00",
            imageUrl: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png",
            variants: "1"
        },
        {
            id: 6,
            name: "Jarrón Plateado Moderno",
            price: "175.00",
            imageUrl: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png",
            rating: "4.6",
            reviews: "8",
            variants: "2"
        }
    ];

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Nuevas Llegadas</h2>

            {/* Contenedor de productos */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default ProductShowcase;
