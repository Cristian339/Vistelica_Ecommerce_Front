'use client'
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

const Carousel = ({ images, title = "out of core", intervalTime = 3000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [touchStart, setTouchStart] = useState(0);
    const timerRef = useRef(null);

    // Detectar tamaño de pantalla para responsividad
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    // Precarga de imágenes para mejor rendimiento
    useEffect(() => {
        const loadImages = () => {
            const imagePromises = images.map(src => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = src;
                    img.onload = resolve;
                    img.onerror = reject;
                });
            });

            Promise.all(imagePromises)
                .then(() => setImagesLoaded(true))
                .catch(err => console.error("Error precargando imágenes:", err));
        };

        loadImages();
    }, [images]);

    // Actualizar dimensiones al redimensionar ventana
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const resetProgress = () => {
        setProgress(0);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };

    const startProgressBar = () => {
        resetProgress();
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

    // Controles táctiles para dispositivos móviles
    const handleTouchStart = (e) => {
        setTouchStart(e.touches[0].clientX);
    };

    const handleTouchEnd = (e) => {
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;

        if (diff > 50) {
            nextSlide();
        } else if (diff < -50) {
            prevSlide();
        }
    };

    // Navegación por teclado para accesibilidad
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    };

    useEffect(() => {
        if (imagesLoaded) {
            startProgressBar();

            const slideInterval = setInterval(() => {
                nextSlide();
            }, intervalTime);

            // Añadir controladores de eventos para navegación por teclado
            window.addEventListener('keydown', handleKeyDown);

            return () => {
                clearInterval(slideInterval);
                resetProgress();
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [imagesLoaded, intervalTime]);

    // Estilos responsivos memoizados para mejorar rendimiento
    const styles = useMemo(() => {
        const isSmall = windowSize.width < 768;
        const isMedium = windowSize.width < 1024;

        return {
            pageWrapper: {
                width: '100%',
                height: isSmall ? '50vh' : '70vh',
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
                transition: 'opacity 0.8s ease-in-out',
                display: 'none',
                willChange: 'opacity', // Optimización para rendimiento
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
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                pointerEvents: 'none',
                background: 'linear-gradient(0deg, rgba(35, 42, 46, 0.5) 0%, rgba(0, 0, 0, 0.2) 100%)',
            },
            titleContainer: {
                textAlign: 'center',
                padding: '0 1rem',
            },
            carouselTitle: {
                fontFamily:typography.fontFamily,
                fontSize: isSmall ? '2rem' : isMedium ? '3.5rem' : '5rem',
                color: vistelicaColors.tertiary,
                textTransform: 'uppercase',
                letterSpacing: isSmall ? '1px' : '3px',
                textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)',
                fontWeight: 600,
                position: 'relative',
                paddingBottom: isSmall ? '10px' : '15px',
                margin: 0,
                borderBottom: `3px solid ${vistelicaColors.primary}`,
            },
            subtitle: {
                fontFamily:typography.fontFamily,
                fontSize: isSmall ? '0.9rem' : '1.1rem',
                color: vistelicaColors.tertiary,
                marginTop: '0.8rem',
                fontWeight: 400,
                textShadow: '1px 1px 4px rgba(0, 0, 0, 0.7)',
                maxWidth: '800px',
                margin: '0.8rem auto 0',
                opacity: 0.9,
            },
            carouselControls: {
                position: 'absolute',
                bottom: isSmall ? '20px' : '60px',
                right: isSmall ? '10px' : '20px',
                display: 'flex',
                gap: isSmall ? '10px' : '15px'
            },
            controlButton: {
                background: 'rgba(35, 42, 46, 0.6)',
                border: `2px solid ${vistelicaColors.primary}`,
                color: vistelicaColors.tertiary,
                width: isSmall ? '36px' : '46px',
                height: isSmall ? '36px' : '46px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: isSmall ? '1rem' : '1.2rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                outline: 'none', // Añadiremos focus-visible con JS
            },
            progressBarContainer: {
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '100%',
                height: isSmall ? '3px' : '5px',
                background: 'rgba(255, 255, 255, 0.2)',
            },
            progressBar: {
                height: '100%',
                background: `linear-gradient(90deg, ${vistelicaColors.secondary}, ${vistelicaColors.primaryDark})`,
                transition: 'width 0.1s linear',
                boxShadow: '0 0 8px rgba(228, 176, 2, 0.5)',
            },
            indicators: {
                position: 'absolute',
                bottom: isSmall ? '15px' : '35px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: isSmall ? '8px' : '12px',
            },
            indicator: {
                width: isSmall ? '8px' : '10px',
                height: isSmall ? '8px' : '10px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: `1px solid ${vistelicaColors.quaternary}`,
                padding: 0,
            },
            activeIndicator: {
                background: vistelicaColors.primary,
                transform: 'scale(1.2)',
                boxShadow: '0 0 8px rgba(228, 176, 2, 0.6)',
            },
            loadingContainer: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                backgroundColor: vistelicaColors.secondary,
            },
            loadingSpinner: {
                width: '50px',
                height: '50px',
                border: `4px solid ${vistelicaColors.tertiary}`,
                borderRadius: '50%',
                borderTop: `4px solid ${vistelicaColors.primary}`,
                animation: 'spin 1s linear infinite',
            },
            srOnly: {
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: '0',
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                borderWidth: '0',
            }
        };
    }, [windowSize]);

    // Animación para el spinner de carga
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    if (!imagesLoaded) {
        return (
            <div style={styles.pageWrapper}>
                <div style={styles.loadingContainer}>
                    <div style={styles.loadingSpinner} aria-label="Cargando imágenes"></div>
                </div>
            </div>
        );
    }

    return (
        <div
            style={styles.pageWrapper}
            role="region"
            aria-label={`Carrusel de imágenes: ${title}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            tabIndex="0"
        >
            <div style={styles.carouselContainer}>
                {images.map((image, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.carouselSlide,
                            ...(index === currentIndex ? styles.activeSlide : {})
                        }}
                        aria-hidden={index !== currentIndex}
                    >
                        <img
                            src={image}
                            alt={`Imagen ${index + 1} de la colección ${title}`}
                            style={styles.carouselImage}
                            loading={index === 0 ? "eager" : "lazy"}
                        />
                    </div>
                ))}
                <div style={styles.carouselOverlay}>
                    <div style={styles.titleContainer}>
                        <h1 style={styles.carouselTitle}>{title}</h1>
                        <p style={styles.subtitle}>Descubre la nueva colección y las últimas tendencias en Vistelica.</p>
                    </div>
                </div>
                <div style={styles.carouselControls}>
                    <button
                        onClick={prevSlide}
                        style={styles.controlButton}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = vistelicaColors.primary;
                            e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(35, 42, 46, 0.6)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.boxShadow = `0 0 0 3px ${vistelicaColors.primaryLight}`;
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
                        }}
                        aria-label="Imagen anterior"
                    >
                        <span aria-hidden="true">❮</span>
                    </button>
                    <button
                        onClick={nextSlide}
                        style={styles.controlButton}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = vistelicaColors.primary;
                            e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(35, 42, 46, 0.6)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.boxShadow = `0 0 0 3px ${vistelicaColors.primaryLight}`;
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
                        }}
                        aria-label="Imagen siguiente"
                    >
                        <span aria-hidden="true">❯</span>
                    </button>
                </div>
                <div style={styles.indicators} role="tablist">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            style={{
                                ...styles.indicator,
                                ...(index === currentIndex ? styles.activeIndicator : {})
                            }}
                            onClick={() => {
                                setCurrentIndex(index);
                                startProgressBar();
                            }}
                            aria-label={`Ir a la imagen ${index + 1}`}
                            aria-selected={index === currentIndex}
                            role="tab"
                        />
                    ))}
                </div>
                <div style={styles.progressBarContainer} aria-hidden="true">
                    <div
                        style={{
                            ...styles.progressBar,
                            width: `${progress}%`,
                        }}
                    />
                </div>
                <div style={styles.srOnly} aria-live="polite">
                    {`Imagen ${currentIndex + 1} de ${images.length}: ${title}`}
                </div>
            </div>
        </div>
    );
};

// Memorizar componente para evitar renders innecesarios
export default React.memo(Carousel);
