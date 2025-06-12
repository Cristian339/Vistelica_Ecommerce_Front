import React, { useMemo } from 'react';
import { Box, Typography, Breadcrumbs, Link as MuiLink, useTheme, useMediaQuery } from '@mui/material';
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { motion } from 'framer-motion';
import { vistelicaColors } from '../../../components/shared/vistelicaColors';
import { typography } from "../../../components/shared/themePrimitives";

const BreadcrumbItem = React.memo(({ label, href, isActive }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (isActive) {
        return (
            <Box
                component={motion.div}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                sx={{
                    color: '#fff',
                    fontWeight: 400,
                    fontSize: { xs: 13, sm: 14, md: 15 },
                    p: { xs: 0.3, sm: 0.5 },
                    px: { xs: 0.8, sm: 1.2 },
                    borderRadius: '6px',
                    backgroundColor: vistelicaColors.primary,
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                    maxWidth: { xs: '120px', sm: '200px', md: 'none' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                <Typography
                    noWrap
                    component="span"
                    sx={{
                        fontSize: 'inherit',
                    }}
                >
                    {label}
                </Typography>
            </Box>
        );
    }

    return (
        <MuiLink
            component={Link}
            underline="none"
            href={href}
            sx={{
                color: vistelicaColors.secondary,
                fontSize: { xs: 13, sm: 14, md: 15 },
                fontWeight: 500,
                transition: 'all 0.2s',
                p: { xs: 0.3, sm: 0.5 },
                px: { xs: 0.8, sm: 1 },
                borderRadius: '6px',
                whiteSpace: 'nowrap',
                display: 'block',
                maxWidth: { xs: '120px', sm: '200px', md: '300px' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                '&:hover': {
                    color: vistelicaColors.primary,
                    backgroundColor: 'rgba(244, 67, 54, 0.05)',
                }
            }}
        >
            {label}
        </MuiLink>
    );
});

BreadcrumbItem.displayName = 'BreadcrumbItem';

const HomeLink = React.memo(() => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <MuiLink
            component={Link}
            href="/"
            underline="none"
            sx={{
                display: 'flex',
                alignItems: 'center',
                color: vistelicaColors.secondary,
                fontSize: { xs: 13, sm: 14, md: 15 },
                fontWeight: 500,
                transition: 'all 0.2s',
                p: { xs: 0.3, sm: 0.5 },
                px: { xs: 0.8, sm: 1 },
                borderRadius: '6px',
                '&:hover': {
                    color: vistelicaColors.primary,
                    backgroundColor: 'rgba(244, 67, 54, 0.05)',
                }
            }}
        >
            <HomeIcon
                sx={{
                    mr: { xs: 0.3, sm: 0.5 },
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    color: vistelicaColors.primary,
                }}
            />
            <Typography
                component="span"
                sx={{
                    display: { xs: 'none', sm: 'inline' }
                }}
            >
                Inicio
            </Typography>
        </MuiLink>
    );
});

HomeLink.displayName = 'HomeLink';

const Breadcrumb = ({ items = [], category, subcategory }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Filtrar items de forma memoizada
    const filteredItems = useMemo(() => {
        if (!subcategory) return items;
        return items.filter(item => item.label !== subcategory.name);
    }, [items, subcategory]);

    return (
        <Breadcrumbs
            component={motion.nav}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            separator={
                <NavigateNextIcon
                    fontSize="small"
                    sx={{
                        color: 'rgba(0,0,0,0.4)',
                        mx: { xs: 0.2, sm: 0.5 },
                        fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1.1rem' }
                    }}
                />
            }
            aria-label="navegación de migas de pan"
            sx={{
                fontFamily: typography.fontFamily,
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': {
                    height: '3px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    borderRadius: '4px',
                },
                py: 0.5
            }}
        >
            <HomeLink />

            {category && category.name && category.name !== 'Todos los productos' && (
                <BreadcrumbItem
                    label={category.name}
                    href={`/product-list?category=${category.slug || category.name.toLowerCase()}`}
                    isActive={false}
                />
            )}

            {filteredItems.map((item, index) => (
                <BreadcrumbItem
                    key={`item-${index}-${item.label}`}
                    label={item.label}
                    href={item.href}
                    isActive={index === filteredItems.length - 1 && !subcategory}
                />
            ))}

            {subcategory && subcategory.name && (
                <BreadcrumbItem
                    label={subcategory.name}
                    href="#"
                    isActive={true}
                />
            )}
        </Breadcrumbs>
    );
};

export default React.memo(Breadcrumb);