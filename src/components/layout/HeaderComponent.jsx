'use client';
import { useState } from "react";
import { AppBar, Toolbar, IconButton, InputBase, Drawer, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import useMediaQuery from '@mui/material/useMediaQuery';

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:768px)');

    const toggleDrawer = (state) => () => {
        setOpen(state);
    };

    const menuCategories = [
        { name: "ÚLTIMAS UNIDADES", color: "#FF0000" },
        { name: "HOMBRE", color: "#171717" },
        { name: "TEEN", color: "#171717" },
        { name: "NIÑO", color: "#171717" },
        { name: "TRAJEARTE", color: "#171717" },
        { name: "TARJETA REGALO", color: "#171717" }
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

                    {/* Center - Logo */}
                    <h1 className="text-xl font-bold"
                        style={{ color: "#171717", fontFamily: "'Amethysta', serif" }}>
                        VÍSTELICA
                    </h1>

                    {/* Right - Icons */}
                    <div className="flex items-center gap-2">
                        {!isMobile && (
                            <>
                                <div className="flex items-center border rounded px-2" style={{ borderColor: "#171717" }}>
                                    <SearchIcon sx={{ color: "#171717" }} />
                                    <InputBase placeholder="Buscar..." sx={{ color: "#171717", marginLeft: 1 }} />
                                </div>
                                <IconButton sx={{ color: "#171717" }}>
                                    <AccountCircleIcon />
                                </IconButton>
                                <IconButton sx={{ color: "#171717" }}>
                                    <FavoriteBorderIcon />
                                </IconButton>
                            </>
                        )}
                        {isMobile && (
                            <IconButton sx={{ color: "#171717" }}>
                                <SearchIcon />
                            </IconButton>
                        )}
                        <div className="relative">
                            <IconButton sx={{ color: "#171717" }}>
                                <ShoppingBagIcon />
                            </IconButton>
                            <span className="absolute top-0 right-0 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                0
                            </span>
                        </div>
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
                                color: "white",
                                backgroundColor: "#666",
                                borderRadius: "0",
                                width: "40px",
                                height: "40px",
                                "&:hover": { backgroundColor: "#555" }
                            }}
                        >
                            ✕
                        </IconButton>
                    </div>

                    {/* Menu Categories */}
                    <List sx={{ pt: 0 }}>
                        {menuCategories.map((category, index) => (
                            <ListItem
                                button
                                key={index}
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
                                {index < 4 && <span>+</span>}
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>
        </>
    );
}