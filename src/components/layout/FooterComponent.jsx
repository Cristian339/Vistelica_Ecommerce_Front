'use client';

import React, { useMemo, useCallback } from 'react';
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

// Componentes optimizados
const FooterSection = React.memo(({ title, links, delay = 0 }) => {
    return (
        <Grid item xs={4} sm={4} md={2} component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay }}
        >
            <FooterTitle variant="h6" component={motion.div}
                         whileHover={{ scale: 1.03 }}
            >
                {title}
            </FooterTitle>
            <Box component={motion.div}
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
                 role="navigation"
                 aria-label={`Navegación de ${title}`}
            >
                {links.map((link, index) => (
                    <FooterLink
                        key={index}
                        href={link.href}
                        component={motion.a}
                        whileHover={{ x: 5 }}
                    >
                        {link.text}
                    </FooterLink>
                ))}
            </Box>
        </Grid>
    );
});

const SocialSection = React.memo(({ socials, delay = 0.4 }) => {
    return (
        <Grid item xs={4} sm={4} md={3} component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay }}
        >
            <FooterTitle variant="h6" component={motion.div}
                         whileHover={{ scale: 1.03 }}
            >
                Síguenos
            </FooterTitle>
            <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}
            >
                {socials.map((social, index) => (
                    <Tooltip key={index} title={social.name}>
                        <Link href={social.href} target="_blank" rel="noopener noreferrer">
                            <SocialIconButton
                                component={motion.button}
                                whileHover={{ y: -3 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label={social.name}
                            >
                                {social.icon}
                            </SocialIconButton>
                        </Link>
                    </Tooltip>
                ))}
            </Box>
        </Grid>
    );
});

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
    textAlign: 'left', // Garantiza alineación consistente
    '&:hover': {
        color: '#FFD700',
        transform: 'translateX(3px)',
    },
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: vistelicaColors.backgroundLight,
    color: '#F1C40F',
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

const FooterComponent = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Enlaces de cada sección del footer (memoizados)
    const footerSections = useMemo(() => [
        {
            title: "Guía de compra",
            links: [
                { href: "/envios", text: "Envíos" },
                { href: "/pagos", text: "Pagos" },
                { href: "/guia-compra/ReturnsPage", text: "Cambios y devoluciones" },
                { href: "/tarjeta-regalo", text: "Tarjeta Regalo" },
                { href: "/pack-trajearte", text: "Pack Trajearte" },
                { href: "/vestuario-laboral", text: "Vestuario Laboral" }
            ]
        },
        {
            title: "Ayuda",
            links: [
                { href: "/preguntas-frecuentes", text: "Preguntas frecuentes" },
                { href: "/guia-tallas/MenSizeGuidePage", text: "Guía de tallas" },
                { href: "/cambio-devolucion", text: "Cambios/devoluciones como invitado" },
                { href: "/contacto", text: "Contacto" },
                { href: "/bases-sorteo", text: "Bases Sorteo" },
                { href: "/condiciones-promocionales", text: "Condiciones Promocionales" }
            ]
        },
        {
            title: "Mi Cuenta", // Reemplazado "Tiendas" por "Mi Cuenta" más relevante para tienda online
            links: [
                { href: "/mi-cuenta", text: "Iniciar sesión" },
                { href: "/pedidos", text: "Mis pedidos" },
                { href: "/favoritos", text: "Lista de deseos" },
                { href: "/direcciones", text: "Mis direcciones" },
                { href: "/programa-fidelizacion", text: "Programa de puntos" },
                { href: "/newsletter", text: "Suscripción a novedades" }
            ]
        },
        {
            title: "Legal",
            links: [
                { href: "/legal-notice/LegalNotice", text: "Aviso legal" },
                { href: "/privacy-policy/PrivacyPolicy", text: "Política de privacidad" },
                { href: "/politica-cookies", text: "Política de Cookies" },
                { href: "/datos-seguros", text: "Sus datos seguros" },
                { href: "/condiciones/TermsOfUse", text: "Condiciones de uso" },
                { href: "/about-us/AboutUs", text: "Sobre nosotros" }
            ]
        }
    ], []);

    // Redes sociales (memoizadas)
    const socialMedias = useMemo(() => [
        { name: "Facebook", icon: <FacebookIcon />, href: "https://www.facebook.com/profile.php?id=61576882775567" },
        { name: "Instagram", icon: <InstagramIcon />, href: "https://www.instagram.com/vistelica_ecommerce/" },
        { name: "Twitter", icon: <TwitterIcon />, href: "https://x.com/Vistelica_" },
        {
            name: "TikTok",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 015.25 5C3.8 5.6 3 7.15 3 8.76v6.5a3.79 3.79 0 003.4 3.73 3.94 3.94 0 003.35-.73 4.37 4.37 0 001.14-1.35 3.8 3.8 0 00.37-2.55v-4.4h3.45c.28 0 1.16-.2 1.93-.85a3.37 3.37 0 001.27-2.48c0-2.2-1.43-4-3.98-4h-.47z" />
            </svg>,
            href: "https://www.tiktok.com/@vistelica_ecommerce"
        }
    ], []);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <FooterContainer component="footer" role="contentinfo" aria-label="Pie de página">
            <Container maxWidth="lg">
                <Grid container spacing={4} sx={{ width: '100%' }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {footerSections.map((section, index) => (
                        <FooterSection
                            key={section.title}
                            title={section.title}
                            links={section.links}
                            delay={index * 0.1}
                        />
                    ))}

                    <SocialSection socials={socialMedias} />
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
                    aria-label="Volver arriba"
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

// Añadir displayNames para mejor depuración
FooterSection.displayName = 'FooterSection';
SocialSection.displayName = 'SocialSection';

export default React.memo(FooterComponent);