'use client';
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
    AppBar, Toolbar, IconButton, Typography, Box, Badge
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter } from 'next/navigation';
import { isAdmin, getToken } from '@/services/authService';
import { vistelicaColors } from '@/components/shared/vistelicaColors';
import { typography } from "@/components/shared/themePrimitives";
import NavigationMenu from '@/components/navigation/NavigationMenu';
import SearchFilter from '@/components/search/SearchFilter';

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const headerRef = useRef(null);
    const isMobile = useMediaQuery('(max-width:768px)');
    const router = useRouter();

    // Control de visibilidad del header según el scroll
    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                const scrollY = window.scrollY;
                setScrolled(scrollY > 20);
            }
        };

        window.addEventListener('scroll', controlNavbar);
        return () => {
            window.removeEventListener('scroll', controlNavbar);
        };
    }, []);

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
    const toggleSearch = () => setSearchOpen(!searchOpen);
    const closeSearch = () => setSearchOpen(false);

    return (
        <>
            <AppBar
                position="sticky"
                component={motion.header}
                elevation={scrolled ? 4 : 1}
                sx={{
                    backgroundColor: "white",
                    borderBottom: `1px solid ${scrolled ? 'transparent' : vistelicaColors.neutralLight}`,
                    transition: "all 0.3s ease",
                    top: 0,
                    height: scrolled ? (isMobile ? '60px' : '70px') : (isMobile ? '70px' : '80px'),
                    display: 'flex',
                    justifyContent: 'center',
                    boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
                }}
            >
                <Toolbar sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 16px !important',
                    height: '100%',
                    transition: 'all 0.3s ease'
                }}>
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
                            whileHover={{ scale: 1.1, backgroundColor: `${vistelicaColors.primaryLight}30` }}
                            whileTap={{ scale: 0.95 }}
                            sx={{
                                color: vistelicaColors.secondary,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <MenuIcon fontSize={scrolled ? "medium" : "large"} />
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
                                    fontSize: scrolled ? "32px" : "37px",
                                    color: vistelicaColors.secondary,
                                    fontFamily: typography.fontFamily,
                                    fontWeight: 700,
                                    letterSpacing: "1px",
                                    marginLeft: "16px",
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transition: 'all 0.3s ease',
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
                                fontSize: scrolled ? "32px" : "37px",
                                color: vistelicaColors.secondary,
                                fontFamily: typography.fontFamily,
                                fontWeight: 700,
                                letterSpacing: "1px",
                                textAlign: 'center',
                                flex: 1,
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'all 0.3s ease',
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
                            <SearchIcon sx={{
                                fontSize: scrolled ? "28px" : "34px",
                                transition: 'all 0.3s ease'
                            }} />
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
                                    <AccountCircleIcon sx={{
                                        fontSize: scrolled ? "28px" : "34px",
                                        transition: 'all 0.3s ease'
                                    }} />
                                </IconButton>

                                <IconButton
                                    component={motion.button}
                                    whileHover={{ scale: 1.1, backgroundColor: `${vistelicaColors.primaryLight}30` }}
                                    whileTap={{ scale: 0.95 }}
                                    sx={{ color: vistelicaColors.secondary }}
                                    onClick={handlewishlist}
                                >
                                    <FavoriteBorderIcon sx={{
                                        fontSize: scrolled ? "28px" : "34px",
                                        transition: 'all 0.3s ease'
                                    }} />
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
                                <ShoppingBagIcon sx={{
                                    fontSize: scrolled ? "28px" : "34px",
                                    transition: 'all 0.3s ease'
                                }} />
                            </IconButton>
                            <Badge
                                badgeContent={0}
                                color="primary"
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    '& .MuiBadge-badge': {
                                        backgroundColor: vistelicaColors.primary,
                                        transition: 'all 0.3s ease',
                                        fontFamily: typography.fontFamily
                                    }
                                }}
                            />
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Componente de filtro de búsqueda */}
            <SearchFilter
                isOpen={searchOpen}
                onClose={closeSearch}
                router={router}
            />

            {/* Componente de menú de navegación */}
            <NavigationMenu open={open} onClose={toggleDrawer(false)} router={router} />
        </>
    );
}