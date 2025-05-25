'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
    Typography,
    Divider,
    Box,
    List,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Paper,
    Avatar,
    Drawer,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    TextField,
    CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { logout, deleteAccount } from '../../services/authService';
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import { typography } from '@/pages/shared-theme/themePrimitives';
import { useSnackbar } from 'notistack';
import {styled, useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const StyledPaper = styled(Paper)(({ theme }) => ({
    border: `1px solid ${vistelicaColors.border}`,
    borderRadius: '12px',
    padding: theme.spacing(3),
    width: '400px',
    minWidth: '350px',
    height: '100%',
    background: '#fff',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.05)',
    position: 'relative',
    overflow: 'hidden',
    margin: theme.spacing(0, 4, 0, 0),
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '6px',
        height: '100%',
        background: `linear-gradient(to bottom, ${vistelicaColors.primary}, ${vistelicaColors.secondary})`,
    }
}));

const StyledListItemButton = styled(ListItemButton)(({ theme, selected }) => ({
    marginBottom: theme.spacing(1),
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    backgroundColor: selected ? `${vistelicaColors.tertiary}30` : 'transparent',
    cursor: 'pointer',
    padding: theme.spacing(1, 2),
    '&:hover': {
        backgroundColor: `${vistelicaColors.tertiary}20`,
        transform: 'translateX(5px)',
    },
    '& .MuiListItemIcon-root': {
        color: selected ? vistelicaColors.primary : vistelicaColors.secondary,
        minWidth: 40,
    },
    '& .MuiListItemText-primary': {
        fontFamily: typography.fontFamily,
        fontWeight: selected ? 600 : 400,
        color: selected ? vistelicaColors.primary : 'inherit',
    }
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
    width: 80,
    height: 80,
    border: `2px solid ${vistelicaColors.primary}`,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    backgroundColor: vistelicaColors.primary,
    color: 'white',
    fontFamily: typography.fontFamily,
    fontWeight: 600,
    fontSize: '1.5rem',
    marginBottom: theme.spacing(2),
}));

