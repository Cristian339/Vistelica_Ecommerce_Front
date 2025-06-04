import React, { useState, useMemo } from 'react';
import {
    Box, Typography, Checkbox, FormControlLabel, Divider, TextField, Button,
    Rating, FormGroup, List, ListItem, ListItemText, Accordion, AccordionSummary,
    AccordionDetails, IconButton, useMediaQuery, useTheme, GlobalStyles,
    CircularProgress, Fade, Slide, Zoom, Tooltip, Badge, InputAdornment,
    Stack, alpha
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FilterListIcon from '@mui/icons-material/FilterList';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined';
import EuroOutlinedIcon from '@mui/icons-material/EuroOutlined';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import { motion } from "framer-motion";
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import { typography } from "@/pages/shared-theme/themePrimitives";

// Lista de tallas comunes
const SIZES = [
    { id: 'XS', label: 'XS' },
    { id: 'S', label: 'S' },
    { id: 'M', label: 'M' },
    { id: 'L', label: 'L' },
    { id: 'XL', label: 'XL' },
    { id: 'XXL', label: 'XXL' },
    { id: '36', label: '36' },
    { id: '38', label: '38' },
    { id: '40', label: '40' },
    { id: '42', label: '42' },
    { id: '44', label: '44' }
];

// Lista de colores
const COLORS = [
    { id: 'BLACK', label: 'Negro', hex: '#000000' },
    { id: 'WHITE', label: 'Blanco', hex: '#FFFFFF' },
    { id: 'GRAY', label: 'Gris', hex: '#808080' },
    { id: 'RED', label: 'Rojo', hex: '#FF0000' },
    { id: 'BLUE', label: 'Azul', hex: '#0000FF' },
    { id: 'GREEN', label: 'Verde', hex: '#008000' },
    { id: 'YELLOW', label: 'Amarillo', hex: '#FFFF00' },
    { id: 'PINK', label: 'Rosa', hex: '#FFC0CB' },
    { id: 'PURPLE', label: 'Morado', hex: '#800080' },
    { id: 'ORANGE', label: 'Naranja', hex: '#FFA500' },
    { id: 'BROWN', label: 'Marrón', hex: '#A52A2A' },
    { id: 'BEIGE', label: 'Beige', hex: '#F5F5DC' },
    { id: 'GOLD', label: 'Dorado', hex: '#FFD700' },
    { id: 'SILVER', label: 'Plateado', hex: '#C0C0C0' },
    { id: 'NAVY', label: 'Azul Marino', hex: '#000080' },
];



// Componente para el encabezado de cada acordeón
const FilterAccordionHeader = React.memo(({ icon: Icon, title, activeCount = 0 }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Icon
            sx={{
                mr: 1.5,
                color: vistelicaColors.primary,
                fontSize: { xs: '1.25rem', sm: '1.35rem' }
            }}
        />
        <Typography
            fontWeight="500"
            fontFamily={typography.fontFamily}
            sx={{
                flexGrow: 1,
                color: vistelicaColors.secondary,
                fontSize: { xs: '0.95rem', sm: '1.1rem' }
            }}
        >
            {title}
        </Typography>

        {activeCount > 0 && (
            <Zoom in={true}>
                <Badge
                    badgeContent={activeCount}
                    color="primary"
                    sx={{ ml: 1 }}
                />
            </Zoom>
        )}
    </Box>
));

FilterAccordionHeader.displayName = 'FilterAccordionHeader';

// Componente para el selector de color
const ColorSelector = React.memo(({ color, isActive, onClick }) => (
    <Tooltip title={color.label} arrow placement="top">
        <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            aria-label={`Color ${color.label}`}
            role="button"
            tabIndex={0}
            sx={{
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                borderRadius: '50%',
                bgcolor: color.hex || color.color || '#CCCCCC',
                border: '2px solid white',
                boxShadow: isActive
                    ? `0 0 0 2px ${vistelicaColors.primary}, 0 3px 8px rgba(0,0,0,0.2)`
                    : '0 0 0 1px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease',
                '&:focus-visible': {
                    outline: `2px solid ${vistelicaColors.primary}`,
                    outlineOffset: '2px',
                },
                '&:after': isActive ? {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    bgcolor: color.hex === '#FFFFFF' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)',
                    transform: 'translate(-50%, -50%)'
                } : {}
            }}
        />
    </Tooltip>
));

ColorSelector.displayName = 'ColorSelector';

