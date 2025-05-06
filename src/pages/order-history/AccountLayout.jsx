'use client';

import React, { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import SidebarMenu from '@/components/layout/SidebarMenu';
import OrdersPage from './OrderPage';
import { getCurrentUser, getToken } from '@/services/authService';
import Navbar from "@/components/layout/HeaderComponent";
import { useRouter } from 'next/navigation';
import {getUserProfile} from "@/services/profileService";

const AccountLayout = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Verificar autenticación
                const token = getToken();

                // Obtener datos del usuario
                const [currentUser, profile] = await Promise.all([
                    getCurrentUser(),
                    getUserProfile()
                ]);
                console.log(currentUser);
                setUserData({
                    ...profile,
                    id: currentUser.user_id // Asegurarnos de tener el ID del usuario
                });
                console.log(userData);
            } catch (error) {
                console.error('Error loading user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!userData) {
        return null; // Redirección ya manejada en el efecto
    }

    return (
        <div>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Grid container spacing={2} sx={{ flexWrap: { xs: 'nowrap' } }}>
                    <Grid item xs={4} sm={3} md={3} lg={3} sx={{ minWidth: { xs: '200px' } }}>
                        <SidebarMenu username={userData?.name} />
                    </Grid>
                    <Grid item xs={8} sm={9} md={9} lg={9} sx={{ flexGrow: 1 }}>

                        <OrdersPage userId={userData.id} />
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default AccountLayout;