'use client';

import React from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
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
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: { main: '#E4B002' },
        secondary: { main: '#000000' },
    },
    typography: {
        fontFamily: '"Amethysta", "Roboto", "Helvetica", "Arial", sans-serif',
    },
});

const CategoryCard = styled(Card)(({ theme }) => ({
    position: 'relative',
    height: 280,
    borderRadius: 12,
    overflow: 'hidden',
    transition: 'transform 0.3s ease-in-out',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    '&:hover': {
        transform: 'translateY(-10px)',
    },
    [theme.breakpoints.down('sm')]: {
        height: 'auto',
    },
}));

const CategoryContent = styled(CardContent)(() => ({
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    transition: 'background-color 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
    },
}));

const CategoryTitle = styled(Typography)(() => ({
    fontWeight: 600,
    fontSize: '1.5rem',
    textAlign: 'center',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    textAlign: 'center',
    marginBottom: theme.spacing(4),
    fontWeight: 700,
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        bottom: -10,
        left: '50%',
        width: 60,
        height: 3,
        backgroundColor: theme.palette.primary.main,
        transform: 'translateX(-50%)',
    },
}));

const categories = [
    {
        title: 'Hombre',
        image: 'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743966077/vistelica/home%20page/Categories/dzx7haoo6ik5xokyslw6.jpg',
        imageAlt: 'Categoría de moda para hombres',
        path: '/sub-men/MainLayout-subM',
    },
    {
        title: 'Mujer',
        image: 'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1744137006/vistelica/home%20page/Categories/xq8kzsvfmnbkbokax4xs.png',
        imageAlt: 'Categoría de moda para mujeres',
        path: '/sub-women/MainLayout-subW',
    },
    {
        title: 'Teen',
        image: 'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743966088/vistelica/home%20page/Categories/ezcb19ycheflvmt648ay.avif',
        imageAlt: 'Categoría de moda para adolescentes',
        path: '/sub-teen/MainLayout-subT',
    },
    {
        title: 'Accesorios',
        image: 'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743966077/vistelica/home%20page/Categories/ctuks3byizjocgni8mmr.jpg',
        imageAlt: 'Categoría de accesorios de moda',
        path: '/accesorios',
    },
];

const FeaturedCategories = () => {
    return (
        <ThemeProvider theme={theme}>
            <Box component="section" sx={{ py: 8, backgroundColor: '#f7f7f9' }}>
                <Container maxWidth="lg">
                    <SectionTitle variant="h3" component="h2" gutterBottom>
                        Categorías Destacadas
                    </SectionTitle>

                    <Grid container spacing={4}>
                        {categories.map((category) => (
                            <Grid item xs={12} sm={6} md={6} key={category.title}>
                                {category.path ? (
                                    <NextLink href={category.path} passHref legacyBehavior>
                                        <Link underline="none">
                                            <CategoryCard>
                                                <Image
                                                    src={category.image}
                                                    alt={category.imageAlt}
                                                    title={category.title}
                                                    layout="responsive"
                                                    width={300}
                                                    height={280}
                                                />
                                                <CategoryContent>
                                                    <CategoryTitle variant="h5" component="h3">
                                                        {category.title}
                                                    </CategoryTitle>
                                                </CategoryContent>
                                            </CategoryCard>
                                        </Link>
                                    </NextLink>
                                ) : (
                                    <CategoryCard>
                                        <Image
                                            src={category.image}
                                            alt={category.imageAlt}
                                            title={category.title}
                                            layout="responsive"
                                            width={300}
                                            height={280}
                                        />
                                        <CategoryContent>
                                            <CategoryTitle variant="h5" component="h3">
                                                {category.title}
                                            </CategoryTitle>
                                        </CategoryContent>
                                    </CategoryCard>
                                )}
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default FeaturedCategories;
