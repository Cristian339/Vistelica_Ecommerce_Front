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

const WomenSizeGuideContent = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const router = useRouter();
    const [tabValue, setTabValue] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    // Data for size tables - Adaptada para mujer
    const topWearSizes = [
        { size: 'XS', bust: '82-85', waist: '62-65', hip: '88-91' },
        { size: 'S', bust: '86-89', waist: '66-69', hip: '92-95' },
        { size: 'M', bust: '90-93', waist: '70-73', hip: '96-98' },
        { size: 'L', bust: '94-97', waist: '74-77', hip: '99-101' },
        { size: 'XL', bust: '98-102', waist: '78-82', hip: '102-105' },
    ];

    const dressSizes = [
        { size: '34', int: 'XXS', bust: '82', waist: '62', hip: '88' },
        { size: '36', int: 'XS', bust: '86', waist: '66', hip: '92' },
        { size: '38', int: 'S', bust: '90', waist: '70', hip: '96' },
        { size: '40', int: 'M', bust: '94', waist: '74', hip: '100' },
        { size: '42', int: 'L', bust: '98', waist: '78', hip: '104' },
        { size: '44', int: 'XL', bust: '102', waist: '82', hip: '108' },
    ];

    const bottomWearSizes = [
        { size: 'XS', waist: '62-65', hip: '88-91' },
        { size: 'S', waist: '66-69', hip: '92-95' },
        { size: 'M', waist: '70-73', hip: '96-98' },
        { size: 'L', waist: '74-77', hip: '99-101' },
        { size: 'XL', waist: '78-82', hip: '102-105' },
    ];

    const underwearSizes = [
        { size: 'XS', int: '75A-80A', waist: '62-65' },
        { size: 'S', int: '85A-90A', waist: '66-69' },
        { size: 'M', int: '95A-100A', waist: '70-73' },
        { size: 'L', int: '105A-110A', waist: '74-77' },
        { size: 'XL', int: '115A-120A', waist: '78-82' },
    ];

    const shoeSizes = [
        { size: '35', length: '22.5' },
        { size: '36', length: '23' },
        { size: '37', length: '23.5' },
        { size: '38', length: '24' },
        { size: '39', length: '24.5' },
        { size: '40', length: '25' },
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
                <title>Guía de Tallas Mujer | Tu Marca</title>
                <meta name="description" content="Guía de tallas para ropa de mujer" />
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
                                case 2: router.push('/guia-tallas/YouthSizeGuideContent'); break;
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
                    GUÍA DE TALLAS MUJER
                </Typography>

                <Box sx={{ mb: 6 }}>
                    <Typography variant="body1" paragraph sx={bodyFont}>
                        Encuentra la talla perfecta para tu estilo. Todas las medidas están en centímetros.
                    </Typography>
                    <Typography variant="body1" paragraph sx={bodyFont}>
                        Recuerda que cada cuerpo es único. Si estás entre dos tallas, te recomendamos elegir la mayor.
                    </Typography>
                </Box>

                {/* Upper Body Section */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 3, ...titleFont }}>
                        PARTE SUPERIOR
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                        <Image
                            src="https://res.cloudinary.com/dhyv4dpk2/image/upload/v1748677549/vistelica/productos/qn2rtnvruhzwtk30ysmo.png"
                            alt="Parte superior mujer"
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
                            <Grid item xs={12} md={4}>
                                <Typography variant="h6" component="h4" gutterBottom sx={titleFont}>
                                    1. BUSTO
                                </Typography>
                                <Typography variant="body1" sx={bodyFont}>
                                    Coloca la cinta métrica alrededor de la parte más llena de tu busto, manteniéndola paralela al suelo.
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Typography variant="h6" component="h4" gutterBottom sx={titleFont}>
                                    2. CINTURA
                                </Typography>
                                <Typography variant="body1" sx={bodyFont}>
                                    Mide alrededor de la parte más estrecha de tu torso, generalmente justo encima del ombligo.
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Typography variant="h6" component="h4" gutterBottom sx={titleFont}>
                                    3. CADERA
                                </Typography>
                                <Typography variant="body1" sx={bodyFont}>
                                    Rodea con la cinta métrica la parte más ancha de tus caderas, pasando por el punto más prominente.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Tops */}
                    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                        <Typography variant="h5" component="h3" gutterBottom sx={titleFont}>
                            BLUSAS | CAMISETAS | TOPS | CHAQUETAS | ABRIGOS
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
                                        <TableCell component="th" scope="row" sx={titleFont}>BUSTO (CM)</TableCell>
                                        {topWearSizes.map(item => (
                                            <TableCell key={`bust-${item.size}`} align="center" sx={bodyFont}>{item.bust}</TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={titleFont}>CINTURA (CM)</TableCell>
                                        {topWearSizes.map(item => (
                                            <TableCell key={`waist-${item.size}`} align="center" sx={bodyFont}>{item.waist}</TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={titleFont}>CADERA (CM)</TableCell>
                                        {topWearSizes.map(item => (
                                            <TableCell key={`hip-${item.size}`} align="center" sx={bodyFont}>{item.hip}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>

                    {/* Dresses */}
                    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                        <Typography variant="h5" component="h3" gutterBottom sx={titleFont}>
                            VESTIDOS | MONOS | ENTERIZOS
                        </Typography>

                        <TableContainer>
                            <Table size={isMobile ? 'small' : 'medium'}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={titleFont}>TALLA ESP</TableCell>
                                        {dressSizes.map(item => (
                                            <TableCell key={item.size} align="center" sx={bodyFont}>{item.size}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={titleFont}>TALLA INT</TableCell>
                                        {dressSizes.map(item => (
                                            <TableCell key={`int-${item.size}`} align="center" sx={bodyFont}>{item.int}</TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={titleFont}>BUSTO (CM)</TableCell>
                                        {dressSizes.map(item => (
                                            <TableCell key={`bust-${item.size}`} align="center" sx={bodyFont}>{item.bust}</TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={titleFont}>CINTURA (CM)</TableCell>
                                        {dressSizes.map(item => (
                                            <TableCell key={`waist-${item.size}`} align="center" sx={bodyFont}>{item.waist}</TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={titleFont}>CADERA (CM)</TableCell>
                                        {dressSizes.map(item => (
                                            <TableCell key={`hip-${item.size}`} align="center" sx={bodyFont}>{item.hip}</TableCell>
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
                            src="https://res.cloudinary.com/dhyv4dpk2/image/upload/v1748676995/vistelica/productos/ji5ubirazncnciiz3g76.png"
                            alt="Parte inferior mujer"
                            width={500}
                            height={400}
                            style={{ objectFit: 'contain' }}
                        />
                    </Box>

                    {/* Pants, Skirts */}
                    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                        <Typography variant="h5" component="h3" gutterBottom sx={{ mb: 2, ...titleFont }}>
                            PANTALONES | FALDAS | SHORTS
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
                            ROPA INTERIOR | BAÑADOR | LENCERÍA
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
                                        <TableCell component="th" scope="row" sx={titleFont}>TALLA INT</TableCell>
                                        {underwearSizes.map(item => (
                                            <TableCell key={`int-${item.size}`} align="center" sx={bodyFont}>{item.int}</TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={titleFont}>CINTURA (CM)</TableCell>
                                        {underwearSizes.map(item => (
                                            <TableCell key={`waist-${item.size}`} align="center" sx={bodyFont}>{item.waist}</TableCell>
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
                            ZAPATOS | SANDALIAS | DEPORTIVOS
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

export default WomenSizeGuideContent;