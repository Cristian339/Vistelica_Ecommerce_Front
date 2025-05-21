'use client';
import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    AppBar, Toolbar, IconButton, InputBase, Drawer, List, ListItem,
    ListItemText, Collapse, Paper, CircularProgress, Typography, Box
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter } from 'next/navigation';
import { isAdmin, getToken } from '@/services/authService';
import categoryService from '@/services/categoryService';
import productService from '@/services/productService';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

const POPULAR_SEARCHES = ['Hombre', 'Mujer', 'Colecciones', 'Ultimas Novedades', 'Chico', 'Chica'];
const CATEGORY_MAP = {
    'Hombre': 1,
    'Mujer': 2,
    'Colecciones': 5,
    'Ultimas Novedades': 6,
    'Chico': 7,
    'Chica': 3
};

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [openSubmenus, setOpenSubmenus] = useState({});
    const [searchOpen, setSearchOpen] = useState(false);
    const [menuCategories, setMenuCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

    const isMobile = useMediaQuery('(max-width:768px)');
    const router = useRouter();

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

    const performSearch = useCallback(async (query) => {
        if (!query || query.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        try {
            setIsSearching(true);
            setSearchError('');
            const results = await productService.searchProducts(query, selectedCategoryIds);
            setSearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
            setSearchError(error.message || 'Error al realizar la búsqueda');
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, [selectedCategoryIds]);

    useEffect(() => {
        const timer = setTimeout(() => {
            performSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, performSearch]);

    const handleSearchChange = (e) => setSearchQuery(e.target.value);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim().length >= 2) {
            router.push(`/search-results/page?query=${encodeURIComponent(searchQuery)}${selectedCategoryIds.length > 0 ? `&categories=${selectedCategoryIds.join(',')}` : ''}`);
            setSearchOpen(false);
            setSearchQuery('');
            setSearchResults([]);
            setSelectedCategoryIds([]);
        }
    };

    const handleProductClick = (productName) => {
        setSearchQuery(productName);
        setSearchResults([]);
    };

    const handlePopularSearchClick = (term) => {
        const categoryId = CATEGORY_MAP[term];
        if (!categoryId) return;

        setSelectedCategoryIds((prev) => (
            prev.includes(categoryId) ? prev : [...prev, categoryId]
        ));

        performSearch(searchQuery);
    };

    const handleLogoClick = async () => {
        try {
            const rol = await isAdmin();
            if (rol) {
                router.push('/admin/page');
            } else {
                router.push('/home/Home');
            }
        } catch (error) {
            console.error("Error verificando permisos:", error);
        }
    };

    const handleCart = () => router.push('/cart/page');
    const handlewishlist = () => router.push('/wish-list/Wishlist');
    const handleAccountClick = () => {
        const token = getToken();
        token ? router.push('/account/AccountLayout') : router.push('/sign-in-side/Sign-in-side');
    };

    const toggleDrawer = (state) => () => setOpen(state);
    const toggleSubmenu = (index) => setOpenSubmenus(prev => ({ ...prev, [index]: !prev[index] }));

    const toggleSearch = () => setSearchOpen(!searchOpen);

    const handleSubcategoryClick = (category, subcat) => {
        localStorage.setItem('selectedCategory', category.name.toLowerCase());
        localStorage.setItem('selectedSubcategory', subcat.subcategory_id.toString());
        router.push(`/product-list/productList?category=${encodeURIComponent(category.name.toLowerCase())}&subcategory=${subcat.subcategory_id}&name=${encodeURIComponent(subcat.name)}`);
        toggleDrawer(false)();
    };

    return (
        <>
            <AppBar
                position="sticky"
                component={motion.header}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                elevation={1}
                sx={{
                    backgroundColor: "white",
                    borderBottom: `1px solid ${vistelicaColors.neutralLight}`,
                    padding: "8px 16px",
                }}
            >
                <Toolbar sx={{ display: 'flex', alignItems: 'center', padding: '0 !important' }}>
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}
                    >
                        <IconButton
                            onClick={toggleDrawer(true)}
                            component={motion.button}
                            whileTap={{ scale: 0.95 }}
                            sx={{ color: vistelicaColors.secondary }}
                        >
                            <MenuIcon fontSize="large" />
                        </IconButton>
                        {!isMobile && (
                            <Typography
                                variant="h1"
                                component={motion.h1}
                                whileHover={{
                                    scale: 1.03,
                                    textShadow: "0px 0px 8px rgba(0,0,0,0.1)"
                                }}
                                sx={{
                                    fontSize: "37px",
                                    color: vistelicaColors.secondary,
                                    fontFamily: typography.fontFamily,
                                    fontWeight: 700,
                                    letterSpacing: "1px",
                                    marginLeft: "16px",
                                    cursor: 'pointer',
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: -5,
                                        left: 0,
                                        width: '60px',
                                        height: '2px',
                                        backgroundColor: vistelicaColors.primary
                                    }
                                }}
                                onClick={handleLogoClick}
                            >
                                VÍSTELICA
                            </Typography>
                        )}
                    </Box>

                    {isMobile && (
                        <Typography
                            variant="h1"
                            component={motion.h1}
                            whileHover={{ scale: 1.03 }}
                            sx={{
                                fontSize: "37px",
                                color: vistelicaColors.secondary,
                                fontFamily: typography.fontFamily,
                                fontWeight: 700,
                                letterSpacing: "1px",
                                textAlign: 'center',
                                flex: 1,
                                cursor: 'pointer',
                                position: 'relative',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -5,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '60px',
                                    height: '2px',
                                    backgroundColor: vistelicaColors.primary
                                }
                            }}
                            onClick={handleLogoClick}
                        >
                            VÍSTELICA
                        </Typography>
                    )}

                    <Box
                        component={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        sx={{ display: "flex", alignItems: "center", gap: "16px" }}
                    >
                        <IconButton
                            onClick={toggleSearch}
                            component={motion.button}
                            whileHover={{ scale: 1.1, backgroundColor: `${vistelicaColors.primaryLight}30` }}
                            whileTap={{ scale: 0.95 }}
                            sx={{ color: vistelicaColors.secondary }}
                        >
                            <SearchIcon sx={{ fontSize: "34px" }} />
                        </IconButton>
                        {!isMobile && (
                            <>
                                <IconButton
                                    component={motion.button}
                                    whileHover={{ scale: 1.1, backgroundColor: `${vistelicaColors.primaryLight}30` }}
                                    whileTap={{ scale: 0.95 }}
                                    sx={{ color: vistelicaColors.secondary }}
                                    onClick={handleAccountClick}
                                >
                                    <AccountCircleIcon sx={{ fontSize: "34px" }} />
                                </IconButton>
                                <IconButton
                                    component={motion.button}
                                    whileHover={{ scale: 1.1, backgroundColor: `${vistelicaColors.primaryLight}30` }}
                                    whileTap={{ scale: 0.95 }}
                                    sx={{ color: vistelicaColors.secondary }}
                                    onClick={handlewishlist}
                                >
                                    <FavoriteBorderIcon sx={{ fontSize: "34px" }} />
                                </IconButton>
                            </>
                        )}
                        <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
                            <IconButton
                                component={motion.button}
                                whileHover={{ scale: 1.1, backgroundColor: `${vistelicaColors.primaryLight}30` }}
                                whileTap={{ scale: 0.95 }}
                                sx={{ color: vistelicaColors.secondary }}
                                onClick={handleCart}
                            >
                                <ShoppingBagIcon sx={{ fontSize: "34px" }} />
                            </IconButton>
                            <Box
                                component={motion.div}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500, delay: 0.6 }}
                                sx={{
                                    position: "absolute", top: 0, right: 0,
                                    backgroundColor: vistelicaColors.primary,
                                    color: "white",
                                    fontSize: "12px",
                                    borderRadius: "50%",
                                    width: "18px",
                                    height: "18px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontFamily: typography.fontFamily,
                                    fontWeight: 600
                                }}
                            >0</Box>
                        </Box>
                    </Box>
                </Toolbar>

                {searchOpen && (
                    <AnimatePresence>
                        <Paper
                            component={motion.div}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            elevation={3}
                            sx={{
                                width: '100%',
                                padding: '16px 24px',
                                borderBottom: `1px solid ${vistelicaColors.neutralLight}`,
                                position: 'relative',
                                zIndex: 10,
                                backgroundColor: 'rgba(255, 255, 255, 0.98)'
                            }}
                        >
                            <form onSubmit={handleSearchSubmit}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, marginRight: '16px' }}>
                                        <SearchIcon sx={{ color: vistelicaColors.primary, fontSize: "24px", marginRight: '12px' }} />
                                        <InputBase
                                            autoFocus
                                            placeholder="¿Qué estás buscando?"
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                            sx={{
                                                flexGrow: 1,
                                                fontSize: '18px',
                                                color: vistelicaColors.secondary,
                                                fontFamily: typography.fontFamily,
                                                '& input::placeholder': {
                                                    color: `${vistelicaColors.secondary}80`,
                                                    fontFamily: typography.fontFamily,
                                                    fontStyle: 'italic'
                                                }
                                            }}
                                        />
                                        {isSearching && (
                                            <CircularProgress
                                                size={22}
                                                sx={{ marginLeft: '12px', color: vistelicaColors.primary }}
                                            />
                                        )}
                                    </Box>
                                    <IconButton
                                        component={motion.button}
                                        whileHover={{ scale: 1.1, backgroundColor: `${vistelicaColors.primaryLight}30` }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            setSearchOpen(false);
                                            setSearchQuery('');
                                            setSelectedCategoryIds([]);
                                            setSearchResults([]);
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            </form>

                            {selectedCategoryIds.length > 0 && (
                                <Box
                                    component={motion.div}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', mt: 2 }}
                                >
                                    {selectedCategoryIds.map(id => (
                                        <Box
                                            component={motion.div}
                                            whileHover={{ scale: 1.05 }}
                                            key={id}
                                            sx={{
                                                padding: '6px 12px',
                                                backgroundColor: vistelicaColors.primaryLight,
                                                borderRadius: '20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                fontSize: '14px',
                                                color: vistelicaColors.secondary,
                                                fontFamily: typography.fontFamily,
                                                fontWeight: 500
                                            }}
                                        >
                                            {Object.keys(CATEGORY_MAP).find(key => CATEGORY_MAP[key] === id)}
                                            <IconButton
                                                component={motion.button}
                                                whileHover={{ rotate: 90 }}
                                                size="small"
                                                onClick={() =>
                                                    setSelectedCategoryIds(prev => prev.filter(cid => cid !== id))
                                                }
                                                sx={{ ml: 1, padding: '2px', color: vistelicaColors.secondary }}
                                            >
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Box>
                            )}

                            <AnimatePresence>
                                {searchResults.length > 0 && (
                                    <Paper
                                        component={motion.div}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        elevation={4}
                                        sx={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: 0,
                                            right: 0,
                                            zIndex: 10,
                                            maxHeight: '400px',
                                            overflowY: 'auto',
                                            mt: 1,
                                            borderBottomLeftRadius: '8px',
                                            borderBottomRightRadius: '8px',
                                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <List>
                                            {searchResults.map((product, index) => (
                                                <ListItem
                                                    component={motion.li}
                                                    whileHover={{
                                                        backgroundColor: vistelicaColors.primaryLight,
                                                        x: 6
                                                    }}
                                                    key={index}
                                                    button={true}
                                                    onClick={() => handleProductClick(product.product_name)}
                                                    sx={{
                                                        fontFamily: typography.fontFamily,
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary={product.product_name}
                                                        primaryTypographyProps={{
                                                            fontFamily: typography.fontFamily
                                                        }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Paper>
                                )}

                                {searchResults.length === 0 && !isSearching && searchQuery.length < 2 && (
                                    <Box
                                        component={motion.div}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        sx={{ padding: '16px 0 8px' }}
                                    >
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: 600,
                                                marginBottom: '16px',
                                                fontFamily: typography.fontFamily,
                                                color: vistelicaColors.secondary,
                                                position: 'relative',
                                                display: 'inline-block',
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    bottom: -5,
                                                    left: 0,
                                                    width: '40px',
                                                    height: '2px',
                                                    backgroundColor: vistelicaColors.primary
                                                }
                                            }}
                                        >
                                            Categorías
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                            {POPULAR_SEARCHES.map((item, index) => (
                                                <Box
                                                    component={motion.div}
                                                    whileHover={{ scale: 1.05, y: -2 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    transition={{ type: "spring", stiffness: 400 }}
                                                    key={index}
                                                    sx={{
                                                        padding: '10px 16px',
                                                        border: `1px solid ${vistelicaColors.neutralLight}`,
                                                        backgroundColor: 'white',
                                                        borderRadius: '24px',
                                                        fontSize: '14px',
                                                        fontFamily: typography.fontFamily,
                                                        fontWeight: 500,
                                                        cursor: 'pointer',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                                                        color: vistelicaColors.secondary
                                                    }}
                                                    onClick={() => handlePopularSearchClick(item)}
                                                >
                                                    {item}
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                )}

                                {searchError && (
                                    <Typography
                                        component={motion.p}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        sx={{
                                            color: 'error.main',
                                            marginTop: '16px',
                                            fontFamily: typography.fontFamily
                                        }}
                                    >
                                        {searchError}
                                    </Typography>
                                )}

                                {searchResults.length === 0 && searchQuery.length >= 2 && !isSearching && !searchError && (
                                    <Typography
                                        component={motion.p}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        sx={{
                                            marginTop: '16px',
                                            fontFamily: typography.fontFamily,
                                            fontStyle: 'italic',
                                            color: vistelicaColors.secondary
                                        }}
                                    >
                                        No se encontraron resultados para "{searchQuery}"
                                    </Typography>
                                )}
                            </AnimatePresence>
                        </Paper>
                    </AnimatePresence>
                )}
            </AppBar>

            <Drawer
                anchor="left"
                open={open}
                onClose={toggleDrawer(false)}
                sx={{
                    width: isMobile ? '100%' : '500px',
                    '& .MuiDrawer-paper': {
                        width: isMobile ? '100%' : '500px',
                        height: '100%',
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0 0 20px rgba(0,0,0,0.1)',
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
                <Box sx={{ width: '100%', height: '100%' }}>
                    <Box className="p-4">
                        <IconButton
                            onClick={toggleDrawer(false)}
                            sx={{
                                color: "black", backgroundColor: "white",
                                borderRadius: "0", width: "40px", height: "40px",
                                "&:hover": {
                                    backgroundColor: "#E4B002", color: "white"
                                }
                            }}
                        >
                            ✕
                        </IconButton>
                    </Box>

                    <List sx={{ pt: 0 }}>
                        {menuCategories.map((category, index) => (
                            <Box key={index}>
                                <ListItem
                                    onClick={() => toggleSubmenu(index)}
                                    sx={{
                                        borderBottom: "1px solid #f0f0f0", color: category.color,
                                        padding: "12px 16px", cursor: "pointer"
                                    }}
                                >
                                    <ListItemText primary={category.name} primaryTypographyProps={{ style: { fontWeight: 500 } }} />
                                    {openSubmenus[index] ? <ExpandLess /> : <ExpandMore />}
                                </ListItem>

                                <Collapse in={openSubmenus[index]} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {category.subcategories?.map((subcat, subIndex) => (
                                            <ListItem
                                                key={subIndex}
                                                onClick={() => handleSubcategoryClick(category, subcat)}
                                                sx={{
                                                    pl: 4, borderBottom: "1px solid #f0f0f0",
                                                    backgroundColor: "#f9f9f9", color: "#333",
                                                    padding: "8px 16px 8px 32px", cursor: "pointer",
                                                    '&:hover': { backgroundColor: "#f0f0f0" }
                                                }}
                                            >
                                                <ListItemText
                                                    primary={subcat.name}
                                                    primaryTypographyProps={{ style: { fontWeight: 400, fontSize: '0.95rem' } }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            </Box>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    );
}
