import React from 'react';
import { Box, Typography, Breadcrumbs, Link as MuiLink, useTheme, useMediaQuery } from '@mui/material';
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import { vistelicaColors } from '../../theme/colors';

const Breadcrumb = ({ items = [], category, subcategory }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{ mb: 2, overflowX: 'auto', whiteSpace: 'nowrap', pb: 0.5 }}>
            <Breadcrumbs
                aria-label="breadcrumb"
                sx={{
                    '& .MuiBreadcrumbs-separator': {
                        color: vistelicaColors.secondary
                    },
                    fontFamily: 'ThemePrimitives.fontFamily'
                }}
            >
                <MuiLink
                    component={Link}
                    href="/"
                    underline="hover"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: vistelicaColors.secondary,
                        fontSize: { xs: 14, md: 16 },
                        transition: 'color 0.2s',
                        '&:hover': {
                            color: vistelicaColors.primary
                        }
                    }}
                >
                    <HomeIcon sx={{ mr: 0.5, fontSize: isMobile ? '1rem' : '1.2rem' }} />
                    Inicio
                </MuiLink>

                {/* Enlace a la categoría - conectada con submenu */}
                {category && (
                    <MuiLink
                        component={Link}
                        href={`/product-list?category=${category.slug || category.name.toLowerCase()}`}
                        underline="hover"
                        sx={{
                            color: vistelicaColors.secondary,
                            fontSize: { xs: 14, md: 16 },
                            transition: 'color 0.2s',
                            '&:hover': {
                                color: vistelicaColors.primary
                            }
                        }}
                    >
                        {category.name}
                    </MuiLink>
                )}

                {/* Mapeado de items adicionales */}
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return isLast ? (
                        <Typography
                            key={index}
                            sx={{
                                color: vistelicaColors.primary,
                                fontWeight: 500,
                                fontSize: { xs: 14, md: 16 },
                                fontFamily: 'ThemePrimitives.fontFamily'
                            }}
                        >
                            {item.label}
                        </Typography>
                    ) : (
                        <MuiLink
                            component={Link}
                            underline="hover"
                            href={item.href}
                            key={index}
                            sx={{
                                color: vistelicaColors.secondary,
                                fontSize: { xs: 14, md: 16 },
                                transition: 'color 0.2s',
                                '&:hover': {
                                    color: vistelicaColors.primary
                                }
                            }}
                        >
                            {item.label}
                        </MuiLink>
                    );
                })}

                {/* Subcategoría si existe */}
                {subcategory && (
                    <Typography
                        sx={{
                            color: vistelicaColors.primary,
                            fontWeight: 500,
                            fontSize: { xs: 14, md: 16 },
                            fontFamily: 'ThemePrimitives.fontFamily'
                        }}
                    >
                        {subcategory.name}
                    </Typography>
                )}
            </Breadcrumbs>
        </Box>
    );
};

export default Breadcrumb;