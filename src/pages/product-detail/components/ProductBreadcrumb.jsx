"use client";

import React from 'react';
import { Box, Typography, Breadcrumbs as MUIBreadcrumbs, Paper, useMediaQuery, useTheme, Chip } from '@mui/material';
import { motion } from "framer-motion";
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

const ProductBreadcrumb = ({ product }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    // Animaciones mejoradas
    const containerAnimation = {
        hidden: { opacity: 0, y: -10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                staggerChildren: 0.08
            }
        }
    };

    const itemAnimation = {
        hidden: { opacity: 0, x: -8 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerAnimation}
        >
            <Paper
                elevation={isMobile ? 0 : 1}
                sx={{
                    py: { xs: 1.5, sm: 2 },
                    px: { xs: 2, sm: 3 },
                    mb: { xs: 2.5, sm: 3, md: 4 },
                    borderRadius: { xs: '10px', sm: '12px' },
                    background: `linear-gradient(120deg, ${vistelicaColors.primary}08, ${vistelicaColors.secondary}10)`,
                    boxShadow: {
                        xs: '0 1px 4px rgba(0,0,0,0.04)',
                        sm: '0 2px 8px rgba(0,0,0,0.07)'
                    },
                    border: `1px solid ${vistelicaColors.primary}15`,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Elemento decorativo superior */}
                <Box
                    component={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    sx={{
                        position: 'absolute',
                        top: -30,
                        right: -30,
                        width: { xs: 90, sm: 120 },
                        height: { xs: 90, sm: 120 },
                        background: `radial-gradient(circle, ${vistelicaColors.primary}15 0%, transparent 70%)`,
                        display: { xs: 'none', sm: 'block' },
                        zIndex: 0
                    }}
                />

                <MUIBreadcrumbs
                    separator={
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.7, 1, 0.7]
                            }}
                            transition={{ duration: 1.8, repeat: Infinity }}
                        >
                            <ArrowForwardIosIcon
                                sx={{
                                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                    color: vistelicaColors.primary
                                }}
                            />
                        </motion.div>
                    }
                    aria-label="navegación de migas de pan"
                    maxItems={isMobile ? 2 : 3}
                    itemsBeforeCollapse={0}
                    itemsAfterCollapse={2}
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        '& .MuiBreadcrumbs-ol': {
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        },
                        '& .MuiBreadcrumbs-li': {
                            fontFamily: typography.fontFamily,
                            fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' }
                        }
                    }}
                >
                    <motion.div
                        variants={itemAnimation}
                        whileHover={{ scale: 1.05 }}
                    >
                        <Link
                            href="/"
                            style={{
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                            aria-label="Ir a página de inicio"
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: `${vistelicaColors.secondary}08`,
                                    borderRadius: '20px',
                                    padding: { xs: '4px 8px', sm: '4px 10px' },
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: `${vistelicaColors.secondary}15`,
                                        boxShadow: `0 2px 5px ${vistelicaColors.secondary}20`
                                    }
                                }}
                            >
                                <HomeIcon sx={{
                                    mr: { xs: 0.5, sm: 0.7 },
                                    fontSize: { xs: '1rem', sm: '1.1rem' },
                                    color: vistelicaColors.secondary
                                }} />
                                <Typography
                                    component="span"
                                    sx={{
                                        fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                                        display: { xs: 'none', sm: 'inline' },
                                        color: vistelicaColors.secondary,
                                        fontFamily: typography.fontFamily,
                                        fontWeight: 500
                                    }}
                                >
                                    Inicio
                                </Typography>
                            </Box>
                        </Link>
                    </motion.div>

                    {product?.category_name && (
                        <motion.div
                            variants={itemAnimation}
                            whileHover={{ scale: 1.05 }}
                        >
                            <Link
                                href={`/categorias/${product.category_id}`}
                                style={{
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                                aria-label={`Ver categoría ${product.category_name}`}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        backgroundColor: `${vistelicaColors.secondary}08`,
                                        borderRadius: '20px',
                                        padding: { xs: '4px 8px', sm: '4px 10px' },
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            backgroundColor: `${vistelicaColors.secondary}15`,
                                            boxShadow: `0 2px 5px ${vistelicaColors.secondary}20`
                                        }
                                    }}
                                >
                                    <CategoryIcon sx={{
                                        mr: { xs: 0.5, sm: 0.7 },
                                        fontSize: { xs: '1rem', sm: '1.1rem' },
                                        color: vistelicaColors.secondary
                                    }} />
                                    <Typography
                                        component="span"
                                        sx={{
                                            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            maxWidth: { xs: '80px', sm: '150px', md: '200px' },
                                            color: vistelicaColors.secondary,
                                            fontFamily: typography.fontFamily,
                                            fontWeight: 500
                                        }}
                                        title={product.category_name}
                                    >
                                        {product.category_name}
                                    </Typography>
                                </Box>
                            </Link>
                        </motion.div>
                    )}

                    <motion.div variants={itemAnimation}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            maxWidth: { xs: '150px', sm: '200px', md: '300px' },
                            backgroundColor: vistelicaColors.primary,
                            borderRadius: '20px',
                            padding: { xs: '4px 8px', sm: '4px 12px' },
                            boxShadow: `0 2px 6px ${vistelicaColors.primary}30`
                        }}>
                            <ShoppingBagIcon sx={{
                                mr: { xs: 0.5, sm: 0.7 },
                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                color: '#fff'
                            }} />
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                                    color: '#fff',
                                    fontFamily: typography.fontFamily,
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                                title={product?.product_name || 'Producto'}
                            >
                                {product?.product_name || 'Producto'}
                            </Typography>
                        </Box>
                    </motion.div>
                </MUIBreadcrumbs>

                {/* Stock status chip */}
                {product?.stock_status && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                    >
                        <Chip
                            size="small"
                            label={product.stock_status === 'in_stock' ? 'En stock' : 'Agotado'}
                            color={product.stock_status === 'in_stock' ? 'success' : 'error'}
                            sx={{
                                position: 'absolute',
                                top: { xs: 8, sm: 10 },
                                right: { xs: 8, sm: 12 },
                                fontFamily: typography.fontFamily,
                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                fontWeight: 500,
                                zIndex: 2,
                                display: { xs: 'none', md: 'flex' }
                            }}
                        />
                    </motion.div>
                )}

                {/* Elemento decorativo inferior */}
                <Box
                    component={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    sx={{
                        position: 'absolute',
                        bottom: -40,
                        left: -40,
                        width: { xs: 80, sm: 100 },
                        height: { xs: 80, sm: 100 },
                        background: `radial-gradient(circle, ${vistelicaColors.secondary}15 0%, transparent 70%)`,
                        display: { xs: 'none', sm: 'block' },
                        zIndex: 0
                    }}
                />
            </Paper>
        </motion.div>
    );
};

export default ProductBreadcrumb;