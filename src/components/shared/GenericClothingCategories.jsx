'use client';

import React, { useEffect, useState, memo, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import categoryService from '@/services/categoryService';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { vistelicaColors } from '@/components/shared/vistelicaColors';
import { typography } from "@/components/shared/themePrimitives";
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Grid from '@mui/material/Grid';

// Componente de categoría individual optimizado con memo
const CategoryItem = memo(({ subcat, index, hoveredIndex, setHoveredIndex, handleCategoryClick }) => {
    const itemRef = useRef(null);

    // Manejo optimizado de eventos de teclado para accesibilidad
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCategoryClick(subcat);
        }
    };

    // Detectar preferencias de reducción de movimiento
    const prefersReducedMotion = useMemo(() =>
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

    return (
        <Box
            ref={itemRef}
            onClick={() => handleCategoryClick(subcat)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(index)}
            onBlur={() => setHoveredIndex(null)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`Ver productos de ${subcat.name}`}
            sx={{
                position: 'relative',
                flex: '1 1 0%',
                height: { xs: '350px', sm: '420px', md: '480px' },
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: hoveredIndex === index
                    ? `0 22px 40px rgba(0, 0, 0, 0.2), 0 0 0 2px ${vistelicaColors.primary}`
                    : '0 10px 30px rgba(0, 0, 0, 0.1)',
                transition: prefersReducedMotion
                    ? 'none'
                    : 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                transform: hoveredIndex === index && !prefersReducedMotion
                    ? 'translateY(-15px)'
                    : 'translateY(0)',
                '&:focus-visible': {
                    outline: `3px solid ${vistelicaColors.primary}`,
                    outlineOffset: '2px',
                },
                '@media (max-width: 768px)': {
                    flexBasis: '100%',
                    minWidth: '280px',
                    scrollSnapAlign: 'start',
                    marginRight: '15px'
                }
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: hoveredIndex === index ? 0.92 : 1,
                    transition: prefersReducedMotion ? 'none' : 'all 0.5s ease',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        transition: prefersReducedMotion ? 'none' : 'all 0.5s ease',
                        opacity: hoveredIndex === index ? 0 : 1,
                        zIndex: 1
                    }
                }}
            >
                <img
                    src={subcat.image_url_sub}
                    alt={subcat.name}
                    loading="lazy"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: prefersReducedMotion ? 'none' : 'transform 0.8s ease',
                        transform: hoveredIndex === index && !prefersReducedMotion ? 'scale(1.1)' : 'scale(1.03)'
                    }}
                />
            </Box>

            <Box
                sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2,
                    background: hoveredIndex === index
                        ? 'linear-gradient(0deg, rgba(35, 42, 46, 0.8) 0%, rgba(35, 42, 46, 0.7) 100%)'
                        : 'linear-gradient(0deg, rgba(35, 42, 46, 0.7) 0%, rgba(35, 42, 46, 0.3) 100%)',
                    transition: prefersReducedMotion ? 'none' : 'all 0.5s ease',
                }}
            >
                <Typography
                    component="h3"
                    sx={{
                        color: hoveredIndex === index ? vistelicaColors.primary : vistelicaColors.tertiary,
                        fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.6rem' },
                        fontWeight: 400,
                        letterSpacing: '0.5px',
                        textAlign: 'center',
                        fontFamily: typography.fontFamily,
                        transition: prefersReducedMotion ? 'none' : 'all 0.4s ease',
                        maxWidth: '80%',
                        mx: 'auto',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                >
                    {subcat.name}
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: hoveredIndex === index ? 1 : 0,
                        transform: hoveredIndex === index && !prefersReducedMotion
                            ? 'translateY(10px)'
                            : 'translateY(20px)',
                        transition: prefersReducedMotion ? 'none' : 'all 0.4s ease 0.1s',
                        marginTop: '10px',
                        padding: '6px 16px',
                        borderRadius: '30px',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(5px)',
                        border: `1px solid ${vistelicaColors.primary}50`,
                    }}
                >
                    <Typography
                        sx={{
                            color: vistelicaColors.tertiary,
                            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
                            fontWeight: 500,
                            mr: 1,
                        }}
                    >
                        Ver productos
                    </Typography>
                    <ArrowForwardIcon
                        sx={{
                            color: vistelicaColors.primary,
                            fontSize: { xs: '1rem', sm: '1.05rem', md: '1.1rem' },
                            transition: prefersReducedMotion ? 'none' : 'transform 0.3s ease',
                            transform: hoveredIndex === index && !prefersReducedMotion
                                ? 'translateX(4px)'
                                : 'translateX(0)'
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
});

