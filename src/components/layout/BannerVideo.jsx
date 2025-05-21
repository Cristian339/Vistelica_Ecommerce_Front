'use client';
import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';

const BannerVideoSection = ({ videoUrl = "https://res.cloudinary.com/dhyv4dpk2/video/upload/v1747847378/vistelica/subcategorias/vuo7vq7l9bizoandcyup.mp4" }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        // Asegurarse de que el video se reproduzca automáticamente cuando esté cargado
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.error("Error al reproducir el video:", error);
            });
        }
    }, []);

    return (
        <Box
            sx={{
                width: '100%',
                height: { xs: '40vh', sm: '50vh', md: '60vh' },
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {/* Video de fondo */}
            <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0,
                }}
            >
                <source src={videoUrl} type="video/mp4" />
                Tu navegador no soporta videos HTML5.
            </video>

            {/* Capa de superposición para mejorar el contraste */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Capa oscura para mejorar visibilidad del texto
                    zIndex: 1,
                }}
            />

            {/* Contenido del banner */}
            <Box
                sx={{
                    color: 'white',
                    typography: 'h3',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: { xs: '2rem', sm: '3rem', md: '6rem' },
                    position: 'relative',
                    zIndex: 2, // Asegura que el texto esté por encima del video
                }}
            >
                LOS MEJORES<Box component="span" sx={{ border: '2px solid white', px: 2, py: 1 }}>PRODUCTOS</Box>
            </Box>
        </Box>
    );
};

export default BannerVideoSection;