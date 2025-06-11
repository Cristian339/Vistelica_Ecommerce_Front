'use client'
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { GlobalStyles } from '@mui/material';
import productService from '@/services/productService';
import Link from 'next/link';
import Image from 'next/image';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

const GenericSuggestedItemsCarousel = ({ categoryId }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [suggestedItems, setSuggestedItems] = useState([]);
    const [screenSize, setScreenSize] = useState({
        isMobile: false,
        isTablet: false
    });
    const carouselRef = useRef(null);
    const observerRef = useRef(null);

    // Detectar tamaño de pantalla de forma optimizada
    useEffect(() => {
        const checkScreenSize = () => {
            const isMobile = window.innerWidth <= 768;
            const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
            setScreenSize({ isMobile, isTablet });
        };

        // Throttle para mejorar rendimiento
        let timeoutId = null;
        const throttledResize = () => {
            if (timeoutId === null) {
                timeoutId = setTimeout(() => {
                    timeoutId = null;
                    checkScreenSize();
                }, 200);
            }
        };

        // Verificar al cargar
        checkScreenSize();

        // Event listener optimizado
        window.addEventListener('resize', throttledResize);
        return () => {
            window.removeEventListener('resize', throttledResize);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);

    // Cargar productos con descuento para la categoría especificada
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchProducts = async () => {
            try {
                const data = await productService.getDiscountedProductsByCategory(categoryId, { signal });
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
                if (!signal.aborted) {
                    console.error('Error cargando productos sugeridos:', error);
                }
            }
        };

        fetchProducts();

        return () => controller.abort();
    }, [categoryId]);

    // Determinar número de items por slide basado en tamaño de pantalla
    const itemsPerSlide = useMemo(() => {
        if (screenSize.isMobile) return 2;
        if (screenSize.isTablet) return 3;
        return 4;
    }, [screenSize]);

    // Navegación optimizada
    const nextSlide = useCallback(() => {
        if (!carouselRef.current) return;

        const scrollAmount = Math.floor(carouselRef.current.offsetWidth / itemsPerSlide) * itemsPerSlide;
        carouselRef.current.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });

        const newIndex = currentSlide + itemsPerSlide >= suggestedItems.length
            ? 0
            : currentSlide + itemsPerSlide;

        setCurrentSlide(newIndex);
    }, [currentSlide, suggestedItems.length, itemsPerSlide]);

    const prevSlide = useCallback(() => {
        if (!carouselRef.current) return;

        const scrollAmount = Math.floor(carouselRef.current.offsetWidth / itemsPerSlide) * itemsPerSlide;
        carouselRef.current.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });

        const newIndex = currentSlide <= 0
            ? Math.max(suggestedItems.length - itemsPerSlide, 0)
            : currentSlide - itemsPerSlide;

        setCurrentSlide(newIndex);
    }, [currentSlide, suggestedItems.length, itemsPerSlide]);

    // Manejar navegación por teclado
    const handleKeyDown = useCallback((e, action) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            action();
        }
    }, []);

    const styles = {
        container: {
            width: '100%',
            maxWidth: '2000px',
            margin: '3rem auto 4rem',
            padding: '0',
            fontFamily: typography.fontFamily,
            position: 'relative',
            boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
            borderRadius: '18px',
            overflow: 'hidden',
            background: 'white',
            border: `1px solid ${vistelicaColors.primary}20`,
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: screenSize.isMobile ? '1.3rem 1.5rem' : '1.5rem 2.5rem',
            background: `linear-gradient(135deg, ${vistelicaColors.secondary} 0%, ${vistelicaColors.tertiary} 100%)`,
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            borderBottom: `4px solid ${vistelicaColors.primary}`,
        },
        headerBackground: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.18,
            zIndex: 0,
        },
        titleContainer: {
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
        },
        title: {
            fontSize: screenSize.isMobile ? '1.3rem' : '1.7rem',
            fontWeight: '800',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontFamily: typography.fontFamily,
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            textShadow: '1px 2px 3px rgba(0,0,0,0.3)',
        },
        titleIcon: {
            backgroundColor: vistelicaColors.primary,
            width: screenSize.isMobile ? '35px' : '44px',
            height: screenSize.isMobile ? '35px' : '44px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '15px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            border: '2px solid rgba(255,255,255,0.6)',
        },
        highlightedText: {
            color: vistelicaColors.primary,
            fontWeight: '900',
            marginLeft: '8px',
            textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
        },
        carouselContainer: {
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            padding: screenSize.isMobile ? '2rem 0' : '3rem 0',
            backgroundColor: '#fdfdfd',
            backgroundImage: 'linear-gradient(180deg, white 0%, #f9f9f9 100%)',
        },
        carouselTrack: {
            display: 'flex',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            gap: screenSize.isMobile ? '18px' : screenSize.isTablet ? '25px' : '30px',
            // Aumentado el padding izquierdo para separar el primer producto del borde
            padding: screenSize.isMobile ? '0 1rem 1rem 1.8rem' : '0 2.5rem 1rem 3.5rem',
            WebkitOverflowScrolling: 'touch',
        },
        productCard: {
            flex: screenSize.isMobile
                ? '0 0 calc(50% - 15px)'
                : screenSize.isTablet
                    ? '0 0 calc(33.333% - 22px)'
                    : '0 0 calc(25% - 25px)',
            minWidth: screenSize.isMobile
                ? 'calc(50% - 15px)'
                : screenSize.isTablet
                    ? 'calc(33.333% - 22px)'
                    : 'calc(25% - 25px)',
            scrollSnapAlign: 'start',
            position: 'relative',
            padding: '0',
            boxSizing: 'border-box',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'white',
            boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
            border: '2px solid rgba(0,0,0,0.05)',
        },
        productImageContainer: {
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#f8f8f8',
            borderBottom: `3px solid ${vistelicaColors.primary}30`,
            paddingBottom: '120%',
        },
        productImage: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.33, 1, 0.68, 1)',
        },
        productOverlay: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '60%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.25), transparent)',
            pointerEvents: 'none',
        },
        productInfo: {
            padding: screenSize.isMobile ? '1.3rem 1.2rem' : '1.5rem 1.4rem',
            position: 'relative',
            backgroundColor: 'white',
            transition: 'transform 0.3s ease',
            borderTop: '1px solid rgba(0,0,0,0.04)',
            minHeight: '140px',
        },
        productName: {
            margin: '0 0 0.7rem 0',
            // Tamaño de fuente ajustado: más pequeño en móvil, más grande en desktop
            fontSize: screenSize.isMobile ? '0.9rem' : '1.2rem',
            fontWeight: '400',
            color: vistelicaColors.primary,
            fontFamily: typography.fontFamily,
            lineHeight: '1.4',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: '2',
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis',
            height: screenSize.isMobile ? '2.8rem' : '3.2rem',
            letterSpacing: '0.2px',
            transition: 'color 0.3s ease',
            textShadow: '1px 1px 1px rgba(0,0,0,0.04)',
        },
        priceContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '1rem',
            flexWrap: 'wrap',
            position: 'relative',
            color: vistelicaColors.error,
        },
        salePrice: {
            color: vistelicaColors.primary,
            fontWeight: '400',
            // Tamaño de precio ajustado
            fontSize: screenSize.isMobile ? '1.2rem' : '1.5rem',
            fontFamily: typography.fontFamily,
            letterSpacing: '0.5px',
            position: 'relative',
        },
        salePriceHighlight: {
            position: 'absolute',
            height: '8px',
            bottom: '2px',
            left: '-3px',
            right: '-3px',
            backgroundColor: `${vistelicaColors.primary}20`,
            zIndex: -1,
            borderRadius: '4px',
        },
        originalPrice: {
            textDecoration: 'line-through',
            color: vistelicaColors.accent,
            // Tamaño de precio tachado ajustado
            fontSize: screenSize.isMobile ? '0.85rem' : '1rem',
            fontFamily: typography.fontFamily,
            fontWeight: '600',
            opacity: 0.85,
            position: 'relative',
            top: '1px',
        },
        discountBadge: {
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: vistelicaColors.error,
            color: 'white',
            fontWeight: 'bold',
            width: screenSize.isMobile ? '48px' : '60px',
            height: screenSize.isMobile ? '48px' : '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            // Tamaño de texto de descuento ajustado
            fontSize: screenSize.isMobile ? '0.9rem' : '1.2rem',
            zIndex: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            border: '3px solid rgba(255,255,255,0.8)',
            transform: 'rotate(5deg)',
            textShadow: '1px 1px 1px rgba(0,0,0,0.3)',
        },
        viewButton: {
            position: 'absolute',
            bottom: '-45px',
            left: 0,
            right: 0,
            margin: '0 auto',
            width: '85%',
            padding: '0.8rem 0',
            backgroundColor: vistelicaColors.primary,
            color: 'white',
            textAlign: 'center',
            borderRadius: '25px',
            fontWeight: '600',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease',
            opacity: 0,
            boxShadow: '0 5px 15px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            textShadow: '1px 1px 1px rgba(0,0,0,0.2)',
        },
        navButton: {
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: screenSize.isMobile ? '40px' : '50px',
            height: screenSize.isMobile ? '40px' : '50px',
            borderRadius: '50%',
            backgroundColor: 'white',
            boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
            border: `2px solid ${vistelicaColors.primary}30`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            zIndex: 10,
            color: vistelicaColors.primary,
            transition: 'all 0.3s ease',
            padding: 0,
            outline: 'none',
        },
        prevButton: {
            // Ajustado para mantener espacio con el primer producto
            left: screenSize.isMobile ? '8px' : '15px',
        },
        nextButton: {
            right: screenSize.isMobile ? '10px' : '20px',
        },
        emptyMessage: {
            padding: '3rem 1rem',
            textAlign: 'center',
            fontSize: '1.1rem',
            color: '#888',
            fontFamily: typography.fontFamily,
            fontStyle: 'italic',
        },
        tagLabel: {
            position: 'absolute',
            top: '15px',
            left: '0',
            backgroundColor: vistelicaColors.primary,
            color: '#fff',
            padding: '0.5rem 1.2rem 0.5rem 0.8rem',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            zIndex: 2,
            fontFamily: typography.fontFamily,
            clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
        },
        decorativeBorder: {
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '100%',
            height: '4px',
            background: `linear-gradient(to right, ${vistelicaColors.accent}, ${vistelicaColors.primary}, ${vistelicaColors.accent})`,
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        },
    };

    // Calcular descuento para cada producto
    const calculateDiscount = useCallback((original, sale) => {
        const originalValue = parseFloat(original.replace('€', '').trim());
        const saleValue = parseFloat(sale.replace('€', '').trim());
        if (originalValue > saleValue) {
            const discount = Math.round(((originalValue - saleValue) / originalValue) * 100);
            return `-${discount}%`;
        }
        return null;
    }, []);

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
                    },
                    '.product-card': {
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        textDecoration: 'none',
                        color: 'inherit'
                    },
                    '.product-card:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 18px 40px rgba(0,0,0,0.2)',
                    },
                    '.product-card:hover .product-image': {
                        transform: 'scale(1.08)',
                    },
                    '.product-card:hover .view-button': {
                        bottom: '15px',
                        opacity: 1,
                    },
                    '.nav-button': {
                        transition: 'all 0.3s ease',
                    },
                    '.nav-button:hover': {
                        backgroundColor: vistelicaColors.primary,
                        color: 'white',
                        transform: 'translateY(-50%) scale(1.1)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                    },
                    '@keyframes pulse': {
                        '0%': { transform: 'scale(1) rotate(5deg)' },
                        '50%': { transform: 'scale(1.05) rotate(5deg)' },
                        '100%': { transform: 'scale(1) rotate(5deg)' },
                    },
                    '.discount-badge': {
                        animation: 'pulse 2s infinite ease-in-out'
                    },
                    '@media (prefers-reduced-motion: reduce)': {
                        '.discount-badge': {
                            animation: 'none',
                        },
                        '.product-card:hover': {
                            transform: 'translateY(-4px)',
                        },
                        '.product-card:hover .product-image': {
                            transform: 'scale(1.03)',
                        },
                    }
                }}
            />

            <div style={styles.container}>
                <div style={styles.header}>
                    <div style={styles.headerBackground}></div>
                    <div style={styles.titleContainer}>
                        <div style={styles.titleIcon}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </div>
                        <div style={styles.title}>
                            RECOMENDACIONES<span style={styles.highlightedText}>PARA TI</span>
                        </div>
                    </div>
                    <div style={styles.decorativeBorder}></div>
                </div>

                <div style={styles.carouselContainer}>
                    {suggestedItems.length === 0 ? (
                        <div style={styles.emptyMessage}>
                            No hay productos en oferta disponibles en esta categoría
                        </div>
                    ) : (
                        <>
                            <div
                                ref={carouselRef}
                                className="hide-scrollbar"
                                style={styles.carouselTrack}
                                role="region"
                                aria-label="Carrusel de productos sugeridos"
                            >
                                {suggestedItems.map((item) => {
                                    const discount = calculateDiscount(item.originalPrice, item.salePrice);

                                    return (
                                        <Link key={item.id} href={`/product-detail/page?id=${item.id}`} passHref legacyBehavior>
                                            <a className="product-card" style={styles.productCard} aria-label={`${item.name}, precio ${item.salePrice}${discount ? ', descuento ' + discount : ''}`}>
                                                <div style={styles.productImageContainer}>
                                                    {discount && (
                                                        <div style={styles.discountBadge} className="discount-badge">
                                                            {discount}
                                                        </div>
                                                    )}
                                                    {item.tag && <div style={styles.tagLabel}>{item.tag}</div>}
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        style={styles.productImage}
                                                        className="product-image"
                                                        loading="lazy"
                                                    />
                                                    <div style={styles.productOverlay}></div>
                                                </div>
                                                <div style={styles.productInfo}>
                                                    <h3 style={styles.productName}>{item.name}</h3>
                                                    <div style={styles.priceContainer}>
                                                        <span style={styles.salePrice}>
                                                            {item.salePrice}
                                                            <span style={styles.salePriceHighlight}></span>
                                                        </span>
                                                        {item.originalPrice !== item.salePrice && (
                                                            <span style={styles.originalPrice}>{item.originalPrice}</span>
                                                        )}
                                                    </div>
                                                    <div className="view-button" style={styles.viewButton}>
                                                        Ver detalles
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M5 12h14M12 5l7 7-7 7"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </a>
                                        </Link>
                                    );
                                })}
                            </div>

                            {suggestedItems.length > (screenSize.isMobile ? 2 : screenSize.isTablet ? 3 : 4) && (
                                <>
                                    <button
                                        onClick={prevSlide}
                                        className="nav-button"
                                        style={{...styles.navButton, ...styles.prevButton}}
                                        aria-label="Anterior"
                                        onKeyDown={(e) => handleKeyDown(e, prevSlide)}
                                    >
                                        <ArrowBackIcon fontSize={screenSize.isMobile ? "small" : "medium"} />
                                    </button>

                                    <button
                                        onClick={nextSlide}
                                        className="nav-button"
                                        style={{...styles.navButton, ...styles.nextButton}}
                                        aria-label="Siguiente"
                                        onKeyDown={(e) => handleKeyDown(e, nextSlide)}
                                    >
                                        <ArrowForwardIcon fontSize={screenSize.isMobile ? "small" : "medium"} />
                                    </button>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default GenericSuggestedItemsCarousel;