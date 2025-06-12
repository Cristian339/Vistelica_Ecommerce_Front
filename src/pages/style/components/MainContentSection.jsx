'use client';
import React, { useCallback, memo, useMemo } from 'react';
import {
    Box,
    Container,
    useTheme,
    useMediaQuery,
    Typography,
    Divider
} from '@mui/material';
import ImageGallery from './ImageGallery';
import ProductGrid from './ProductGrid';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

const MainContentSection = memo(({
                                     styleImages = [],
                                     currentImageIndex = 0,
                                     setCurrentImageIndex,
                                     selectedThumbnail = 0,
                                     setSelectedThumbnail,
                                     products = [],
                                     isProductInWishlist,
                                     loadingWishlist = {},
                                     toggleFavorite
                                 }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));

    // Memoizamos el contador de productos disponibles
    const productCount = useMemo(() => products.length, [products.length]);

    // Optimizamos los controladores de navegación
    const handlePrevImage = useCallback(() => {
        const prevIndex = currentImageIndex === 0 ? styleImages.length - 1 : currentImageIndex - 1;
        setCurrentImageIndex(prevIndex);
        setSelectedThumbnail(prevIndex);
    }, [currentImageIndex, styleImages.length, setCurrentImageIndex, setSelectedThumbnail]);

    const handleNextImage = useCallback(() => {
        const nextIndex = currentImageIndex === styleImages.length - 1 ? 0 : currentImageIndex + 1;
        setCurrentImageIndex(nextIndex);
        setSelectedThumbnail(nextIndex);
    }, [currentImageIndex, styleImages.length, setCurrentImageIndex, setSelectedThumbnail]);

    const handleThumbnailClick = useCallback((index) => {
        setCurrentImageIndex(index);
        setSelectedThumbnail(index);
    }, [setCurrentImageIndex, setSelectedThumbnail]);

    return (
        <Container
            maxWidth="xl"
            disableGutters
            component="section"
            aria-label="Colección de productos y galería de imágenes"
            sx={{
                px: { xs: 1, sm: 2, md: 3 },
                backgroundColor: vistelicaColors.backgroundLight,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: { xs: 3, md: 4 },
                    alignItems: 'flex-start',
                    position: 'relative',
                    mt: { xs: 2, sm: 3, md: 4 }
                }}
                component="div"
                role="main"
            >
                {/* Columna izquierda: Galería de imágenes */}
                <Box
                    sx={{
                        width: { xs: '100%', md: '58%', lg: '52%' },
                        position: 'sticky',
                        top: { xs: 0, md: 20 },
                        zIndex: 1,
                    }}
                    component="article"
                    aria-label="Galería de imágenes de estilo"
                >
                    <Box sx={{
                        width: '100%',
                        maxWidth: '100%',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: `0 20px 40px ${vistelicaColors.shadow}20`,
                        border: `1px solid ${vistelicaColors.divider}`,
                        backgroundColor: vistelicaColors.white,
                    }}>
                        <ImageGallery
                            styleImages={styleImages}
                            currentImageIndex={currentImageIndex}
                            selectedThumbnail={selectedThumbnail}
                            onPrevImage={handlePrevImage}
                            onNextImage={handleNextImage}
                            onThumbnailClick={handleThumbnailClick}
                            isMobile={isMobile}
                            isFullWidth={true}
                        />
                    </Box>
                </Box>

                {/* Columna derecha: Productos */}
                <Box
                    sx={{
                        width: { xs: '100%', md: '42%', lg: '48%' },
                        position: 'relative',
                        borderRadius: '24px',
                        backgroundColor: vistelicaColors.white,
                        boxShadow: `0 15px 35px ${vistelicaColors.shadow}15`,
                        border: `1px solid ${vistelicaColors.divider}`,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    component="article"
                    aria-label="Productos relacionados"
                >
                    {/* Encabezado de la sección de productos */}
                    <Box
                        sx={{
                            p: { xs: 2.5, sm: 3, md: 3.5 },
                            borderBottom: `1px solid ${vistelicaColors.divider}`,
                            backgroundColor: `${vistelicaColors.backgroundAccent}15`,
                        }}
                        component="header"
                    >
                        <Typography
                            variant="h6"
                            component="h2"
                            id="productos-relacionados-titulo"
                            sx={{
                                fontSize: { xs: '1.25rem', sm: '1.35rem', md: '1.45rem' },
                                fontWeight: 600,
                                color: vistelicaColors.primary,
                                fontFamily: typography.fontFamily,
                                position: 'relative',
                                pl: 1.8,
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: '10%',
                                    height: '80%',
                                    width: '5px',
                                    backgroundColor: vistelicaColors.primary,
                                    borderRadius: '2.5px',
                                }
                            }}
                        >
                            Productos relacionados
                        </Typography>
                        <Typography
                            variant="body1"
                            component="p"
                            aria-live="polite"
                            sx={{
                                mt: 0.8,
                                color: vistelicaColors.textSecondary,
                                fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                                fontFamily: typography.fontFamily,
                                pl: 1.8,
                            }}
                        >
                            {productCount} artículo{productCount !== 1 ? 's' : ''} disponible{productCount !== 1 ? 's' : ''}
                        </Typography>
                    </Box>

                    {/* Contenido de productos */}
                    <Box
                        sx={{
                            p: { xs: 2.5, sm: 3 },
                            overflowY: 'auto',
                            maxHeight: { xs: 'auto', md: 'calc(100vh - 180px)' },
                            scrollbarWidth: 'thin',
                            '&::-webkit-scrollbar': {
                                width: '6px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: vistelicaColors.backgroundLight,
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: `${vistelicaColors.primary}40`,
                                borderRadius: '3px',
                            },
                            '&:focus': {
                                outline: `2px solid ${vistelicaColors.primary}`,
                                outlineOffset: -2,
                            },
                        }}
                        component="div"
                        aria-labelledby="productos-relacionados-titulo"
                        tabIndex="0"
                    >
                        <ProductGrid
                            products={products}
                            isProductInWishlist={isProductInWishlist}
                            loadingWishlist={loadingWishlist}
                            toggleFavorite={toggleFavorite}
                            isMobile={isMobile}
                            isTablet={isTablet}
                        />
                    </Box>
                </Box>
            </Box>

            {/* Elemento separador decorativo para móvil */}
            {isMobile && (
                <Divider
                    role="presentation"
                    aria-hidden="true"
                    sx={{
                        my: 4,
                        mx: 'auto',
                        width: '40%',
                        borderColor: `${vistelicaColors.primary}30`,
                        borderWidth: '2px',
                        borderRadius: '1px',
                    }}
                />
            )}
        </Container>
    );
});

// Nombre explícito para herramientas de desarrollo
MainContentSection.displayName = 'MainContentSection';

export default MainContentSection;