'use client';
import { useState } from "react";
import { AppBar, Toolbar, IconButton, InputBase, Drawer, List, ListItem, ListItemText, Collapse } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import useMediaQuery from '@mui/material/useMediaQuery';

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [openSubmenus, setOpenSubmenus] = useState({});
    const isMobile = useMediaQuery('(max-width:768px)');

    const toggleDrawer = (state) => () => {
        setOpen(state);
    };

    const toggleSubmenu = (index) => {
        setOpenSubmenus(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const menuCategories = [
        {
            name: "ÚLTIMAS NOVEDADES",
            color: "#FF0000",
            subcategories: ["Nueva colección", "Descuentos especiales", "Edición limitada"]
        },
        {
            name: "HOMBRE",
            color: "#171717",
            subcategories: ["Camisas", "Pantalones", "Trajes"]
        },
        {
            name: "MUJER",
            color: "#171717",
            subcategories: ["Vestidos", "Faldas", "Blusas"]
        },
        {
            name: "TEEN",
            color: "#171717",
            subcategories: ["Urbano", "Casual", "Deportivo"]
        },
        {
            name: "ACCESORIOS",
            color: "#171717",
            subcategories: ["Cinturones", "Corbatas", "Pañuelos"]
        },
    ];

    return (
        <>
            {/* Navbar */}
            <AppBar position="static" color="transparent" elevation={0} sx={{ backgroundColor: "white", padding: "8px 16px" }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', padding: '0 !important' }}>
                    {/* Left - Hamburger Menu */}
                    <IconButton onClick={toggleDrawer(true)} sx={{ color: "#171717" }}>
                        <MenuIcon />
                    </IconButton>

                    {/*Logo */}
                    <h1 className="text-xl font-bold"
                        style={{
                            color: "#171717",
                            fontFamily: "'Amethysta', serif",
                            marginLeft: isMobile ? 'auto' : '8px',
                            marginRight: isMobile ? 'auto' : '0',
                            textAlign: isMobile ? 'center' : 'left',
                            flexGrow: isMobile ? 1 : 0
                        }}>
                        VÍSTELICA
                    </h1>


                    {/* Right - Icons in One Line */}
                    <div style={{display: "flex", alignItems: "center", gap: "16px"}}>
                        {isMobile ? (
                            <div style={{display: "flex", alignItems: "center", gap: "16px"}}>
                                <IconButton sx={{ color: "#171717" }}>
                                    <SearchIcon />
                                </IconButton>
                                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                    <IconButton sx={{ color: "#171717" }}>
                                        <ShoppingBagIcon />
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
                        ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                <div style={{ display: "flex", alignItems: "center", border: "1px solid #171717", borderRadius: "4px", padding: "4px 8px" }}>
                                    <SearchIcon sx={{ color: "#171717" }} />
                                    <InputBase placeholder="Buscar..." sx={{ color: "#171717", marginLeft: 1 }} />
                                </div>
                                <IconButton sx={{ color: "#171717" }}>
                                    <AccountCircleIcon />
                                </IconButton>
                                <IconButton sx={{ color: "#171717" }}>
                                    <FavoriteBorderIcon />
                                </IconButton>
                                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                    <IconButton sx={{ color: "#171717" }}>
                                        <ShoppingBagIcon />
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
                        )}
                    </div>
                </Toolbar>
            </AppBar>

            {/* Sliding Menu */}
            <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
                <div className="w-full sm:w-80">
                    {/* Menu Header with Icons */}
                    {isMobile && (
                        <div className="flex justify-end p-4 border-b border-gray-200">
                            <IconButton sx={{ color: "#171717" }}>
                                <SearchIcon />
                            </IconButton>
                            <div className="relative">
                                <IconButton sx={{ color: "#171717" }}>
                                    <ShoppingBagIcon />
                                </IconButton>
                                <span className="absolute top-0 right-0 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    0
                                </span>
                            </div>
                        </div>
                    )}

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
                                "&:hover": { backgroundColor: "#E4B002",
                                    color: "white"}
                            }}
                        >
                            ✕
                        </IconButton>
                    </div>

                    {/* Menu Categories with Subcategories */}
                    <List sx={{ pt: 0 }}>
                        {menuCategories.map((category, index) => (
                            <div key={index}>
                                <ListItem
                                    button
                                    onClick={() => toggleSubmenu(index)}
                                    sx={{
                                        borderBottom: "1px solid #f0f0f0",
                                        color: category.color,
                                        padding: "12px 16px"
                                    }}
                                >
                                    <ListItemText
                                        primary={category.name}
                                        primaryTypographyProps={{
                                            style: { fontWeight: 500 }
                                        }}
                                    />
                                    {openSubmenus[index] ? <ExpandLess /> : <ExpandMore />}
                                </ListItem>

                                <Collapse in={openSubmenus[index]} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {category.subcategories.map((subcat, subIndex) => (
                                            <ListItem
                                                button
                                                key={subIndex}
                                                sx={{
                                                    pl: 4,
                                                    borderBottom: "1px solid #f0f0f0",
                                                    backgroundColor: "#f9f9f9",
                                                    color: "#333",
                                                    padding: "8px 16px 8px 32px"
                                                }}
                                            >
                                                <ListItemText
                                                    primary={subcat}
                                                    primaryTypographyProps={{
                                                        style: { fontWeight: 400, fontSize: '0.95rem' }
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