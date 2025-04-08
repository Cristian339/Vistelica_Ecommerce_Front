// ProductCarousel.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Button, Box, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Datos de productos hardcodeados directamente en el componente
const hardcodedProducts = [
    {
        id: 1,
        name: 'ZZ Plant',
        brand: 'Botanical Gardens',
        price: 80.00,
        image: 'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png',
    },
    {
        id: 2,
        name: 'Spray Bottle',
        brand: 'Planted',
        price: 15.00,
        image: 'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png',
    },
    {
        id: 3,
        name: 'Snake Plant',
        brand: 'GreenLeaf',
        price: 109.99,
        image: 'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png',
    },
    {
        id: 4,
        name: 'Sansevieria',
        brand: 'Urban Jungle',
        price: 45.00,
        image: 'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png',
    },
    {
        id: 5,
        name: 'Monstera Deliciosa',
        brand: 'Tropical Haven',
        price: 120.00,
        image: 'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png',
    },
    {
        id: 6,
        name: 'Clay Pot - Medium',
        brand: 'Terra Cotta',
        price: 28.50,
        image: 'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png',
    },
    {
        id: 7,
        name: 'Plant Food Formula',
        brand: 'GreenThumb',
        price: 19.99,
        image: 'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png',
    },
    {
        id: 8,
        name: 'Fiddle Leaf Fig',
        brand: 'Exotic Plants',
        price: 150.00,
        image: 'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png',
    },
    {
        id: 9,
        name: 'Potting Soil - 5L',
        brand: 'EarthMix',
        price: 22.99,
        image: 'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png',
    },
    {
        id: 10,
        name: 'Watering Can',
        brand: 'GardenEssentials',
        price: 34.50,
        image: 'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png',
    }
];

// Estilos CSS puros
const styles = {
    container: {
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    subtitle: {
        fontSize: '16px',
        color: '#666',
        marginTop: '5px',
    },
    seeAll: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#1a1a1a',
        textDecoration: 'none',
        cursor: 'pointer',
    },
    productsContainer: {
        position: 'relative',
        overflow: 'hidden',
    },
    productsList: {
        display: 'flex',
        transition: 'transform 0.5s ease-in-out',
        gap: '20px',
    },
    productCard: {
        flex: '0 0 calc(25% - 15px)',
        backgroundColor: '#f5f3ef',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    productImage: {
        width: '100%',
        height: '300px',
        objectFit: 'cover',
        backgroundColor: '#f5f3ef',
    },
    productInfo: {
        padding: '15px',
    },
    productName: {
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    productBrand: {
        fontSize: '14px',
        color: '#666',
        marginBottom: '10px',
    },
    productPrice: {
        fontSize: '18px',
        fontWeight: 'bold',
    },
    navigationControls: {
        marginTop: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    progressBarContainer: {
        flex: '1',
        height: '4px',
        backgroundColor: '#e0e0e0',
        position: 'relative',
        cursor: 'pointer',
        margin: '0 20px',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#1a1a1a',
        transition: 'width 0.3s ease-in-out',
    },
    arrowButton: {
        minWidth: '40px',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        border: '1px solid #e0e0e0',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#f5f5f5',
        },
    },
};

// Props del componente:
// - products: Array de objetos producto (opcional, por defecto usa hardcodedProducts)
// - title: Título del carrusel (opcional, por defecto "New arrivals")
// - subtitle: Subtítulo del carrusel (opcional)
// - onSeeAllClick: Función para manejar el clic en "See all" (opcional)
// - initialSlidesToShow: Número inicial de slides a mostrar (opcional, por defecto 4)

const ProductCarousel = ({
                             products = hardcodedProducts, // Usa los productos hardcodeados por defecto
                             title = "Explora nuestros productos",
                             subtitle = "Empieza a ver nuestros productos más  impresionates de nuestro extenso catologo.",
                             onSeeAllClick = () => {},
                             initialSlidesToShow = 4
                         }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slidesToShow, setSlidesToShow] = useState(initialSlidesToShow);
    const maxIndex = Math.max(0, Math.ceil(products.length / slidesToShow) - 1);
    const progressBarRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 600) {
                setSlidesToShow(1);
            } else if (window.innerWidth <= 900) {
                setSlidesToShow(2);
            } else if (window.innerWidth <= 1200) {
                setSlidesToShow(3);
            } else {
                setSlidesToShow(initialSlidesToShow);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [initialSlidesToShow]);

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => Math.min(maxIndex, prevIndex + 1));
    };

    const handleProgressBarClick = (e) => {
        if (!progressBarRef.current) return;

        const rect = progressBarRef.current.getBoundingClientRect();
        const clickPositionRatio = (e.clientX - rect.left) / rect.width;
        const newIndex = Math.floor(clickPositionRatio * (maxIndex + 1));
        setCurrentIndex(Math.min(maxIndex, Math.max(0, newIndex)));
    };

    const progressPercentage = maxIndex === 0 ? 100 : (currentIndex / maxIndex) * 100;

    // Si no hay productos, no renderizar nada
    if (!products.length) return null;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>{title}</h2>
                    {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
                </div>
                <span style={styles.seeAll} onClick={onSeeAllClick}>See all</span>
            </div>

            <div style={styles.productsContainer}>
                <div
                    style={{
                        ...styles.productsList,
                        transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
                    }}
                >
                    {products.map((product) => (
                        <div key={product.id} style={styles.productCard}>
                            <Box
                                sx={{
                                    height: '300px',
                                    backgroundColor: '#f5f3ef',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                }}
                            >
                                <Box
                                    component="img"
                                    sx={styles.productImage}
                                    alt={product.name}
                                    src={product.image}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/api/placeholder/400/300';
                                    }}
                                />
                            </Box>
                            <div style={styles.productInfo}>
                                <h3 style={styles.productName}>{product.name}</h3>
                                {product.brand && <p style={styles.productBrand}>{product.brand}</p>}
                                <p style={styles.productPrice}>${product.price.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={styles.navigationControls}>
                <Button
                    variant="outlined"
                    style={styles.arrowButton}
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                >
                    <ArrowBackIosIcon fontSize="small" />
                </Button>

                <div
                    style={styles.progressBarContainer}
                    ref={progressBarRef}
                    onClick={handleProgressBarClick}
                >
                    <div
                        style={{
                            ...styles.progressBar,
                            width: `${progressPercentage}%`,
                        }}
                    />
                </div>

                <Button
                    variant="outlined"
                    style={styles.arrowButton}
                    onClick={handleNext}
                    disabled={currentIndex >= maxIndex}
                >
                    <ArrowForwardIosIcon fontSize="small" />
                </Button>
            </div>
        </div>
    );
};

export default ProductCarousel;