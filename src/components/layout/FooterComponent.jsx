'use client';

import React from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Link,
    Divider,
    IconButton,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// Estilos
const FooterContainer = styled(Box)(({ theme }) => ({
    backgroundColor: '#ffffff',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    borderTop: '1px solid #e0e0e0',
}));

const FooterTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '1rem',
    marginBottom: theme.spacing(2),
}));

const FooterLink = styled(Link)(({ theme }) => ({
    color: '#333',
    textDecoration: 'none',
    display: 'block',
    marginBottom: theme.spacing(1),
    fontSize: '0.9rem',
    '&:hover': {
        textDecoration: 'underline',
    },
}));

const SocialIconsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
}));

const BackToTopButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    right: theme.spacing(3),
    bottom: theme.spacing(3),
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    '&:hover': {
        backgroundColor: '#f5f5f5',
    },
}));

const CopyrightText = styled(Typography)(({ theme }) => ({
    fontSize: '0.8rem',
    color: '#666',
    [theme.breakpoints.down('md')]: {
        textAlign: 'center',
    },
}));

const FooterComponent = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <FooterContainer component="footer">
            <Container maxWidth="lg">
                <Grid container spacing={4} sx={{ width: '100%' }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid size={{ xs: 4, sm: 4, md: 2 }}>
                        <FooterTitle variant="h6">Guía de compra</FooterTitle>
                        <FooterLink href="/envios">Envíos</FooterLink>
                        <FooterLink href="/pagos">Pagos</FooterLink>
                        <FooterLink href="/cambios-devoluciones">Cambios y devoluciones</FooterLink>
                        <FooterLink href="/tarjeta-regalo">Tarjeta Regalo</FooterLink>
                        <FooterLink href="/pack-trajearte">Pack Trajearte</FooterLink>
                        <FooterLink href="/vestuario-laboral">Vestuario Laboral</FooterLink>
                    </Grid>

                    <Grid size={{ xs: 4, sm: 4, md: 2 }}>
                        <FooterTitle variant="h6">Ayuda</FooterTitle>
                        <FooterLink href="/preguntas-frecuentes">Preguntas frecuentes</FooterLink>
                        <FooterLink href="/guia-tallas">Guía de tallas</FooterLink>
                        <FooterLink href="/cambio-devolucion">Haz tu cambio/devolución como invitado</FooterLink>
                        <FooterLink href="/contacto">Contacto</FooterLink>
                        <FooterLink href="/bases-sorteo">Bases Sorteo</FooterLink>
                        <FooterLink href="/condiciones-promocionales">Condiciones Promocionales</FooterLink>
                    </Grid>

                    <Grid size={{ xs: 4, sm: 4, md: 2 }}>
                        <FooterTitle variant="h6">Tiendas</FooterTitle>
                        <FooterLink href="/nuestras-tiendas">Nuestras tiendas</FooterLink>
                        <FooterLink href="/trabaja-con-nosotros">Trabaja con nosotros</FooterLink>
                        <FooterLink href="/quienes-somos">¿Quiénes somos?</FooterLink>
                        <FooterLink href="/empresa-alma">Empresa con ALMA</FooterLink>
                        <FooterLink href="/descuento-familias">Descuento Familias Numerosas</FooterLink>
                        <FooterLink href="/sii">SII</FooterLink>
                    </Grid>

                    <Grid size={{ xs: 4, sm: 4, md: 3 }}>
                        <FooterTitle variant="h6">Legal</FooterTitle>
                        <FooterLink href="/aviso-legal">Aviso legal</FooterLink>
                        <FooterLink href="/politica-privacidad">Política de privacidad</FooterLink>
                        <FooterLink href="/politica-cookies">Política de Cookies</FooterLink>
                        <FooterLink href="/datos-seguros">Sus datos seguros</FooterLink>
                        <FooterLink href="/condiciones-uso">Condiciones de uso</FooterLink>
                    </Grid>

                    <Grid size={{ xs: 4, sm: 4, md: 3 }}>
                        <FooterTitle variant="h6">Síguenos</FooterTitle>
                        <SocialIconsContainer>
                            <IconButton aria-label="Facebook"><FacebookIcon /></IconButton>
                            <IconButton aria-label="Instagram"><InstagramIcon /></IconButton>
                            <IconButton aria-label="YouTube"><YouTubeIcon /></IconButton>
                            <IconButton aria-label="Twitter"><TwitterIcon /></IconButton>
                            <IconButton aria-label="TikTok">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 015.25 5C3.8 5.6 3 7.15 3 8.76v6.5a3.79 3.79 0 003.4 3.73 3.94 3.94 0 003.35-.73 4.37 4.37 0 001.14-1.35 3.8 3.8 0 00.37-2.55v-4.4h3.45c.28 0 1.16-.2 1.93-.85a3.37 3.37 0 001.27-2.48c0-2.2-1.43-4-3.98-4h-.47z" />
                                </svg>
                            </IconButton>
                        </SocialIconsContainer>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Grid container columns={{ xs: 4, sm: 8, md: 12 }} sx={{ width: '100%' }}>
                    <Grid size={{ xs: 4, md: 12 }}>
                        <CopyrightText>
                            ©2024 VÍSTELICA. Todos los derechos reservados.
                        </CopyrightText>
                    </Grid>
                </Grid>
            </Container>

            <BackToTopButton onClick={scrollToTop}>
                <KeyboardArrowUpIcon />
            </BackToTopButton>
        </FooterContainer>
    );
};

export default FooterComponent;
