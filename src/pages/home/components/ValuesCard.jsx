'use client';
import React, { useMemo } from 'react';
import { Box, Typography, Container, Grid, Paper, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { vistelicaColors } from '../../shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

// Componente para los iconos de valores
const ValueIcon = React.memo(({ icon, alt }) => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <Box sx={{
            border: `2px solid ${vistelicaColors.tertiary}`,
            borderRadius: '50%',
            p: 2,
            mb: 3,
            bgcolor: 'white',
            boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: { xs: 65, md: 80 }, // Más grande en desktop
            height: { xs: 65, md: 80 }, // Más grande en desktop
            mx: 'auto' // Centrado en móvil
        }}
             role="img"
             aria-label={alt}
        >
            {icon}
        </Box>
    );
});

// Componente para cada tarjeta de valor
const ValueItem = React.memo(({ icon, title, description, iconAlt }) => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // Centrado en todas las pantallas
            justifyContent: 'center', // Añadido para mejor centrado
            height: '100%',
            p: { xs: 2.5, md: 3 }, // Más padding en desktop
            textAlign: 'center', // Centrado de texto para móvil
            borderRadius: '12px',
            transition: 'all 0.4s ease',
            '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                bgcolor: 'rgba(255,255,255,0.6)'
            }
        }}>
            <ValueIcon icon={icon} alt={iconAlt} />
            <Typography
                variant="subtitle1"
                sx={{
                    fontWeight: 600,
                    fontFamily: typography.fontFamily,
                    color: vistelicaColors.secondary,
                    mb: 1.5,
                    fontSize: { xs: '1.1rem', md: '1.2rem' }, // Más grande en desktop
                    textAlign: 'center' // Aseguramos centrado en todas las pantallas
                }}
            >
                {title}
            </Typography>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    textAlign: 'center',
                    fontFamily: typography.fontFamily,
                    maxWidth: { xs: '220px', md: '240px' }, // Más ancho en desktop
                    mx: 'auto',
                    fontSize: { xs: '0.875rem', md: '0.95rem' } // Más grande en desktop
                }}
            >
                {description}
            </Typography>
        </Box>
    );
});

// Componente para el divisor animado
const AnimatedDivider = React.memo(({ variants }) => (
    <Box sx={{ mt: 3, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <motion.svg
            width="220"
            height="24"
            viewBox="0 0 220 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <motion.path
                d="M2 12C2 12 55 4 110 12C165 20 218 12 218 12"
                stroke={vistelicaColors.primary}
                strokeWidth="1.5"
                strokeLinecap="round"
                variants={variants}
                initial="hidden"
                animate="visible"
            />
        </motion.svg>
    </Box>
));

// Datos de los valores de la empresa
const valuesData = [
    {
        id: 'shipping',
        title: 'Envío rápido',
        description: 'Gratis en pedidos superiores a $25. Paquetería premium.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={vistelicaColors.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
        ),
        iconAlt: 'Icono de envío rápido'
    },
    {
        id: 'sustainable',
        title: 'Proceso sostenible',
        description: 'De principio a fin. Cuidamos del medio ambiente en cada paso de producción.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={vistelicaColors.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
        ),
        iconAlt: 'Icono de sostenibilidad'
    },
    {
        id: 'designs',
        title: 'Diseños únicos',
        description: 'Materiales de alta calidad seleccionados para garantizar exclusividad y durabilidad.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={vistelicaColors.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
        ),
        iconAlt: 'Icono de diseño único'
    },
    {
        id: 'security',
        title: 'Total seguridad',
        description: 'Protección de datos garantizada en todos nuestros procesos de pago y envío.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={vistelicaColors.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
        ),
        iconAlt: 'Icono de seguridad'
    }
];

