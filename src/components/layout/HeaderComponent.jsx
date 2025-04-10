'use client';
import {useEffect, useState} from "react";
import { AppBar, Toolbar, IconButton, InputBase, Drawer, List, ListItem, ListItemText, Collapse, Dialog, Paper } from "@mui/material";
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
import { isAdmin } from '@/services/authService';


export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [openSubmenus, setOpenSubmenus] = useState({});
    const [searchOpen, setSearchOpen] = useState(false);
    const [menuCategories, setMenuCategories] = useState([]);
    const isMobile = useMediaQuery('(max-width:768px)');
    const router = useRouter();

    useEffect(() => {
        fetch("http://localhost:5000/api/categories")
            .then(res => res.json())
            .then(data => setMenuCategories(data))
            .catch(err => console.error("Error loading categories:", err));
    }, []);


    const handleLogoClick = async () => {
        try {
            const rol = await isAdmin();
            if (rol) {
                router.push('/admin/page');
            }
        } catch (error) {
            console.error("Error verificando permisos:", error);
        }
    };

    const toggleDrawer = (state) => () => setOpen(state);
    const toggleSubmenu = (index) => {
        setOpenSubmenus(prev => ({ ...prev, [index]: !prev[index] }));
    };
    const toggleSearch = () => setSearchOpen(!searchOpen);

    return (
        <>
            {/* Navbar */}
            <AppBar position="static" color="transparent" elevation={0} sx={{ backgroundColor: "white", padding: "8px 16px" }}>
                <Toolbar sx={{display: 'flex', alignItems: 'center', padding: '0 !important'}}>

                {/* Left section - Hamburger Menu and Logo */}
                    {/* Logo con hamburguesa alineado con flexbox */}
                    <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <IconButton onClick={toggleDrawer(true)} sx={{color: "#171717"}}>
                            <MenuIcon fontSize="large"/>
                        </IconButton>

                        {!isMobile && (
                            <h1
                                style={{
                                    fontSize: "37px",
                                    color: "#171717",
                                    fontFamily: "'Amethysta', serif",
                                    marginLeft: "16px"
                                }}
                                onClick={handleLogoClick}
                            >
                                VÍSTELICA
                            </h1>
                        )}
                    </div>


                    {/* Logo - centered on mobile only */}
                    {isMobile && (
                        <h1 className="text-xl font-bold"
                            style={{
                                fontSize: "37px",
                                color: "#171717",
                                fontFamily: "'Amethysta', serif",
                                textAlign: 'center',
                                flex: 1
                            }}
                            onClick={handleLogoClick}
                        >
                            VÍSTELICA
                        </h1>
                    )}

                    {/* Right - Icons in One Line */}
                    <div style={{display: "flex", alignItems: "center", gap: "16px"}}>
                        {/* Search Button - Both Mobile & Desktop with same size */}
                        <IconButton onClick={toggleSearch} sx={{color: "#171717"}}>
                            <SearchIcon sx={{fontSize: "34px"}}/>
                        </IconButton>

                        {!isMobile && (
                            <>
                                <IconButton sx={{color: "#171717"}}>
                                    <AccountCircleIcon sx={{fontSize: "34px"}}/>
                                </IconButton>
                                <IconButton sx={{color: "#171717"}}>
                                    <FavoriteBorderIcon sx={{fontSize: "34px"}}/>
                                </IconButton>
                            </>
                        )}

                        {/* Shopping Bag - Both Mobile & Desktop */}
                        <div style={{position: "relative", display: "flex", alignItems: "center"}}>
                            <IconButton sx={{color: "#171717"}}>
                                <ShoppingBagIcon sx={{fontSize: "34px"}}/>
                            </IconButton>
                            <span style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                backgroundColor: "black",
                                color: "white",
                                fontSize: "12px",
                                borderRadius: "50%",
                                width: "16px",
                                height: "16px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                            0
                        </span>
                        </div>
                    </div>
                </Toolbar>

                {/* Search Panel below logo */}
                {searchOpen && (
                    <Paper elevation={0} square sx={{
                        width: '100%',
                        padding: '16px',
                        borderBottom: '1px solid #e0e0e0',
                        borderTop: '1px solid #e0e0e0'
                    }}>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <div style={{display: 'flex', alignItems: 'center', flexGrow: 1, marginRight: '16px'}}>
                                <SearchIcon sx={{color: "#171717", fontSize: "24px", marginRight: '8px'}}/>
                                <InputBase
                                    autoFocus
                                    placeholder="¿Qué estás buscando?"
                                    sx={{
                                        flexGrow: 1,
                                        fontSize: '16px',
                                        color: "#171717"
                                    }}
                                />
                            </div>
                            <IconButton onClick={toggleSearch}>
                                <CloseIcon/>
                            </IconButton>
                        </div>
                        <div style={{padding: '10px 0'}}>
                            <h3 style={{fontWeight: 'bold', marginBottom: '10px'}}>BÚSQUEDAS POPULARES</h3>
                            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                                {['Camisas', 'Vestidos', 'Pantalones', 'Trajes', 'Rebajas'].map((item, index) => (
                                    <div key={index} style={{
                                        padding: '8px 12px',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '20px',
                                        fontSize: '14px',
                                        cursor: 'pointer'
                                    }}>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Paper>
                )}
            </AppBar>

            {/* Sliding Menu */}
            <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}
                    sx={{
                        width: isMobile ? '100%' : '500px',
                        height: isMobile ? '100%' : 'auto',
                        '& .MuiDrawer-paper': {
                            width: isMobile ? '100%' : '500px',
                            height: isMobile ? '100%' : '100%',
                        }
                    }}
            >
                <div style={{width: '100%', height: '100%'}}>
                    {/* Menu Header with Icons */}


                    {/* Close Button */}
                    <div className="p-4">
                        <IconButton
                            onClick={toggleDrawer(false)}
                            sx={{
                                color: "black",
                                backgroundColor: "white",
                                borderRadius: "0",
                                width: "40px",
                                height: "40px",
                                "&:hover": {
                                    backgroundColor: "#E4B002",
                                    color: "white"
                                }
                            }}
                        >
                            ✕
                        </IconButton>
                    </div>

                    {/* Menu Categories with Subcategories */}
                    <List sx={{pt: 0}}>
                        {menuCategories.map((category, index) => (
                            <div key={index}>
                                <ListItem
                                    onClick={() => toggleSubmenu(index)}
                                    sx={{
                                        borderBottom: "1px solid #f0f0f0",
                                        color: category.color,
                                        padding: "12px 16px",
                                        cursor: "pointer"
                                    }}
                                >
                                    <ListItemText
                                        primary={category.name}
                                        primaryTypographyProps={{
                                            style: {fontWeight: 500}
                                        }}
                                    />
                                    {openSubmenus[index] ? <ExpandLess/> : <ExpandMore/>}
                                </ListItem>

                                <Collapse in={openSubmenus[index]} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {category.subcategories.map((subcat, subIndex) => (
                                            <ListItem
                                                key={subIndex}
                                                sx={{
                                                    pl: 4,
                                                    borderBottom: "1px solid #f0f0f0",
                                                    backgroundColor: "#f9f9f9",
                                                    color: "#333",
                                                    padding: "8px 16px 8px 32px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <ListItemText
                                                    primary={subcat.name}
                                                    primaryTypographyProps={{
                                                        style: {fontWeight: 400, fontSize: '0.95rem'}
                                                    }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            </div>
                        ))}
                    </List>
                </div>
            </Drawer>
        </>
    );
}