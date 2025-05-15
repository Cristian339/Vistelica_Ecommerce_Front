'use client';

import React, { useState, useEffect } from 'react';
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
    Collapse,
    styled,
    useMediaQuery,
    useTheme,
    Drawer,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';
import { motion } from 'framer-motion';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { logout } from '../../services/authService';
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import { typography } from '@/pages/shared-theme/themePrimitives';

// Componentes estilizados
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
    margin: theme.spacing(0, 4, 0, 0), // Aumentado el margen derecho
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
    backgroundColor: vistelicaColors.tertiary,
    color: vistelicaColors.primary,
    fontFamily: typography.fontFamily,
    fontWeight: 600,
    fontSize: '1.5rem',
    marginBottom: theme.spacing(2),
    border: `2px solid ${vistelicaColors.secondary}`,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
}));

const HelpButton = styled('a')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'inherit',
    borderRadius: '8px',
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: `${vistelicaColors.tertiary}20`,
        transform: 'translateX(5px)',
    },
}));

const MotionBox = styled(motion.div)({
    width: '100%',
});

const SidebarMenu = ({ username, drawerOpen: externalDrawerOpen, setDrawerOpen: externalSetDrawerOpen, avatarUrl }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [internalDrawerOpen, setInternalDrawerOpen] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const router = useRouter();
    const currentPath = router.pathname;
    const userInitial = username ? username.charAt(0).toUpperCase() : 'U';

    // Estado para manejar la URL del avatar
    const [userAvatar, setUserAvatar] = useState(avatarUrl || '');

    // Buscar avatar en localStorage si no se proporciona por props
    useEffect(() => {
        if (!avatarUrl) {
            try {
                const userData = localStorage.getItem('userData');
                if (userData) {
                    const parsedData = JSON.parse(userData);
                    const storedAvatar = parsedData?.avatar || parsedData?.profilePic || parsedData?.avatarUrl || parsedData?.photo;
                    if (storedAvatar) {
                        setUserAvatar(storedAvatar);
                    }
                }
            } catch (error) {
                console.error('Error al cargar avatar del localStorage:', error);
            }
        } else {
            setUserAvatar(avatarUrl);
        }
    }, [avatarUrl]);

    // Usa el estado interno o el externo según las props
    const drawerOpen = externalDrawerOpen !== undefined ? externalDrawerOpen : internalDrawerOpen;
    const setDrawerOpen = externalSetDrawerOpen || setInternalDrawerOpen;

    const handleNavigation = (path) => {
        router.push(path);
        if (isMobile) {
            setDrawerOpen(false);
        }
    };

    // Abrir el diálogo de confirmación para cerrar sesión
    const handleLogoutConfirmation = () => {
        setLogoutDialogOpen(true);
    };

    // Cerrar el diálogo de confirmación
    const handleCloseDialog = () => {
        setLogoutDialogOpen(false);
    };

    // Función que ejecuta el proceso de cerrar sesión después de confirmar
    const handleLogout = async () => {
        try {
            setLogoutDialogOpen(false);
            await logout();
            router.push('/sign-in-side/Sign-in-side');
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    const listItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: i => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5
            }
        })
    };

    const menuItems = [
        { text: "Mi cuenta", icon: <PersonOutlineIcon />, path: "/account/AccountLayout", selected: currentPath === "/account/AccountLayout" },
        { text: "Pedidos", icon: <LocalShippingOutlinedIcon />, path: "/order-history/AccountLayout", selected: currentPath === "/order-history/AccountLayout" },
        { text: "Direcciones", icon: <LocationOnOutlinedIcon />, path: "/account/AccountAddresses", selected: currentPath === "/account/AccountAddresses" },
        { text: "Métodos de pago", icon: <PaymentOutlinedIcon />, path: "#", selected: false },
        { text: "Devoluciones", icon: <AssignmentReturnOutlinedIcon />, path: "#", selected: false },
    ];

    // Contenido del sidebar
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
                <UserAvatar
                    src={userAvatar}
                    alt={username || 'Usuario'}
                    imgProps={{
                        onError: (e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                        }
                    }}
                >
                    {userInitial}
                </UserAvatar>
                <Typography
                    variant="h5"
                    component="h1"
                    fontWeight="600"
                    fontFamily={typography.fontFamily}
                    sx={{
                        color: vistelicaColors.primary,
                        textAlign: 'center',
                        mb: 1
                    }}
                >
                    Hola {username || '—'}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: vistelicaColors.secondary,
                        textAlign: 'center'
                    }}
                >
                    Bienvenido a tu espacio personal
                </Typography>
            </Box>

            <Divider sx={{
                mb: 2,
                borderColor: `${vistelicaColors.divider}`,
                '&::before, &::after': {
                    borderColor: `${vistelicaColors.divider}`,
                }
            }} />

            <Box sx={{ px: { xs: 0, sm: 1 } }}>
                <List disablePadding>
                    {menuItems.map((item, index) => (
                        <MotionBox
                            key={item.text}
                            custom={index}
                            initial={!isMobile && "hidden"}
                            animate={!isMobile && "visible"}
                            variants={listItemVariants}
                        >
                            <StyledListItemButton
                                selected={item.selected}
                                onClick={() => handleNavigation(item.path)}
                            >
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </StyledListItemButton>
                        </MotionBox>
                    ))}

                    <MotionBox
                        custom={menuItems.length}
                        initial={!isMobile && "hidden"}
                        animate={!isMobile && "visible"}
                        variants={listItemVariants}
                    >
                        <StyledListItemButton
                            onClick={handleLogoutConfirmation}
                        >
                            <ListItemIcon>
                                <LogoutOutlinedIcon />
                            </ListItemIcon>
                            <ListItemText primary="Cerrar sesión" />
                        </StyledListItemButton>
                    </MotionBox>

                    <MotionBox
                        custom={menuItems.length + 1}
                        initial={!isMobile && "hidden"}
                        animate={!isMobile && "visible"}
                        variants={listItemVariants}
                    >
                        <StyledListItemButton
                            sx={{
                                color: vistelicaColors.error,
                                '&:hover': {
                                    backgroundColor: `${vistelicaColors.error}10`,
                                    '& .MuiListItemIcon-root': {
                                        color: vistelicaColors.error,
                                    }
                                }
                            }}
                        >
                            <ListItemIcon>
                                <DeleteOutlineOutlinedIcon />
                            </ListItemIcon>
                            <ListItemText primary="Eliminar cuenta" />
                        </StyledListItemButton>
                    </MotionBox>
                </List>
            </Box>

            <Divider sx={{
                my: 3,
                borderColor: `${vistelicaColors.divider}`,
            }} />

            <Box sx={{ px: { xs: 0, sm: 1 } }}>
                <Typography
                    variant="h6"
                    component="h2"
                    fontWeight="500"
                    fontFamily={typography.fontFamily}
                    sx={{
                        mb: 2,
                        color: vistelicaColors.primary,
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }}
                    onClick={() => setHelpOpen(!helpOpen)}
                >
                    <HelpOutlineOutlinedIcon sx={{ mr: 1 }} />
                    ¿Necesitas ayuda?
                </Typography>

                <Collapse in={helpOpen || true}>
                    <Box
                        component={motion.div}
                        initial={!isMobile && { opacity: 0 }}
                        animate={!isMobile && { opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        sx={{
                            backgroundColor: `${vistelicaColors.tertiary}10`,
                            borderRadius: '12px',
                            p: 2,
                            mb: 2,
                        }}
                    >
                        <HelpButton href="/faq">
                            <HelpOutlineOutlinedIcon sx={{ color: vistelicaColors.secondary, mr: 2 }} />
                            <Typography fontFamily={typography.fontFamily}>FAQs</Typography>
                        </HelpButton>

                        <HelpButton href="tel:+34624581440">
                            <PhoneOutlinedIcon sx={{ color: vistelicaColors.secondary, mr: 2 }} />
                            <Typography fontFamily={typography.fontFamily}>+34 624 58 14 40</Typography>
                        </HelpButton>

                        <HelpButton
                            href="mailto:vistelica.company@gmail.com"
                            sx={{
                                '&:hover': {
                                    '& .email-text': {
                                        color: vistelicaColors.primary
                                    }
                                }
                            }}
                        >
                            <EmailOutlinedIcon sx={{ color: vistelicaColors.secondary, mr: 2 }} />
                            <Typography
                                className="email-text"
                                fontFamily={typography.fontFamily}
                                sx={{
                                    wordBreak: 'break-word',
                                    fontSize: '0.875rem',
                                    transition: 'color 0.3s ease',
                                }}
                            >
                                vistelica.company@gmail.com
                            </Typography>
                        </HelpButton>
                    </Box>
                </Collapse>
            </Box>

            {/* Diálogo de confirmación para cerrar sesión */}
            <Dialog
                open={logoutDialogOpen}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    style: {
                        borderRadius: '12px',
                        padding: '8px',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
                    }
                }}
            >
                <DialogTitle id="alert-dialog-title" sx={{
                    fontFamily: typography.fontFamily,
                    fontWeight: 600,
                    color: vistelicaColors.primary
                }}>
                    Cerrar sesión
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" sx={{
                        fontFamily: typography.fontFamily,
                        color: vistelicaColors.secondary
                    }}>
                        ¿Estás seguro de que deseas cerrar la sesión? Tendrás que volver a iniciar sesión para acceder a tu cuenta.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ padding: '16px' }}>
                    <Button
                        onClick={handleCloseDialog}
                        sx={{
                            fontFamily: typography.fontFamily,
                            color: vistelicaColors.secondary,
                            '&:hover': {
                                backgroundColor: `${vistelicaColors.secondary}10`,
                            }
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleLogout}
                        variant="contained"
                        sx={{
                            fontFamily: typography.fontFamily,
                            backgroundColor: vistelicaColors.primary,
                            '&:hover': {
                                backgroundColor: vistelicaColors.secondary,
                            }
                        }}
                        autoFocus
                    >
                        Cerrar sesión
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );

    // Para dispositivos móviles, mostramos solo el Drawer
    if (isMobile) {
        return (
            <>
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
            </>
        );
    }

    // Para desktop, mostrar el sidebar normal con margen para evitar solapamiento y posicionado más abajo
    return (
        <Box sx={{
            flexShrink: 0,
            mr: 5, // Margen adicional en contenedor para evitar solapamiento
            position: 'relative',
            left: { md: '-20px', lg: '-40px' }, // Desplazamiento hacia la izquierda para evitar solapamiento
            zIndex: 0 // Asegura que el contenido principal quede por encima
        }}>
            <StyledPaper>
                {sidebarContent}
            </StyledPaper>
        </Box>
    );
};

export default SidebarMenu;