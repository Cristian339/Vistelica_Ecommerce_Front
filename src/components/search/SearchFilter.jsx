'use client';
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    InputBase, Paper, CircularProgress, Typography, Avatar,
    Box, List, ListItem, ListItemText, Chip, ListItemAvatar,
    Divider, ListItemButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
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

export default function SearchFilter({ isOpen, onClose, router }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
    const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

    useEffect(() => {
        if (!isOpen) {
            // Limpiar resultados cuando se cierra
            setSearchResults([]);
            setSearchQuery('');
            setSelectedCategoryIds([]);
            setSelectedItemIndex(-1);
        }
    }, [isOpen]);

    const performSearch = useCallback(async (query) => {
        if (!query || query.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        try {
            setIsSearching(true);
            setSearchError('');
            console.log("Buscando con categorías:", selectedCategoryIds);
            const results = await productService.searchProducts(query, selectedCategoryIds);
            console.log("Resultados:", results);
            setSearchResults(results || []);
        } catch (error) {
            console.error('Error en la búsqueda:', error);
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
    }, [searchQuery, performSearch, selectedCategoryIds]);

    const handleSearchChange = (e) => setSearchQuery(e.target.value);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim().length >= 2) {
            router.push(`/search-results/page?query=${encodeURIComponent(searchQuery)}${selectedCategoryIds.length > 0 ? `&categories=${selectedCategoryIds.join(',')}` : ''}`);
            onClose();
        }
    };

    const handleProductClick = (productId, index) => {
        console.log("Producto seleccionado:", productId);
        setSelectedItemIndex(index);

        if (productId) {
            // Método 1: Navegación directa con window.location
            window.location.href = `/product-detail/page?id=${productId}`;

            // Método 2: Como respaldo, usar router.push con timeout
            setTimeout(() => {
                try {
                    router.push(`/product-detail/page?id=${productId}`);
                } catch (error) {
                    console.error("Error en la redirección:", error);
                    // Método 3: Como último recurso si todo falla
                    window.open(`/product-detail/page?id=${productId}`, '_self');
                }
            }, 100);

            onClose();
        } else {
            console.error("ID de producto no válido");
        }
    };

    const handlePopularSearchClick = (term) => {
        const categoryId = CATEGORY_MAP[term];
        if (!categoryId) return;

        setSelectedCategoryIds((prev) => {
            if (prev.includes(categoryId)) return prev;
            return [...prev, categoryId];
        });
    };

    const handleRemoveCategory = (idToRemove) => {
        setSelectedCategoryIds((prev) =>
            prev.filter(id => id !== idToRemove)
        );
    };

    // Función para extraer la imagen del producto si está disponible
    const getProductImage = (product) => {
        if (product?.images_url?.length > 0) {
            return product.images_url[0];
        } else if (product?.images && product.images.length > 0) {
            return product.images[0];
        } else if (product?.image_url) {
            return product.image_url;
        }
        return null;
    };

    // Función para formatear el precio
    const formatPrice = (price) => {
        if (!price && price !== 0) return '';
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        overflow: 'hidden',
                        position: 'relative',
                        zIndex: 1050,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}
                >
                    <Paper
                        sx={{
                            width: '100%',
                            padding: '20px 24px',
                            borderBottom: `1px solid ${vistelicaColors.neutralLight}`,
                            backgroundColor: 'rgba(255, 255, 255, 0.98)',
                            borderRadius: 0
                        }}
                        elevation={3}
                    >
                        {/* Formulario de búsqueda */}
                        <form onSubmit={handleSearchSubmit}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                border: `2px solid ${vistelicaColors.primaryLight}`,
                                borderRadius: '50px',
                                padding: '8px 16px',
                                transition: 'all 0.3s ease',
                                '&:focus-within': {
                                    borderColor: vistelicaColors.primary,
                                    boxShadow: `0 0 0 4px ${vistelicaColors.primaryLight}40`
                                }
                            }}>
                                <SearchIcon
                                    sx={{
                                        color: vistelicaColors.primary,
                                        fontSize: "24px",
                                        marginRight: '12px'
                                    }}
                                />
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
                                {isSearching ? (
                                    <CircularProgress
                                        size={22}
                                        sx={{ marginLeft: '12px', color: vistelicaColors.primary }}
                                    />
                                ) : (
                                    searchQuery && (
                                        <CloseIcon
                                            onClick={() => setSearchQuery('')}
                                            sx={{
                                                cursor: 'pointer',
                                                color: vistelicaColors.secondary,
                                                fontSize: '20px',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    color: vistelicaColors.primary
                                                }
                                            }}
                                        />
                                    )
                                )}
                            </Box>
                        </form>

                        {/* Categorías seleccionadas */}
                        {selectedCategoryIds.length > 0 && (
                            <Box
                                component={motion.div}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', mt: 2 }}
                            >
                                {selectedCategoryIds.map(id => {
                                    const categoryName = Object.keys(CATEGORY_MAP).find(key => CATEGORY_MAP[key] === id);
                                    return (
                                        <Chip
                                            key={`cat-${id}`}
                                            label={categoryName}
                                            onDelete={() => handleRemoveCategory(id)}
                                            sx={{
                                                backgroundColor: `${vistelicaColors.primaryLight}60`,
                                                color: vistelicaColors.secondary,
                                                fontFamily: typography.fontFamily,
                                                fontWeight: 500
                                            }}
                                        />
                                    );
                                })}

                                <Chip
                                    icon={<CloseIcon />}
                                    label="Cerrar búsqueda"
                                    onClick={onClose}
                                    sx={{
                                        backgroundColor: vistelicaColors.secondary,
                                        color: 'white',
                                        fontFamily: typography.fontFamily,
                                        fontWeight: 500,
                                        marginLeft: 'auto'
                                    }}
                                />
                            </Box>
                        )}

                        {/* Resultados de búsqueda - DISEÑO MEJORADO */}
                        <AnimatePresence>
                            {searchResults && searchResults.length > 0 && (
                                <Paper
                                    component={motion.div}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    elevation={4}
                                    sx={{
                                        mt: 2,
                                        maxHeight: '400px',
                                        overflowY: 'auto',
                                        borderRadius: '12px',
                                        backgroundColor: 'white',
                                        border: `1px solid ${vistelicaColors.neutralLight}`
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            padding: '12px 16px',
                                            fontFamily: typography.fontFamily,
                                            fontWeight: 600,
                                            color: vistelicaColors.secondary,
                                            borderBottom: `1px solid ${vistelicaColors.neutralLight}`
                                        }}
                                    >
                                        {searchResults.length} resultados encontrados
                                    </Typography>

                                    <List sx={{ padding: 0 }}>
                                        {searchResults.map((product, index) => (
                                            <React.Fragment key={`product-${product.product_id || index}`}>
                                                <ListItemButton
                                                    onClick={() => handleProductClick(product.product_id, index)}
                                                    selected={selectedItemIndex === index}
                                                    sx={{
                                                        cursor: 'pointer',
                                                        padding: '12px 16px',
                                                        '&:hover': {
                                                            backgroundColor: `${vistelicaColors.primaryLight}20`,
                                                        },
                                                        '&.Mui-selected': {
                                                            backgroundColor: `${vistelicaColors.primaryLight}40`,
                                                        }
                                                    }}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar
                                                            src={getProductImage(product)}
                                                            alt={product.product_name}
                                                            variant="rounded"
                                                            sx={{
                                                                width: 60,
                                                                height: 60,
                                                                border: `1px solid ${vistelicaColors.neutralLight}`,
                                                                borderRadius: '8px'
                                                            }}
                                                        >
                                                            {product.product_name?.charAt(0) || 'P'}
                                                        </Avatar>
                                                    </ListItemAvatar>

                                                    <ListItemText
                                                        primary={product.product_name}
                                                        primaryTypographyProps={{
                                                            fontWeight: 600,
                                                            fontFamily: typography.fontFamily,
                                                            color: vistelicaColors.secondary,
                                                            noWrap: true
                                                        }}
                                                    />

                                                    <Box sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'flex-end',
                                                        marginLeft: 1
                                                    }}>
                                                        <Typography
                                                            variant="body2"
                                                            component="span"
                                                            sx={{
                                                                color: vistelicaColors.primary,
                                                                fontWeight: 600,
                                                                fontFamily: typography.fontFamily
                                                            }}
                                                        >
                                                            {formatPrice(product.price)}
                                                        </Typography>

                                                        {product.category && (
                                                            <Chip
                                                                label={product.category}
                                                                size="small"
                                                                sx={{
                                                                    fontSize: '0.7rem',
                                                                    height: 22,
                                                                    mt: 0.5,
                                                                    backgroundColor: `${vistelicaColors.primaryLight}40`,
                                                                    color: vistelicaColors.secondary
                                                                }}
                                                            />
                                                        )}
                                                    </Box>

                                                    <ArrowForwardIosIcon
                                                        sx={{
                                                            fontSize: 16,
                                                            color: vistelicaColors.primaryLight,
                                                            ml: 1
                                                        }}
                                                    />
                                                </ListItemButton>
                                                {index < searchResults.length - 1 && (
                                                    <Divider variant="inset" component="li" />
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                </Paper>
                            )}

                            {/* Búsquedas populares */}
                            {(!searchQuery || searchQuery.length < 2) && !isSearching && (
                                <Box sx={{ mt: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                fontFamily: typography.fontFamily,
                                                color: vistelicaColors.secondary,
                                            }}
                                        >
                                            Categorías
                                        </Typography>

                                        {/* Solo mostramos el botón si no hay categorías seleccionadas */}
                                        {selectedCategoryIds.length === 0 && (
                                            <Chip
                                                icon={<CloseIcon />}
                                                label="Cerrar búsqueda"
                                                onClick={onClose}
                                                sx={{
                                                    backgroundColor: vistelicaColors.secondary,
                                                    color: 'white',
                                                    fontFamily: typography.fontFamily,
                                                    fontWeight: 500,
                                                }}
                                            />
                                        )}
                                    </Box>

                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                        {POPULAR_SEARCHES.map((term, idx) => (
                                            <Chip
                                                key={`pop-${idx}`}
                                                label={term}
                                                onClick={() => handlePopularSearchClick(term)}
                                                sx={{
                                                    backgroundColor: selectedCategoryIds.includes(CATEGORY_MAP[term])
                                                        ? vistelicaColors.primary
                                                        : 'white',
                                                    color: selectedCategoryIds.includes(CATEGORY_MAP[term])
                                                        ? 'white'
                                                        : vistelicaColors.secondary,
                                                    border: `1px solid ${vistelicaColors.neutralLight}`,
                                                    fontFamily: typography.fontFamily,
                                                    fontWeight: 500
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {/* Mensajes de error o sin resultados */}
                            {searchQuery && searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && !searchError && (
                                <Box sx={{ textAlign: 'center', my: 3 }}>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontFamily: typography.fontFamily,
                                            color: vistelicaColors.secondary,
                                            mb: 2
                                        }}
                                    >
                                        No se encontraron resultados para "{searchQuery}"
                                    </Typography>

                                    <Chip
                                        icon={<CloseIcon />}
                                        label="Cerrar búsqueda"
                                        onClick={onClose}
                                        sx={{
                                            backgroundColor: vistelicaColors.secondary,
                                            color: 'white',
                                            fontFamily: typography.fontFamily,
                                            fontWeight: 500,
                                        }}
                                    />
                                </Box>
                            )}

                            {searchError && (
                                <Box sx={{ textAlign: 'center', my: 3 }}>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontFamily: typography.fontFamily,
                                            color: 'error.main',
                                            mb: 2
                                        }}
                                    >
                                        {searchError}
                                    </Typography>

                                    <Chip
                                        icon={<CloseIcon />}
                                        label="Cerrar búsqueda"
                                        onClick={onClose}
                                        sx={{
                                            backgroundColor: vistelicaColors.secondary,
                                            color: 'white',
                                            fontFamily: typography.fontFamily,
                                            fontWeight: 500,
                                        }}
                                    />
                                </Box>
                            )}
                        </AnimatePresence>
                    </Paper>
                </motion.div>
            )}
        </AnimatePresence>
    );
}