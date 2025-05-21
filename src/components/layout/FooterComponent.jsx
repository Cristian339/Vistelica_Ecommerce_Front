'use client';

import React, { useState } from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Link,
    Divider,
    IconButton,
    useTheme,
    useMediaQuery,
    Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

// Estilos
const FooterContainer = styled(Box)(({ theme }) => ({
    backgroundColor: vistelicaColors.backgroundLight,
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(4),
    borderTop: `1px solid ${vistelicaColors.primary}`,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '3px',
        background: `linear-gradient(90deg, ${vistelicaColors.primary}, ${vistelicaColors.secondary})`,
    }
}));

const FooterTitle = styled(Typography)(({ theme }) => ({
    fontFamily: typography.fontFamily,
    fontWeight: 600,
    fontSize: '1.1rem',
    marginBottom: theme.spacing(2.5),
    color: vistelicaColors.secondary,
    position: 'relative',
    display: 'inline-block',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -5,
        left: 0,
        width: '30px',
        height: '2px',
        backgroundColor: vistelicaColors.primary
    }
}));

const FooterLink = styled(Link)(({ theme }) => ({
    color: vistelicaColors.primary,
    textDecoration: 'none',
    display: 'block',
    marginBottom: theme.spacing(1.2),
    fontSize: '0.9rem',
    fontFamily: typography.fontFamily,
    transition: 'transform 0.2s ease, color 0.2s ease',
    '&:hover': {
        color: '#FFD700', // Color amarillo dorado para el hover
        transform: 'translateX(3px)',
    },
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: vistelicaColors.backgroundLight,
    color: '#F1C40F', // Color amarillo en lugar de vistelicaColors.text
    border: `1px solid ${vistelicaColors.divider}`,
    margin: theme.spacing(0.5),
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: vistelicaColors.primary,
        color: '#fff',
        transform: 'translateY(-3px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
}));

const BackToTopButton = styled(motion.div)({
    position: 'absolute',
    right: '24px',
    bottom: '24px',
    zIndex: 10,
});

const CopyrightText = styled(Typography)(({ theme }) => ({
    fontSize: '0.85rem',
    color: vistelicaColors.secondary,
    fontFamily: typography.fontFamily,
    [theme.breakpoints.down('md')]: {
        textAlign: 'center',
    },
}));

const GridItem = styled(Grid)({
    opacity: 0,
});

