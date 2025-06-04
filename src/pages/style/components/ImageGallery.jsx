import React from 'react';
import {
    Box,
    IconButton,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageGallery = ({
                          styleImages,
                          currentImageIndex,
                          selectedThumbnail,
                          onPrevImage,
                          onNextImage,
                          onThumbnailClick,
                          isMobile
                      }) => {
    const theme = useTheme();

    return (
        <Box sx={{
            bgcolor: 'grey.100',
            borderRadius: 2,
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Botones de navegación */}
            <IconButton
                onClick={onPrevImage}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: { xs: 4, sm: 8 },
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ddd',
                    borderRadius: '50%',
                    backdropFilter: 'blur(4px)',
                    width: { xs: 35, sm: 40 },
                    height: { xs: 35, sm: 40 },
                    '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 1)',
                        transform: 'translateY(-50%) scale(1.1)'
                    },
                    transition: 'all 0.2s ease'
                }}
            >
                <ChevronLeft size={isMobile ? 16 : 20} />
            </IconButton>

            <IconButton
                onClick={onNextImage}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    right: { xs: 4, sm: 8 },
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ddd',
                    borderRadius: '50%',
                    backdropFilter: 'blur(4px)',
                    width: { xs: 35, sm: 40 },
                    height: { xs: 35, sm: 40 },
                    '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 1)',
                        transform: 'translateY(-50%) scale(1.1)'
                    },
                    transition: 'all 0.2s ease'
                }}
            >
                <ChevronRight size={isMobile ? 16 : 20} />
            </IconButton>

            {/* Imagen principal */}
            <Box
                component="img"
                src={styleImages[currentImageIndex]?.image_url || "/api/placeholder/600/800"}
                alt="Estilo"
                sx={{
                    width: '100%',
                    height: { xs: '60vh', sm: '70vh', md: 'auto' },
                    maxHeight: { xs: '500px', md: '600px' },
                    objectFit: 'cover'
                }}
            />

            {/* Thumbnails */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 1,
                flexWrap: 'wrap',
                gap: { xs: 0.5, sm: 1 },
                px: { xs: 1, sm: 2 },
                pb: 1
            }}>
                {styleImages.map((img, index) => (
                    <Box
                        key={index}
                        component="img"
                        src={img.image_url}
                        onClick={() => onThumbnailClick(index)}
                        alt={`Thumbnail ${index}`}
                        sx={{
                            width: { xs: 40, sm: 50 },
                            height: { xs: 55, sm: 70 },
                            objectFit: 'cover',
                            border: index === selectedThumbnail ? '3px solid #1976d2' : '1px solid #ccc',
                            cursor: 'pointer',
                            borderRadius: 1,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                border: '2px solid #1976d2'
                            }
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default ImageGallery;