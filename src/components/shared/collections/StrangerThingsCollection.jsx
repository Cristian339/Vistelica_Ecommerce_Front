'use client';
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Image from 'next/image';
import { vistelicaColors } from '@/components/shared/vistelicaColors';
import { typography } from "@/components/shared/themePrimitives";

const StrangerThingsCollection = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [glitchEffect, setGlitchEffect] = useState(false);
    const [vhsPosition, setVhsPosition] = useState(50);
    const [clientSideRendered, setClientSideRendered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const buttonRef = useRef(null);
    const sectionRef = useRef(null);
    const prefersReducedMotion = typeof window !== 'undefined' ?
        window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

    // Memoizar colores para prevenir recálculos
    const stColors = useMemo(() => ({
        background: '#1A0315',
        title: '#E62C2F',
        gradientStart: '#1A0315',
        gradientEnd: '#500A3C',
        buttonHover: vistelicaColors.accent,
        lightRed: '#FF4A5F',
    }), []);

    // Detector de tamaño de pantalla optimizado con debounce
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();

        let timeoutId;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(checkMobile, 150);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Efectos visuales y animaciones - optimizados con RAF y preferencias de usuario
    useEffect(() => {
        setClientSideRendered(true);

        if (prefersReducedMotion) {
            setIsVisible(true);
            return;
        }

        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        // Optimizar efectos de glitch con debounce
        let glitchTimeoutId;
        const glitchInterval = setInterval(() => {
            setGlitchEffect(true);
            glitchTimeoutId = setTimeout(() => setGlitchEffect(false), 200);
        }, 5000);

        // VHS scan optimizado con RAF
        let lastTime = 0;
        let vhsTimerId;

        const updateVhsPosition = (timestamp) => {
            if (timestamp - lastTime > 2000) {
                setVhsPosition(Math.random() * 100);
                lastTime = timestamp;
            }
            vhsTimerId = requestAnimationFrame(updateVhsPosition);
        };

        if (!prefersReducedMotion) {
            vhsTimerId = requestAnimationFrame(updateVhsPosition);
        }

        // Observador de intersección para cargar animaciones solo cuando esté visible
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            clearTimeout(timer);
            clearTimeout(glitchTimeoutId);
            clearInterval(glitchInterval);
            cancelAnimationFrame(vhsTimerId);
            observer.disconnect();
        };
    }, [prefersReducedMotion]);

    // Manejadores de eventos memoizados
    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            buttonRef.current?.click();
        }
    }, []);

    // Generación determinista de líneas plásticas memoizada
    const plasticLines = useMemo(() => {
        const lines = [];
        for (let i = 0; i < (isMobile ? 10 : 20); i++) {
            lines.push({
                height: '1px',
                width: `${(i * 5) % 100}%`,
                left: `${(i * 4) % 100}%`,
                top: `${(i * 5) % 100}%`,
                transform: `rotate(${i * 18}deg)`,
                position: 'absolute',
                backgroundColor: stColors.title,
                opacity: 0.4,
                willChange: prefersReducedMotion ? 'auto' : 'opacity',
            });
        }
        return lines;
    }, [stColors.title, isMobile, prefersReducedMotion]);

    // Estilos optimizados y memoizados
    const styles = useMemo(() => ({
        container: {
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            maxWidth: '1400px',
            margin: '0 auto 2rem',
            boxShadow: '0 15px 35px rgba(0,0,0,0.25)',
            borderRadius: isMobile ? '12px' : '16px',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: prefersReducedMotion ? 'none' : 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        },
        mainContainer: {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: stColors.background,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            borderRadius: isMobile ? '12px' : '16px',
        },
        contentWrapper: {
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            flexWrap: isMobile ? 'nowrap' : 'wrap',
            width: '100%',
        },
        imageSection: {
            position: 'relative',
            width: '100%',
            height: isMobile ? '450px' : '500px', // Aumenté la altura en móviles para mejor visibilidad
            flex: isMobile ? '1 1 auto' : '1 1 60%',
            minWidth: '300px',
            backgroundColor: stColors.background,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: isMobile ?
                '12px 12px 0 0' :
                '16px 0 0 16px',
        },
        blueBackground: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.7,
            zIndex: 1,
            background: `linear-gradient(135deg, ${stColors.gradientStart} 0%, ${stColors.gradientEnd} 100%)`,
        },
        glitchOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 4,
            backgroundColor: 'rgba(255,0,0,0.05)',
            mixBlendMode: 'overlay',
            opacity: glitchEffect ? 1 : 0,
            transition: prefersReducedMotion ? 'none' : 'opacity 0.1s ease',
            willChange: prefersReducedMotion ? 'auto' : 'opacity',
        },
        scanlines: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 2px)',
            backgroundSize: '100% 2px',
            zIndex: 3,
            opacity: 0.5,
            pointerEvents: 'none',
            willChange: prefersReducedMotion ? 'auto' : 'opacity',
        },
        plasticWrapEffect: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0.2,
            zIndex: 2,
        },
        artist: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
            transition: prefersReducedMotion ? 'none' : 'transform 0.8s ease',
            transform: (isHovered || isFocused) ? 'scale(1.05)' : 'scale(1)',
            filter: glitchEffect ? 'hue-rotate(10deg) contrast(1.2)' : 'none',
            willChange: prefersReducedMotion ? 'auto' : 'transform',
        },
        textSection: {
            padding: isMobile ? '2.5rem 0.5rem' : '3.5rem 3rem', // Ajusté el padding para centrar mejor en móviles
            flex: '1 1 40%',
            minWidth: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 10,
            background: `linear-gradient(160deg, ${stColors.background} 0%, #2A0523 100%)`,
            borderRadius: isMobile ?
                '0 0 12px 12px' :
                '0 16px 16px 0',
            position: 'relative',
            overflow: 'hidden',
        },
        noiseOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            opacity: 0.05,
            mixBlendMode: 'overlay',
            zIndex: 1,
        },
        vhsEffect: {
            position: 'absolute',
            top: '50%',
            left: '0',
            width: '100%',
            height: '3px',
            background: 'rgba(255,255,255,0.3)',
            zIndex: 20,
            opacity: 0.4,
            willChange: prefersReducedMotion ? 'auto' : 'top',
        },
        artistName: {
            fontSize: isMobile ? '2.4rem' : '2.8rem',
            fontWeight: 'bold',
            color: stColors.title,
            marginBottom: '0.5rem',
            lineHeight: '1.1',
            textTransform: 'uppercase',
            fontFamily: typography.fontFamily,
            letterSpacing: '2px',
            marginTop: '0',
            textShadow: (isHovered || isFocused) ?
                '0 0 10px rgba(230,44,47,0.7), 0 0 20px rgba(230,44,47,0.5)' :
                '2px 2px 4px rgba(0,0,0,0.5)',
            transition: prefersReducedMotion ? 'none' : 'text-shadow 0.3s ease',
            position: 'relative',
            zIndex: 5,
            transform: glitchEffect ? 'translateX(3px)' : 'translateX(0)',
            width: '100%',
            maxWidth: isMobile ? '280px' : '400px',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'center',
        },
        tourName: {
            fontSize: isMobile ? '1.6rem' : '1.8rem',
            fontWeight: 'bold',
            color: stColors.title,
            marginBottom: '1.2rem',
            lineHeight: '1.2',
            textTransform: 'uppercase',
            fontFamily: typography.fontFamily,
            textShadow: '1px 1px 3px rgba(0,0,0,0.4)',
            position: 'relative',
            paddingBottom: '0.8rem',
            zIndex: 5,
            transform: glitchEffect ? 'translateX(-2px)' : 'translateX(0)',
            width: '100%',
            maxWidth: isMobile ? '280px' : '400px',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'center',
        },
        tourNameUnderline: {
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '2px',
            backgroundColor: stColors.title,
            opacity: 0.6,
        },
        promoText: {
            fontSize: isMobile ? '1rem' : '1.1rem',
            margin: '1.2rem auto',
            lineHeight: '1.6',
            fontFamily: typography.fontFamily,
            color: 'rgba(255,255,255,0.85)',
            width: '100%',
            maxWidth: isMobile ? '280px' : '400px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            letterSpacing: '0.5px',
            position: 'relative',
            zIndex: 5,
            textAlign: 'center',
        },
        button: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? '12px 24px' : '14px 28px',
            borderRadius: '50px',
            backgroundColor: 'white',
            color: stColors.background,
            border: 'none',
            cursor: 'pointer',
            fontSize: isMobile ? '0.95rem' : '1rem',
            marginTop: '1.5rem',
            transition: prefersReducedMotion ? 'none' : 'all 0.3s ease',
            fontFamily: typography.fontFamily,
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(230,44,47,0.3)',
            position: 'relative',
            overflow: 'hidden',
            zIndex: 5,
            outline: isFocused ? `3px solid ${stColors.title}` : 'none',
            outlineOffset: '3px',
            touchAction: 'manipulation',
            maxWidth: isMobile ? '280px' : 'none',
            width: isMobile ? '100%' : 'auto',
        },
        buttonHovered: {
            backgroundColor: stColors.title,
            color: 'white',
            transform: prefersReducedMotion ? 'none' : 'translateY(-3px)',
            boxShadow: '0 6px 16px rgba(230,44,47,0.5)',
        },
        buttonBefore: {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: (isHovered || isFocused) ? '100%' : '0%',
            height: '100%',
            backgroundColor: stColors.title,
            transition: prefersReducedMotion ? 'none' : 'width 0.3s ease',
            zIndex: -1,
        },
        buttonIcon: {
            marginLeft: '10px',
            transition: prefersReducedMotion ? 'none' : 'transform 0.3s ease',
            transform: (isHovered || isFocused) ? 'translateX(4px)' : 'translateX(0)',
            position: 'relative',
            zIndex: 2,
        },
        releaseDateBadge: {
            position: 'absolute',
            top: '20px',
            right: '20px',
            backgroundColor: stColors.title,
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            fontFamily: typography.fontFamily,
            zIndex: 15,
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
        },
        calendarIcon: {
            marginRight: '6px',
            width: '16px',
            height: '16px',
        },
        strangerFlicker: {
            animation: !prefersReducedMotion && glitchEffect ? 'flicker 0.2s ease infinite' : 'none',
        },
        decorativeCorner: {
            position: 'absolute',
            width: '50px',
            height: '50px',
            borderStyle: 'solid',
            borderColor: 'rgba(230,44,47,0.5)',
            borderWidth: '0',
            zIndex: 4,
        },
        cornerTopRight: {
            top: '20px',
            right: '20px',
            borderTopWidth: '2px',
            borderRightWidth: '2px',
        },
        cornerBottomLeft: {
            bottom: '20px',
            left: '20px',
            borderBottomWidth: '2px',
            borderLeftWidth: '2px',
        },
        // Estilos específicos para accesibilidad y foco
        srOnly: {
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            borderWidth: 0
        }
    }), [isHovered, isFocused, isVisible, glitchEffect, stColors, isMobile, prefersReducedMotion]);

    return (
        <section
            aria-labelledby="collection-title"
            className="stranger-things-collection"
            style={styles.container}
            ref={sectionRef}
        >
            <div style={{...styles.mainContainer, width: '100%'}}>
                <div style={styles.contentWrapper}>
                    {/* Sección de imagen (izquierda o superior en móvil) */}
                    <div
                        style={styles.imageSection}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        role="img"
                        aria-label="Imagen promocional de la colección Stranger Things mostrando ropa inspirada en la serie"
                    >
                        {/* Fondo con efecto de gradiente */}
                        <div style={styles.blueBackground}></div>

                        {/* Efecto de plástico */}
                        <div style={styles.plasticWrapEffect}>
                            {plasticLines.map((lineStyle, index) => (
                                <div key={index} style={lineStyle} aria-hidden="true"></div>
                            ))}
                        </div>

                        {/* Líneas de escaneo */}
                        <div style={styles.scanlines} aria-hidden="true"></div>

                        {/* Imagen principal optimizada */}
                        <div style={styles.artist}>
                            {clientSideRendered && (
                                <Image
                                    src="https://res.cloudinary.com/dhyv4dpk2/image/upload/v1747850681/vistelica/subcategorias/Chica/dutqii5vmisykfo7br45.jpg"
                                    alt="Colección de ropa Stranger Things"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 60vw"
                                    priority
                                    style={{
                                        objectFit: 'cover',
                                        objectPosition: 'center',
                                        zIndex: 5
                                    }}
                                    loading="eager"
                                />
                            )}
                        </div>

                        {/* Efecto de glitch */}
                        <div style={styles.glitchOverlay} aria-hidden="true"></div>

                        {/* Efecto de línea VHS */}
                        <div
                            style={{
                                ...styles.vhsEffect,
                                top: clientSideRendered ? `${vhsPosition}%` : '50%',
                            }}
                            aria-hidden="true"
                        ></div>

                        {/* Badge de fecha */}
                        <div
                            style={styles.releaseDateBadge}
                            role="status"
                            aria-label="Disponible el 20 de julio"
                        >
                            <svg style={styles.calendarIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            20/07
                        </div>
                    </div>

                    {/* Sección de texto (derecha o inferior en móvil) */}
                    <div style={styles.textSection}>
                        {/* Overlay de ruido */}
                        <div style={styles.noiseOverlay} aria-hidden="true"></div>

                        {/* Decoraciones */}
                        <div style={{...styles.decorativeCorner, ...styles.cornerTopRight}} aria-hidden="true"></div>
                        <div style={{...styles.decorativeCorner, ...styles.cornerBottomLeft}} aria-hidden="true"></div>

                        {/* Título principal con ID para accesibilidad */}
                        <h2
                            id="collection-title"
                            style={{...styles.artistName, ...styles.strangerFlicker}}
                        >
                            Stranger<br />Things
                        </h2>

                        {/* Subtítulo de colección */}
                        <h3 style={styles.tourName}>
                            Colección<br />Exclusiva
                            <span style={styles.tourNameUnderline} aria-hidden="true"></span>
                        </h3>

                        {/* Texto promocional */}
                        <p style={styles.promoText}>
                            Descubre nuestra colección exclusiva<br />
                            Stranger Things disponible el 20/07 en nuestra tienda
                        </p>

                        {/* Botón CTA con accesibilidad mejorada */}
                        <button
                            ref={buttonRef}
                            style={{
                                ...styles.button,
                                ...((isHovered || isFocused) ? styles.buttonHovered : {})
                            }}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            onKeyDown={handleKeyPress}
                            aria-label="Explorar productos de la colección Stranger Things"
                        >
                            <div style={styles.buttonBefore} aria-hidden="true"></div>
                            <span style={{
                                position: 'relative',
                                zIndex: 2,
                                color: (isHovered || isFocused) ? 'white' : stColors.background
                            }}>
                                Explorar productos
                                <svg
                                    style={styles.buttonIcon}
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Estilos CSS con soporta para prefers-reduced-motion */}
            <style jsx global>{`
                @media (prefers-reduced-motion: no-preference) {
                    @keyframes vhsScan {
                        0% { top: -10px; }
                        100% { top: 100%; }
                    }
                    @keyframes flicker {
                        0% { opacity: 1; }
                        50% { opacity: 0.8; }
                        100% { opacity: 1; }
                    }
                }

                .stranger-things-collection:focus-within {
                    outline: 2px solid ${stColors.title};
                    outline-offset: 4px;
                }
            `}</style>
        </section>
    );
};

export default StrangerThingsCollection;