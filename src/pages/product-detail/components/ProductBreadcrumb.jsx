"use client";

import React from 'react';
import { Box, Typography, Breadcrumbs as MUIBreadcrumbs, Paper } from '@mui/material';
import { motion } from "framer-motion";
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

const ProductBreadcrumb = ({ product }) => {
    // Animaciones mejoradas
    const containerAnimation = {
        hidden: { opacity: 0, y: -10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const itemAnimation = {
        hidden: { opacity: 0, x: -5 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerAnimation}
        >
            <Paper
                elevation={1}
                sx={{
                    py: 2,
                    px: 3,
                    mb: 4,
                    borderRadius: '12px',
                    background: `linear-gradient(to right, ${vistelicaColors.primary}10, ${vistelicaColors.secondary}10)`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                }}
            >
                <MUIBreadcrumbs
                    separator={
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.7, 1, 0.7]
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    backgroundColor: vistelicaColors.primary,
                                    borderRadius: '50%',
                                    mx: 1
                                }}
                            />
                        </motion.div>
                    }
                    aria-label="breadcrumb"
                    sx={{
                        '& .MuiBreadcrumbs-ol': {
                            alignItems: 'center'
                        },
                        '& .MuiBreadcrumbs-li': {
                            fontFamily: typography.fontFamily,
                            fontSize: '1rem'
                        }
                    }}
                >
                    <motion.div variants={itemAnimation}>
                        <Link
                            href="/"
                            style={{
                                color: vistelicaColors.secondary,
                                textDecoration: 'none',
                                fontSize: '1rem',
                                fontFamily: typography.fontFamily,
                                display: 'flex',
                                alignItems: 'center',
                                fontWeight: 500
                            }}
                        >
                            <HomeIcon sx={{ mr: 0.7, fontSize: '1.2rem' }} />
                            Inicio
                        </Link>
                    </motion.div>

                    {product?.category_name && (
                        <motion.div variants={itemAnimation}>
                            <Link
                                href={`/categorias/${product.category_id}`}
                                style={{
                                    color: vistelicaColors.secondary,
                                    textDecoration: 'none',
                                    fontSize: '1rem',
                                    fontFamily: typography.fontFamily,
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontWeight: 500
                                }}
                            >
                                <CategoryIcon sx={{ mr: 0.7, fontSize: '1.2rem' }} />
                                {product.category_name}
                            </Link>
                        </motion.div>
                    )}

                    <motion.div variants={itemAnimation}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ShoppingBagIcon sx={{ mr: 0.7, fontSize: '1.2rem', color: 'text.secondary' }} />
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: '1rem',
                                    color: vistelicaColors.primary,
                                    fontFamily: typography.fontFamily,
                                    fontWeight: 600
                                }}
                            >
                                {product?.product_name || 'Producto'}
                            </Typography>
                        </Box>
                    </motion.div>
                </MUIBreadcrumbs>
            </Paper>
        </motion.div>
    );
};

export default ProductBreadcrumb;