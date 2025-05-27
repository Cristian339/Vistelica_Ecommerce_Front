'use client';
import React, { useMemo, useCallback } from 'react';
import { Box, Typography, Breadcrumbs, Link, Chip, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import { typography } from "@/pages/shared-theme/themePrimitives";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
import CategoryIcon from '@mui/icons-material/Category';

const CustomBreadcrumb = React.memo(({ items = [], currentPage }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Memoizamos los items para evitar recálculos innecesarios
    const breadcrumbItems = useMemo(() => {
        if (!items || items.length === 0) {
            return [
                { label: 'Inicio', path: '/', icon: HomeIcon },
                { label: 'Carrito', path: '/cart', icon: ShoppingCartIcon, active: true }
            ];
        }
        return items;
    }, [items]);

    // Optimizamos la función de navegación con useCallback
    const handleContinueShopping = useCallback(() => {
        window.location.href = '/products';
    }, []);

    // Optimizamos el renderizado de cada item de breadcrumb
    const renderBreadcrumbItem = useCallback((item, index, items) => {
        const Icon = item.icon || (index === 0 ? HomeIcon :
            (index === items.length - 1 ? ShoppingCartIcon : CategoryIcon));

        const isLast = index === items.length - 1;

        const content = (
            <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(index * 0.1, 0.3), duration: 0.2 }}
                whileHover={{ scale: 1.05 }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: isLast ? vistelicaColors.primary : 'text.secondary',
                        textDecoration: 'none',
                        '&:hover': {
                            color: vistelicaColors.primary,
                            textDecoration: isLast ? 'none' : 'underline'
                        },
                        fontWeight: isLast ? 600 : 400,
                        fontSize: { xs: '0.7rem', sm: '0.875rem' }
                    }}
                >
                    <Icon
                        fontSize="small"
                        sx={{
                            mr: { xs: 0.3, sm: 0.5 },
                            color: isLast ? vistelicaColors.primary : 'text.secondary',
                            opacity: 0.8,
                            fontSize: { xs: '0.9rem', sm: '1rem' }
                        }}
                    />
                    {item.label}
                </Box>
            </motion.div>
        );

        return isLast ? (
            <Typography
                key={index}
                sx={{
                    fontWeight: 600,
                    color: vistelicaColors.primary,
                    display: 'flex',
                    alignItems: 'center',
                    fontFamily: typography.fontFamily.heading
                }}
            >
                {content}
            </Typography>
        ) : (
            <Link
                key={index}
                href={item.path}
                underline="hover"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'text.secondary',
                    textDecoration: 'none',
                    fontFamily: typography.fontFamily.body
                }}
            >
                {content}
            </Link>
        );
    }, []);

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            layout
            sx={{
                mb: { xs: 2, sm: 3 },
                mt: { xs: 0.5, sm: 1 },
                p: { xs: 1, sm: 1.5 },
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                border: '1px solid rgba(0,0,0,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 0 }
            }}
        >
            <Breadcrumbs
                separator={
                    <NavigateNextIcon
                        fontSize="small"
                        sx={{ color: vistelicaColors.primary }}
                    />
                }
                maxItems={isMobile ? 2 : 4}
                sx={{
                    fontFamily: typography.fontFamily.body,
                    '& .MuiBreadcrumbs-ol': {
                        flexWrap: { xs: 'wrap', sm: 'nowrap' }
                    }
                }}
            >
                {breadcrumbItems.map((item, index) => renderBreadcrumbItem(item, index, breadcrumbItems))}
            </Breadcrumbs>

            {/* Chips de estado o información adicional */}
            <Box sx={{
                display: 'flex',
                gap: { xs: 0.5, sm: 1 },
                width: { xs: '100%', sm: 'auto' },
                justifyContent: { xs: 'center', sm: 'flex-start' }
            }}>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ flex: isMobile ? '1 0 auto' : 'none' }}
                >
                    <Chip
                        icon={<ShoppingCartIcon fontSize="small" />}
                        label="Carrito"
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{
                            width: isMobile ? '100%' : 'auto',
                            '& .MuiChip-label': {
                                fontSize: { xs: '0.7rem', sm: '0.75rem' }
                            }
                        }}
                    />
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ flex: isMobile ? '1 0 auto' : 'none' }}
                >
                    <Chip
                        icon={<StoreIcon fontSize="small" />}
                        label="Seguir comprando"
                        size="small"
                        sx={{
                            width: isMobile ? '100%' : 'auto',
                            backgroundColor: 'white',
                            color: vistelicaColors.secondary,
                            border: `1px solid ${vistelicaColors.secondary}40`,
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: `${vistelicaColors.secondary}10`
                            },
                            '& .MuiChip-label': {
                                fontSize: { xs: '0.7rem', sm: '0.75rem' }
                            }
                        }}
                        onClick={handleContinueShopping}
                    />
                </motion.div>
            </Box>
        </Box>
    );
});

CustomBreadcrumb.displayName = 'CustomBreadcrumb';

export default CustomBreadcrumb;