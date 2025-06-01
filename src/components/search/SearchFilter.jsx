'use client';
import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    InputBase, Paper, CircularProgress, Typography, Avatar,
    Box, List, ListItemText, Chip, ListItemAvatar,
    Divider, ListItemButton, TextField, useMediaQuery
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
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

// Componente memoizado para el formulario de búsqueda
const SearchForm = memo(({ searchQuery, isSearching, handleSearchChange, handleSearchSubmit, handleClearSearch }) => (
    <form onSubmit={handleSearchSubmit}>
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            border: `2px solid ${vistelicaColors.primaryLight}`,
            borderRadius: '50px',
            padding: {xs: '6px 12px', sm: '8px 16px'},
            transition: 'all 0.3s ease',
            '&:focus-within': {
                borderColor: vistelicaColors.primary,
                boxShadow: `0 0 0 4px ${vistelicaColors.primaryLight}40`
            }
        }}>
            <SearchIcon
                sx={{
                    color: vistelicaColors.primary,
                    fontSize: {xs: "20px", sm: "24px"},
                    marginRight: {xs: '8px', sm: '12px'}
                }}
                aria-hidden="true"
            />
            <InputBase
                autoFocus
                placeholder="¿Qué estás buscando?"
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Campo de búsqueda"
                inputProps={{
                    'aria-autocomplete': 'list',
                    'aria-controls': 'search-results-list'
                }}
                sx={{
                    flexGrow: 1,
                    fontSize: {xs: '16px', sm: '18px'},
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
                    sx={{ marginLeft: {xs: '8px', sm: '12px'}, color: vistelicaColors.primary }}
                    aria-label="Buscando..."
                />
            ) : (
                searchQuery && (
                    <CloseIcon
                        onClick={handleClearSearch}
                        sx={{
                            cursor: 'pointer',
                            color: vistelicaColors.secondary,
                            fontSize: {xs: '18px', sm: '20px'},
                            transition: 'all 0.2s',
                            '&:hover': {
                                color: vistelicaColors.primary
                            }
                        }}
                        aria-label="Borrar búsqueda"
                    />
                )
            )}
        </Box>
    </form>
));

// Componente memoizado para los chips de categoría seleccionada
const SelectedCategories = memo(({ categories, onRemove, onClose }) => (
    <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: {xs: '6px', sm: '8px'},
            mt: 2
        }}
        role="region"
        aria-label="Categorías seleccionadas"
    >
        {categories.map(id => {
            const categoryName = Object.keys(CATEGORY_MAP).find(key => CATEGORY_MAP[key] === id);
            return (
                <Chip
                    key={`cat-${id}`}
                    label={categoryName}
                    onDelete={() => onRemove(id)}
                    sx={{
                        backgroundColor: `${vistelicaColors.primaryLight}60`,
                        color: vistelicaColors.secondary,
                        fontFamily: typography.fontFamily,
                        fontWeight: 500
                    }}
                    aria-label={`Quitar categoría ${categoryName}`}
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
            aria-label="Cerrar búsqueda"
        />
    </Box>
));

// Componente memoizado para un resultado de producto individual
const ProductResult = memo(({ product, index, isSelected, onClick, formatPrice, getProductImage }) => (
    <React.Fragment>
        <ListItemButton
            onClick={() => onClick(product.id, index)}
            selected={isSelected}
            sx={{
                cursor: 'pointer',
                padding: {xs: '10px 12px', sm: '12px 16px'},
                '&:hover': {
                    backgroundColor: `${vistelicaColors.primaryLight}20`,
                },
                '&.Mui-selected': {
                    backgroundColor: `${vistelicaColors.primaryLight}40`,
                }
            }}
            role="option"
            aria-selected={isSelected}
        >
            <ListItemAvatar>
                <Avatar
                    src={getProductImage(product)}
                    alt={product.name || "Producto"}
                    variant="rounded"
                    sx={{
                        width: {xs: 45, sm: 60},
                        height: {xs: 45, sm: 60},
                        border: `1px solid ${vistelicaColors.neutralLight}`,
                        borderRadius: '8px'
                    }}
                >
                    {product.name?.charAt(0) || 'P'}
                </Avatar>
            </ListItemAvatar>

            <ListItemText
                primary={product.name}
                primaryTypographyProps={{
                    fontWeight: 600,
                    fontFamily: typography.fontFamily,
                    color: vistelicaColors.secondary,
                    noWrap: true,
                    fontSize: {xs: '0.9rem', sm: '1rem'}
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
                        fontFamily: typography.fontFamily,
                        fontSize: {xs: '0.85rem', sm: '0.9rem'}
                    }}
                >
                    {formatPrice(product.price)}
                </Typography>

                {product.category && (
                    <Chip
                        label={product.category}
                        size="small"
                        sx={{
                            fontSize: {xs: '0.65rem', sm: '0.7rem'},
                            height: {xs: 20, sm: 22},
                            mt: 0.5,
                            backgroundColor: `${vistelicaColors.primaryLight}40`,
                            color: vistelicaColors.secondary
                        }}
                    />
                )}
            </Box>

            <ArrowForwardIosIcon
                sx={{
                    fontSize: {xs: 14, sm: 16},
                    color: vistelicaColors.primaryLight,
                    ml: 1
                }}
                aria-hidden="true"
            />
        </ListItemButton>
        <Divider variant="inset" component="li" />
    </React.Fragment>
));

// Componente memoizado para los chips de búsqueda populares
const PopularSearchChips = memo(({ terms, selectedIds, onClick, onClose }) => (
    <Box sx={{ mt: 3 }}>
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            flexWrap: {xs: 'wrap', sm: 'nowrap'},
            gap: {xs: 1, sm: 0}
        }}>
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 600,
                    fontFamily: typography.fontFamily,
                    color: vistelicaColors.secondary,
                    fontSize: {xs: '1.1rem', sm: '1.25rem'}
                }}
            >
                Categorías
            </Typography>

            {selectedIds.length === 0 && (
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
                    aria-label="Cerrar búsqueda"
                />
            )}
        </Box>

        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: {xs: '8px', sm: '12px'}
            }}
            role="listbox"
            aria-label="Categorías populares"
        >
            {terms.map((term, idx) => (
                <Chip
                    key={`pop-${idx}`}
                    label={term}
                    onClick={() => onClick(term)}
                    sx={{
                        backgroundColor: selectedIds.includes(CATEGORY_MAP[term])
                            ? vistelicaColors.primary
                            : 'white',
                        color: selectedIds.includes(CATEGORY_MAP[term])
                            ? 'white'
                            : vistelicaColors.secondary,
                        border: `1px solid ${vistelicaColors.neutralLight}`,
                        fontFamily: typography.fontFamily,
                        fontWeight: 500,
                        fontSize: {xs: '0.85rem', sm: '1rem'}
                    }}
                    role="option"
                    aria-selected={selectedIds.includes(CATEGORY_MAP[term])}
                />
            ))}
        </Box>
    </Box>
));

