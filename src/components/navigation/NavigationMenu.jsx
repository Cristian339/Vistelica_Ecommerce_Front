'use client';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Drawer, List, ListItemButton, ListItemText, Collapse, Box, Typography,
    IconButton, Divider, Avatar, ListItemIcon, Badge
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import categoryService from '@/services/categoryService';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";
import useMediaQuery from '@mui/material/useMediaQuery';
import WomanIcon from '@mui/icons-material/Woman';
import ManIcon from '@mui/icons-material/Man';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import DiamondIcon from '@mui/icons-material/Diamond';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

const CATEGORY_ICONS = {
    'Hombre': <ManIcon />,
    'Mujer': <WomanIcon />,
    'Colecciones': <DiamondIcon />,
    'Ultimas Novedades': <NewReleasesIcon />,
    'Chico': <ChildCareIcon />,
    'Chica': <ChildCareIcon />
};

const NavigationMenu = ({ open, onClose, router }) => {
    const [openSubmenus, setOpenSubmenus] = useState({});
    const [menuCategories, setMenuCategories] = useState([]);
    const isMobile = useMediaQuery('(max-width:768px)');

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const categories = await categoryService.fetchCategories();
                setMenuCategories(categories);
                const selectedCategory = localStorage.getItem('selectedCategory');
                if (selectedCategory) {
                    const categoryIndex = categories.findIndex(
                        cat => cat.name.toLowerCase() === selectedCategory.toLowerCase()
                    );
                    if (categoryIndex >= 0) {
                        setOpenSubmenus(prev => ({ ...prev, [categoryIndex]: true }));
                    }
                }
            } catch (error) {
                console.error("Error loading categories:", error);
            }
        };
        loadCategories();
    }, []);

    const toggleSubmenu = (index) => setOpenSubmenus(prev => ({ ...prev, [index]: !prev[index] }));

    const handleSubcategoryClick = (category, subcat) => {
        localStorage.setItem('selectedCategory', category.name.toLowerCase());
        localStorage.setItem('selectedSubcategory', subcat.subcategory_id.toString());
        router.push(`/product-list/productList?category=${encodeURIComponent(category.name.toLowerCase())}&subcategory=${subcat.subcategory_id}&name=${encodeURIComponent(subcat.name)}`);
        onClose();
    };

    const getCategoryIcon = (categoryName) => {
        return CATEGORY_ICONS[categoryName] || <DiamondIcon />;
    };

    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={onClose}
            variant="temporary"
            sx={{
                width: isMobile ? '100%' : '500px',
                '& .MuiDrawer-paper': {
                    width: isMobile ? '100%' : '500px',
                    height: '100%',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 0 20px rgba(0,0,0,0.1)',
                    borderRadius: 0,
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23E4B00220" fill-opacity="0.1" fill-rule="evenodd"/%3E%3C/svg%3E")',
                    backgroundAttachment: 'fixed'
                }
            }}
            SlideProps={{
                component: motion.div,
                initial: { x: "-100%" },
                animate: { x: 0 },
                exit: { x: "-100%" },
                transition: { type: "tween", ease: "easeOut", duration: 0.3 }
            }}
        >
            <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header del menú */}
                <Box sx={{
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: `1px solid ${vistelicaColors.neutralLight}`,
                    background: `linear-gradient(to right, ${vistelicaColors.primary}30, white)`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}>
                    <Typography
                        variant="h5"
                        component={motion.div}
                        whileHover={{ scale: 1.03 }}
                        sx={{
                            fontFamily: typography.fontFamily,
                            fontWeight: 600,
                            color: vistelicaColors.secondary,
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -5,
                                left: 0,
                                width: '40px',
                                height: '3px',
                                background: `linear-gradient(to right, ${vistelicaColors.primary}, ${vistelicaColors.tertiary})`,
                                borderRadius: '2px'
                            }
                        }}
                    >
                        Categorías
                    </Typography>
                    <IconButton
                        component={motion.button}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        sx={{
                            color: vistelicaColors.secondary,
                            '&:hover': {
                                backgroundColor: `${vistelicaColors.primary}20`,
                            }
                        }}
                    >
                        <Box sx={{
                            width: '20px',
                            height: '20px',
                            position: 'relative',
                            '&::before, &::after': {
                                content: '""',
                                position: 'absolute',
                                top: '50%',
                                left: 0,
                                width: '100%',
                                height: '2px',
                                backgroundColor: vistelicaColors.secondary,
                                transition: 'all 0.2s ease'
                            },
                            '&::before': {
                                transform: 'rotate(45deg)'
                            },
                            '&::after': {
                                transform: 'rotate(-45deg)'
                            }
                        }} />
                    </IconButton>
                </Box>

                {/* Lista de categorías */}
                <List sx={{
                    pt: 2,
                    overflow: 'auto',
                    flex: 1,
                    padding: '0 10px',
                    '&::-webkit-scrollbar': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: vistelicaColors.primaryLight,
                        borderRadius: '6px',
                    }
                }}>
                    {menuCategories.map((category, index) => (
                        <Box
                            key={index}
                            sx={{
                                mb: 2,
                                boxShadow: openSubmenus[index] ? '0 4px 15px rgba(0,0,0,0.07)' : 'none',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <motion.div
                                whileHover={{ x: 6 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <ListItemButton
                                    onClick={() => toggleSubmenu(index)}
                                    sx={{
                                        borderRadius: '12px',
                                        backgroundColor: openSubmenus[index]
                                            ? `linear-gradient(45deg, ${vistelicaColors.primary}20, ${vistelicaColors.primaryLight}40)`
                                            : 'white',
                                        transition: 'all 0.3s ease',
                                        padding: '12px 16px',
                                        border: `1px solid ${openSubmenus[index] ? vistelicaColors.primaryLight : 'transparent'}`,
                                        '&:hover': {
                                            backgroundColor: `${vistelicaColors.primaryLight}40`,
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: '40px',
                                            color: category.color || vistelicaColors.primary,
                                            backgroundColor: `${vistelicaColors.primaryLight}30`,
                                            borderRadius: '50%',
                                            width: '36px',
                                            height: '36px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: '12px'
                                        }}
                                    >
                                        {getCategoryIcon(category.name)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={category.name}
                                        primaryTypographyProps={{
                                            style: {
                                                fontWeight: 600,
                                                fontFamily: typography.fontFamily,
                                                color: openSubmenus[index] ? vistelicaColors.primary : vistelicaColors.secondary,
                                                fontSize: '1.05rem',
                                                letterSpacing: '0.5px'
                                            }
                                        }}
                                    />
                                    {openSubmenus[index] ? (
                                        <ExpandLess sx={{ color: vistelicaColors.primary }} />
                                    ) : (
                                        <ExpandMore />
                                    )}
                                </ListItemButton>
                            </motion.div>

                            <Collapse in={openSubmenus[index]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding sx={{
                                    background: 'linear-gradient(180deg, rgba(228,176,2,0.08) 0%, rgba(255,255,255,0) 100%)',
                                    borderRadius: '0 0 12px 12px',
                                    overflow: 'hidden',
                                    padding: '8px 0',
                                    borderLeft: `1px solid ${vistelicaColors.neutralLight}`,
                                    borderRight: `1px solid ${vistelicaColors.neutralLight}`,
                                    borderBottom: `1px solid ${vistelicaColors.neutralLight}`
                                }}>
                                    <AnimatePresence>
                                        {openSubmenus[index] && category.subcategories?.map((subcat, subIndex) => (
                                            <motion.div
                                                key={subIndex}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ delay: subIndex * 0.05 }}
                                            >
                                                <ListItemButton
                                                    onClick={() => handleSubcategoryClick(category, subcat)}
                                                    sx={{
                                                        pl: 7,
                                                        py: 1.2,
                                                        borderLeft: `3px solid transparent`,
                                                        transition: 'all 0.2s ease',
                                                        margin: '2px 0',
                                                        '&:hover': {
                                                            borderLeft: `3px solid ${vistelicaColors.primary}`,
                                                            backgroundColor: `${vistelicaColors.primaryLight}20`,
                                                            paddingLeft: '32px'
                                                        }
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary={subcat.name}
                                                        primaryTypographyProps={{
                                                            style: {
                                                                fontWeight: 400,
                                                                fontSize: '0.95rem',
                                                                fontFamily: typography.fontFamily
                                                            }
                                                        }}
                                                    />
                                                    {subcat.is_new && (
                                                        <Badge
                                                            sx={{
                                                                '& .MuiBadge-badge': {
                                                                    background: `linear-gradient(135deg, ${vistelicaColors.primary}, #f9d273)`,
                                                                    color: 'white',
                                                                    fontFamily: typography.fontFamily,
                                                                    fontSize: '0.7rem',
                                                                    padding: '0 6px',
                                                                    borderRadius: '10px',
                                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                                }
                                                            }}
                                                            badgeContent="nuevo"
                                                        />
                                                    )}
                                                </ListItemButton>
                                                {subIndex < category.subcategories.length - 1 && (
                                                    <Divider sx={{ ml: 6, mr: 3, borderColor: `${vistelicaColors.neutralLight}50` }} />
                                                )}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </List>
                            </Collapse>
                        </Box>
                    ))}
                </List>

                {/* Footer del menú sin botón */}
                <Box
                    sx={{
                        padding: '18px',
                        borderTop: `1px solid ${vistelicaColors.neutralLight}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        background: `linear-gradient(to top, ${vistelicaColors.primary}15, transparent)`,
                        boxShadow: '0 -4px 10px rgba(0,0,0,0.03)'
                    }}
                >
                    <Typography
                        variant="body1"
                        component={motion.div}
                        whileHover={{ scale: 1.05 }}
                        sx={{
                            fontFamily: typography.fontFamily,
                            color: vistelicaColors.secondary,
                            fontWeight: 500,
                            fontSize: '1rem',
                            textAlign: 'center',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            background: `linear-gradient(135deg, ${vistelicaColors.primaryLight}40, transparent)`,
                        }}
                    >
                        ¿Listo para explorar?
                    </Typography>
                </Box>
            </Box>
        </Drawer>
    );
};

export default NavigationMenu;