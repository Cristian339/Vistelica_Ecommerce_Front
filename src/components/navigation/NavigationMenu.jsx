'use client';
import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Drawer, List, ListItemButton, ListItemText, Collapse, Box, Typography,
    IconButton, Divider, Avatar, ListItemIcon, Badge, Tooltip, Chip,
    useMediaQuery, ClickAwayListener
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import categoryService from '@/services/categoryService';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";
import WomanIcon from '@mui/icons-material/Woman';
import ManIcon from '@mui/icons-material/Man';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import DiamondIcon from '@mui/icons-material/Diamond';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import AccessibleIcon from '@mui/icons-material/Accessible';

const CATEGORY_ICONS = {
    'Hombre': <ManIcon />,
    'Mujer': <WomanIcon />,
    'Colecciones': <DiamondIcon />,
    'Ultimas Novedades': <NewReleasesIcon />,
    'Chico': <ChildCareIcon />,
    'Chica': <ChildCareIcon />
};

// Componente memoizado para el encabezado del menú
const MenuHeader = memo(({ onClose }) => (
    <Box
        component={motion.div}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        sx={{
            padding: '22px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${vistelicaColors.neutralLight}`,
            background: `linear-gradient(120deg, ${vistelicaColors.primary}20, white 70%)`,
            boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '3px',
                background: `linear-gradient(to right, ${vistelicaColors.primary}, transparent)`,
            }
        }}
    >
        <Typography
            variant="h5"
            component={motion.div}
            whileHover={{ scale: 1.03 }}
            sx={{
                fontFamily: typography.fontFamily,
                fontWeight: 700,
                color: vistelicaColors.secondary,
                position: 'relative',
                fontSize: '1.5rem',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -7,
                    left: 0,
                    width: '45px',
                    height: '3px',
                    background: `linear-gradient(to right, ${vistelicaColors.primary}, ${vistelicaColors.tertiary})`,
                    borderRadius: '2px'
                }
            }}
        >
            <span style={{ color: vistelicaColors.primary }}>V</span>ÍS<span style={{ color: vistelicaColors.primary }}>T</span>ELICA
        </Typography>

        <Tooltip title="Cerrar menú" arrow>
            <IconButton
                component={motion.button}
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                aria-label="Cerrar menú de navegación"
                sx={{
                    color: vistelicaColors.secondary,
                    backgroundColor: `${vistelicaColors.neutralLight}30`,
                    '&:hover': {
                        backgroundColor: `${vistelicaColors.primary}20`,
                    },
                    '&:focus-visible': {
                        outline: `2px solid ${vistelicaColors.primary}`,
                        outlineOffset: '2px'
                    }
                }}
            >
                <CloseIcon />
            </IconButton>
        </Tooltip>
    </Box>
));

// Componente memoizado para la sección de novedades
const FeaturedSection = memo(({ featuredItems, handleSubcategoryClick }) => (
    <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        sx={{
            padding: '16px 20px',
            borderBottom: `1px solid ${vistelicaColors.neutralLight}`,
            background: `linear-gradient(to right, white, ${vistelicaColors.primary}08)`,
        }}
    >
        <Typography
            variant="subtitle1"
            sx={{
                fontFamily: typography.fontFamily,
                fontWeight: 600,
                fontSize: '0.85rem',
                marginBottom: '10px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                color: vistelicaColors.secondary,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
            }}
        >
            <StarIcon fontSize="small" sx={{ color: vistelicaColors.primary }} />
            Novedades
        </Typography>

        <Box
            sx={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                maxWidth: '100%',
                overflowX: 'auto',
                pb: 1,
                '&::-webkit-scrollbar': {
                    height: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: vistelicaColors.primaryLight,
                    borderRadius: '4px',
                }
            }}
            role="region"
            aria-label="Subcategorías destacadas"
        >
            {featuredItems.map((item, idx) => (
                <Chip
                    key={idx}
                    component={motion.div}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    icon={<NewReleasesIcon fontSize="small" />}
                    label={item.name}
                    onClick={() => handleSubcategoryClick(
                        {name: item.categoryName},
                        item
                    )}
                    tabIndex={0}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSubcategoryClick({name: item.categoryName}, item);
                        }
                    }}
                    sx={{
                        backgroundColor: idx % 2 === 0 ?
                            `${vistelicaColors.primary}15` :
                            `${vistelicaColors.tertiary}15`,
                        border: `1px solid ${vistelicaColors.primary}30`,
                        fontFamily: typography.fontFamily,
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        py: 2.5,
                        '&:hover': {
                            backgroundColor: `${vistelicaColors.primary}25`,
                            boxShadow: '0 4px 8px rgba(0,0,0,0.07)'
                        },
                        '&:focus-visible': {
                            outline: `2px solid ${vistelicaColors.primary}`,
                            outlineOffset: '2px'
                        },
                        '& .MuiChip-icon': {
                            color: vistelicaColors.primary
                        }
                    }}
                />
            ))}
        </Box>
    </Box>
));

