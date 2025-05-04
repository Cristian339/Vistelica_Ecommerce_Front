'use client';

import React from 'react';
import { useRouter } from 'next/router';
import {
    Typography,
    Divider,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EditIcon from '@mui/icons-material/Edit';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { logout } from '../../services/authService'; // Importación de la función logout

const SidebarMenu = ({ username }) => {
    const router = useRouter();

    const handleNavigation = (path) => {
        router.push(path);  // Navegar a la ruta proporcionada
    };

    // Función para manejar el cierre de sesión
    const handleLogout = async () => {
        try {
            await logout();
            router.push('/sign-in-side/Sign-in-side');
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            // Aquí podrías añadir una notificación de error si lo deseas
        }
    };

    return (
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', p: 2, height: '100%' }}>
            <Typography variant="h5" component="h1" fontWeight="500" sx={{ mb: 3 }}>
                Hola {username || '—'}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <List disablePadding>
                <ListItem button selected sx={{ mb: 1, borderRadius: 1 }} onClick={() => handleNavigation('/account/AcountInfo')}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <PersonOutlineIcon />
                    </ListItemIcon>
                    <ListItemText primary="Mi cuenta" primaryTypographyProps={{ fontWeight: 500 }} />
                </ListItem>

                <ListItem button sx={{ mb: 1, borderRadius: 1 }} onClick={() => handleNavigation('/account/AccountInfoEditable')}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <EditIcon />
                    </ListItemIcon>
                    <ListItemText primary="Mis datos" />
                </ListItem>

                <ListItem button sx={{ mb: 1, borderRadius: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <LocalShippingOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Pedidos" />
                </ListItem>

                <ListItem button sx={{ mb: 1, borderRadius: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <LocationOnOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Direcciones" />
                </ListItem>

                <ListItem button sx={{ mb: 1, borderRadius: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <FavoriteBorderOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Favoritos" />
                </ListItem>

                <ListItem button sx={{ mb: 1, borderRadius: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <PaymentOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Pagos" />
                </ListItem>

                <ListItem button sx={{ mb: 1, borderRadius: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <AssignmentReturnOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Devoluciones" />
                </ListItem>

                <ListItem
                    button
                    sx={{ mb: 1, borderRadius: 1 }}
                    onClick={handleLogout}
                >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <LogoutOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Cerrar sesión" />
                </ListItem>

                <ListItem button sx={{ mb: 1, borderRadius: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <DeleteOutlineOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Eliminar cuenta" />
                </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" component="h2" fontWeight="500" sx={{ mb: 2 }}>
                ¿Necesitas ayuda?
            </Typography>

            <List disablePadding>
                <ListItem button sx={{ mb: 1, borderRadius: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <HelpOutlineOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="FAQS" />
                </ListItem>

                <ListItem button sx={{ mb: 1, borderRadius: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <PhoneOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="+34 624 58 14 40" />
                </ListItem>

                <ListItem button sx={{ mb: 1, borderRadius: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <EmailOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="vistelica.company@gmail.com"
                        primaryTypographyProps={{
                            sx: {
                                wordBreak: 'break-word',
                                fontSize: '0.875rem',
                            },
                        }}
                    />
                </ListItem>
            </List>
        </Paper>
    );
};

export default SidebarMenu;