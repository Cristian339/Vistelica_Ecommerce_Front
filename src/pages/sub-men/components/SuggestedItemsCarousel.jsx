'use client'
import React, { useState, useRef } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { GlobalStyles } from '@mui/material'; // Importamos GlobalStyles

const SuggestedItemsCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const carouselRef = useRef(null);

    // Datos de productos sugeridos
    const suggestedItems = [
        {
            id: 1,
            name: 'Sudadera capucha',
            originalPrice: '19,99 €',
            salePrice: '13,99 €',
            image: 'https://picsum.photos/200/300?random=6',
            category: 'tops',
            tag: '',
        },
        {
            id: 2,
            name: 'Pack sudadera y pantalón wide leg',
            originalPrice: '39,99 €',
            salePrice: '39,99 €',
            image: 'https://picsum.photos/200/300?random=7',
            category: 'sets',
            tag: 'EXCLUSIVO ONLINE',
        },
        {
            id: 3,
            name: 'Jeans super baggy',
            originalPrice: '29,99 €',
            salePrice: '14,99 €',
            image: 'https://picsum.photos/200/300?random=8',
            category: 'jeans',
            tag: '',
        },
        {
            id: 4,
            name: 'Chaleco puffy',
            originalPrice: '29,99 €',
            salePrice: '14,99 €',
            image: 'https://picsum.photos/200/300?random=9',
            category: 'tops',
            tag: '',
        },
        {
            id: 5,
            name: 'Sudadera cuello polo',
            originalPrice: '35,99 €',
            salePrice: '19,99 €',
            image: 'https://picsum.photos/200/300?random=11',
            category: 'tops',
            tag: '',
        },
        {
            id: 6,
            name: 'Chaqueta denim oversize',
            originalPrice: '45,99 €',
            salePrice: '29,99 €',
            image: 'https://picsum.photos/200/300?random=12',
            category: 'outerwear',
            tag: 'NUEVO',
        },
        {
            id: 7,
            name: 'Camiseta oversized print',
            originalPrice: '19,99 €',
            salePrice: '14,99 €',
            image: 'https://picsum.photos/200/300?random=13',
            category: 'tops',
            tag: '',
        },
    ];

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
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE
            gap: '1px',
        },
        // Eliminamos carouselTrackScrollbar que causaba el problema
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
        regularPrice: {
            fontWeight: 'bold',
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
            {/* Definimos los estilos globales para ocultar la scrollbar */}
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
                            <div key={item.id} style={styles.productCard}>
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
                            </div>
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