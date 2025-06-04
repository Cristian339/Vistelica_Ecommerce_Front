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

    const handlePrevImage = () => {
        const prevIndex = currentImageIndex === 0 ? styleImages.length - 1 : currentImageIndex - 1;
        setCurrentImageIndex(prevIndex);
        setSelectedThumbnail(prevIndex);
    };

    const handleNextImage = () => {
        const nextIndex = currentImageIndex === styleImages.length - 1 ? 0 : currentImageIndex + 1;
        setCurrentImageIndex(nextIndex);
        setSelectedThumbnail(nextIndex);
    };

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index);
        setSelectedThumbnail(index);
    };

    return (
        <Container maxWidth="lg" disableGutters sx={{ px: { xs: 1, sm: 2 } }}>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'flex-start',
                gap: { xs: 3, md: 4 },
                ml: 0
            }}>
                {/* Galería de imágenes */}
                <Box sx={{
                    width: { xs: '100%', md: '50%' },
                    maxWidth: { xs: '100%', md: 450 },
                    order: { xs: 1, md: 1 }
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
                    order: { xs: 2, md: 2 }
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