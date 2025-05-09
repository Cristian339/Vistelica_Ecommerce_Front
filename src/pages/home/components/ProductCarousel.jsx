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

// Estilos CSS con mejoras para móvil
const styles = {
    container: {
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px 10px', // Reducido padding en móvil
        fontFamily: 'Arial, sans-serif',
        boxSizing: 'border-box',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap', // Para pantallas muy pequeñas
    },
    title: {
        fontSize: '24px', // Tamaño reducido para móvil
        fontWeight: 'bold',
        color: '#1a1a1a',
        margin: '0',
    },
    subtitle: {
        fontSize: '14px', // Tamaño reducido para móvil
        color: '#666',
        marginTop: '5px',
        margin: '5px 0 0 0',
    },
    seeAll: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#1a1a1a',
        textDecoration: 'none',
        cursor: 'pointer',
        padding: '5px', // Área táctil más grande
    },
    productsContainer: {
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
    },
    productsList: {
        display: 'flex',
        transition: 'transform 0.5s ease-in-out',
        gap: '15px', // Gap reducido para móvil
        margin: '0',
        padding: '0',
    },
    productCard: {
        flex: '0 0 100%', // Se ajustará según slidesToShow
        backgroundColor: '#f5f3ef',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    productImage: {
        width: '100%',
        height: '200px', // Altura reducida para móvil
        objectFit: 'cover',
        backgroundColor: '#f5f3ef',
    },
    productInfo: {
        padding: '12px',
    },
    productName: {
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '5px',
        margin: '0 0 5px 0',
    },
    productBrand: {
        fontSize: '14px',
        color: '#666',
        marginBottom: '8px',
        margin: '0 0 8px 0',
    },
    productPrice: {
        fontSize: '16px',
        fontWeight: 'bold',
        margin: '0',
    },
    navigationControls: {
        marginTop: '20px',
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
        margin: '0 10px', // Margen reducido para móvil
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#1a1a1a',
        transition: 'width 0.3s ease-in-out',
    },
    arrowButton: {
        minWidth: '36px', // Tamaño reducido para móvil
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        border: '1px solid #e0e0e0',
        cursor: 'pointer',
        padding: '0',
    },
};

const ProductCarousel = ({
                             products = hardcodedProducts,
                             title = "Explora nuestros productos",
                             subtitle = "Empieza a ver nuestros productos más impresionantes de nuestro extenso catálogo.",
                             onSeeAllClick = () => {},
                             initialSlidesToShow = 4
                         }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slidesToShow, setSlidesToShow] = useState(initialSlidesToShow);
    const [cardWidth, setCardWidth] = useState(100);
    const containerRef = useRef(null);
    const progressBarRef = useRef(null);

    // Calcular el índice máximo basado en el número de slides
    const maxIndex = Math.max(0, products.length - slidesToShow);

    // Efecto para manejar el resize y ajustar el número de slides
    useEffect(() => {
        const handleResize = () => {
            let newSlidesToShow;

            if (window.innerWidth < 480) {
                newSlidesToShow = 1;
            } else if (window.innerWidth <= 600) {
                newSlidesToShow = 1.2; // Muestra 1 completo y un poco del siguiente
            } else if (window.innerWidth <= 900) {
                newSlidesToShow = 2;
            } else if (window.innerWidth <= 1200) {
                newSlidesToShow = 3;
            } else {
                newSlidesToShow = initialSlidesToShow;
            }

            setSlidesToShow(newSlidesToShow);

            // Ajustar el ancho de la tarjeta según slidesToShow
            // Para valores decimales, calculamos el porcentaje apropiado
            const newCardWidth = 100 / newSlidesToShow;
            setCardWidth(newCardWidth);

            // Asegurarse de que currentIndex no exceda el nuevo maxIndex
            const newMaxIndex = Math.max(0, products.length - newSlidesToShow);
            if (currentIndex > newMaxIndex) {
                setCurrentIndex(newMaxIndex);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [initialSlidesToShow, products.length, currentIndex]);

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

    // Calcular el porcentaje de progreso
    const progressPercentage = maxIndex === 0 ? 100 : (currentIndex / maxIndex) * 100;

    // Si no hay productos, no renderizar nada
    if (!products.length) return null;

    return (
        <div style={styles.container} ref={containerRef}>
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
                        <div
                            key={product.id}
                            style={{
                                ...styles.productCard,
                                flex: `0 0 ${cardWidth}%`, // Ancho dinámico basado en slidesToShow
                            }}
                        >
                            <Box
                                sx={{
                                    height: { xs: '200px', sm: '250px', md: '300px' },
                                    backgroundColor: '#f5f3ef',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                }}
                            >
                                <Box
                                    component="img"
                                    sx={{
                                        ...styles.productImage,
                                        height: { xs: '200px', sm: '250px', md: '300px' },
                                    }}
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
                    style={{
                        ...styles.arrowButton,
                        opacity: currentIndex === 0 ? 0.5 : 1,
                    }}
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                >
                    <ArrowBackIosIcon style={{ fontSize: '16px' }} />
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
                    style={{
                        ...styles.arrowButton,
                        opacity: currentIndex >= maxIndex ? 0.5 : 1,
                    }}
                    onClick={handleNext}
                    disabled={currentIndex >= maxIndex}
                >
                    <ArrowForwardIosIcon style={{ fontSize: '16px' }} />
                </Button>
            </div>
        </div>
    );
};

export default ProductCarousel;