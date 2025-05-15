'use client';

import React, { useState, useRef, useEffect } from 'react';
import NextLink from 'next/link';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Container,
    Box,
    Link
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { vistelicaColors } from '../../shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";
import { motion } from 'framer-motion';

// Componente Card mejorado con hover effects y altura aumentada
const CategoryCard = styled(Card)(({ theme }) => ({
    position: 'relative',
    height: 480, // Aumentada la altura de 380px a 480px
    maxWidth: 1100, // Aumentado el ancho máximo de 900px a 1100px
    margin: '0 auto',
    borderRadius: 16,
    overflow: 'hidden',
    transition: 'transform 0.4s ease, box-shadow 0.4s ease',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    border: `1px solid ${vistelicaColors.divider}`,
    '&:hover': {
        transform: 'translateY(-10px)',
        boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
    },
    [theme.breakpoints.down('sm')]: {
        height: 350, // Aumentada también para móviles
    },
}));

const VideoContainer = styled(Box)(() => ({
    position: 'relative',
    height: '100%',
    width: '100%',
    overflow: 'hidden',
}));

const StyledVideo = styled('video')(() => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s ease, filter 0.4s ease',
}));

const CategoryContent = styled(CardContent)(() => ({
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: '25px',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(4px)',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingBottom: '35px',
    },
}));

const CategoryTitle = styled(Typography)(() => ({
    fontFamily: typography.fontFamily,
    fontWeight: 600,
    fontSize: '1.8rem',
    textAlign: 'center',
    color: vistelicaColors.secondary,
    position: 'relative',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -10,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '0%',
        height: '2px',
        backgroundColor: vistelicaColors.primary,
        transition: 'width 0.3s ease',
    },
    '&:hover::after': {
        width: '40%',
    }
}));

const SectionTitle = styled(motion.h2)(() => ({
    textAlign: 'center',
    marginBottom: '40px',
    fontWeight: 700,
    fontSize: '2rem',
    fontFamily: typography.fontFamily,
    color: vistelicaColors.secondary,
    position: 'relative',
    paddingBottom: '15px',
    margin: '0 auto 40px',
    maxWidth: '80%',
    '&:after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: '50%',
        width: 80,
        height: 3,
        backgroundColor: vistelicaColors.primary,
        transform: 'translateX(-50%)',
    },
}));

const categories = [
    {
        title: 'Hombre',
        video: 'https://res.cloudinary.com/dhyv4dpk2/video/upload/v1747333743/vistelica/home%20page/Img-Main/man/hudcof9s4ukdnj0kpb6l.webm',
        type: 'video/webm',
        imageAlt: 'Categoría de moda para hombres',
        path: '/sub-men/MainLayout-subM',
        description: 'Elegancia y estilo para cada ocasión'
    },
    {
        title: 'Mujer',
        video: 'https://res.cloudinary.com/dhyv4dpk2/video/upload/v1747333750/vistelica/home%20page/Img-Main/Women/alihfmkaaz3humbjwnu2.mp4',
        type: 'video/mp4',
        imageAlt: 'Categoría de moda para mujeres',
        path: '/sub-women/MainLayout-subW',
        description: 'Tendencias que resaltan tu personalidad'
    },
    {
        title: 'Chica',
        video: 'https://res.cloudinary.com/dhyv4dpk2/video/upload/v1747333744/vistelica/home%20page/Img-Main/Girl/bn4dotyydgmc25nrnmtx.webm',
        type: 'video/webm',
        imageAlt: 'Categoría de moda para adolescentes',
        path: '/sub-teen/MainLayout-subT',
        description: 'Frescura y estilo juvenil'
    },
    {
        title: 'Chico',
        video: 'https://res.cloudinary.com/dhyv4dpk2/video/upload/v1747333744/vistelica/home%20page/Img-Main/Boy/dj4xcaojseib3xypqtqa.webm',
        type: 'video/webm',
        imageAlt: 'Categoría de accesorios de moda',
        path: '/accesorios',
        description: 'Comodidad y diseño para jóvenes'
    },
];

const FeaturedCategories = () => {
    const videoRefs = useRef([]);
    const [hoverIndex, setHoverIndex] = useState(null);

    useEffect(() => {
        // Reproducir todos los videos automáticamente al cargar la página
        videoRefs.current.forEach(video => {
            if (video) {
                video.play().catch(error => {
                    console.log('Error reproduciendo video:', error);
                });
            }
        });
    }, []);

    // Animaciones con framer-motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            }
        }
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    const handleMouseEnter = (index) => {
        setHoverIndex(index);
    };

    const handleMouseLeave = () => {
        setHoverIndex(null);
    };

    return (
        <Box
            component="section"
            sx={{
                py: { xs: 6, md: 10 },
                backgroundColor: '#f7f7f9',
                position: 'relative',
                overflow: 'hidden',
                backgroundImage: 'radial-gradient(circle at 20% 90%, rgba(228, 176, 2, 0.03) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(228, 176, 2, 0.03) 0%, transparent 30%)'
            }}
        >
            <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <SectionTitle
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Categorías Destacadas
                </SectionTitle>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ width: '100%' }}
                >
                    <Grid container spacing={6} justifyContent="center">
                        {categories.map((category, index) => (
                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={12}
                                key={category.title}
                                component={motion.div}
                                variants={cardVariants}
                            >
                                <NextLink href={category.path} passHref legacyBehavior>
                                    <Link
                                        underline="none"
                                        onMouseEnter={() => handleMouseEnter(index)}
                                        onMouseLeave={handleMouseLeave}
                                        sx={{ display: 'block' }}
                                    >
                                        <CategoryCard>
                                            <VideoContainer>
                                                <StyledVideo
                                                    ref={el => videoRefs.current[index] = el}
                                                    autoPlay
                                                    muted
                                                    loop
                                                    playsInline
                                                    style={{
                                                        transform: hoverIndex === index ? 'scale(1.05)' : 'scale(1)',
                                                        filter: hoverIndex === index ? 'brightness(1.05)' : 'brightness(1)'
                                                    }}
                                                >
                                                    <source src={category.video} type={category.type} />
                                                    Tu navegador no soporta el elemento de video.
                                                </StyledVideo>
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 50%)',
                                                        opacity: hoverIndex === index ? 0.8 : 0.5,
                                                        transition: 'opacity 0.4s ease'
                                                    }}
                                                />
                                            </VideoContainer>
                                            <CategoryContent>
                                                <CategoryTitle variant="h5" component="h3">
                                                    {category.title}
                                                </CategoryTitle>
                                                <Box
                                                    sx={{
                                                        height: hoverIndex === index ? '30px' : '0px',
                                                        opacity: hoverIndex === index ? 1 : 0,
                                                        transition: 'all 0.3s ease',
                                                        overflow: 'hidden',
                                                        mt: hoverIndex === index ? 1 : 0
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            textAlign: 'center',
                                                            fontFamily: typography.fontFamily,
                                                            color: vistelicaColors.secondary,
                                                            fontSize: '1.1rem'
                                                        }}
                                                    >
                                                        {category.description}
                                                    </Typography>
                                                </Box>
                                            </CategoryContent>
                                        </CategoryCard>
                                    </Link>
                                </NextLink>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Container>
        </Box>
    );
};

export default FeaturedCategories;