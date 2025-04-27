'use client';

import React, { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import SidebarMenu from '@/components/layout/SidebarMenu';
import { getUserProfile, updateUserProfile } from '@/services/profileService';
import {
    Typography,
    Divider,
    Box,
    Paper,
    TextField,
    Button,
    CircularProgress
} from '@mui/material';

const AccountInfoEditable = () => {
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile();
                setUserData(data);
                setFormData(data); // Inicializa los inputs
            } catch (error) {
                console.error("Error al obtener el perfil:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateUserProfile(formData); // Servicio para actualizar en el backend
            const updatedData = await getUserProfile(); // Recarga los datos
            setUserData(updatedData);
            setFormData(updatedData);
        } catch (error) {
            console.error('Error al guardar los cambios:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <div>
            {/* Aquí se agrega el Navbar si es necesario */}
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Grid container spacing={2} sx={{ flexWrap: { xs: 'nowrap' } }}>
                    {/* Sidebar */}
                    <Grid item xs={4} sm={3} md={3} lg={3} sx={{ minWidth: { xs: '200px' } }}>
                        <SidebarMenu username={userData?.name} />
                    </Grid>

                    {/* Formulario de edición */}
                    <Grid item xs={8} sm={9} md={9} lg={9} sx={{ flexGrow: 1 }}>
                        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', p: 3, height: '100%', maxWidth: 500 }}>
                            <Typography variant="h5" component="h1" fontWeight="500" sx={{ mb: 3 }}>
                                Mi cuenta
                            </Typography>
                            <Divider sx={{ mb: 4 }} />

                            <Box sx={{ mb: 5 }}>
                                <Typography variant="h6" component="h2" fontWeight="500" sx={{ mb: 3 }}>
                                    Editar perfil
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <TextField
                                        label="Nombre"
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Apellidos"
                                        name="lastName"
                                        value={formData.lastName || ''}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Dirección"
                                        name="address"
                                        value={formData.address || ''}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Teléfono"
                                        name="phone"
                                        value={formData.phone || ''}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Fecha de nacimiento"
                                        name="born_date"
                                        type="date"
                                        value={formData.born_date ? formData.born_date.split('T')[0] : ''}
                                        onChange={handleChange}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Box>

                                <Button
                                    variant="contained"
                                    sx={{
                                        mt: 4,
                                        backgroundColor: '#E4B002',
                                        '&:hover': {
                                            backgroundColor: '#D49F01',
                                        }
                                    }}
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default AccountInfoEditable;
