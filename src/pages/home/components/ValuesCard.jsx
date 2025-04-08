import React from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';

const ValuesCard = () => {
    return (
        <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
            <Paper elevation={0} sx={{
                p: 4,
                bgcolor: '#f5f5f5',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        mb: 3,
                        fontFamily: "'Amethysta', serif",
                        fontWeight: 400
                    }}
                >
                    VISTÉLICA
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        mb: 4,
                        maxWidth: '500px',
                        mx: 'auto',
                        color: '#333'
                    }}
                >
                    Hacer que un estilo de vida lujoso sea accesible para un grupo generoso de mujeres es nuestro impulso diario.
                </Typography>

                <Grid container spacing={3}>
                    {/* Fast Shipping */}
                    <Grid item xs={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box sx={{
                                border: '1px solid #ccc',
                                borderRadius: '50%',
                                p: 1.5,
                                mb: 1.5,
                                bgcolor: 'white'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                                </svg>
                            </Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                                Envío rápido.
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Gratis en pedidos superiores a $25.
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Sustainable Process */}
                    <Grid item xs={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box sx={{
                                border: '1px solid #ccc',
                                borderRadius: '50%',
                                p: 1.5,
                                mb: 1.5,
                                bgcolor: 'white'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                            </Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                                Proceso sostenible
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                De principio a fin.
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Unique Designs */}
                    <Grid item xs={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box sx={{
                                border: '1px solid #ccc',
                                borderRadius: '50%',
                                p: 1.5,
                                mb: 1.5,
                                bgcolor: 'white'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                            </Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                                Diseños únicos y materiales
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                de alta calidad.
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Fast Shipping Again */}
                    <Grid item xs={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box sx={{
                                border: '1px solid #ccc',
                                borderRadius: '50%',
                                p: 1.5,
                                mb: 1.5,
                                bgcolor: 'white'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            </Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                                Total seguridad.
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Proteccion de datos
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4 }}>
                    <svg width="120" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 12C2 12 24 4 60 12C96 20 118 12 118 12" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                </Box>
            </Paper>
        </Container>
    );
};

export default ValuesCard;