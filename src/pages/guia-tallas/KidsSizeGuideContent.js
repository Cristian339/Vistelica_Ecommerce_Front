'use client';

import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    Divider,
    useTheme,
    useMediaQuery,
    Tabs,
    Tab,
    CircularProgress
} from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import Image from 'next/image';
import { motion } from 'framer-motion';

// Definición de estilos de fuente
const titleFont = {
    fontFamily: '"Amethysta", serif',
    fontWeight: 400
};

const bodyFont = {
    fontFamily: '"Tenor Sans", sans-serif',
    fontWeight: 400
};

const YouthSizeGuideContent = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const router = useRouter();
    const [tabValue, setTabValue] = useState(3); // Nuevo valor para Jóvenes
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    // Data for size tables - Adaptada para jóvenes
    const youthClothingSizes = [
        { size: 'XS', height: '150-160', chest: '78-82', waist: '64-68', hip: '84-88', age: '12-14 años' },
        { size: 'S', height: '160-168', chest: '82-86', waist: '68-72', hip: '88-92', age: '14-16 años' },
        { size: 'M', height: '168-176', chest: '86-92', waist: '72-76', hip: '92-96', age: '16-18 años' },
        { size: 'L', height: '176-184', chest: '92-98', waist: '76-80', hip: '96-100', age: '18-20 años' },
        { size: 'XL', height: '184-190', chest: '98-104', waist: '80-84', hip: '100-104', age: '20+ años' },
    ];

    const youthShoeSizes = [
        { eu: '35-37', us: '3-5', uk: '2-4', cm: '22-23.5', age: '12-14 años' },
        { eu: '37-39', us: '5-7', uk: '4-6', cm: '23.5-25', age: '14-16 años' },
        { eu: '39-41', us: '7-9', uk: '6-8', cm: '25-26.5', age: '16-18 años' },
        { eu: '41-43', us: '9-11', uk: '8-10', cm: '26.5-28', age: '18-20 años' },
        { eu: '43-45', us: '11-13', uk: '10-12', cm: '28-29.5', age: '20+ años' },
    ];

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    backgroundColor: theme.palette.background.paper
                }}
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <CircularProgress
                        size={60}
                        thickness={4}
                        sx={{
                            color: vistelicaColors.primary,
                            mb: 3
                        }}
                    />
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            color: vistelicaColors.primary,
                            ...bodyFont
                        }}
                    >
                        Cargando guía de tallas para jóvenes...
                    </Typography>
                </motion.div>
            </Box>
        );
    }

    return (
        <>
            <Head>
                <title>Guía de Tallas Jóvenes | Tu Marca</title>
                <meta name="description" content="Guía de tallas para ropa de jóvenes" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Amethysta&family=Tenor+Sans&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Size Guide Selector */}
                <Box sx={{
                    width: '100%',
                    mb: 4,
                    borderBottom: 1,
                    borderColor: 'divider',
                    backgroundColor: 'white',
                    borderRadius: 1,
                    boxShadow: theme.shadows[1],
                    textAlign: 'center'
                }}>
                    <Typography
                        variant="h6"
                        sx={{
                            px: 3,
                            pt: 2,
                            color: vistelicaColors.primary,
                            ...titleFont
                        }}
                    >
                        SELECCIONA LA GUÍA DE TALLAS
                    </Typography>
                    <Tabs
                        value={tabValue}
                        onChange={(e, newValue) => {
                            setTabValue(newValue);
                            switch(newValue) {
                                case 0: router.push('/guia-tallas/MenSizeGuidePage'); break;
                                case 1: router.push('/guia-tallas/WomenSizeGuideContent'); break;
                                case 3: router.push('/guia-tallas/YouthSizeGuideContent'); break;
                            }
                        }}
                        variant={isMobile ? 'scrollable' : 'fullWidth'}
                        scrollButtons="auto"
                        aria-label="Selector de guías de tallas"
                        sx={{
                            '& .MuiTabs-indicator': {
                                backgroundColor: vistelicaColors.primary,
                                height: 3
                            }
                        }}
                    >
                        <Tab
                            label="Hombre"
                            sx={{
                                ...bodyFont,
                                fontWeight: tabValue === 0 ? 600 : 400,
                                textTransform: 'none',
                                fontSize: isMobile ? '0.875rem' : '1rem',
                                minWidth: 'unset',
                                px: isMobile ? 1.5 : 3,
                                color: tabValue === 0 ? vistelicaColors.primary : theme.palette.text.secondary,
                                '&.Mui-selected': {
                                    color: vistelicaColors.primary,
                                }
                            }}
                        />
                        <Tab
                            label="Mujer"
                            sx={{
                                ...bodyFont,
                                fontWeight: tabValue === 1 ? 600 : 400,
                                textTransform: 'none',
                                fontSize: isMobile ? '0.875rem' : '1rem',
                                minWidth: 'unset',
                                px: isMobile ? 1.5 : 3,
                                color: tabValue === 1 ? vistelicaColors.primary : theme.palette.text.secondary,
                                '&.Mui-selected': {
                                    color: vistelicaColors.primary,
                                }
                            }}
                        />
                        <Tab
                            label="Jóvenes"
                            sx={{
                                ...bodyFont,
                                fontWeight: tabValue === 3 ? 600 : 400,
                                textTransform: 'none',
                                fontSize: isMobile ? '0.875rem' : '1rem',
                                minWidth: 'unset',
                                px: isMobile ? 1.5 : 3,
                                color: tabValue === 3 ? vistelicaColors.primary : theme.palette.text.secondary,
                                '&.Mui-selected': {
                                    color: vistelicaColors.primary,
                                }
                            }}
                        />
                    </Tabs>
                </Box>

                {/* Main Content */}
                <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
                    sx={{
                        textAlign: 'center',
                        mb: 4,
                        fontSize: isMobile ? '2rem' : '2.5rem',
                        ...titleFont
                    }}
                >
                    GUÍA DE TALLAS JÓVENES
                </Typography>

                <Box sx={{ mb: 6 }}>
                    <Typography variant="body1" paragraph sx={bodyFont}>
                        Encuentra la talla perfecta para adolescentes y jóvenes. Todas las medidas están en centímetros.
                    </Typography>
                    <Typography variant="body1" paragraph sx={bodyFont}>
                        Los jóvenes están en pleno crecimiento, te recomendamos verificar las medidas cada 6 meses.
                    </Typography>
                </Box>

                {/* Clothing Section */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 3, ...titleFont }}>
                        ROPA PARA JÓVENES
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                        <Image
                            src="https://res.cloudinary.com/dhyv4dpk2/image/upload/v1748676997/vistelica/productos/ureobwlowwwnf8ksn8kk.png"
                            alt="Ropa juvenil"
                            width={600}
                            height={400}
                            style={{ objectFit: 'contain' }}
                        />
                    </Box>

                    {/* Measurement Instructions */}
                    <Box sx={{ backgroundColor: theme.palette.grey[100], p: 3, mb: 4, borderRadius: 1 }}>
                        <Typography variant="h5" component="h3" gutterBottom sx={titleFont}>
                            ¿CÓMO MEDIR A LOS JÓVENES CORRECTAMENTE?
                        </Typography>

                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            <Grid item xs={12} md={4}>
                                <Typography variant="h6" component="h4" gutterBottom sx={titleFont}>
                                    1. ALTURA
                                </Typography>
                                <Typography variant="body1" sx={bodyFont}>
                                    Mide desde la parte superior de la cabeza hasta los pies, con el joven de pie contra una pared.
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Typography variant="h6" component="h4" gutterBottom sx={titleFont}>
                                    2. PECHO
                                </Typography>
                                <Typography variant="body1" sx={bodyFont}>
                                    Rodea con la cinta métrica la parte más ancha del pecho, manteniendo la cinta paralela al suelo.
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Typography variant="h6" component="h4" gutterBottom sx={titleFont}>
                                    3. CADERA
                                </Typography>
                                <Typography variant="body1" sx={bodyFont}>
                                    Mide alrededor de la parte más ancha de las caderas, sobre los glúteos.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Clothing Sizes */}
                    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                        <Typography variant="h5" component="h3" gutterBottom sx={titleFont}>
                            CAMISETAS | PANTALONES | SUDADERAS | CHAQUETAS | JEANS
                        </Typography>

                        <TableContainer>
                            <Table size={isMobile ? 'small' : 'medium'}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={titleFont}>TALLA</TableCell>
                                        {youthClothingSizes.map(item => (
                                            <TableCell key={item.size} align="center" sx={bodyFont}>{item.size}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={titleFont}>EDAD</TableCell>
                                        {youthClothingSizes.map(item => (
                                            <TableCell key={`age-${item.size}`} align="center" sx={bodyFont}>{item.age}</TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={titleFont}>ALTURA (CM)</TableCell>
                                        {youthClothingSizes.map(item => (
                                            <TableCell key={`height-${item.size}`} align="center" sx={bodyFont}>{item.height}</TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={titleFont}>PECHO (CM)</TableCell>
                                        {youthClothingSizes.map(item => (
                                            <TableCell key={`chest-${item.size}`} align="center" sx={bodyFont}>{item.chest}</TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={titleFont}>CINTURA (CM)</TableCell>
                                        {youthClothingSizes.map(item => (
                                            <TableCell key={`waist-${item.size}`} align="center" sx={bodyFont}>{item.waist}</TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={titleFont}>CADERA (CM)</TableCell>
                                        {youthClothingSizes.map(item => (
                                            <TableCell key={`hip-${item.size}`} align="center" sx={bodyFont}>{item.hip}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>

                <Divider sx={{ my: 6 }} />

                {/* Footwear Section */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 3, ...titleFont }}>
                        CALZADO PARA JÓVENES
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                        <Image
                            src="https://res.cloudinary.com/dhyv4dpk2/image/upload/v1748676996/vistelica/productos/dyoqkbzpwerbrhj4vkc3.png"
                            alt="Calzado juvenil"
                            width={600}
                            height={400}
                            style={{ objectFit: 'contain' }}
                        />
                    </Box>

                    {/* Shoe Sizes */}
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h5" component="h3" gutterBottom sx={{ mb: 2, ...titleFont }}>
                            ZAPATOS | DEPORTIVOS | BOTAS | SANDALIAS
                        </Typography>

                        <TableContainer>
                            <Table size={isMobile ? 'small' : 'medium'}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={titleFont}>EDAD</TableCell>
                                        {youthShoeSizes.map(item => (
                                            <TableCell key={item.age} align="center" sx={bodyFont}>{item.age}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={titleFont}>TALLA EU</TableCell>
                                        {youthShoeSizes.map(item => (
                                            <TableCell key={`eu-${item.age}`} align="center" sx={bodyFont}>{item.eu}</TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={titleFont}>TALLA US</TableCell>
                                        {youthShoeSizes.map(item => (
                                            <TableCell key={`us-${item.age}`} align="center" sx={bodyFont}>{item.us}</TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={titleFont}>TALLA UK</TableCell>
                                        {youthShoeSizes.map(item => (
                                            <TableCell key={`uk-${item.age}`} align="center" sx={bodyFont}>{item.uk}</TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={titleFont}>LONGITUD (CM)</TableCell>
                                        {youthShoeSizes.map(item => (
                                            <TableCell key={`cm-${item.age}`} align="center" sx={bodyFont}>{item.cm}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>

                {/* Additional Tips */}
                <Box sx={{ backgroundColor: theme.palette.grey[100], p: 3, borderRadius: 1, mt: 4 }}>
                    <Typography variant="h5" component="h3" gutterBottom sx={titleFont}>
                        CONSEJOS PARA ELEGIR TALLAS PARA JÓVENES
                    </Typography>
                    <Typography variant="body1" paragraph sx={bodyFont}>
                        • Mide al joven antes de comprar, especialmente durante períodos de crecimiento acelerado.
                    </Typography>
                    <Typography variant="body1" paragraph sx={bodyFont}>
                        • Para ropa, considera que los jóvenes pueden preferir ajustes más modernos (oversize o slim fit).
                    </Typography>
                    <Typography variant="body1" paragraph sx={bodyFont}>
                        • En calzado, deja aproximadamente 1 cm de espacio para comodidad y crecimiento.
                    </Typography>
                    <Typography variant="body1" paragraph sx={bodyFont}>
                        • Las tallas pueden variar según la marca, siempre revisa las guías específicas del producto.
                    </Typography>
                    <Typography variant="body1" paragraph sx={bodyFont}>
                        • Considera que los jóvenes pueden estar en pleno desarrollo, opta por tallas con algo de margen.
                    </Typography>
                </Box>
            </Container>
        </>
    );
};

export default YouthSizeGuideContent;