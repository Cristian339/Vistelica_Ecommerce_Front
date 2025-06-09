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
import Navbar from "@/components/layout/HeaderComponent";

// Definición de estilos de fuente
const titleFont = {
    fontFamily: '"Amethysta", serif',
    fontWeight: 400
};

const bodyFont = {
    fontFamily: '"Tenor Sans", sans-serif',
    fontWeight: 400
};

const MenSizeGuideContent = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const router = useRouter();
    const [tabValue, setTabValue] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    // Data for size tables
    const topWearSizes = [
        { size: 'XS', chest: '88-92' },
        { size: 'S', chest: '94-98' },
        { size: 'M', chest: '100-104' },
        { size: 'L', chest: '106-110' },
        { size: 'XL', chest: '112-116' },
        { size: 'XXL', chest: '118-122' },
    ];

    const shirtSizes = [
        { size: '38', equivalence: 'XS', neck: '38' },
        { size: '39', equivalence: 'S', neck: '39' },
        { size: '40', equivalence: 'M', neck: '40' },
        { size: '41', equivalence: 'M', neck: '41' },
        { size: '42', equivalence: 'L', neck: '42' },
        { size: '43', equivalence: 'XL', neck: '43' },
        { size: '44', equivalence: 'XL', neck: '44' },
        { size: '45', equivalence: 'XXL', neck: '45' },
    ];

    const formalWearSizes = [
        { size: '42', equivalence: 'XS', chest: '88-90' },
        { size: '44', equivalence: 'XS', chest: '92-94' },
        { size: '46', equivalence: 'S', chest: '96-98' },
        { size: '48', equivalence: 'M', chest: '100-102' },
        { size: '50', equivalence: 'M', chest: '104-106' },
        { size: '52', equivalence: 'L', chest: '108-110' },
        { size: '54', equivalence: 'XL', chest: '112-114' },
        { size: '56', equivalence: 'XL', chest: '116-118' },
        { size: '58', equivalence: 'XXL', chest: '120-122' },
        { size: '60', equivalence: 'XXL', chest: '124-126' },
    ];

    const bottomWearSizes = [
        { size: '38', waist: '74-76', hip: '90-93' },
        { size: '40', waist: '78-80', hip: '94-96' },
        { size: '42', waist: '82-84', hip: '97-99' },
        { size: '44', waist: '86-88', hip: '100-102' },
        { size: '46', waist: '90-92', hip: '103-105' },
        { size: '48', waist: '94-96', hip: '106-108' },
        { size: '50', waist: '98-100', hip: '109-111' },
        { size: '52', waist: '102-106', hip: '112-114' },
        { size: '54', waist: '108-110', hip: '116-118' },
        { size: '56', waist: '112-116', hip: '119-122' },
    ];

    const underwearSizes = [
        { size: 'XS', waist: '68-70' },
        { size: 'S', waist: '71-76' },
        { size: 'M', waist: '77-82' },
        { size: 'L', waist: '83-88' },
        { size: 'XL', waist: '89-94' },
        { size: 'XXL', waist: '95-100' },
    ];

    const shoeSizes = [
        { size: '39', length: '25,5' },
        { size: '40', length: '26' },
        { size: '41', length: '26,8' },
        { size: '42', length: '27,5' },
        { size: '43', length: '28' },
        { size: '44', length: '29' },
        { size: '45', length: '28,8' },
        { size: '46', length: '30,6' },
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
                        Cargando guía de tallas...
                    </Typography>
                </motion.div>
            </Box>
        );
    }

    return (
        <>
            <Navbar/>
            <Head>
                <title>Guía de Tallas Hombre | Tu Marca</title>
                <meta name="description" content="Guía de tallas para ropa de hombre" />
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
                            label="Jovenes"
                            sx={{
                                ...bodyFont,
                                fontWeight: tabValue === 2 ? 600 : 400,
                                textTransform: 'none',
                                fontSize: isMobile ? '0.875rem' : '1rem',
                                minWidth: 'unset',
                                px: isMobile ? 1.5 : 3,
                                color: tabValue === 2 ? vistelicaColors.primary : theme.palette.text.secondary,
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
                    GUÍA DE TALLAS HOMBRE
                </Typography>

                <Box sx={{ mb: 6 }}>
                    <Typography variant="body1" paragraph sx={bodyFont}>
                        Encuentra la talla perfecta para tu estilo. Todas las medidas están en centímetros.
                    </Typography>
                    <Typography variant="body1" paragraph sx={bodyFont}>
                        Si necesitas ayuda adicional, nuestro equipo de atención al cliente estará encantado de ayudarte.
                    </Typography>
                </Box>

                {/* Upper Body Section */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 3, ...titleFont }}>
                        PARTE SUPERIOR
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                        <Image
                            src="https://res.cloudinary.com/dhyv4dpk2/image/upload/v1747494646/vistelica/productos/axi8umeoraiw7wxp0ouq.jpg"
                            alt="Parte superior"
                            width={500}
                            height={400}
                            style={{ objectFit: 'contain' }}
                        />
                    </Box>

                    {/* Measurement Instructions */}
                    <Box sx={{ backgroundColor: theme.palette.grey[100], p: 3, mb: 4, borderRadius: 1 }}>
                        <Typography variant="h5" component="h3" gutterBottom sx={titleFont}>
                            ¿CÓMO TOMARNOS CORRECTAMENTE LAS MEDIDAS?
                        </Typography>

                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" component="h4" gutterBottom sx={titleFont}>
                                    1. CUELLO
                                </Typography>
                                <Typography variant="body1" sx={bodyFont}>
                                    Debemos medirnos con una cinta métrica alrededor del cuello con una cierta inclinación
                                    en la parte delantera por donde caería el botón de la camisa.
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" component="h4" gutterBottom sx={titleFont}>
                                    2. PECHO
                                </Typography>
                                <Typography variant="body1" sx={bodyFont}>
                                    Debemos medirnos con una cinta métrica alrededor del pecho justo por debajo de los brazos.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Casual Wear */}
                    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                        <Typography variant="h5" component="h3" gutterBottom sx={titleFont}>
                            PARKAS | CHALECOS | CAZADORAS | JERSEYS | POLOS | CAMISETAS | SUDADERAS
                        </Typography>

                        <TableContainer>
                            <Table size={isMobile ? 'small' : 'medium'}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={titleFont}>TALLA</TableCell>
                                        {topWearSizes.map(item => (
                                            <TableCell key={item.size} align="center" sx={bodyFont}>{item.size}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={titleFont}>PECHO (CM)</TableCell>
                                        {topWearSizes.map(item => (
                                            <TableCell key={`chest-${item.size}`} align="center" sx={bodyFont}>{item.chest}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>

                    {/* Shirts */}
                    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                        <Typography variant="h5" component="h3" gutterBottom sx={titleFont}>
                            CAMISAS
                        </Typography>

                        <TableContainer>
                            <Table size={isMobile ? 'small' : 'medium'}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={titleFont}>TALLA</TableCell>
                                        {shirtSizes.map(item => (
                                            <TableCell key={item.size} align="center" sx={bodyFont}>{item.size}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={titleFont}>EQUIVALENCIA</TableCell>
                                        {shirtSizes.map(item => (
                                            <TableCell key={`equiv-${item.size}`} align="center" sx={bodyFont}>{item.equivalence}</TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={titleFont}>CUELLO (CM)</TableCell>
                                        {shirtSizes.map(item => (
                                            <TableCell key={`neck-${item.size}`} align="center" sx={bodyFont}>{item.neck}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>

                    {/* Formal Wear */}
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h5" component="h3" gutterBottom sx={titleFont}>
                            ABRIGOS | AMERICANAS | TRAJES | CHAQUÉS | CHALECO CEREMONIA
                        </Typography>

                        <TableContainer>
                            <Table size={isMobile ? 'small' : 'medium'}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={titleFont}>TALLA</TableCell>
                                        {formalWearSizes.map(item => (
                                            <TableCell key={item.size} align="center" sx={bodyFont}>{item.size}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={titleFont}>EQUIVALENCIA</TableCell>
                                        {formalWearSizes.map(item => (
                                            <TableCell key={`equiv-${item.size}`} align="center" sx={bodyFont}>{item.equivalence}</TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={titleFont}>PECHO (CM)</TableCell>
                                        {formalWearSizes.map(item => (
                                            <TableCell key={`chest-${item.size}`} align="center" sx={bodyFont}>{item.chest}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>

                <Divider sx={{ my: 6 }} />

                {/* Lower Body Section */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 3, ...titleFont }}>
                        PARTE INFERIOR
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                        <Image
                            src="https://res.cloudinary.com/dhyv4dpk2/image/upload/v1747494647/vistelica/productos/h4add57bz1av8hnwmrm4.jpg"
                            alt="Parte inferior"
                            width={500}
                            height={400}
                            style={{ objectFit: 'contain' }}
                        />
                    </Box>

                    {/* Measurement Instructions */}
                    <Box sx={{ backgroundColor: theme.palette.grey[100], p: 3, mb: 4, borderRadius: 1 }}>
                        <Typography variant="h5" component="h3" gutterBottom sx={titleFont}>
                            ¿CÓMO TOMARNOS CORRECTAMENTE LAS MEDIDAS?
                        </Typography>

                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" component="h4" gutterBottom sx={titleFont}>
                                    3. CINTURA
                                </Typography>
                                <Typography variant="body1" sx={bodyFont}>
                                    Trazamos con la cinta métrica el contorno de nuestra cintura a la altura de donde se situaría el cinturón.
                                    La medida que nos dé, sería la talla del cinturón.
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" component="h4" gutterBottom sx={titleFont}>
                                    4. CADERA
                                </Typography>
                                <Typography variant="body1" sx={bodyFont}>
                                    Con la cinta métrica rodearemos la parte más ancha de nuestra cadera pasando por la parte más sobresaliente del trasero.
                                    Recuerda que para tomar esta medida debes juntar los pies antes.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Pants, Bermudas, Belts */}
                    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                        <Typography variant="h5" component="h3" gutterBottom sx={{ mb: 2, ...titleFont }}>
                            PANTALONES | BERMUDAS | CINTURONES
                        </Typography>

                        <TableContainer>
                            <Table size={isMobile ? 'small' : 'medium'}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={titleFont}>TALLA</TableCell>
                                        {bottomWearSizes.map(item => (
                                            <TableCell key={item.size} align="center" sx={bodyFont}>{item.size}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={titleFont}>CINTURA (CM)</TableCell>
                                        {bottomWearSizes.map(item => (
                                            <TableCell key={`waist-${item.size}`} align="center" sx={bodyFont}>{item.waist}</TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={titleFont}>CADERA (CM)</TableCell>
                                        {bottomWearSizes.map(item => (
                                            <TableCell key={`hip-${item.size}`} align="center" sx={bodyFont}>{item.hip}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>

                    {/* Underwear */}
                    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                        <Typography variant="h5" component="h3" gutterBottom sx={{ mb: 2, ...titleFont }}>
                            UNDERWEAR | BAÑO
                        </Typography>

                        <TableContainer>
                            <Table size={isMobile ? 'small' : 'medium'}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={titleFont}>TALLA</TableCell>
                                        {underwearSizes.map(item => (
                                            <TableCell key={item.size} align="center" sx={bodyFont}>{item.size}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={titleFont}>CINTURA (CM)</TableCell>
                                        {underwearSizes.map(item => (
                                            <TableCell key={`under-waist-${item.size}`} align="center" sx={bodyFont}>{item.waist}</TableCell>
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
                        CALZADO
                    </Typography>

                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h5" component="h3" gutterBottom sx={{ mb: 2, ...titleFont }}>
                            SNEAKERS | ZAPATOS
                        </Typography>

                        <TableContainer>
                            <Table size={isMobile ? 'small' : 'medium'}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={titleFont}>TALLA</TableCell>
                                        {shoeSizes.map(item => (
                                            <TableCell key={item.size} align="center" sx={bodyFont}>{item.size}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={titleFont}>LONGITUD PIE (CM)</TableCell>
                                        {shoeSizes.map(item => (
                                            <TableCell key={`length-${item.size}`} align="center" sx={bodyFont}>{item.length}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            </Container>
        </>
    );
};

export default MenSizeGuideContent;