const SidebarMenu = ({ username, avatarUrl, drawerOpen, setDrawerOpen }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const currentPath = router.pathname;
    const userInitial = username ? username.charAt(0).toUpperCase() : 'U';

    const handleNavigation = (path) => {
        router.push(path);
        if (isMobile && setDrawerOpen) {
            setDrawerOpen(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/sign-in-side/Sign-in-side');
        } catch (error) {
            console.error("Logout error:", error);
            enqueueSnackbar('Error al cerrar sesión', { variant: 'error' });
        }
    };

    const handleDeleteAccount = async () => {
        if (!password) {
            enqueueSnackbar('Por favor ingresa tu contraseña', { variant: 'warning' });
            return;
        }

        setIsDeleting(true);
        try {
            const success = await deleteAccount(password);
            if (success) {
                enqueueSnackbar('Cuenta eliminada correctamente', { variant: 'success' });
                router.push('/home/Home');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Contraseña incorrecta';
            enqueueSnackbar(errorMessage, { variant: 'error' });
        } finally {
            setIsDeleting(false);
            setPassword('');
            setDeleteDialogOpen(false);
        }
    };

    const listItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: i => ({
            opacity: 1,
            x: 0,
            transition: { delay: i * 0.1, duration: 0.5 }
        })
    };

    const menuItems = [
        { text: "Mi cuenta", icon: <PersonOutlineIcon />, path: "/account/AccountLayout", selected: currentPath === "/account/AccountLayout" },
        { text: "Pedidos", icon: <LocalShippingOutlinedIcon />, path: "/order-history/AccountLayout", selected: currentPath === "/order-history/AccountLayout" },
        { text: "Direcciones", icon: <LocationOnOutlinedIcon />, path: "/account/AccountAddresses", selected: currentPath === "/account/AccountAddresses" },
        { text: "Métodos de pago", icon: <PaymentOutlinedIcon />, path: "#", selected: false },
        { text: "Devoluciones", icon: <AssignmentReturnOutlinedIcon />, path: "#", selected: false },
    ];

    const renderAvatar = () => (
        <Box sx={{ position: 'relative' }}>
            <UserAvatar
                src={avatarUrl}
                alt={username || 'Usuario'}
                imgProps={{
                    onError: (e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                    }
                }}
            >
                {!avatarUrl && userInitial}
            </UserAvatar>
        </Box>
    );

    const sidebarContent = (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', mb: 3 }}>
                {isMobile && (
                    <Box sx={{ alignSelf: 'flex-end', mb: 1 }}>
                        <IconButton onClick={() => setDrawerOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                )}
                {renderAvatar()}
                <Typography variant="h5" component="h1" fontWeight="600" fontFamily={typography.fontFamily}
                            sx={{ color: vistelicaColors.primary, textAlign: 'center', mb: 1 }}>
                    Hola {username || '—'}
                </Typography>
                <Typography variant="body2" sx={{ color: vistelicaColors.secondary, textAlign: 'center' }}>
                    Bienvenido a tu espacio personal
                </Typography>
            </Box>

            <Divider sx={{ mb: 2, borderColor: vistelicaColors.divider }} />

            <Box sx={{ px: { xs: 0, sm: 1 } }}>
                <List disablePadding>
                    {menuItems.map((item, index) => (
                        <motion.div key={item.text} custom={index} initial="hidden" animate="visible" variants={listItemVariants}>
                            <StyledListItemButton selected={item.selected} onClick={() => handleNavigation(item.path)}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </StyledListItemButton>
                        </motion.div>
                    ))}

                    <motion.div custom={menuItems.length} initial="hidden" animate="visible" variants={listItemVariants}>
                        <StyledListItemButton onClick={() => setLogoutDialogOpen(true)}>
                            <ListItemIcon><LogoutOutlinedIcon /></ListItemIcon>
                            <ListItemText primary="Cerrar sesión" />
                        </StyledListItemButton>
                    </motion.div>

                    <motion.div custom={menuItems.length + 1} initial="hidden" animate="visible" variants={listItemVariants}>
                        <StyledListItemButton
                            onClick={() => setDeleteDialogOpen(true)}
                            sx={{ color: 'error.main' }}
                        >
                            <ListItemIcon sx={{ color: 'error.main' }}><DeleteOutlineOutlinedIcon /></ListItemIcon>
                            <ListItemText
                                primary="Eliminar cuenta"
                                primaryTypographyProps={{ color: 'error' }}
                            />
                        </StyledListItemButton>
                    </motion.div>
                </List>
            </Box>

            {/* Diálogo para cerrar sesión */}
            <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)}>
                <DialogTitle>Cerrar sesión</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas cerrar la sesión?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLogoutDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleLogout} color="primary" variant="contained">
                        Cerrar sesión
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo para eliminar cuenta */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Eliminar cuenta permanentemente</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Esta acción eliminará todos tus datos de forma permanente. Para confirmar, ingresa tu contraseña:
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Contraseña"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setDeleteDialogOpen(false);
                        setPassword('');
                    }}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleDeleteAccount}
                        color="error"
                        disabled={isDeleting}
                        startIcon={isDeleting ? <CircularProgress size={20} /> : null}
                    >
                        {isDeleting ? 'Eliminando...' : 'Eliminar cuenta'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );

    if (isMobile) {
        return (
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: { xs: '90%', sm: '400px' },
                        borderRadius: '0 12px 12px 0',
                        p: 2
                    },
                }}
            >
                {sidebarContent}
            </Drawer>
        );
    }

    return (
        <Box sx={{ flexShrink: 0, mr: 5, position: 'relative', left: { md: '-20px', lg: '-40px' }, zIndex: 0 }}>
            <StyledPaper>
                {sidebarContent}
            </StyledPaper>
        </Box>
    );
};

export default SidebarMenu;