const ValuesCard = () => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    // Memoizar las variantes de animación
    const animations = useMemo(() => ({
        containerVariants: {
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: {
                    when: "beforeChildren",
                    staggerChildren: 0.2
                }
            }
        },
        itemVariants: {
            hidden: { y: 20, opacity: 0 },
            visible: {
                y: 0,
                opacity: 1,
                transition: {
                    type: "spring",
                    stiffness: 80,
                    duration: 0.5
                }
            }
        },
        logoVariants: {
            hidden: { scale: 0.8, opacity: 0 },
            visible: {
                scale: 1,
                opacity: 1,
                transition: {
                    delay: 0.3,
                    type: "spring",
                    stiffness: 100
                }
            }
        },
        dividerVariants: {
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
                pathLength: 1,
                opacity: 1,
                transition: {
                    delay: 0.8,
                    duration: 1.5,
                    ease: "easeInOut"
                }
            }
        }
    }), []);

    return (
        <Container
            maxWidth="xl" // Cambiado a xl para más espacio horizontal
            sx={{
                py: { xs: 5, md: 8 },
                px: { xs: 2, md: 4 }
            }}
        >
            <motion.div
                initial="hidden"
                animate="visible"
                variants={animations.containerVariants}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <Paper elevation={3} sx={{
                    p: { xs: 3, md: 6 }, // Más padding vertical en desktop
                    bgcolor: '#FDFBF6',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    maxWidth: { xs: '100%', md: '1400px' }, // Más ancho en desktop
                    mx: 'auto',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '5px',
                        background: `linear-gradient(90deg, ${vistelicaColors.primary}, ${vistelicaColors.secondary})`,
                    }
                }}>
                    <motion.div variants={animations.logoVariants}>
                        <Typography
                            variant="h3"
                            component="h1"
                            sx={{
                                mb: { xs: 2, md: 3 }, // Más margen en desktop
                                fontFamily: typography.fontFamily,
                                fontWeight: 600,
                                color: vistelicaColors.secondary,
                                letterSpacing: '1px',
                                fontSize: { xs: '2rem', md: '2.5rem' }, // Más grande en desktop
                                position: 'relative',
                                textAlign: 'center', // Centrado para móvil
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -8,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: { xs: '60px', md: '80px' }, // Más ancho en desktop
                                    height: '2px',
                                    backgroundColor: vistelicaColors.primary
                                }
                            }}
                        >
                            VISTÉLICA
                        </Typography>
                    </motion.div>

                    <motion.div variants={animations.itemVariants}>
                        <Typography
                            variant="body1"
                            sx={{
                                mb: { xs: 4, md: 5 }, // Más margen en desktop
                                maxWidth: { xs: '95%', md: '700px' }, // Más ancho en desktop
                                mx: 'auto',
                                color: vistelicaColors.textSecondary,
                                fontSize: { xs: '1rem', md: '1.2rem' }, // Más grande en desktop
                                fontFamily: typography.fontFamily,
                                fontStyle: 'italic',
                                textAlign: 'center',
                                lineHeight: 1.6
                            }}
                        >
                            "Hacer que un estilo de vida lujoso sea accesible para un grupo generoso de mujeres es nuestro impulso diario."
                        </Typography>
                    </motion.div>

                    <Grid container spacing={{ xs: 3, md: 4 }} sx={{ mb: { xs: 3, md: 5 } }} justifyContent="center" alignItems="stretch">
                        {valuesData.map((value) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                                component={motion.div}
                                variants={animations.itemVariants}
                                key={value.id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'stretch'
                                }}
                            >
                                <ValueItem
                                    icon={value.icon}
                                    title={value.title}
                                    description={value.description}
                                    iconAlt={value.iconAlt}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    <AnimatedDivider variants={animations.dividerVariants} />
                </Paper>
            </motion.div>
        </Container>
    );
};

// Añadir displayNames para facilitar la depuración
ValueIcon.displayName = 'ValueIcon';
ValueItem.displayName = 'ValueItem';
AnimatedDivider.displayName = 'AnimatedDivider';

export default React.memo(ValuesCard);