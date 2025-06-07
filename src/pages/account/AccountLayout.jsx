'use client';

import React, { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Box,
    useMediaQuery,
    Fab,
    CircularProgress
} from '@mui/material';
import SidebarMenu from '@/components/layout/SidebarMenu';
import AccountInfo from './AcountInfo';
import { getUserProfile } from '@/services/profileService';
import Navbar from "@/components/layout/HeaderComponent";
import MenuIcon from '@mui/icons-material/Menu';
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
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

                // Guardar datos en localStorage para persistencia
                if (typeof window !== 'undefined') {
                    localStorage.setItem('userData', JSON.stringify({
                        name: profile.name,
                        avatar: profile.avatar || profile.profilePic
                    }));
                }
            } catch (error) {
                console.error('Error loading profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    // Datos del usuario para pasar a los componentes
    const userAvatar = userData?.avatar || userData?.profilePic;
    const userName = userData?.name || 'Usuario';

    // Si está cargando, mostrar un indicador centrado
    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
                backgroundColor: 'rgba(255,255,255,0.8)',
                zIndex: 1200
            }}>
                <CircularProgress sx={{ color: vistelicaColors.primary }} />
            </Box>
        );
    }

    return (
        <div>
            <Navbar />
            <Container
                maxWidth="lg"
                sx={{
                    py: { xs: 2, md: 4 },
                    px: { xs: 1.5, md: 2 }
                }}
            >
                <Grid container spacing={3} sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                    {/* Sidebar para desktop */}
                    {!isMobile && (
                        <Grid size={{ xs: 12, md: 3, lg: 4 }}>
                            <Box sx={{ position: 'sticky', top: 24 }}>
                                <SidebarMenu
                                    username={userName}
                                    avatarUrl={userAvatar}
                                    key="desktop-sidebar"
                                />
                            </Box>
                        </Grid>
                    )}

                    {/* Contenido principal */}
                    <Grid size={{ xs: 12, md: 9, lg: 9 }}>
                        <Box
                            component={motion.div}
                            initial="hidden"
                            animate="visible"
                            variants={contentVariants}
                            sx={{ width: '100%' }}
                        >
                            <AccountInfo
                                userData={userData}
                                setUserData={setUserData}
                                loading={false}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Botón flotante para móvil */}
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
                        '&:hover': { backgroundColor: vistelicaColors.secondary },
                        zIndex: 1050
                    }}
                >
                    <MenuIcon />
                </Fab>
            )}

            {/* Sidebar para móvil */}
            {isMobile && (
                <SidebarMenu
                    username={userName}
                    avatarUrl={userAvatar}
                    drawerOpen={sidebarOpen}
                    setDrawerOpen={setSidebarOpen}
                    key="mobile-sidebar"
                />
            )}
        </div>
    );
};

export default AccountLayout;
