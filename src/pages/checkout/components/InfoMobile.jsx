"use client";
import * as React from 'react';
import { lazy, Suspense, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { vistelicaColors } from "@/components/shared/vistelicaColors";
import { typography } from '@/components/shared/themePrimitives';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CircularProgress from '@mui/material/CircularProgress';

// Lazy load para el componente Info para mejorar rendimiento
const LazyInfo = lazy(() => import('./Info'));

// Botón estilizado
const ViewDetailsButton = styled(Button)(({ theme }) => ({
    borderRadius: '30px',
    textTransform: 'none',
    padding: '10px 20px',
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    color: vistelicaColors.primary,
    border: `1px solid ${vistelicaColors.primary}20`,
    fontFamily: typography.fontFamily,
    fontWeight: 600,
    transition: 'all 0.3s',
    '&:hover': {
        backgroundColor: `${vistelicaColors.primary}08`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transform: 'translateY(-2px)'
    }
}));

// Indicador de arrastrar
const DragIndicator = styled(Box)(({ theme }) => ({
    width: '60px',
    height: '5px',
    backgroundColor: '#e0e0e0',
    borderRadius: '5px',
    margin: '10px auto',
}));

// Componente para mostrar durante la carga del componente Info
const LoadingFallback = () => (
    <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            minHeight: 200
        }}
        role="status"
        aria-live="polite"
    >
        <CircularProgress size={30} sx={{ color: vistelicaColors.primary }} />
        <span className="visually-hidden">Cargando resumen del pedido</span>
    </Box>
);

// Convertir a componente memo para mejorar el rendimiento
const InfoMobile = React.memo(function InfoMobile({ totalPrice }) {
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = useCallback((newOpen) => () => {
        setOpen(newOpen);
    }, []);

    const DrawerList = (
        <Box
            sx={{ width: 'auto', pb: 4, pt: 1 }}
            role="dialog"
            aria-labelledby="drawer-title"
        >
            <DragIndicator />
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 3,
                pt: 1,
                pb: 2
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5
                }}>
                    <ShoppingCartOutlinedIcon
                        sx={{
                            color: vistelicaColors.primary,
                            fontSize: '1.5rem'
                        }}
                        aria-hidden="true"
                    />
                    <Box
                        component="span"
                        sx={{
                            fontWeight: 600,
                            fontSize: '1.1rem',
                            fontFamily: typography.fontFamily,
                            color: '#333'
                        }}
                        id="drawer-title"
                    >
                        Detalles del pedido
                    </Box>
                </Box>
                <IconButton
                    onClick={toggleDrawer(false)}
                    sx={{
                        color: '#666',
                        '&:hover': {
                            backgroundColor: '#f5f5f5'
                        }
                    }}
                    aria-label="Cerrar detalles"
                >
                    <CloseIcon aria-hidden="true" />
                </IconButton>
            </Box>
            <Box sx={{ px: 3 }}>
                <Suspense fallback={<LoadingFallback />}>
                    <LazyInfo totalPrice={totalPrice} />
                </Suspense>
            </Box>
        </Box>
    );

    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            mt: 2
        }}>
            <ViewDetailsButton
                endIcon={<ExpandMoreIcon aria-hidden="true" />}
                onClick={toggleDrawer(true)}
                startIcon={<ShoppingCartOutlinedIcon aria-hidden="true" />}
                fullWidth
                variant="outlined"
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-label="Ver detalles del pedido"
            >
                Ver detalles del pedido
            </ViewDetailsButton>
            <Drawer
                open={open}
                anchor="bottom"
                onClose={toggleDrawer(false)}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: '16px',
                        borderTopRightRadius: '16px',
                        maxHeight: { xs: '95vh', sm: '80vh' }, // Mejor adaptación responsive
                        backgroundImage: 'none',
                        backgroundColor: 'background.paper',
                        boxShadow: '0 -5px 25px rgba(0,0,0,0.1)',
                    },
                }}
                SlideProps={{
                    timeout: 300,
                }}
                aria-modal="true"
                role="dialog"
            >
                {DrawerList}
            </Drawer>
        </Box>
    );
});

// Añadir displayName para herramientas de desarrollo
InfoMobile.displayName = 'InfoMobile';
export default InfoMobile;