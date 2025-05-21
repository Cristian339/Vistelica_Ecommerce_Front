'use client'
import React, { useState, useRef, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { GlobalStyles } from '@mui/material';
import  productService  from '@/services/productService'; // Asegúrate de que la ruta es correcta
import Link from 'next/link';

const SuggestedItemsCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [suggestedItems, setSuggestedItems] = useState([]);
    const carouselRef = useRef(null);

    // Cargar productos con descuento para categoría 1
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getDiscountedProductsByCategory(2);
                const mappedItems = data.map(product => ({
                    id: product.productId,
                    name: product.name,
                    originalPrice: `${product.originalPrice} €`,
                    salePrice: `${product.discountedPrice} €`,
                    image: product.images.find(img => img.is_main === true)?.image_url || '',
                    tag: '',
                }));
                setSuggestedItems(mappedItems);
            } catch (error) {
                console.error('Error cargando productos sugeridos:', error);
            }
        };


        fetchProducts();
    }, []);

    const nextSlide = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: carouselRef.current.offsetWidth,
                behavior: 'smooth'
            });
        }

        const newIndex = currentSlide + 4 >= suggestedItems.length
            ? 0
            : currentSlide + 1;

        setCurrentSlide(newIndex);
    };

    const prevSlide = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: -carouselRef.current.offsetWidth,
                behavior: 'smooth'
            });
        }

        const newIndex = currentSlide <= 0
            ? Math.max(suggestedItems.length - 4, 0)
            : currentSlide - 1;

        setCurrentSlide(newIndex);
    };

    const styles = {
        container: {
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0',
            fontFamily: 'Arial, sans-serif',
            position: 'relative',
        },
        header: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: '20px 10px',
            backgroundColor: '#E4B002',
            color: '#fff',
        },
        title: {
            display: 'flex',
            alignItems: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            marginLeft: '10px',
        },
        arrow: {
            marginRight: '15px',
            fontSize: '24px',
        },
        carouselContainer: {
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
        },
        carouselTrack: {
            display: 'flex',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            gap: '1px',
        },
        productCard: {
            flex: '0 0 25%',
            minWidth: '25%',
            scrollSnapAlign: 'start',
            position: 'relative',
            borderRight: '1px solid #e5e5e5',
        },
        productImage: {
            width: '100%',
            aspectRatio: '3/4',
            objectFit: 'cover',
        },
        productInfo: {
            padding: '10px',
            backgroundColor: '#f8f8f8',
        },
        productName: {
            margin: '0 0 5px 0',
            fontSize: '14px',
            fontWeight: 'normal',
        },
        priceContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        salePrice: {
            color: '#d20000',
            fontWeight: 'bold',
            fontSize: '14px',
        },
        originalPrice: {
            textDecoration: 'line-through',
            color: '#666',
            fontSize: '14px',
        },
        navButton: {
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#fff',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            border: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            zIndex: 10,
        },
        prevButton: {
            left: '10px',
        },
        nextButton: {
            right: '10px',
        },
        tagLabel: {
            position: 'absolute',
            top: '10px',
            left: '0',
            backgroundColor: '#000',
            color: '#fff',
            padding: '4px 8px',
            fontSize: '10px',
            fontWeight: 'bold',
        }
    };

    return (
        <>
            <GlobalStyles
                styles={{
                    '.hide-scrollbar::-webkit-scrollbar': {
                        display: 'none'
                    },
                    '.hide-scrollbar': {
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none'
                    }
                }}
            />

            <div style={styles.container}>
                <div style={styles.header}>
                    <div style={styles.title}>
                        <span style={styles.arrow}>→</span>
                        TE PUEDE INTERESAR
                    </div>
                </div>

                <div style={styles.carouselContainer}>
                    <div
                        ref={carouselRef}
                        className="hide-scrollbar"
                        style={styles.carouselTrack}
                    >
                        {suggestedItems.map((item) => (
                            <Link key={item.id} href={`/product-detail/page?id=${item.id}`} passHref legacyBehavior>
                                <a style={{...styles.productCard, textDecoration: 'none', color: 'inherit'}}>

                                    {item.tag && <div style={styles.tagLabel}>{item.tag}</div>}
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        style={styles.productImage}
                                    />
                                    <div style={styles.productInfo}>
                                        <h3 style={styles.productName}>{item.name}</h3>
                                        <div style={styles.priceContainer}>
                                            <span style={styles.salePrice}>{item.salePrice}</span>
                                            {item.originalPrice !== item.salePrice && (
                                                <span style={styles.originalPrice}>{item.originalPrice}</span>
                                            )}
                                        </div>
                                    </div>
                                </a>
                            </Link>
                        ))}

                    </div>

                    <button
                        onClick={prevSlide}
                        style={{...styles.navButton, ...styles.prevButton}}
                        aria-label="Anterior"
                    >
                        <ArrowBackIcon/>
                    </button>

                    <button
                        onClick={nextSlide}
                        style={{...styles.navButton, ...styles.nextButton}}
                        aria-label="Siguiente"
                    >
                        <ArrowForwardIcon/>
                    </button>
                </div>
            </div>
        </>
    );
};

export default SuggestedItemsCarousel;
