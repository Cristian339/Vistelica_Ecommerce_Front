'use client'
import React, { useState, useEffect, useRef } from 'react';

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const intervalTime = 3000; // 3 segundos para cada imagen
    const timerRef = useRef(null);

    // Usando Unsplash Source API para imágenes de moda/streetwear
    const images = [
        'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1747774818/vistelica/subcategorias/Mujer/carrusel/cikyohy8jbkik5vrvr9n.jpg',
        'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1747774817/vistelica/subcategorias/Mujer/carrusel/n9isocddswxwor133sbz.jpg',
        'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1747774817/vistelica/subcategorias/Mujer/carrusel/vgccp1ydgvfnaitfxoqc.jpg',
        'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1747774817/vistelica/subcategorias/Mujer/carrusel/rakrbhwoxzrb8dmrvdla.jpg',
    ];

    const resetProgress = () => {
        setProgress(0);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };

    const startProgressBar = () => {
        resetProgress();
        // Incrementamos el progreso cada 30ms (para suavidad)
        const increment = 100 / (intervalTime / 30);
        timerRef.current = setInterval(() => {
            setProgress(prevProgress => {
                if (prevProgress >= 100) {
                    return 0;
                }
                return prevProgress + increment;
            });
        }, 30);
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
        startProgressBar();
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
        startProgressBar();
    };

    useEffect(() => {
        // Iniciar la barra de progreso en el montaje
        startProgressBar();

        // Configurar temporizador para cambiar de slide
        const slideInterval = setInterval(() => {
            nextSlide();
        }, intervalTime);

        return () => {
            clearInterval(slideInterval);
            resetProgress();
        };
    }, []);

    // Estilos CSS en línea
    const styles = {
        pageWrapper: {
            width: '100vw',
            height: '70vh',
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
            overflow: 'hidden',
            position: 'relative',
        },
        carouselContainer: {
            position: 'relative',
            width: '100%',
            height: '100%',
            margin: 0,
            padding: 0,
            overflow: 'hidden'
        },
        carouselSlide: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            transition: 'opacity 0.5s ease-in-out',
            display: 'none',
        },
        activeSlide: {
            opacity: 1,
            display: 'block',
        },
        carouselImage: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
        },
        carouselOverlay: {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none'
        },
        carouselTitle: {
            fontFamily: 'Arial, sans-serif',
            fontSize: '5rem',
            color: 'white',
            textTransform: 'lowercase',
            letterSpacing: '2px',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
        },
        carouselControls: {
            position: 'absolute',
            bottom: '60px', // Ajustado para dar espacio a la barra de progreso
            right: '20px',
            display: 'flex',
            gap: '10px'
        },
        controlButton: {
            background: 'rgba(255, 255, 255, 0.3)',
            border: 'none',
            color: 'white',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1.2rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'background 0.3s ease'
        },
        progressBarContainer: {
            position: 'absolute',
            bottom: '20px',
            left: '0',
            width: '100%',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.2)',
        },
        progressBar: {
            height: '100%',
            background: 'white',
            transition: 'width 0.1s linear',
        },
        indicators: {
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '10px',
        },
        indicator: {
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.3)',
            cursor: 'pointer',
        },
        activeIndicator: {
            background: 'white',
        }
    };

    // Para que funcione correctamente, necesitamos añadir algunos estilos globales
    useEffect(() => {
        // Agregar estilos globales para asegurar que el carrusel ocupe toda la pantalla
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';

        // Limpiar estilos al desmontar el componente
        return () => {
            document.body.style.margin = '';
            document.body.style.padding = '';
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.carouselContainer}>
                {images.map((image, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.carouselSlide,
                            ...(index === currentIndex ? styles.activeSlide : {})
                        }}
                    >
                        <img
                            src={image}
                            alt={`Fashion item ${index + 1}`}
                            style={styles.carouselImage}
                        />
                    </div>
                ))}
                <div style={styles.carouselOverlay}>
                    <h1 style={styles.carouselTitle}>out of core</h1>
                </div>
                <div style={styles.carouselControls}>
                    <button onClick={prevSlide} style={styles.controlButton}>❮</button>
                    <button onClick={nextSlide} style={styles.controlButton}>❯</button>
                </div>
                <div style={styles.indicators}>
                    {images.map((_, index) => (
                        <div
                            key={index}
                            style={{
                                ...styles.indicator,
                                ...(index === currentIndex ? styles.activeIndicator : {})
                            }}
                            onClick={() => {
                                setCurrentIndex(index);
                                startProgressBar();
                            }}
                        />
                    ))}
                </div>
                <div style={styles.progressBarContainer}>
                    <div
                        style={{
                            ...styles.progressBar,
                            width: `${progress}%`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Carousel;