// Componente memoizado para una subcategoría
const SubcategoryItem = memo(({ subcat, category, onClick, index, total }) => (
    <motion.div
        initial={{ opacity: 0, x: -15, height: 0 }}
        animate={{ opacity: 1, x: 0, height: 'auto' }}
        exit={{ opacity: 0, x: -15, height: 0 }}
        transition={{
            delay: index * 0.03,
            duration: 0.2,
            ease: "easeInOut"
        }}
    >
        <ListItemButton
            onClick={() => onClick(category, subcat)}
            sx={{
                pl: 8.5,
                py: 1.5,
                borderLeft: `3px solid transparent`,
                transition: 'all 0.2s ease',
                margin: '3px 8px',
                borderRadius: '8px',
                '&:hover': {
                    borderLeft: `3px solid ${vistelicaColors.primary}`,
                    backgroundColor: `${vistelicaColors.primaryLight}15`,
                    paddingLeft: '36px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                },
                '&:focus-visible': {
                    outline: `2px solid ${vistelicaColors.primary}`,
                    outlineOffset: '2px'
                }
            }}
            role="menuitem"
            aria-label={subcat.name}
        >
            <ListItemText
                primary={subcat.name}
                primaryTypographyProps={{
                    style: {
                        fontWeight: 400,
                        fontSize: '0.98rem',
                        fontFamily: typography.fontFamily,
                        color: vistelicaColors.secondary,
                        transition: 'all 0.2s ease',
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
                            padding: '0 8px',
                            height: '22px',
                            minWidth: '50px',
                            borderRadius: '11px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                            fontWeight: 600,
                            letterSpacing: '0.5px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }
                    }}
                    badgeContent="nuevo"
                />
            )}
        </ListItemButton>
        {index < total - 1 && (
            <Divider sx={{
                ml: 8,
                mr: 3,
                borderColor: `${vistelicaColors.neutralLight}70`,
                opacity: 0.7
            }} />
        )}
    </motion.div>
));

// Componente memoizado para una categoría
const CategoryItem = memo(({
                               category,
                               index,
                               isOpen,
                               onToggle,
                               onSubcategoryClick,
                               getCategoryIcon
                           }) => (
    <Box
        component={motion.div}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 + index * 0.08 }}
        sx={{
            mb: 2.5,
            boxShadow: isOpen ? '0 5px 18px rgba(0,0,0,0.08)' : 'none',
            borderRadius: '14px',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            transform: isOpen ? 'scale(1.01)' : 'scale(1)',
            backgroundColor: isOpen ? 'white' : 'transparent',
        }}
        role="menuitem"
        aria-expanded={isOpen}
    >
        <motion.div
            whileHover={{ x: 7, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
            <ListItemButton
                onClick={() => onToggle(index)}
                sx={{
                    borderRadius: isOpen ? '14px 14px 0 0' : '14px',
                    background: isOpen
                        ? `linear-gradient(45deg, ${vistelicaColors.primary}15, ${vistelicaColors.primaryLight}25)`
                        : 'white',
                    transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                    padding: '14px 18px',
                    border: `1px solid ${isOpen ? vistelicaColors.primaryLight : 'rgba(0,0,0,0.05)'}`,
                    '&:hover': {
                        backgroundColor: isOpen
                            ? `linear-gradient(45deg, ${vistelicaColors.primary}20, ${vistelicaColors.primaryLight}30)`
                            : `${vistelicaColors.primaryLight}20`,
                        transform: 'translateY(-2px)',
                    },
                    '&:focus-visible': {
                        outline: `2px solid ${vistelicaColors.primary}`,
                        outlineOffset: '2px'
                    },
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': isOpen ? {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        height: '2px',
                        width: '100%',
                        background: `linear-gradient(to right, ${vistelicaColors.primary}70, transparent)`,
                    } : {}
                }}
                aria-controls={`panel-${index}`}
                id={`category-header-${index}`}
            >
                <ListItemIcon
                    sx={{
                        minWidth: '45px',
                        color: vistelicaColors.primary,
                        backgroundColor: `${vistelicaColors.primaryLight}25`,
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: '16px',
                        boxShadow: isOpen
                            ? '0 4px 10px rgba(228,176,2,0.2)'
                            : '0 3px 8px rgba(0,0,0,0.05)',
                        transition: 'all 0.3s ease',
                        border: `1px solid ${vistelicaColors.primary}20`,
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
                            color: isOpen ? vistelicaColors.primary : vistelicaColors.secondary,
                            fontSize: '1.1rem',
                            letterSpacing: '0.5px'
                        }
                    }}
                />
                <Box
                    component={motion.div}
                    animate={{
                        rotate: isOpen ? 180 : 0,
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 0.4 }}
                    sx={{
                        color: isOpen ? vistelicaColors.primary : vistelicaColors.secondary,
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    aria-hidden="true"
                >
                    <ExpandMore />
                </Box>
            </ListItemButton>
        </motion.div>

        <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List
                component="div"
                disablePadding
                sx={{
                    background: 'linear-gradient(180deg, rgba(228,176,2,0.05) 0%, rgba(255,255,255,0) 100%)',
                    borderRadius: '0 0 14px 14px',
                    overflow: 'hidden',
                    padding: '8px 0',
                    borderLeft: `1px solid ${vistelicaColors.neutralLight}`,
                    borderRight: `1px solid ${vistelicaColors.neutralLight}`,
                    borderBottom: `1px solid ${vistelicaColors.neutralLight}`
                }}
                role="menu"
                aria-labelledby={`category-header-${index}`}
                id={`panel-${index}`}
            >
                <AnimatePresence>
                    {isOpen && category.subcategories?.map((subcat, subIndex) => (
                        <SubcategoryItem
                            key={subIndex}
                            subcat={subcat}
                            category={category}
                            onClick={onSubcategoryClick}
                            index={subIndex}
                            total={category.subcategories.length}
                        />
                    ))}
                </AnimatePresence>
            </List>
        </Collapse>
    </Box>
));

