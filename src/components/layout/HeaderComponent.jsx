'use client';
import { useEffect, useState, useCallback } from "react";
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
            <AppBar position="static" color="transparent" elevation={0} sx={{ backgroundColor: "white", padding: "8px 16px" }}>
                <Toolbar sx={{ display: 'flex', alignItems: 'center', padding: '0 !important' }}>
                    <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <IconButton onClick={toggleDrawer(true)} sx={{ color: "#171717" }}>
                            <MenuIcon fontSize="large" />
                        </IconButton>
                        {!isMobile && (
                            <Typography variant="h1" sx={{
                                fontSize: "37px", color: "#171717", fontFamily: "'Amethysta', serif",
                                marginLeft: "16px", cursor: 'pointer'
                            }} onClick={handleLogoClick}>
                                VÍSTELICA
                            </Typography>
                        )}
                    </div>

                    {isMobile && (
                        <Typography variant="h1" sx={{
                            fontSize: "37px", color: "#171717", fontFamily: "'Amethysta', serif",
                            textAlign: 'center', flex: 1, cursor: 'pointer'
                        }} onClick={handleLogoClick}>
                            VÍSTELICA
                        </Typography>
                    )}

                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <IconButton onClick={toggleSearch} sx={{ color: "#171717" }}>
                            <SearchIcon sx={{ fontSize: "34px" }} />
                        </IconButton>
                        {!isMobile && (
                            <>
                                <IconButton sx={{ color: "#171717" }} onClick={handleAccountClick}>
                                    <AccountCircleIcon sx={{ fontSize: "34px" }} />
                                </IconButton>
                                <IconButton sx={{ color: "#171717" }} onClick={handlewishlist}>
                                    <FavoriteBorderIcon sx={{ fontSize: "34px" }} />
                                </IconButton>
                            </>
                        )}
                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                            <IconButton sx={{ color: "#171717" }} onClick={handleCart}>
                                <ShoppingBagIcon sx={{ fontSize: "34px" }} />
                            </IconButton>
                            <Box sx={{
                                position: "absolute", top: 0, right: 0, backgroundColor: "black",
                                color: "white", fontSize: "12px", borderRadius: "50%", width: "16px", height: "16px",
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}>0</Box>
                        </div>
                    </div>
                </Toolbar>

                {searchOpen && (
                    <Paper elevation={0} square sx={{
                        width: '100%', padding: '16px', borderBottom: '1px solid #e0e0e0',
                        borderTop: '1px solid #e0e0e0', position: 'relative'
                    }}>
                        <form onSubmit={handleSearchSubmit}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, marginRight: '16px' }}>
                                    <SearchIcon sx={{ color: "#171717", fontSize: "24px", marginRight: '8px' }} />
                                    <InputBase
                                        autoFocus
                                        placeholder="¿Qué estás buscando?"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        sx={{ flexGrow: 1, fontSize: '16px', color: "#171717" }}
                                    />
                                    {isSearching && <CircularProgress size={20} sx={{ marginLeft: '8px' }} />}
                                </Box>
                                <IconButton onClick={() => {
                                    setSearchOpen(false);
                                    setSearchQuery('');
                                    setSelectedCategoryIds([]);
                                    setSearchResults([]);
                                }}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </form>

                        {selectedCategoryIds.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', mt: 2 }}>
                                {selectedCategoryIds.map(id => (
                                    <Box key={id} sx={{
                                        padding: '6px 10px',
                                        backgroundColor: '#e0e0e0',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '14px'
                                    }}>
                                        {Object.keys(CATEGORY_MAP).find(key => CATEGORY_MAP[key] === id)}
                                        <IconButton
                                            size="small"
                                            onClick={() =>
                                                setSelectedCategoryIds(prev => prev.filter(cid => cid !== id))
                                            }
                                            sx={{ ml: 1, padding: '2px' }}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        )}

                        {searchResults.length > 0 && (
                            <Paper elevation={3} sx={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                zIndex: 10,
                                maxHeight: '400px',
                                overflowY: 'auto',
                                mt: 1
                            }}>
                                <List>
                                    {searchResults.map((product, index) => (
                                        <ListItem
                                            key={index}
                                            button={true}
                                            onClick={() => handleProductClick(product.product_name)}
                                            sx={{
                                                '&:hover': { backgroundColor: '#f5f5f5' }
                                            }}
                                        >
                                            <ListItemText primary={product.product_name} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        )}

                        {searchResults.length === 0 && !isSearching && searchQuery.length < 2 && (
                            <Box sx={{ padding: '10px 0' }}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                                    Categorias
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {POPULAR_SEARCHES.map((item, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                padding: '8px 12px',
                                                border: '1px solid #e0e0e0',
                                                borderRadius: '20px',
                                                fontSize: '14px',
                                                cursor: 'pointer',
                                                '&:hover': { backgroundColor: '#f5f5f5' }
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
                            <Typography sx={{ color: 'error.main', marginTop: '10px' }}>
                                {searchError}
                            </Typography>
                        )}

                        {searchResults.length === 0 && searchQuery.length >= 2 && !isSearching && !searchError && (
                            <Typography sx={{ marginTop: '10px' }}>
                                No se encontraron resultados para "{searchQuery}"
                            </Typography>
                        )}
                    </Paper>
                )}
            </AppBar>

            <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}
                    sx={{
                        width: isMobile ? '100%' : '500px',
                        '& .MuiDrawer-paper': {
                            width: isMobile ? '100%' : '500px',
                            height: '100%',
                        }
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