CategoryItem.displayName = 'CategoryItem';

const GenericClothingCategories = ({ categoryName }) => {
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const router = useRouter();
    const isMobile = useMediaQuery('(max-width:600px)');
    const isTablet = useMediaQuery('(max-width:960px)');
    const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

    // Referencia para el controlador de la petición API
    const abortControllerRef = useRef(null);
    // Referencia para el contenedor móvil
    const scrollContainerRef = useRef(null);

    // Función optimizada para obtener el título de la categoría
    const getCategoryTitle = useMemo(() => {
        switch(categoryName?.toLowerCase()) {
            case 'hombre': return 'Explora nuestras subcategorías para Hombre';
            case 'mujer': return 'Descubre las subcategorías para Mujer';
            case 'chico': return 'Subcategorías exclusivas para Chicos';
            case 'chica': return 'Colecciones especiales para Chicas';
            default: return 'Nuestras subcategorías';
        }
    }, [categoryName]);

    // Cargar subcategorías con mejoras de rendimiento
    useEffect(() => {
        // Cancelar petición anterior si existe
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Crear nuevo controlador para esta petición
        abortControllerRef.current = new AbortController();
        const { signal } = abortControllerRef.current;

        const loadSubcategories = async () => {
            try {
                setLoading(true);
                setError(null);

                const categories = await categoryService.fetchCategories();

                if (signal.aborted) return;

                const targetCategory = categories.find(
                    (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
                );

                if (targetCategory?.subcategories) {
                    const visibles = targetCategory.subcategories.filter(
                        (sub) => !sub.discard
                    );
                    setSubcategories(visibles);
                } else {
                    setSubcategories([]);
                }
            } catch (error) {
                if (!signal.aborted) {
                    console.error(`Error al cargar subcategorías de ${categoryName}:`, error);
                    setError(`No se pudieron cargar las categorías. ${error.message}`);
                }
            } finally {
                if (!signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadSubcategories();

        // Limpiar al desmontar
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [categoryName]);

    // Optimizar la función de click en categoría con useCallback
    const handleCategoryClick = useCallback(async (subcat) => {
        try {
            const categories = await categoryService.fetchCategories();

            const targetCategory = categories.find(
                (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
            );

            const categoryId = targetCategory ? targetCategory.category_id : '';
            const categorySlug = targetCategory ? targetCategory.slug || categoryName.toLowerCase() : categoryName.toLowerCase();

            localStorage.setItem('selectedCategory', categoryId);
            localStorage.setItem('selectedSubcategory', subcat.subcategory_id);

            const subcategorySlug = subcat.slug || subcat.subcategory_id;

            router.push(`/product-list/productList?category=${categorySlug}&subcategory=${subcategorySlug}`);
        } catch (error) {
            console.error('Error al navegar a la subcategoría:', error);
        }
    }, [categoryName, router]);

    // Gestión del scroll horizontal en móvil con optimización
    useEffect(() => {
        if (!isMobile || !scrollContainerRef.current) return;

        let startX;
        let scrollLeft;
        let isDown = false;

        const container = scrollContainerRef.current;

        const handleMouseDown = (e) => {
            isDown = true;
            container.style.cursor = 'grabbing';
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
            e.preventDefault();
        };

        const handleMouseUp = () => {
            isDown = false;
            container.style.cursor = 'grab';
        };

        const handleMouseLeave = () => {
            isDown = false;
            container.style.cursor = 'grab';
        };

        const handleMouseMove = (e) => {
            if (!isDown) return;
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        };

        container.addEventListener('mousedown', handleMouseDown);
        container.addEventListener('mouseup', handleMouseUp);
        container.addEventListener('mouseleave', handleMouseLeave);
        container.addEventListener('mousemove', handleMouseMove);

        return () => {
            container.removeEventListener('mousedown', handleMouseDown);
            container.removeEventListener('mouseup', handleMouseUp);
            container.removeEventListener('mouseleave', handleMouseLeave);
            container.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isMobile]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '400px',
                    backgroundColor: vistelicaColors.tertiary,
                    backgroundImage: `linear-gradient(135deg, ${vistelicaColors.tertiary} 0%, ${vistelicaColors.quaternary}40 100%)`,
                }}
                role="status"
                aria-label="Cargando subcategorías"
            >
                <CircularProgress sx={{ color: vistelicaColors.primary }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    height: '300px',
                    backgroundColor: vistelicaColors.tertiary,
                    backgroundImage: `linear-gradient(135deg, ${vistelicaColors.tertiary} 0%, ${vistelicaColors.quaternary}40 100%)`,
                    p: 3,
                }}
                role="alert"
            >
                <Typography
                    component="h2"
                    sx={{
                        color: vistelicaColors.secondary,
                        mb: 2,
                        textAlign: 'center',
                        fontFamily: typography.fontFamily,
                    }}
                >
                    Ha ocurrido un error
                </Typography>
                <Typography
                    sx={{
                        color: vistelicaColors.secondary,
                        textAlign: 'center',
                        fontFamily: typography.fontFamily,
                    }}
                >
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            component="section"
            sx={{
                background: `linear-gradient(135deg, ${vistelicaColors.tertiary} 0%, ${vistelicaColors.quaternary}40 100%)`,
                padding: { xs: '3rem 0', md: '5rem 0' },
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '5px',
                    background: `linear-gradient(90deg, transparent, ${vistelicaColors.primary}, transparent)`,
                }
            }}
        >
            <Container
                maxWidth={false}
                sx={{
                    width: '100%',
                    maxWidth: '2500px',
                    px: { xs: '8px', sm: '16px', md: '24px' },
                }}
            >
                <Box
                    component="header"
                    sx={{
                        position: 'relative',
                        mb: { xs: 4, md: 5 },
                        px: { xs: 1, md: 0 },
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        variant="h3"
                        component="h2"
                        sx={{
                            color: vistelicaColors.secondary,
                            fontFamily: typography.fontFamily,
                            fontWeight: 400,
                            fontSize: { xs: '1.75rem', md: '2.5rem' },
                            textAlign: 'center',
                            position: 'relative',
                            margin: '0 auto',
                            display: 'inline-block',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-12px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '60px',
                                height: '4px',
                                backgroundColor: vistelicaColors.primary,
                                borderRadius: '2px'
                            }
                        }}
                    >
                        {getCategoryTitle}
                    </Typography>
                </Box>

                <Box
                    ref={scrollContainerRef}
                    component="div"
                    role="list"
                    aria-label={`Subcategorías de ${categoryName}`}
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'stretch',
                        gap: { xs: '10px', md: '15px' },
                        mt: { xs: 3, md: 5 },
                        overflowX: isMobile ? 'auto' : 'visible',
                        scrollSnapType: isMobile ? 'x mandatory' : 'none',
                        WebkitOverflowScrolling: 'touch',
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                        cursor: isMobile ? 'grab' : 'default',
                        padding: isMobile ? '10px 5px 20px' : 0,
                        position: 'relative',
                        '&::after': isMobile ? {
                            content: '""',
                            flexShrink: 0,
                            width: '5px',
                            height: '1px',
                        } : {}
                    }}
                >
                    {subcategories.map((subcat, index) => (
                        <CategoryItem
                            key={subcat.subcategory_id}
                            subcat={subcat}
                            index={index}
                            hoveredIndex={hoveredIndex}
                            setHoveredIndex={setHoveredIndex}
                            handleCategoryClick={handleCategoryClick}
                        />
                    ))}
                </Box>

                {subcategories.length === 0 && !loading && (
                    <Typography
                        sx={{
                            textAlign: 'center',
                            color: vistelicaColors.secondary,
                            padding: '2rem',
                            fontFamily: typography.fontFamily,
                            backgroundColor: `${vistelicaColors.tertiary}80`,
                            borderRadius: '8px'
                        }}
                        role="status"
                    >
                        No se encontraron categorías disponibles para {categoryName}.
                    </Typography>
                )}
            </Container>
        </Box>
    );
};

export default GenericClothingCategories;