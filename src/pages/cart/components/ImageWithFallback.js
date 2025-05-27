'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { Box, CircularProgress, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';

const ImageWithFallback = React.memo(({ src, isLoading, alt, productId }) => {
    const [hasError, setHasError] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Imagen base64 integrada memoizada
    const placeholderBase64 = useMemo(() =>
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTk5OTkiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==",
        []);

    // Manejador de error optimizado
    const handleImageError = useCallback(() => {
        setHasError(true);
    }, []);

    // Animaciones optimizadas según dispositivo
    const imageAnimation = useMemo(() => ({
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: isMobile ? 0.3 : 0.5 }
    }), [isMobile]);

    // Estilos memoizados
    const imageStyle = useMemo(() => ({
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    }), []);

    return (
        <>
            {isLoading && (
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.04)'
                }}>
                    <CircularProgress
                        size={isMobile ? 20 : 24}
                        thickness={isMobile ? 3 : 4}
                        color="inherit"
                        sx={{ opacity: 0.7 }}
                    />
                </Box>
            )}

            {!isLoading && (
                <motion.img
                    {...imageAnimation}
                    src={hasError ? placeholderBase64 : src}
                    alt={alt || `Imagen de producto ${productId}`}
                    onError={handleImageError}
                    style={imageStyle}
                    loading="lazy"
                    decoding="async"
                />
            )}
        </>
    );
});

ImageWithFallback.displayName = 'ImageWithFallback';

export default ImageWithFallback;