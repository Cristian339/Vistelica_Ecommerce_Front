'use client';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styleService from '@/services/styleService';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Grid from '@mui/material/Grid';
import StyleIcon from '@mui/icons-material/Style';
import InstagramIcon from '@mui/icons-material/Instagram';
import Chip from '@mui/material/Chip';
import useMediaQuery from '@mui/material/useMediaQuery';
import Pagination from '@mui/material/Pagination';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import IconButton from '@mui/material/IconButton';

const GenericStylesShowcase = ({ categoryId }) => {
    const [styles, setStyles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();
    const isMobile = useMediaQuery('(max-width:600px)');
    const isTablet = useMediaQuery('(max-width:900px)');
    const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

    // Mostrar solo 2 elementos por página en móvil y tablet, 4 en otros dispositivos
    const itemsPerPage = useMemo(() => isMobile || isTablet ? 2 : 4, [isMobile, isTablet]);
    const totalPages = useMemo(() => Math.ceil(styles.length / itemsPerPage), [styles.length, itemsPerPage]);

    // Obtener solo los estilos para la página actual (memoizado)
    const currentStyles = useMemo(() =>
            styles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
        [styles, currentPage, itemsPerPage]
    );

    // Etiquetas de tendencias traducidas
    const trendLabels = useMemo(() => ['TENDENCIA', 'NUEVO', 'DESTACADO', 'EXCLUSIVO'], []);

    useEffect(() => {
        const fetchStyles = async () => {
            try {
                setLoading(true);
                const data = await styleService.getStylesByCategoryId(categoryId);
                const mapped = data.map(style => {
                    const mainImage = style.styleImages?.find(img => img.is_main);
                    return {
                        id: style.style_id,
                        name: style.name,
                        description: style.description,
                        image: mainImage?.image_url || 'https://via.placeholder.com/300x400?text=No+Image'
                    };
                });
                setStyles(mapped);
            } catch (error) {
                console.error('Error al cargar estilos:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStyles();
    }, [categoryId]);

    const handleStyleClick = useCallback((styleId) => {
        if (!styleId) return;
        router.push(`/style/page?id=${styleId}`);
    }, [router]);

    const handlePageChange = useCallback((event, value) => {
        setCurrentPage(value);
        setHoveredIndex(null);

        const stylesGrid = document.getElementById('styles-grid');
        if (stylesGrid) {
            window.scrollTo({
                top: stylesGrid.offsetTop - 100,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        }
    }, [prefersReducedMotion]);

    const handlePrevPage = useCallback(() => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            setHoveredIndex(null);
        }
    }, [currentPage]);

    const handleNextPage = useCallback(() => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
            setHoveredIndex(null);
        }
    }, [currentPage, totalPages]);

    // Efecto para animaciones de fondo optimizadas
    useEffect(() => {
        if (prefersReducedMotion) return;

        const elementCount = isMobile ? 10 : isTablet ? 15 : 25;

        const createAnimatedBg = () => {
            const container = document.getElementById('animated-bg-container');
            if (!container) return;

            container.innerHTML = '';

            for (let i = 0; i < elementCount; i++) {
                const element = document.createElement('div');
                element.className = 'animated-bg-element';
                element.setAttribute('aria-hidden', 'true');

                const posX = Math.random() * 100;
                const posY = Math.random() * 100;
                const size = 30 + Math.random() * 50;
                const opacity = 0.05 + Math.random() * 0.2;
                const duration = 20 + Math.random() * 40;

                element.style.cssText = `
                    position: absolute;
                    top: ${posY}%;
                    left: ${posX}%;
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: ${Math.random() > 0.6 ? '50%' : Math.random() > 0.5 ? '30% 70% 70% 30% / 30% 30% 70% 70%' : '5px'};
                    background-color: ${Math.random() > 0.7 ? vistelicaColors.primary : vistelicaColors.secondary}${Math.floor(opacity * 255).toString(16).padStart(2, '0')};
                    filter: blur(${Math.random() * 8 + 2}px);
                    animation: float ${duration}s infinite ease-in-out;
                    animation-delay: -${Math.random() * duration}s;
                    z-index: 0;
                    will-change: transform;
                `;

                container.appendChild(element);
            }
        };

        if (!document.getElementById('bg-animation-style')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'bg-animation-style';
            styleElement.textContent = `
                @keyframes float {
                    0% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); }
                    25% { transform: translate3d(15px, 25px, 0) rotate(5deg) scale(1.05); }
                    50% { transform: translate3d(-20px, 15px, 0) rotate(-5deg) scale(1); }
                    75% { transform: translate3d(10px, -18px, 0) rotate(3deg) scale(0.95); }
                    100% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); }
                }
            `;
            document.head.appendChild(styleElement);
        }

        requestAnimationFrame(createAnimatedBg);

        let resizeTimer;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(createAnimatedBg, 100);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimer);
        };
    }, [isMobile, isTablet, prefersReducedMotion]);

    return (
        <Box
            component="section"
            aria-labelledby="showcase-title"
            sx={{
                position: 'relative',
                background: `linear-gradient(135deg, ${vistelicaColors.tertiary} 0%, ${vistelicaColors.quaternary} 100%)`,
                padding: { xs: '5rem 0 7rem', md: '7rem 0 10rem' },
                width: '100%',
                overflow: 'hidden',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '8px',
                    background: `linear-gradient(90deg, transparent, ${vistelicaColors.primary}, transparent)`,
                }
            }}
        >
            <Box
                id="animated-bg-container"
                aria-hidden="true"
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    zIndex: 0,
                }}
            />

            <Container
                maxWidth={false}
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    width: '100%',
                    maxWidth: '90%',
                    mx: 'auto',
                    px: { xs: 2, md: 4, lg: 6 }
                }}
            >
                <Box
                    component="header"
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'center', md: 'center' },
                        marginBottom: '5rem',
                        paddingBottom: '2.5rem',
                        borderBottom: `2px solid ${vistelicaColors.primary}40`,
                        position: 'relative',
                        textAlign: { xs: 'center', md: 'left' },
                    }}
                >
                    <Box sx={{ mb: { xs: 3, md: 0 }, width: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                        <Typography
                            id="showcase-title"
                            variant="h3"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.8rem',
                                fontSize: { xs: '2.5rem', md: '3.5rem' },
                                fontWeight: 700,
                                fontFamily: typography.fontFamily,
                                color: vistelicaColors.secondary,
                                textTransform: 'uppercase',
                                letterSpacing: '3px',
                                mb: 2,
                                position: 'relative',
                                textShadow: '2px 2px 15px rgba(0,0,0,0.3)',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -15,
                                    left: 0,
                                    width: '100px',
                                    height: '5px',
                                    backgroundColor: vistelicaColors.primary,
                                    boxShadow: '0 0 15px rgba(228, 176, 2, 0.7)',
                                }
                            }}
                        >
                            <StyleIcon
                                sx={{
                                    color: vistelicaColors.primary,
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    filter: 'drop-shadow(0 0 5px rgba(228, 176, 2, 0.7))'
                                }}
                                aria-hidden="true"
                            />
                            CONSIGUE EL LOOK
                        </Typography>

                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontSize: { xs: '1.1rem', md: '1.25rem' },
                                maxWidth: '650px',
                                color: vistelicaColors.secondary,
                                fontFamily: typography.fontFamily,
                                letterSpacing: '0.8px',
                                fontWeight: 500,
                                opacity: 0.9,
                                mt: 4,
                                textShadow: '1px 1px 5px rgba(0,0,0,0.2)',
                                lineHeight: 1.6,
                            }}
                        >
                            INSPÍRATE CON NUESTROS ESTILOS ESPECIALES Y COMPARTE TUS LOOKS EN REDES SOCIALES CON @VISTELICA.
                        </Typography>
                    </Box>

                    <Box
                        component="a"
                        href="https://www.instagram.com/vistelica_ecommerce/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Síguenos en Instagram @vistelica"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255,255,255,0.12)',
                            padding: '12px 24px',
                            borderRadius: '40px',
                            border: `2px solid ${vistelicaColors.primary}70`,
                            boxShadow: '0 10px 20px rgba(0,0,0,0.1), 0 0 20px rgba(228, 176, 2, 0.3)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.4s ease',
                            textDecoration: 'none',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 15px 30px rgba(0,0,0,0.15), 0 0 30px rgba(228, 176, 2, 0.4)',
                            },
                            '&:focus-visible': {
                                outline: `3px solid ${vistelicaColors.primary}`,
                                outlineOffset: '3px',
                            }
                        }}
                    >
                        <InstagramIcon sx={{ color: vistelicaColors.primary, mr: 1.5, fontSize: '1.8rem' }} aria-hidden="true" />
                        <Typography
                            sx={{
                                fontSize: '1.3rem',
                                fontFamily: typography.fontFamily,
                                color: vistelicaColors.secondary,
                                fontWeight: 600,
                                letterSpacing: '1px',
                            }}
                        >
                            @vistelica
                        </Typography>
                    </Box>
                </Box>

                {loading ? (
                    <Box
                        role="status"
                        aria-label="Cargando estilos"
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '600px',
                            width: '100%',
                            backdropFilter: 'blur(8px)',
                        }}
                    >
                        <CircularProgress sx={{ color: vistelicaColors.primary, fontSize: '80px' }} size={80} />
                    </Box>
                ) : (
                    <>
                        <Grid
                            id="styles-grid"
                            container
                            spacing={{ xs: 4, md: 8 }}
                            sx={{
                                mt: { xs: 3, md: 5 },
                                mb: { xs: 5, md: 8 },
                                width: '100%',
                            }}
                        >
                            {currentStyles.map((style, index) => (
                                <Grid
                                    key={style.id}
                                    size={{ xs: 12, sm: 6 }}
                                    sx={{
                                        mb: { xs: 4, md: 8 },
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Box
                                        onClick={() => handleStyleClick(style.id)}
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleStyleClick(style.id);
                                            }
                                        }}
                                        tabIndex={0}
                                        role="button"
                                        aria-label={`Ver detalles del estilo ${style.name}`}
                                        sx={{
                                            position: 'relative',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            width: '100%',
                                            maxWidth: { xs: '100%', sm: '500px', md: '700px' },
                                            aspectRatio: '3/4',
                                            cursor: 'pointer',
                                            boxShadow: hoveredIndex === index
                                                ? `0 22px 40px rgba(0,0,0,0.2), 0 0 0 3px ${vistelicaColors.primary}`
                                                : '0 10px 30px rgba(0,0,0,0.15)',
                                            transition: 'all 0.4s ease',
                                            transform: hoveredIndex === index
                                                ? 'translateY(-15px)'
                                                : 'translateY(0)',
                                            border: `1px solid ${hoveredIndex === index
                                                ? vistelicaColors.primary
                                                : 'rgba(255,255,255,0.2)'}`,
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                background: hoveredIndex === index
                                                    ? `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 40%, ${vistelicaColors.primary}10 100%)`
                                                    : 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
                                                zIndex: 1,
                                                transition: 'all 0.5s ease',
                                            },
                                            '&:focus-visible': {
                                                outline: `3px solid ${vistelicaColors.primary}`,
                                                outlineOffset: '3px',
                                            }
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={style.image}
                                            alt=""
                                            loading="lazy"
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.7s ease',
                                                transform: hoveredIndex === index ? 'scale(1.08)' : 'scale(1)',
                                            }}
                                        />

                                        <Chip
                                            label={trendLabels[index % trendLabels.length]}
                                            size="small"
                                            aria-hidden="true"
                                            sx={{
                                                position: 'absolute',
                                                top: 12,
                                                right: 12,
                                                backgroundColor: vistelicaColors.primary,
                                                color: vistelicaColors.secondary,
                                                fontWeight: 600,
                                                fontSize: '0.75rem',
                                                fontFamily: typography.fontFamily,
                                                letterSpacing: '1px',
                                                zIndex: 3,
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                opacity: hoveredIndex === index ? 1 : 0.85,
                                                transform: hoveredIndex === index
                                                    ? 'translateY(-3px)'
                                                    : 'translateY(0)',
                                                transition: 'all 0.4s ease',
                                            }}
                                        />

                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                width: '100%',
                                                zIndex: 2,
                                                paddingBottom: '16px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                textAlign: 'center',
                                                transition: 'all 0.4s ease',
                                                transform: hoveredIndex === index ? 'translateY(-10px)' : 'translateY(0)',
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: hoveredIndex === index ? vistelicaColors.primary : vistelicaColors.tertiary,
                                                    fontSize: { xs: '1.3rem', md: '1.5rem' },
                                                    fontWeight: 600,
                                                    fontFamily: typography.fontFamily,
                                                    textAlign: 'center',
                                                    width: '100%',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '1px',
                                                    textShadow: '1px 1px 4px rgba(0,0,0,0.6)',
                                                    mb: 1.5,
                                                    transition: 'all 0.4s ease',
                                                    position: 'relative',
                                                    '&::after': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        bottom: -8,
                                                        left: '50%',
                                                        transform: 'translateX(-50%)',
                                                        width: hoveredIndex === index ? '50px' : '0',
                                                        height: '2px',
                                                        backgroundColor: vistelicaColors.primary,
                                                        transition: 'all 0.4s ease',
                                                    }
                                                }}
                                            >
                                                {style.name}
                                            </Typography>

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: hoveredIndex === index
                                                        ? vistelicaColors.primary
                                                        : 'rgba(255,255,255,0.15)',
                                                    borderRadius: '30px',
                                                    padding: '8px 20px',
                                                    marginTop: '12px',
                                                    transition: 'all 0.4s ease 0.1s',
                                                    transform: hoveredIndex === index
                                                        ? 'translateY(0) scale(1)'
                                                        : 'translateY(10px) scale(0.9)',
                                                    opacity: hoveredIndex === index ? 1 : 0.7,
                                                    boxShadow: hoveredIndex === index
                                                        ? '0 4px 12px rgba(228, 176, 2, 0.3)'
                                                        : 'none',
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: hoveredIndex === index
                                                            ? vistelicaColors.secondary
                                                            : vistelicaColors.tertiary,
                                                        fontSize: '0.9rem',
                                                        fontFamily: typography.fontFamily,
                                                        mr: 0.5,
                                                        fontWeight: hoveredIndex === index ? 600 : 400,
                                                    }}
                                                >
                                                    Ver detalles
                                                </Typography>
                                                <ArrowForwardIcon
                                                    aria-hidden="true"
                                                    sx={{
                                                        color: hoveredIndex === index
                                                            ? vistelicaColors.secondary
                                                            : vistelicaColors.primary,
                                                        fontSize: '0.9rem',
                                                        transition: 'transform 0.3s ease',
                                                        transform: hoveredIndex === index
                                                            ? 'translateX(3px)'
                                                            : 'translateX(0)',
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}

                            {styles.length === 0 && (
                                <Box
                                    sx={{
                                        width: '100%',
                                        textAlign: 'center',
                                        py: 10,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: vistelicaColors.tertiary,
                                            fontFamily: typography.fontFamily,
                                            fontSize: '1.4rem',
                                            opacity: 0.8,
                                        }}
                                    >
                                        No hay estilos disponibles para esta categoría.
                                    </Typography>
                                </Box>
                            )}
                        </Grid>

                        {/* Paginación para navegación entre estilos */}
                        {styles.length > itemsPerPage && (
                            <Box
                                component="nav"
                                aria-label="Navegación de páginas"
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    py: 4,
                                    mt: 3,
                                    backdropFilter: 'blur(8px)',
                                    backgroundColor: 'rgba(255,255,255,0.08)',
                                    borderRadius: '100px',
                                    maxWidth: '80%',
                                    mx: 'auto',
                                    border: `1px solid ${vistelicaColors.primary}30`,
                                }}
                            >
                                {/* Versión móvil: botones simples prev/next */}
                                {isMobile ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <IconButton
                                            onClick={handlePrevPage}
                                            disabled={currentPage === 1}
                                            aria-label="Página anterior"
                                            sx={{
                                                backgroundColor: currentPage === 1 ? 'rgba(255,255,255,0.1)' : vistelicaColors.primary,
                                                color: currentPage === 1 ? 'rgba(255,255,255,0.3)' : vistelicaColors.secondary,
                                                '&:hover': {
                                                    backgroundColor: currentPage === 1 ? 'rgba(255,255,255,0.1)' : vistelicaColors.primary + 'ee',
                                                },
                                                '&:focus-visible': {
                                                    outline: `3px solid ${vistelicaColors.primary}`,
                                                }
                                            }}
                                        >
                                            <KeyboardArrowLeftIcon />
                                        </IconButton>

                                        <Typography sx={{
                                            color: vistelicaColors.tertiary,
                                            fontFamily: typography.fontFamily,
                                            fontWeight: 500
                                        }}>
                                            {currentPage} / {totalPages}
                                        </Typography>

                                        <IconButton
                                            onClick={handleNextPage}
                                            disabled={currentPage === totalPages}
                                            aria-label="Página siguiente"
                                            sx={{
                                                backgroundColor: currentPage === totalPages ? 'rgba(255,255,255,0.1)' : vistelicaColors.primary,
                                                color: currentPage === totalPages ? 'rgba(255,255,255,0.3)' : vistelicaColors.secondary,
                                                '&:hover': {
                                                    backgroundColor: currentPage === totalPages ? 'rgba(255,255,255,0.1)' : vistelicaColors.primary + 'ee',
                                                },
                                                '&:focus-visible': {
                                                    outline: `3px solid ${vistelicaColors.primary}`,
                                                }
                                            }}
                                        >
                                            <KeyboardArrowRightIcon />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <Pagination
                                        count={totalPages}
                                        page={currentPage}
                                        onChange={handlePageChange}
                                        size="large"
                                        aria-label={`Página ${currentPage} de ${totalPages}`}
                                        sx={{
                                            '& .MuiPaginationItem-root': {
                                                color: vistelicaColors.tertiary,
                                                fontFamily: typography.fontFamily,
                                                border: `1px solid ${vistelicaColors.primary}30`,
                                                '&.Mui-selected': {
                                                    backgroundColor: vistelicaColors.primary,
                                                    color: vistelicaColors.secondary,
                                                    fontWeight: 600,
                                                    '&:hover': {
                                                        backgroundColor: vistelicaColors.primary + 'dd',
                                                    }
                                                },
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                                },
                                                '&:focus-visible': {
                                                    outline: `3px solid ${vistelicaColors.primary}`,
                                                    outlineOffset: '2px',
                                                }
                                            }
                                        }}
                                    />
                                )}
                            </Box>
                        )}
                    </>
                )}

                <Typography
                    component="footer"
                    variant="body2"
                    sx={{
                        textAlign: 'center',
                        fontFamily: typography.fontFamily,
                        fontSize: '1.2rem',
                        color: vistelicaColors.secondary,
                        opacity: 0.85,
                        maxWidth: '800px',
                        mx: 'auto',
                        mt: 7,
                        mb: 2,
                        textShadow: '1px 1px 3px rgba(0,0,0,0.15)',
                        lineHeight: 1.8,
                        letterSpacing: '0.5px',
                    }}
                >
                    Los looks son combinaciones exclusivas creadas por nuestros especialistas en moda.
                    Inspírate en estas tendencias y crea tu propio estilo único con prendas Vistelica.
                </Typography>
            </Container>
        </Box>
    );
};

export default GenericStylesShowcase;