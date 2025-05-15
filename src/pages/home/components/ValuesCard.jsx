import React from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { vistelicaColors } from '../../shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

const ValuesCard = () => {
    // Animación para el contenedor
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    };

    // Animación para cada elemento
    const itemVariants = {
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
    };

    // Animación para el logo
    const logoVariants = {
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
    };

    // Animación para el divisor
    const dividerVariants = {
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
    };

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 }, px: { xs: 2, md: 4 } }}>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <Paper elevation={3} sx={{
                    p: { xs: 3, md: 5 },
                    bgcolor: '#FDFBF6',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    maxWidth: '1200px',
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
                    <motion.div variants={logoVariants}>
                        <Typography
                            variant="h3"
                            component="h1"
                            sx={{
                                mb: 2,
                                fontFamily: typography.fontFamily,
                                fontWeight: 600,
                                color: vistelicaColors.secondary,
                                letterSpacing: '1px',
                                position: 'relative',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -8,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '60px',
                                    height: '2px',
                                    backgroundColor: vistelicaColors.primary
                                }
                            }}
                        >
                            VISTÉLICA
                        </Typography>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Typography
                            variant="body1"
                            sx={{
                                mb: 5,
                                maxWidth: '600px',
                                mx: 'auto',
                                color: vistelicaColors.textSecondary,
                                fontSize: { xs: '1rem', md: '1.1rem' },
                                fontFamily: typography.fontFamily,
                                fontStyle: 'italic',
                                textAlign: 'center',
                                lineHeight: 1.6
                            }}
                        >
                            "Hacer que un estilo de vida lujoso sea accesible para un grupo generoso de mujeres es nuestro impulso diario."
                        </Typography>
                    </motion.div>

                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        {/* Fast Shipping */}
                        <Grid item xs={12} sm={6} md={3} component={motion.div} variants={itemVariants}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                height: '100%',
                                p: 2,
                                borderRadius: '12px',
                                transition: 'all 0.4s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                                    bgcolor: 'rgba(255,255,255,0.6)'
                                }
                            }}>
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
                                    width: 70,
                                    height: 70
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={vistelicaColors.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                                    </svg>
                                </Box>
                                <Typography variant="subtitle1" sx={{
                                    fontWeight: 600,
                                    fontFamily: typography.fontFamily,
                                    color: vistelicaColors.secondary,
                                    mb: 1,
                                    fontSize: '1.1rem'
                                }}>
                                    Envío rápido
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{
                                    textAlign: 'center',
                                    fontFamily: typography.fontFamily,
                                    maxWidth: '180px',
                                    mx: 'auto'
                                }}>
                                    Gratis en pedidos superiores a $25. Paquetería premium.
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Sustainable Process */}
                        <Grid item xs={12} sm={6} md={3} component={motion.div} variants={itemVariants}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                height: '100%',
                                p: 2,
                                borderRadius: '12px',
                                transition: 'all 0.4s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                                    bgcolor: 'rgba(255,255,255,0.6)'
                                }
                            }}>
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
                                    width: 70,
                                    height: 70
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={vistelicaColors.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                    </svg>
                                </Box>
                                <Typography variant="subtitle1" sx={{
                                    fontWeight: 600,
                                    fontFamily: typography.fontFamily,
                                    color: vistelicaColors.secondary,
                                    mb: 1,
                                    fontSize: '1.1rem'
                                }}>
                                    Proceso sostenible
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{
                                    textAlign: 'center',
                                    fontFamily: typography.fontFamily,
                                    maxWidth: '180px',
                                    mx: 'auto'
                                }}>
                                    De principio a fin. Cuidamos del medio ambiente en cada paso de producción.
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Unique Designs */}
                        <Grid item xs={12} sm={6} md={3} component={motion.div} variants={itemVariants}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                height: '100%',
                                p: 2,
                                borderRadius: '12px',
                                transition: 'all 0.4s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                                    bgcolor: 'rgba(255,255,255,0.6)'
                                }
                            }}>
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
                                    width: 70,
                                    height: 70
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={vistelicaColors.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                </Box>
                                <Typography variant="subtitle1" sx={{
                                    fontWeight: 600,
                                    fontFamily: typography.fontFamily,
                                    color: vistelicaColors.secondary,
                                    mb: 1,
                                    fontSize: '1.1rem'
                                }}>
                                    Diseños únicos
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{
                                    textAlign: 'center',
                                    fontFamily: typography.fontFamily,
                                    maxWidth: '180px',
                                    mx: 'auto'
                                }}>
                                    Materiales de alta calidad seleccionados para garantizar exclusividad y durabilidad.
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Security */}
                        <Grid item xs={12} sm={6} md={3} component={motion.div} variants={itemVariants}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                height: '100%',
                                p: 2,
                                borderRadius: '12px',
                                transition: 'all 0.4s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                                    bgcolor: 'rgba(255,255,255,0.6)'
                                }
                            }}>
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
                                    width: 70,
                                    height: 70
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={vistelicaColors.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                </Box>
                                <Typography variant="subtitle1" sx={{
                                    fontWeight: 600,
                                    fontFamily: typography.fontFamily,
                                    color: vistelicaColors.secondary,
                                    mb: 1,
                                    fontSize: '1.1rem'
                                }}>
                                    Total seguridad
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{
                                    textAlign: 'center',
                                    fontFamily: typography.fontFamily,
                                    maxWidth: '180px',
                                    mx: 'auto'
                                }}>
                                    Protección de datos garantizada en todos nuestros procesos de pago y envío.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <motion.svg width="180" height="24" viewBox="0 0 180 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <motion.path
                                d="M2 12C2 12 45 4 90 12C135 20 178 12 178 12"
                                stroke={vistelicaColors.primary}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                variants={dividerVariants}
                                initial="hidden"
                                animate="visible"
                            />
                        </motion.svg>
                    </Box>
                </Paper>
            </motion.div>
        </Container>
    );
};

export default ValuesCard;