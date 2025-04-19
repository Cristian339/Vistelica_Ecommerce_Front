'use client';

import React, { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import SidebarMenu from '@/components/layout/SidebarMenu';
import AccountInfo from './AcountInfo';
import { getUserProfile } from '@/services/profileService';
import Navbar from "@/components/layout/HeaderComponent";

const AccountLayout = ({ userId }) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profile = await getUserProfile(userId);
                setUserData(profile);
            } catch (error) {
                console.error('Error al cargar el perfil:', error);
            }
        };

        fetchUserProfile();
    }, [userId]);

    return (
        <div>
            <Navbar/>
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={2} sx={{ flexWrap: { xs: 'nowrap' } }}>
                <Grid item xs={4} sm={3} md={3} lg={3} sx={{ minWidth: { xs: '200px' } }}>
                    <SidebarMenu username={userData?.name} />
                </Grid>
                <Grid item xs={8} sm={9} md={9} lg={9} sx={{ flexGrow: 1 }}>
                    <AccountInfo userData={userData} />
                </Grid>
            </Grid>
        </Container>
        </div>
    );
};

export default AccountLayout;