// Componente para el selector de tamaño
const SizeSelector = React.memo(({ size, isActive, onClick, sx = {} }) => (
    <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: isActive ? 1.05 : 1 }}
        whileTap={{ scale: isActive ? 0.95 : 1 }}
        onClick={onClick}
        onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && onClick) {
                onClick();
            }
        }}
        role="button"
        aria-pressed={isActive}
        tabIndex={0}
        sx={{
            width: { xs: 38, sm: 44 },
            height: { xs: 38, sm: 44 },
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid',
            borderColor: isActive ? vistelicaColors.primary : alpha(vistelicaColors.secondary, 0.2),
            bgcolor: isActive ? alpha(vistelicaColors.primary, 0.1) : 'transparent',
            color: isActive ? vistelicaColors.primary : vistelicaColors.secondary,
            fontWeight: isActive ? 400 : 500,
            fontFamily: typography.fontFamily,
            fontSize: { xs: '0.85rem', sm: '0.95rem' },
            cursor: onClick ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            userSelect: 'none',
            '&:hover': {
                borderColor: onClick ? vistelicaColors.primary : alpha(vistelicaColors.secondary, 0.2),
                bgcolor: onClick ? alpha(vistelicaColors.primary, 0.05) : 'transparent'
            },
            '&:focus-visible': {
                outline: onClick ? `2px solid ${vistelicaColors.primary}` : 'none',
                outlineOffset: '2px'
            },
            ...sx
        }}
    >
        {size.label}
    </Box>
));

SizeSelector.displayName = 'SizeSelector';