const FooterComponent = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [hoveredSection, setHoveredSection] = useState(null);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <FooterContainer component="footer">
            <Container maxWidth="lg">
                <Grid container spacing={4} sx={{ width: '100%' }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid item xs={4} sm={4} md={2} component={motion.div}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}>
                        <FooterTitle variant="h6" component={motion.div}
                                     whileHover={{ scale: 1.03 }}>
                            Guía de compra
                        </FooterTitle>
                        <Box component={motion.div}
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}>
                            <FooterLink href="/envios" component={motion.a} whileHover={{ x: 5 }}>Envíos</FooterLink>
                            <FooterLink href="/pagos" component={motion.a} whileHover={{ x: 5 }}>Pagos</FooterLink>
                            <FooterLink href="/cambios-devoluciones" component={motion.a} whileHover={{ x: 5 }}>Cambios y devoluciones</FooterLink>
                            <FooterLink href="/tarjeta-regalo" component={motion.a} whileHover={{ x: 5 }}>Tarjeta Regalo</FooterLink>
                            <FooterLink href="/pack-trajearte" component={motion.a} whileHover={{ x: 5 }}>Pack Trajearte</FooterLink>
                            <FooterLink href="/vestuario-laboral" component={motion.a} whileHover={{ x: 5 }}>Vestuario Laboral</FooterLink>
                        </Box>
                    </Grid>

                    <Grid item xs={4} sm={4} md={2} component={motion.div}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 }}>
                        <FooterTitle variant="h6" component={motion.div}
                                     whileHover={{ scale: 1.03 }}>
                            Ayuda
                        </FooterTitle>
                        <Box component={motion.div}
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}>
                            <FooterLink href="/preguntas-frecuentes" component={motion.a} whileHover={{ x: 5 }}>Preguntas frecuentes</FooterLink>
                            <FooterLink href="/guia-tallas" component={motion.a} whileHover={{ x: 5 }}>Guía de tallas</FooterLink>
                            <FooterLink href="/cambio-devolucion" component={motion.a} whileHover={{ x: 5 }}>Cambios/devoluciones como invitado</FooterLink>
                            <FooterLink href="/contacto" component={motion.a} whileHover={{ x: 5 }}>Contacto</FooterLink>
                            <FooterLink href="/bases-sorteo" component={motion.a} whileHover={{ x: 5 }}>Bases Sorteo</FooterLink>
                            <FooterLink href="/condiciones-promocionales" component={motion.a} whileHover={{ x: 5 }}>Condiciones Promocionales</FooterLink>
                        </Box>
                    </Grid>

                    <Grid item xs={4} sm={4} md={2} component={motion.div}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}>
                        <FooterTitle variant="h6" component={motion.div}
                                     whileHover={{ scale: 1.03 }}>
                            Tiendas
                        </FooterTitle>
                        <Box component={motion.div}
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}>
                            <FooterLink href="/nuestras-tiendas" component={motion.a} whileHover={{ x: 5 }}>Nuestras tiendas</FooterLink>
                            <FooterLink href="/trabaja-con-nosotros" component={motion.a} whileHover={{ x: 5 }}>Trabaja con nosotros</FooterLink>
                            <FooterLink href="/quienes-somos" component={motion.a} whileHover={{ x: 5 }}>¿Quiénes somos?</FooterLink>
                            <FooterLink href="/empresa-alma" component={motion.a} whileHover={{ x: 5 }}>Empresa con ALMA</FooterLink>
                            <FooterLink href="/descuento-familias" component={motion.a} whileHover={{ x: 5 }}>Descuento Familias Numerosas</FooterLink>
                            <FooterLink href="/sii" component={motion.a} whileHover={{ x: 5 }}>SII</FooterLink>
                        </Box>
                    </Grid>

                    <Grid item xs={4} sm={4} md={3} component={motion.div}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}>
                        <FooterTitle variant="h6" component={motion.div}
                                     whileHover={{ scale: 1.03 }}>
                            Legal
                        </FooterTitle>
                        <Box component={motion.div}
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}>
                            <FooterLink href="/aviso-legal" component={motion.a} whileHover={{ x: 5 }}>Aviso legal</FooterLink>
                            <FooterLink href="/politica-privacidad" component={motion.a} whileHover={{ x: 5 }}>Política de privacidad</FooterLink>
                            <FooterLink href="/politica-cookies" component={motion.a} whileHover={{ x: 5 }}>Política de Cookies</FooterLink>
                            <FooterLink href="/datos-seguros" component={motion.a} whileHover={{ x: 5 }}>Sus datos seguros</FooterLink>
                            <FooterLink href="/condiciones-uso" component={motion.a} whileHover={{ x: 5 }}>Condiciones de uso</FooterLink>
                        </Box>
                    </Grid>

                    <Grid item xs={4} sm={4} md={3} component={motion.div}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}>
                        <FooterTitle variant="h6" component={motion.div}
                                     whileHover={{ scale: 1.03 }}>
                            Síguenos
                        </FooterTitle>
                        <Box
                            component={motion.div}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}
                        >
                            <Tooltip title="Facebook">
                                <SocialIconButton component={motion.button} whileHover={{ y: -3 }} whileTap={{ scale: 0.9 }} aria-label="Facebook">
                                    <FacebookIcon />
                                </SocialIconButton>
                            </Tooltip>
                            <Tooltip title="Instagram">
                                <SocialIconButton component={motion.button} whileHover={{ y: -3 }} whileTap={{ scale: 0.9 }} aria-label="Instagram">
                                    <InstagramIcon />
                                </SocialIconButton>
                            </Tooltip>
                            <Tooltip title="YouTube">
                                <SocialIconButton component={motion.button} whileHover={{ y: -3 }} whileTap={{ scale: 0.9 }} aria-label="YouTube">
                                    <YouTubeIcon />
                                </SocialIconButton>
                            </Tooltip>
                            <Tooltip title="Twitter">
                                <SocialIconButton component={motion.button} whileHover={{ y: -3 }} whileTap={{ scale: 0.9 }} aria-label="Twitter">
                                    <TwitterIcon />
                                </SocialIconButton>
                            </Tooltip>
                            <Tooltip title="TikTok">
                                <SocialIconButton component={motion.button} whileHover={{ y: -3 }} whileTap={{ scale: 0.9 }} aria-label="TikTok">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 015.25 5C3.8 5.6 3 7.15 3 8.76v6.5a3.79 3.79 0 003.4 3.73 3.94 3.94 0 003.35-.73 4.37 4.37 0 001.14-1.35 3.8 3.8 0 00.37-2.55v-4.4h3.45c.28 0 1.16-.2 1.93-.85a3.37 3.37 0 001.27-2.48c0-2.2-1.43-4-3.98-4h-.47z" />
                                    </svg>
                                </SocialIconButton>
                            </Tooltip>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{
                    my: 4,
                    '&::before, &::after': {
                        borderColor: vistelicaColors.primary
                    },
                    opacity: 0.7
                }} />

                <Grid container columns={{ xs: 4, sm: 8, md: 12 }} sx={{ width: '100%' }}>
                    <Grid item xs={4} md={12} component={motion.div}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}>
                        <CopyrightText>
                            ©2024 VÍSTELICA. Todos los derechos reservados.
                        </CopyrightText>
                    </Grid>
                </Grid>
            </Container>

            <BackToTopButton
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                whileHover={{
                    scale: 1.1,
                    boxShadow: '0 8px 15px rgba(0,0,0,0.1)'
                }}
                whileTap={{ scale: 0.9 }}
            >
                <IconButton
                    onClick={scrollToTop}
                    sx={{
                        backgroundColor: vistelicaColors.primary,
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: vistelicaColors.secondary
                        }
                    }}
                >
                    <KeyboardArrowUpIcon />
                </IconButton>
            </BackToTopButton>
        </FooterContainer>
    );
};

export default FooterComponent;