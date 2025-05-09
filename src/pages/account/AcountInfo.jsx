'use client';

import React, { useEffect, useState } from 'react';
import {
    Typography,
    Divider,
    Box,
    Paper,
    CircularProgress
} from '@mui/material';
import { getUserProfile } from '@/services/profileService';

const AccountInfo = ({ userData, setUserData }) => {
    const [loading, setLoading] = useState(!userData);

    useEffect(() => {
        if (!userData) {
            const fetchProfile = async () => {
                try {
                    const data = await getUserProfile();
                    setUserData(data);
                } catch (error) {
                    console.error("Error al obtener el perfil:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchProfile();
        }
    }, [userData, setUserData]);

    if (loading) return <CircularProgress />;

    const fields = [
        { label: 'Nombre', value: userData?.name || '—' },
        { label: 'Apellidos', value: userData?.lastName || '—' },
        { label: 'Email', value: userData?.email || '—' },
        { label: 'Dirección', value: userData?.address || '—' },
        { label: 'Teléfono', value: userData?.phone || '—' },
        { label: 'Fecha de nacimiento', value: userData?.born_date ? new Date(userData.born_date).toLocaleDateString() : '—' },
    ];

    return (
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', p: 3, height: '100%', maxWidth: 500 }}>
            <Typography variant="h5" component="h1" fontWeight="500" sx={{ mb: 3 }}>
                Mi cuenta
            </Typography>
            <Divider sx={{ mb: 4 }} />

            <Box sx={{ mb: 5 }}>
                <Typography variant="h6" component="h2" fontWeight="500" sx={{ mb: 3 }}>
                    Mi perfil
                </Typography>

                {fields.map((field, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="body1" fontWeight="500">{field.label}</Typography>
                        <Typography variant="body1">{field.value}</Typography>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
};

export default AccountInfo;