// Componente principal FilterSidebar
const FilterSidebar = ({
                           filters,
                           setFilters,
                           categories = [],
                           subcategories = [],
                           loadingSubcategories = false,
                           selectedCategory,
                           selectedGender,
                           showFilters,
                           setShowFilters,
                           availableSizes = [],
                           onSubcategorySelect,
                           products = [],
                       }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const [expandedAccordion, setExpandedAccordion] = useState('sizes');

    // Función para manejar cambios en los accordions
    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpandedAccordion(isExpanded ? panel : false);
    };
    const getRatingCount = (rating) => {
        if (!products || products.length === 0) return 0;

        return products.filter(product => {
            const productRating = parseFloat(product.average_rating) || 0;

            if (rating === 5) {
                // Para 5 estrellas: exactamente 5.0
                return productRating === 5.0;
            } else {
                // Para 1-4 estrellas: rango de X.0 a X.99
                return productRating >= rating && productRating < rating + 1;
            }
        }).length;
    };
    // Función para manejar checkboxes
    const handleCheckbox = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: prev[key].includes(value)
                ? prev[key].filter(item => item !== value)
                : [...prev[key], value]
        }));
    };

    // Función para manejar tallas
    const handleSizeClick = (sizeId) => {
        handleCheckbox('sizes', sizeId);
    };

    // Función para manejar colores
    const handleColorClick = (colorId) => {
        handleCheckbox('colors', colorId);
    };

    // Función para manejar cambios de precio
    const handlePriceChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Función para cerrar el sidebar en móvil
    const closeSidebar = () => {
        if (isMobile && setShowFilters) setShowFilters(false);
    };

    // Función para limpiar todos los filtros
    const clearAllFilters = () => {
        setFilters({
            subcategories: [],
            brands: [],
            colors: [],
            sizes: [],
            ratings: [],
            priceMin: '',
            priceMax: '',
            hasDiscount: false,
            lowStock: false
        });
    };

    // Contar filtros activos por sección
    const getActiveFiltersCount = useMemo(() => {
        return {
            subcategories: filters.subcategories.length,
            colors: filters.colors.length,
            sizes: filters.sizes ? filters.sizes.length : 0,
            price: (filters.priceMin !== '' || filters.priceMax !== '') ? 1 : 0,
            ratings: filters.ratings.length,
            stockDiscount: (filters.hasDiscount ? 1 : 0) + (filters.lowStock ? 1 : 0),
        };
    }, [filters]);

    // Verificar si hay algún filtro activo
    const hasActiveFilters = useMemo(() => {
        return Object.values(getActiveFiltersCount).some(count => count > 0) ||
            filters.hasDiscount ||
            filters.lowStock;
    }, [filters, getActiveFiltersCount]);

    return (
        <>
            <GlobalStyles
                styles={{
                    ':root': {
                        '--Sidebar-width': '320px',
                    },
                    '@keyframes fadeIn': {
                        '0%': {
                            opacity: 0,
                            transform: 'translateY(5px)'
                        },
                        '100%': {
                            opacity: 1,
                            transform: 'translateY(0)'
                        }
                    },
                    '.filter-item': {
                        animation: 'fadeIn 0.25s ease-out',
                        animationFillMode: 'backwards'
                    },
                    '.MuiAccordion-root': {
                        borderRadius: '10px !important',
                        overflow: 'hidden',
                        boxShadow: 'none',
                        '&:before': {
                            display: 'none'
                        },
                        marginBottom: '14px',
                        backgroundColor: alpha(vistelicaColors.light || '#f5f5f5', 0.8)
                    },
                    '.MuiAccordionSummary-root': {
                        borderRadius: '10px',
                        transition: 'all 0.2s',
                        minHeight: '50px !important',
                        '&:hover': {
                            backgroundColor: alpha(vistelicaColors.primary, 0.04)
                        },
                        '&.Mui-expanded': {
                            backgroundColor: alpha(vistelicaColors.primary, 0.07)
                        }
                    }
                }}
            />

            {/* Overlay para cerrar el sidebar en móvil */}
            <Fade in={showFilters && isMobile}>
                <Box
                    aria-hidden="true"
                    onClick={closeSidebar}
                    sx={{
                        position: 'fixed',
                        zIndex: 1199,
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(3px)',
                        transition: 'all 0.3s',
                        display: {xs: 'block', md: 'none'},
                        visibility: showFilters && isMobile ? 'visible' : 'hidden',
                    }}
                />
            </Fade>

            {/* Contenedor principal del sidebar */}
            <Slide direction="right" in={showFilters || !isMobile} mountOnEnter unmountOnExit>
                <Box
                    component="aside"
                    aria-label="Filtros de productos"
                    sx={{
                        position: {xs: 'fixed', md: 'sticky'},
                        top: {xs: 0, md: '80px'},
                        left: 0,
                        height: {xs: '100vh', md: 'calc(100vh - 80px)'},
                        width: {xs: '85%', sm: '320px'},
                        maxWidth: '100%',
                        zIndex: 1200,
                        display: 'flex',
                        flexDirection: 'column',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        bgcolor: 'background.paper',
                        p: {xs: 2, sm: 2.5},
                        borderRight: '1px solid',
                        borderColor: vistelicaColors.border || '#e0e0e0',
                        boxShadow: {
                            xs: '0 0 20px rgba(0,0,0,0.15)',
                            md: '0 4px 12px rgba(0,0,0,0.05)'
                        },
                        scrollbarWidth: 'thin',
                        '&::-webkit-scrollbar': {
                            width: '5px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            borderRadius: '4px',
                            '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.2)',
                            }
                        }
                    }}
                >
                    {/* Cabecera del sidebar */}
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 3,
                            pb: 2,
                            borderBottom: `1px solid ${vistelicaColors.border || '#e0e0e0'}`
                        }}
                    >
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <FilterListIcon
                                sx={{
                                    color: vistelicaColors.primary,
                                    mr: 1.5,
                                    fontSize: '28px'
                                }}
                            />
                            <Typography
                                variant="h5"
                                fontWeight="400"
                                fontFamily={typography.fontFamily}
                                sx={{
                                    color: vistelicaColors.secondary,
                                    fontSize: { xs: '1.25rem', sm: '1.4rem' },
                                    letterSpacing: '-0.3px'
                                }}
                            >
                                Filtros
                            </Typography>
                        </Box>

                        {isMobile && (
                            <IconButton
                                onClick={closeSidebar}
                                aria-label="Cerrar panel de filtros"
                                sx={{
                                    bgcolor: alpha(vistelicaColors.light || '#f5f5f5', 0.8),
                                    '&:hover': {
                                        bgcolor: alpha(vistelicaColors.primary, 0.1),
                                    }
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        )}
                    </Box>

                    {/* Contenido con overflow */}
                    <Box sx={{ flex: 1, overflowY: 'auto', pb: 2 }}>
                        {/* SECCIÓN: Tallas */}
                        <Accordion
                            expanded={expandedAccordion === 'sizes'}
                            onChange={handleAccordionChange('sizes')}
                            disableGutters
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{color: vistelicaColors.primary}}/>}
                                sx={{px: 2}}
                            >
                                <FilterAccordionHeader
                                    icon={StraightenOutlinedIcon}
                                    title="Tallas"
                                    activeCount={getActiveFiltersCount.sizes}
                                />
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box
                                    component={motion.div}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: { xs: 0.8, sm: 1 },
                                        pt: 1,
                                        justifyContent: { xs: 'center', sm: 'flex-start' }
                                    }}
                                >
                                    {SIZES.map((size) => {
                                        const isAvailable = availableSizes.includes(size.id);
                                        return (
                                            <Box
                                                key={size.id}
                                                sx={{
                                                    position: 'relative',
                                                    '&:after': !isAvailable ? {
                                                        content: '""',
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        width: '120%',
                                                        height: '2px',
                                                        backgroundColor: vistelicaColors.secondary,
                                                        transform: 'translate(-50%, -50%) rotate(-15deg)',
                                                        zIndex: 1,
                                                        pointerEvents: 'none'
                                                    } : {}
                                                }}
                                            >
                                                <SizeSelector
                                                    size={size}
                                                    isActive={filters.sizes?.includes(size.id)}
                                                    onClick={() => isAvailable && handleSizeClick(size.id)}
                                                    sx={{
                                                        opacity: isAvailable ? 1 : 0.5,
                                                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                                                        '&:hover': {
                                                            backgroundColor: isAvailable
                                                                ? alpha(vistelicaColors.primary, 0.05)
                                                                : 'transparent'
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </AccordionDetails>
                        </Accordion>

                        {/* Colores */}
                        <Accordion
                            expanded={expandedAccordion === 'colors'}
                            onChange={handleAccordionChange('colors')}
                            disableGutters
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{color: vistelicaColors.primary}}/>}
                                sx={{px: 2}}
                            >
                                <FilterAccordionHeader
                                    icon={StyleOutlinedIcon}
                                    title="Colores"
                                    activeCount={getActiveFiltersCount.colors}
                                />
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box
                                    component={motion.div}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: { xs: 1, sm: 1.2 },
                                        pt: 1,
                                        justifyContent: 'center'
                                    }}
                                >
                                    {COLORS.map((color) => (
                                        <ColorSelector
                                            key={color.id}
                                            color={color}
                                            isActive={filters.colors?.includes(color.id)}
                                            onClick={() => handleColorClick(color.id)}
                                        />
                                    ))}
                                </Box>
                            </AccordionDetails>
                        </Accordion>

                        <Divider sx={{my: 2, opacity: 0.6, bgcolor: vistelicaColors.border || '#e0e0e0'}}/>

                        {/* Precio */}
                        <Accordion
                            expanded={expandedAccordion === 'price'}
                            onChange={handleAccordionChange('price')}
                            disableGutters
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{color: vistelicaColors.primary}}/>}
                                sx={{px: 2}}
                            >
                                <FilterAccordionHeader
                                    icon={EuroOutlinedIcon}
                                    title="Precio"
                                    activeCount={getActiveFiltersCount.price}
                                />
                            </AccordionSummary>
                            <AccordionDetails>
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={{ xs: 2, sm: 1.5 }}
                                    alignItems="center"
                                    sx={{ mt: 1, mb: 1 }}
                                >
                                    <TextField
                                        label="Mínimo"
                                        type="number"
                                        size="small"
                                        fullWidth
                                        value={filters.priceMin}
                                        onChange={(e) => handlePriceChange('priceMin', e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">€</InputAdornment>
                                            )
                                        }}

                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '8px',
                                                fontFamily: typography.fontFamily,
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: vistelicaColors.primary
                                                }
                                            }
                                        }}
                                    />

                                    <Typography sx={{
                                        fontSize: '1.3rem',
                                        color: vistelicaColors.secondary,
                                        display: { xs: 'none', sm: 'block' }
                                    }}>
                                        -
                                    </Typography>

                                    <TextField
                                        label="Máximo"
                                        type="number"
                                        size="small"
                                        fullWidth
                                        value={filters.priceMax}
                                        onChange={(e) => handlePriceChange('priceMax', e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">€</InputAdornment>
                                            )
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '8px',
                                                fontFamily: typography.fontFamily,
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: vistelicaColors.primary
                                                }
                                            }
                                        }}
                                    />
                                </Stack>
                            </AccordionDetails>
                        </Accordion>

                        <Divider sx={{my: 2, opacity: 0.6, bgcolor: vistelicaColors.border || '#e0e0e0'}}/>

                        {/* Stock y descuentos */}
                        <Accordion
                            expanded={expandedAccordion === 'stockDiscounts'}
                            onChange={handleAccordionChange('stockDiscounts')}
                            disableGutters
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{color: vistelicaColors.primary}}/>}
                                sx={{px: 2}}
                            >
                                <FilterAccordionHeader
                                    icon={LocalOfferIcon}
                                    title="Stock y Descuentos"
                                    activeCount={getActiveFiltersCount.stockDiscount}
                                />
                            </AccordionSummary>

                            <AccordionDetails>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={filters.hasDiscount}
                                                onChange={() => setFilters(prev => ({
                                                    ...prev,
                                                    hasDiscount: !prev.hasDiscount
                                                }))}
                                                sx={{
                                                    color: vistelicaColors.primary,
                                                    '&.Mui-checked': {
                                                        color: vistelicaColors.primary
                                                    }
                                                }}
                                            />

                                        }
                                        label={
                                            <Typography fontFamily={typography.fontFamily} fontSize="0.95rem">
                                                En oferta
                                            </Typography>
                                        }
                                        sx={{p: 0.5, borderRadius: '6px'}}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={filters.lowStock}
                                                onChange={() => setFilters(prev => ({
                                                    ...prev,
                                                    lowStock: !prev.lowStock
                                                }))}
                                                sx={{
                                                    color: vistelicaColors.primary,
                                                    '&.Mui-checked': {
                                                        color: vistelicaColors.primary
                                                    }
                                                }}
                                            />
                                        }
                                        label={
                                            <Typography fontFamily={typography.fontFamily} fontSize="0.95rem">
                                                Últimas unidades
                                            </Typography>
                                        }
                                        sx={{p: 0.5, borderRadius: '6px'}}
                                    />
                                </FormGroup>
                            </AccordionDetails>
                        </Accordion>

                        <Divider sx={{my: 2, opacity: 0.6, bgcolor: vistelicaColors.border || '#e0e0e0'}}/>

                        {/* Rating */}
                        <Accordion
                            expanded={expandedAccordion === 'ratings'}
                            onChange={handleAccordionChange('ratings')}
                            disableGutters
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{color: vistelicaColors.primary}}/>}
                                sx={{px: 2}}
                            >
                                <FilterAccordionHeader
                                    icon={StarOutlineIcon}
                                    title="Valoración"
                                    activeCount={getActiveFiltersCount.ratings}
                                />
                            </AccordionSummary>
                            <AccordionDetails>
                                <List disablePadding>
                                    {[5, 4, 3, 2, 1].map((rating) => (
                                        <motion.div
                                            key={rating}
                                            className="filter-item"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ListItem
                                                disablePadding
                                                sx={{
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    mb: 0.5,
                                                    '&:hover': {
                                                        bgcolor: alpha(vistelicaColors.primary, 0.04)
                                                    }
                                                }}
                                            >
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={filters.ratings.includes(rating)}
                                                            onChange={() => handleCheckbox('ratings', rating)}
                                                            size="small"
                                                            sx={{
                                                                color: vistelicaColors.primary,
                                                                '&.Mui-checked': {
                                                                    color: vistelicaColors.primary
                                                                }
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Rating
                                                                value={rating}
                                                                readOnly
                                                                size="small"
                                                                sx={{
                                                                    mr: 0.8,
                                                                    color: vistelicaColors.primary
                                                                }}
                                                            />
                                                            <Typography
                                                                component="span"
                                                                variant="body2"
                                                                fontFamily={typography.fontFamily}
                                                                sx={{ opacity: 0.7 }}
                                                            >
                                                                ({rating}+)
                                                            </Typography>
                                                        </Box>
                                                    }
                                                    sx={{
                                                        mx: 0,
                                                        width: '100%',
                                                        py: 0.7
                                                    }}
                                                />
                                            </ListItem>
                                        </motion.div>
                                    ))}
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    </Box>

                    {/* Botones de acción (fijados al fondo) */}
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        sx={{
                            mt: 'auto',
                            pt: 2,
                            borderTop: `1px solid ${vistelicaColors.border || '#e0e0e0'}`,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5
                        }}
                    >

                        <Button
                            variant="outlined"
                            fullWidth
                            disabled={!hasActiveFilters}
                            onClick={clearAllFilters}
                            sx={{
                                py: { xs: 1, sm: 1.2 },
                                borderColor: hasActiveFilters ? vistelicaColors.border || '#e0e0e0' : 'transparent',
                                color: vistelicaColors.secondary,
                                fontFamily: typography.fontFamily,
                                borderRadius: '8px',
                                opacity: hasActiveFilters ? 1 : 0.5,
                                '&:hover': {
                                    borderColor: vistelicaColors.primary,
                                    bgcolor: alpha(vistelicaColors.primary, 0.02)
                                },
                                '&.Mui-disabled': {
                                    borderColor: alpha(vistelicaColors.border || '#e0e0e0', 0.3),
                                }
                            }}
                        >
                            Limpiar filtros
                        </Button>
                    </Box>
                </Box>
            </Slide>
        </>
    );
};

export default React.memo(FilterSidebar);