import React from 'react';
import {
    Box,
    Container,
    Grid,
    useTheme,
    useMediaQuery
} from '@mui/material';
import ImageGallery from './ImageGallery';
import ProductGrid from './ProductGrid';
import { vistelicaColors } from '@/components/shared/vistelicaColors';
import { typography } from "@/components/shared/themePrimitives";

const MainContentSection = ({
                                styleImages,
                                currentImageIndex,
                                setCurrentImageIndex,
                                selectedThumbnail,
                                setSelectedThumbnail,
                                products,
                                isProductInWishlist,
                                loadingWishlist,
                                toggleFavorite
                            }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    if (!styleImages || !Array.isArray(styleImages)) {
        return null; // o un componente de loading
    }
    if (!products || !Array.isArray(products)) {
        return null; // o un componente de loading
    }
    const handlePrevImage = () => {
        if (!styleImages || !Array.isArray(styleImages) || styleImages.length === 0) return;

        const prevIndex = currentImageIndex === 0 ? styleImages.length - 1 : currentImageIndex - 1;
        setCurrentImageIndex(prevIndex);
        setSelectedThumbnail(prevIndex);
    };

    const handleNextImage = () => {
        if (!styleImages || !Array.isArray(styleImages) || styleImages.length === 0) return;

        const nextIndex = currentImageIndex === styleImages.length - 1 ? 0 : currentImageIndex + 1;
        setCurrentImageIndex(nextIndex);
        setSelectedThumbnail(nextIndex);
    };

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index);
        setSelectedThumbnail(index);
    };

    return (
        <Container maxWidth="lg" disableGutters sx={{
            px: { xs: 1, sm: 2 },
            backgroundColor: vistelicaColors.backgroundLight,
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'flex-start',
                gap: { xs: 3, md: 4 },
                ml: 0,
                padding: { xs: 1, sm: 2 },
                borderRadius: 2,
                background: `linear-gradient(to bottom, ${vistelicaColors.backgroundLight}, ${vistelicaColors.backgroundAccent}10)`,
            }}>
                {/* Galería de imágenes */}
                <Box sx={{
                    width: { xs: '100%', md: '50%' },
                    maxWidth: { xs: '100%', md: 450 },
                    order: { xs: 1, md: 1 },
                    transition: 'all 0.3s ease',
                    borderRadius: 2,
                    overflow: 'hidden',
                }}>
                    <ImageGallery
                        styleImages={styleImages}
                        currentImageIndex={currentImageIndex}
                        selectedThumbnail={selectedThumbnail}
                        onPrevImage={handlePrevImage}
                        onNextImage={handleNextImage}
                        onThumbnailClick={handleThumbnailClick}
                        isMobile={isMobile}
                    />
                </Box>

                {/* Grid de productos */}
                <Box sx={{
                    flexGrow: 1,
                    width: { xs: '100%', md: 'auto' },
                    order: { xs: 2, md: 2 },
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    padding: { xs: 1, sm: 2 },
                    backgroundColor: `${vistelicaColors.white}`,
                    boxShadow: `0 4px 12px ${vistelicaColors.shadow}10`,
                    border: `1px solid ${vistelicaColors.divider}`,
                }}>
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
        </Container>
    );
};

export default MainContentSection;