// Componente principal del filtro de búsqueda
export default function SearchFilter({ isOpen, onClose, router }) {
    const isMobile = useMediaQuery('(max-width:600px)');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
    const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
    const [keyboardNavActive, setKeyboardNavActive] = useState(false);

    // Resetear estados cuando se cierra el diálogo
    useEffect(() => {
        if (!isOpen) {
            setSearchResults([]);
            setSearchQuery('');
            setSelectedCategoryIds([]);
            setSelectedItemIndex(-1);
            setKeyboardNavActive(false);
        }
    }, [isOpen]);

    // Función memoizada para realizar búsquedas
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
            console.error('Error en la búsqueda:', error);
            setSearchError(error.message || 'Error al realizar la búsqueda');
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, [selectedCategoryIds]);

    // Efecto para debouncing de las búsquedas
    useEffect(() => {
        const timer = setTimeout(() => {
            performSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, performSearch, selectedCategoryIds]);

    // Handlers memoizados
    const handleSearchChange = useCallback((e) => setSearchQuery(e.target.value), []);

    const handleClearSearch = useCallback(() => setSearchQuery(''), []);

    const handleSearchSubmit = useCallback((e) => {
        e.preventDefault();
        if (searchQuery.trim().length >= 2) {
            router.push(`/search-results/page?query=${encodeURIComponent(searchQuery)}${selectedCategoryIds.length > 0 ? `&categories=${selectedCategoryIds.join(',')}` : ''}`);
            onClose();
        }
    }, [searchQuery, selectedCategoryIds, router, onClose]);

    const handleProductClick = useCallback((productId, index) => {
        if (!productId) {
            console.error("ID de producto no válido");
            return;
        }

        setSelectedItemIndex(index);

        try {
            window.location.href = `/product-detail/page?id=${productId}`;

            // Método de respaldo con router
            setTimeout(() => {
                try {
                    router.push(`/product-detail/page?id=${productId}`);
                } catch (error) {
                    console.error("Error en la redirección:", error);
                    window.open(`/product-detail/page?id=${productId}`, '_self');
                }
            }, 100);

            onClose();
        } catch (error) {
            console.error("Error al navegar:", error);
        }
    }, [router, onClose]);

    const handlePopularSearchClick = useCallback((term) => {
        const categoryId = CATEGORY_MAP[term];
        if (!categoryId) return;

        setSelectedCategoryIds((prev) => {
            if (prev.includes(categoryId)) return prev;
            return [...prev, categoryId];
        });
    }, []);

    const handleRemoveCategory = useCallback((idToRemove) => {
        setSelectedCategoryIds((prev) =>
            prev.filter(id => id !== idToRemove)
        );
    }, []);

    // Funciones de utilidad memoizadas
    const getProductImage = useCallback((product) => {
        return product?.image != null ? product.image : null;
    }, []);

    const formatPrice = useCallback((price) => {
        if (!price && price !== 0) return '';
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    }, []);

    // Manejo de navegación por teclado
    const handleKeyDown = useCallback((e) => {
        if (!searchResults.length) return;

        setKeyboardNavActive(true);

        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedItemIndex(prev =>
                    prev < searchResults.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedItemIndex(prev => prev > 0 ? prev - 1 : 0);
                break;
            case 'Enter':
                if (selectedItemIndex >= 0 && selectedItemIndex < searchResults.length) {
                    handleProductClick(searchResults[selectedItemIndex].id, selectedItemIndex);
                }
                break;
            case 'Escape':
                onClose();
                break;
        }
    }, [searchResults, selectedItemIndex, handleProductClick, onClose]);

    // Añadir event listener para navegación por teclado
    useEffect(() => {
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handleKeyDown]);

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
                    role="dialog"
                    aria-modal="true"
                    aria-label="Buscador de productos"
                >
                    <Paper
                        sx={{
                            width: '100%',
                            padding: {xs: '16px 16px', sm: '20px 24px'},
                            borderBottom: `1px solid ${vistelicaColors.neutralLight}`,
                            backgroundColor: 'rgba(255, 255, 255, 0.98)',
                            borderRadius: 0
                        }}
                        elevation={3}
                    >
                        {/* Formulario de búsqueda */}
                        <SearchForm
                            searchQuery={searchQuery}
                            isSearching={isSearching}
                            handleSearchChange={handleSearchChange}
                            handleSearchSubmit={handleSearchSubmit}
                            handleClearSearch={handleClearSearch}
                        />

                        {/* Categorías seleccionadas */}
                        {selectedCategoryIds.length > 0 && (
                            <SelectedCategories
                                categories={selectedCategoryIds}
                                onRemove={handleRemoveCategory}
                                onClose={onClose}
                            />
                        )}

                        {/* Resultados de búsqueda */}
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
                                        maxHeight: {xs: '300px', sm: '400px'},
                                        overflowY: 'auto',
                                        borderRadius: '12px',
                                        backgroundColor: 'white',
                                        border: `1px solid ${vistelicaColors.neutralLight}`,
                                        scrollbarWidth: 'thin',
                                        '&::-webkit-scrollbar': {
                                            width: '6px',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: vistelicaColors.primaryLight,
                                            borderRadius: '10px',
                                        }
                                    }}
                                    role="listbox"
                                    id="search-results-list"
                                    aria-label="Resultados de búsqueda"
                                >
                                    <Typography
                                        sx={{
                                            padding: {xs: '10px 12px', sm: '12px 16px'},
                                            fontFamily: typography.fontFamily,
                                            fontWeight: 600,
                                            color: vistelicaColors.secondary,
                                            borderBottom: `1px solid ${vistelicaColors.neutralLight}`,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <span>{searchResults.length} resultados encontrados</span>
                                        {keyboardNavActive && (
                                            <Typography
                                                component="span"
                                                variant="caption"
                                                sx={{
                                                    color: vistelicaColors.primaryLight,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5
                                                }}
                                            >
                                                <KeyboardArrowDownIcon fontSize="small" />
                                                Usa las flechas para navegar
                                            </Typography>
                                        )}
                                    </Typography>

                                    <List sx={{ padding: 0 }}>
                                        {searchResults.map((product, index) => (
                                            <ProductResult
                                                key={`product-${product.id || index}`}
                                                product={product}
                                                index={index}
                                                isSelected={selectedItemIndex === index}
                                                onClick={handleProductClick}
                                                formatPrice={formatPrice}
                                                getProductImage={getProductImage}
                                            />
                                        ))}
                                    </List>
                                </Paper>
                            )}

                            {/* Búsquedas populares */}
                            {(!searchQuery || searchQuery.length < 2) && !isSearching && (
                                <PopularSearchChips
                                    terms={POPULAR_SEARCHES}
                                    selectedIds={selectedCategoryIds}
                                    onClick={handlePopularSearchClick}
                                    onClose={onClose}
                                />
                            )}

                            {/* Mensajes de error o sin resultados */}
                            {searchQuery && searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && !searchError && (
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        my: {xs: 2, sm: 3},
                                        padding: {xs: '10px', sm: '20px'},
                                        backgroundColor: `${vistelicaColors.neutralLight}30`,
                                        borderRadius: '8px'
                                    }}
                                    role="alert"
                                >
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
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        my: {xs: 2, sm: 3},
                                        padding: {xs: '10px', sm: '20px'},
                                        backgroundColor: '#fee2e2',
                                        borderRadius: '8px'
                                    }}
                                    role="alert"
                                    aria-live="assertive"
                                >
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

// Asignar displayNames para mejor depuración
SearchForm.displayName = 'SearchForm';
SelectedCategories.displayName = 'SelectedCategories';
ProductResult.displayName = 'ProductResult';
PopularSearchChips.displayName = 'PopularSearchChips';