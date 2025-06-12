'use client';
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Image from 'next/image';
import { vistelicaColors } from '@/components/shared/vistelicaColors';
import { typography } from "@/components/shared/themePrimitives";

const GenericCollectionPreview = ({
                                      // Props personalizables
                                      name,
                                      subname,
                                      description,
                                      imageUrl,
                                      releaseDate,

                                      // Colores
                                      mainColor = vistelicaColors.primary,
                                      accentColor = vistelicaColors.secondary,
                                      hoverColor = vistelicaColors.accent,

                                      // Opciones adicionales
                                      imageLeft = true,
                                      labelText = 'Productos',

                                      // Imagen y gradiente
                                      gradientStart = vistelicaColors.primary,
                                      gradientEnd = vistelicaColors.secondary,
                                      lineColor = vistelicaColors.accent,

                                      // Callback opcional
                                      onExploreClick
                                  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [animation, setAnimation] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const buttonRef = useRef(null);
    const containerRef = useRef(null);

    // Detectar preferencias de usuario
    const prefersReducedMotion = typeof window !== 'undefined' ?
        window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

    // Efecto para detectar cliente y tamaño de pantalla
    useEffect(() => {
        setIsClient(true);

        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();

        // Debounce para el evento resize
        let timeoutId;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(checkMobile, 100);
        };

        window.addEventListener('resize', handleResize);

        // Animar el componente al montarse con menor intensidad si el usuario prefiere reducir el movimiento
        const timer = setTimeout(() => {
            setAnimation(true);
        }, prefersReducedMotion ? 0 : 100);

        // Usar intersection observer para animar solo cuando sea visible
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setAnimation(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            clearTimeout(timer);
            clearTimeout(timeoutId);
            window.removeEventListener('resize', handleResize);
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

    const handleFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
    }, []);

    const handleExploreClick = useCallback((e) => {
        if (onExploreClick) {
            onExploreClick(e);
        }
    }, [onExploreClick]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleExploreClick(e);
        }
    }, [handleExploreClick]);

    // Generar líneas plásticas de manera determinista para SSR
    const plasticLines = useMemo(() => {
        const lines = [];
        const linesCount = isMobile ? 10 : 20;

        for (let i = 0; i < linesCount; i++) {
            lines.push({
                height: '1px',
                width: `${(i * 5) % 100}%`,  // Determinista
                left: `${(i * 4) % 100}%`,   // Determinista
                top: `${(i * 5) % 100}%`,    // Determinista
                transform: `rotate(${i * 18}deg)`,  // Determinista (360/20)
                position: 'absolute',
                backgroundColor: lineColor,
                opacity: 0.4,
            });
        }
        return lines;
    }, [lineColor, isMobile]);

    // Estilos responsivos memoizados
    const styles = useMemo(() => ({
        container: {
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            maxWidth: '1400px',
            margin: '0 auto 2rem',
            boxShadow: '0 15px 35px rgba(0,0,0,0.18)',
            borderRadius: '16px',
            opacity: animation ? 1 : 0,
            transform: animation ? 'translateY(0)' : 'translateY(20px)',
            transition: prefersReducedMotion ? 'opacity 0.3s ease' : 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        },
        mainContainer: {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: mainColor,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            borderRadius: '16px',
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
            height: isMobile ? '450px' : '500px', // Aumentado para móviles
            flex: isMobile ? '1 1 auto' : '1 1 60%',
            minWidth: isMobile ? '100%' : '300px',
            backgroundColor: mainColor,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            order: isMobile ? 1 : (imageLeft ? 1 : 2),
            borderRadius: isMobile ? '16px 16px 0 0' : (imageLeft ? '16px 0 0 16px' : '0 16px 16px 0'),
            willChange: 'transform',
            touchAction: 'manipulation',
        },
        gradient: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.7,
            zIndex: 1,
            background: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
        },
        plasticWrapEffect: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0.2,
            zIndex: 2,
            pointerEvents: 'none',
        },
        imageContainer: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
            transition: prefersReducedMotion ? 'none' : 'transform 0.8s ease',
            transform: (isHovered || isFocused) && !prefersReducedMotion ? 'scale(1.05)' : 'scale(1)',
            willChange: 'transform',
        },
        textSection: {
            padding: isMobile ? '2.5rem 0.5rem' : '3.5rem 3rem',
            flex: '1 1 40%',
            minWidth: isMobile ? '100%' : '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 10,
            order: isMobile ? 2 : (imageLeft ? 2 : 1),
            background: vistelicaColors.backgroundLight,
            borderRadius: isMobile ? '0 0 16px 16px' : (imageLeft ? '0 16px 16px 0' : '16px 0 0 16px'),
            position: 'relative',
        },
        decorativeLine: {
            position: 'absolute',
            [isMobile ? 'top' : (imageLeft ? 'left' : 'right')]: 0,
            [isMobile ? 'left' : 'top']: '50%',
            transform: isMobile ? 'translateX(-50%)' : 'translateY(-50%)',
            width: isMobile ? '60%' : '3px',
            height: isMobile ? '3px' : '60%',
            background: isMobile
                ? `linear-gradient(to right, transparent, ${accentColor}, transparent)`
                : `linear-gradient(to bottom, transparent, ${accentColor}, transparent)`,
            display: prefersReducedMotion ? 'none' : 'block',
        },
        title: {
            fontSize: isMobile ? '2.2rem' : '2.8rem',
            fontWeight: 'bold',
            color: accentColor,
            marginBottom: '0.5rem',
            lineHeight: '1.1',
            textTransform: 'uppercase',
            fontFamily: typography.fontFamily,
            letterSpacing: '1px',
            marginTop: '0',
            textShadow: '1px 1px 3px rgba(0,0,0,0.2)',
            position: 'relative',
            display: 'inline-block',
            textAlign: 'center',
            width: '100%',
            maxWidth: isMobile ? '280px' : '400px',
        },
        subtitle: {
            fontSize: isMobile ? '1.5rem' : '1.8rem',
            fontWeight: 'bold',
            color: accentColor,
            marginBottom: '1.2rem',
            lineHeight: '1.2',
            textTransform: 'uppercase',
            fontFamily: typography.fontFamily,
            position: 'relative',
            paddingBottom: '0.8rem',
            textAlign: 'center',
            width: '100%',
            maxWidth: isMobile ? '280px' : '400px',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        subtitleUnderline: {
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '2px',
            backgroundColor: accentColor,
            opacity: 0.6,
        },
        label: {
            fontSize: '1.2rem',
            color: vistelicaColors.tertiary,
            marginBottom: labelText ? '1.6rem' : '0',
            textTransform: 'uppercase',
            display: labelText ? 'block' : 'none',
            fontFamily: typography.fontFamily,
            letterSpacing: '0.5px',
            position: 'relative',
            paddingBottom: '10px',
            textAlign: 'center',
            width: '100%',
        },
        description: {
            fontSize: '1.1rem',
            margin: '1.2rem 0',
            lineHeight: '1.6',
            color: vistelicaColors.textDark,
            fontFamily: typography.fontFamily,
            maxWidth: isMobile ? '280px' : '400px',
            opacity: 0.85,
            textAlign: 'center',
            width: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        button: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? '12px 24px' : '14px 28px',
            borderRadius: '50px',
            backgroundColor: mainColor,
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            marginTop: '1.5rem',
            transition: prefersReducedMotion ? 'background-color 0.3s' : 'all 0.3s ease',
            fontFamily: typography.fontFamily,
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            position: 'relative',
            overflow: 'hidden',
            zIndex: 1,
            minWidth: isMobile ? '200px' : 'auto',
            touchAction: 'manipulation',
            outline: (isFocused && !isHovered) ? `3px solid ${accentColor}` : 'none',
            outlineOffset: '2px',
        },
        buttonHovered: {
            transform: prefersReducedMotion ? 'none' : 'translateY(-3px)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
        },
        buttonBefore: {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: (isHovered || isFocused) ? '100%' : '0%',
            height: '100%',
            backgroundColor: hoverColor,
            transition: prefersReducedMotion ? 'none' : 'width 0.3s ease',
            zIndex: -1,
        },
        buttonIcon: {
            marginLeft: '10px',
            transition: prefersReducedMotion ? 'none' : 'transform 0.3s ease',
            transform: (isHovered || isFocused) && !prefersReducedMotion ? 'translateX(4px)' : 'translateX(0)',
        },
        releaseDateBadge: {
            position: 'absolute',
            top: '20px',
            right: '20px',
            backgroundColor: accentColor,
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            fontFamily: typography.fontFamily,
            zIndex: 15,
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            display: releaseDate ? 'flex' : 'none',
            alignItems: 'center',
        },
        calendarIcon: {
            marginRight: '6px',
            width: '16px',
            height: '16px',
        },
        shineEffect: {
            position: 'absolute',
            top: '0',
            left: (isHovered || isFocused) && !prefersReducedMotion ? '120%' : '-100%',
            width: '50px',
            height: '100%',
            background: 'rgba(255,255,255,0.3)',
            transform: 'skewX(-25deg)',
            transition: prefersReducedMotion ? 'none' : 'left 0.8s ease',
            pointerEvents: 'none',
        },
        activeDot: {
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'white',
        },
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
    }), [animation, isHovered, isFocused, isMobile, prefersReducedMotion, imageLeft, mainColor,
        accentColor, hoverColor, gradientStart, gradientEnd, labelText, releaseDate]);

    return (
        <section
            ref={containerRef}
            className="collection-preview"
            style={styles.container}
            aria-labelledby="collection-title"
        >
            <div style={{...styles.mainContainer, width: '100%'}}>
                <div style={styles.contentWrapper}>
                    {/* Sección de la imagen */}
                    <div
                        style={styles.imageSection}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        tabIndex="0"
                        role="img"
                        aria-label={`Imagen de colección: ${name} - ${subname}`}
                    >
                        {/* Fondo con gradiente */}
                        <div style={styles.gradient} aria-hidden="true"></div>

                        {/* Efecto decorativo de líneas */}
                        <div style={styles.plasticWrapEffect} aria-hidden="true">
                            {plasticLines.map((lineStyle, index) => (
                                <div key={index} style={lineStyle}></div>
                            ))}
                        </div>

                        {/* Imagen principal */}
                        <div style={styles.imageContainer}>
                            {isClient ? (
                                <Image
                                    src={imageUrl}
                                    alt={`${name} - ${subname}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 60vw"
                                    priority
                                    style={{
                                        objectFit: 'cover',
                                        objectPosition: 'center',
                                        zIndex: 5
                                    }}
                                />
                            ) : (
                                <img
                                    src={imageUrl}
                                    alt={`${name} - ${subname}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        objectPosition: 'center',
                                        zIndex: 5
                                    }}
                                />
                            )}
                            <div style={styles.shineEffect} aria-hidden="true"></div>
                        </div>

                        {/* Badge de fecha de lanzamiento */}
                        {releaseDate && (
                            <div style={styles.releaseDateBadge} role="text" aria-label={`Disponible el ${releaseDate}`}>
                                <svg style={styles.calendarIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                {releaseDate}
                            </div>
                        )}

                        {/* Indicadores de slider (decorativos) */}
                        <div style={styles.dots} aria-hidden="true">
                            <div style={styles.activeDot}></div>
                            <div style={styles.dot}></div>
                            <div style={styles.dot}></div>
                        </div>
                    </div>

                    {/* Sección de texto */}
                    <div style={styles.textSection}>
                        <div style={styles.decorativeLine} aria-hidden="true"></div>

                        {/* Título principal (nombre) */}
                        <h2 id="collection-title" style={styles.title}>
                            {name.split(' ').length > 1
                                ? <>
                                    {name.split(' ')[0]}<br />{name.split(' ').slice(1).join(' ')}
                                </>
                                : name}
                        </h2>

                        {/* Subtítulo */}
                        <h3 style={styles.subtitle}>
                            {subname.split(' ').length > 2
                                ? <>
                                    {subname.split(' ').slice(0, 2).join(' ')}<br />
                                    {subname.split(' ').slice(2).join(' ')}
                                </>
                                : subname}
                            <span style={styles.subtitleUnderline} aria-hidden="true"></span>
                        </h3>

                        {/* Etiqueta opcional */}
                        {labelText && <p style={styles.label}>{labelText}</p>}

                        {/* Texto descriptivo */}
                        <p style={styles.description}>
                            {description}<br />
                            {releaseDate ? `Disponible el ${releaseDate} en nuestra tienda.` : ''}
                        </p>

                        {/* Botón CTA */}
                        <button
                            ref={buttonRef}
                            style={{
                                ...styles.button,
                                ...(isHovered || isFocused ? styles.buttonHovered : {})
                            }}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            onClick={handleExploreClick}
                            onKeyDown={handleKeyDown}
                            aria-label={`Explorar productos de ${name}`}
                        >
                            <div style={styles.buttonBefore} aria-hidden="true"></div>
                            <span style={{position: 'relative', zIndex: 2, color: (isHovered || isFocused) ? 'white' : 'inherit'}}>
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
        </section>
    );
};

export default GenericCollectionPreview;