// Componente memoizado para el pie de página
const MenuFooter = memo(() => (
    <Box
        component={motion.div}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        sx={{
            padding: '22px',
            borderTop: `1px solid ${vistelicaColors.neutralLight}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            background: `linear-gradient(to top, ${vistelicaColors.primary}15, transparent)`,
            boxShadow: '0 -4px 15px rgba(0,0,0,0.03)',
            position: 'relative',
            gap: '15px'
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
                fontSize: '1.1rem',
                textAlign: 'center',
                padding: '10px 16px',
                borderRadius: '24px',
                background: `linear-gradient(135deg, ${vistelicaColors.primaryLight}40, transparent)`,
                boxShadow: '0 3px 10px rgba(0,0,0,0.05)',
                border: `1px solid ${vistelicaColors.neutralLight}`,
            }}
        >
            <motion.span
                initial={{ opacity: 0.8 }}
                animate={{
                    opacity: [0.8, 1, 0.8],
                    scale: [1, 1.05, 1]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'reverse'
                }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                <LocalMallIcon fontSize="small" sx={{ color: vistelicaColors.primary }} />
                ¿Listo para explorar nuestra colección?
            </motion.span>
        </Typography>

        <Typography
            variant="caption"
            sx={{
                fontFamily: typography.fontFamily,
                color: vistelicaColors.secondary + '99',
                fontWeight: 400,
                fontSize: '0.8rem',
                textAlign: 'center',
                maxWidth: '80%'
            }}
        >
            Moda y estilo para todas las ocasiones
        </Typography>

        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            mt: 1,
            padding: '4px 12px',
            backgroundColor: `${vistelicaColors.primary}10`,
            borderRadius: '16px'
        }}>
            <AccessibleIcon fontSize="small" sx={{ color: vistelicaColors.primary }} />
            <Typography
                variant="caption"
                sx={{
                    fontFamily: typography.fontFamily,
                    color: vistelicaColors.secondary,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                }}
            >
                Navegue con flechas y Tab para accesibilidad
            </Typography>
        </Box>
    </Box>
));

// Componente principal del menú de navegación
const NavigationMenu = ({ open, onClose, router }) => {
    const [openSubmenus, setOpenSubmenus] = useState({});
    const [menuCategories, setMenuCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [focusedItem, setFocusedItem] = useState(null);
    const isMobile = useMediaQuery('(max-width:768px)');
    const isSmallMobile = useMediaQuery('(max-width:480px)');

    // Optimiza la carga de categorías con useEffect y useCallback
    const loadCategories = useCallback(async () => {
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
                    setActiveCategory(categoryIndex);
                }
            }
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    }, []);

    useEffect(() => {
        if (open) {
            loadCategories();
        }
    }, [open, loadCategories]);

    // Optimiza la función toggleSubmenu con useCallback
    const toggleSubmenu = useCallback((index) => {
        setOpenSubmenus(prev => ({ ...prev, [index]: !prev[index] }));
        setActiveCategory(prevActive => prevActive === index ? null : index);
    }, []);

    // Optimiza handleSubcategoryClick con useCallback
    const handleSubcategoryClick = useCallback((category, subcat) => {
        localStorage.setItem('selectedCategory', category.name.toLowerCase());
        localStorage.setItem('selectedSubcategory', subcat.subcategory_id.toString());
        router.push(`/product-list/productList?category=${encodeURIComponent(category.name.toLowerCase())}&subcategory=${subcat.subcategory_id}&name=${encodeURIComponent(subcat.name)}`);
        onClose();
    }, [router, onClose]);

    // Memoiza el resultado de getCategoryIcon
    const getCategoryIcon = useCallback((categoryName) => {
        return CATEGORY_ICONS[categoryName] || <DiamondIcon />;
    }, []);

    // Memoiza las subcategorías destacadas
    const featuredSubcategories = useMemo(() => {
        const featured = [];
        menuCategories.forEach(category => {
            if (category.subcategories?.length) {
                const newItems = category.subcategories
                    .filter(sub => sub.is_new)
                    .map(sub => ({...sub, categoryName: category.name}));
                featured.push(...newItems.slice(0, 2));
            }
        });
        return featured.slice(0, 4);
    }, [menuCategories]);

    // Manejador de eventos de teclado para navegación
    const handleKeyDown = useCallback((e) => {
        if (!open) return;

        switch (e.key) {
            case 'Escape':
                onClose();
                break;
            case 'Tab':
                // El comportamiento por defecto de Tab es gestionar el foco
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                // Se puede implementar la navegación por teclado dentro de las categorías
                e.preventDefault();
                break;
        }
    }, [open, onClose]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={onClose}
            variant="temporary"
            sx={{
                width: isMobile ? '100%' : '520px',
                '& .MuiDrawer-paper': {
                    width: isMobile ? '100%' : '520px',
                    height: '100%',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 0 25px rgba(0,0,0,0.15)',
                    borderRadius: 0,
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z" fill="%23E4B00220" fill-opacity="0.08" fill-rule="evenodd"/%3E%3C/svg%3E")',
                    backgroundAttachment: 'fixed',
                    overflowX: 'hidden'
                }
            }}
            SlideProps={{
                component: motion.div,
                initial: { x: "-100%", opacity: 0.5 },
                animate: { x: 0, opacity: 1 },
                exit: { x: "-100%", opacity: 0 },
                transition: { type: "spring", stiffness: 300, damping: 30 }
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
        >
            <Box
                sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
                role="navigation"
                aria-label="Menú principal"
            >
                {/* Header del menú */}
                <MenuHeader onClose={onClose} />

                {/* Destacados o novedades */}
                {menuCategories.length > 0 && (
                    <FeaturedSection
                        featuredItems={featuredSubcategories}
                        handleSubcategoryClick={handleSubcategoryClick}
                    />
                )}

                {/* Lista de categorías */}
                <List
                    component={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    sx={{
                        pt: 2,
                        overflow: 'auto',
                        flex: 1,
                        padding: '10px 14px',
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: vistelicaColors.primaryLight,
                            borderRadius: '6px',
                        }
                    }}
                    role="menu"
                    aria-label="Categorías de productos"
                >
                    {menuCategories.map((category, index) => (
                        <CategoryItem
                            key={index}
                            category={category}
                            index={index}
                            isOpen={openSubmenus[index]}
                            onToggle={toggleSubmenu}
                            onSubcategoryClick={handleSubcategoryClick}
                            getCategoryIcon={getCategoryIcon}
                        />
                    ))}
                </List>

                {/* Footer del menú */}
                <MenuFooter />
            </Box>
        </Drawer>
    );
};

// Asignar displayNames para mejor depuración
MenuHeader.displayName = 'MenuHeader';
FeaturedSection.displayName = 'FeaturedSection';
CategoryItem.displayName = 'CategoryItem';
SubcategoryItem.displayName = 'SubcategoryItem';
MenuFooter.displayName = 'MenuFooter';

export default memo(NavigationMenu);