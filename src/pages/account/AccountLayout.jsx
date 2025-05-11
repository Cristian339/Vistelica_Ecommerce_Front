'use client';

import React, { useEffect, useState } from 'react';
import { Container, Grid, Box, useMediaQuery, Fab } from '@mui/material';
import SidebarMenu from '@/components/layout/SidebarMenu';
import AccountInfo from './AcountInfo';
import { getUserProfile } from '@/services/profileService';
import Navbar from "@/components/layout/HeaderComponent";
import MenuIcon from '@mui/icons-material/Menu';
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import { typography } from '@/pages/shared-theme/themePrimitives';
import { motion } from 'framer-motion';

const AccountLayout = () => {
    const [userData, setUserData] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const isMobile = useMediaQuery('(max-width:900px)');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const profile = await getUserProfile();
                setUserData(profile);
            } catch (error) {
                console.error('Error al cargar el perfil:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    // Animación para el contenido principal
    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
                <Grid container spacing={2} sx={{
                    flexWrap: { xs: 'wrap', md: 'nowrap' }
                }}>
                    {/* Sidebar solo visible en desktop */}
                    {!isMobile && (
                        <Grid item md={3} lg={3}>
                            <SidebarMenu username={userData?.name || 'Usuario'} />
                        </Grid>
                    )}

                    {/* Contenido principal - ancho completo en móviles */}
                    <Grid item xs={12} md={9} lg={9}>
                        <Box
                            component={motion.div}
                            initial="hidden"
                            animate="visible"
                            variants={contentVariants}
                        >
                            <AccountInfo
                                userData={userData}
                                setUserData={setUserData}
                                loading={loading}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Botón flotante para mostrar sidebar en móvil */}
            {isMobile && (
                <Fab
                    color="primary"
                    aria-label="menu"
                    onClick={() => setSidebarOpen(true)}
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        backgroundColor: vistelicaColors.primary,
                        '&:hover': {
                            backgroundColor: vistelicaColors.secondary
                        },
                        zIndex: 1050
                    }}
                >
                    <MenuIcon />
                </Fab>
            )}

            {/* SidebarMenu para móvil como drawer */}
            {isMobile && (
                <SidebarMenu
                    username={userData?.name || 'Usuario'}
                    drawerOpen={sidebarOpen}
                    setDrawerOpen={setSidebarOpen}
                />
            )}
        </div>
    );
};

export default AccountLayout;