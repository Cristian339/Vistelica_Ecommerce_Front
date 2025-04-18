'use client';
import React from 'react';
import {
    Box,
    Typography,
    Checkbox,
    FormControlLabel,
    Divider,
    TextField,
    Button,
    Rating,
    FormGroup,
    List,
    ListItem,
    ListItemText,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    useMediaQuery,
    useTheme,
    GlobalStyles
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { COLORS, BRANDS } from '../constants/filterOptions';

// Función auxiliar para cerrar el sidebar (en móvil)
const closeSidebar = () => {
    document.documentElement.style.setProperty('--SideNavigation-slideIn', '0');
};

const FilterSidebar = ({ filters, setFilters, categories = [], selectedGender, showFilters, setShowFilters }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Función para manejar checkboxes
    const handleCheckbox = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: prev[key].includes(value)
                ? prev[key].filter(item => item !== value)
                : [...prev[key], value]
        }));
    };

    // Función para manejar cambios de precio
    const handlePriceChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Función para aplicar filtro de precio
    const applyPriceFilter = () => {
        // Ya se aplica automáticamente en el useEffect del componente padre
        if (isMobile) {
            closeSidebar();
        }
    };

    // Extraer solo las subcategorías del género seleccionado
    const getSubcategories = () => {
        if (!categories || categories.length === 0 || !selectedGender) {
            return [];
        }

        const subcategories = [];

        // Filtrar categorías por género
        const filteredCategories = categories.filter(cat =>
            cat && (cat.gender === selectedGender || cat.gender === 'unisex')
        );

        // Extraer subcategorías
        filteredCategories.forEach(category => {
            if (category?.subcategories?.length > 0) {
                subcategories.push(...category.subcategories);
            }
        });

        return subcategories;
    };

    const subcategories = getSubcategories();

    return (
        <>
            <GlobalStyles
                styles={(theme) => ({
                    ':root': {
                        '--Sidebar-width': '280px',
                        [theme.breakpoints.up('lg')]: {
                            '--Sidebar-width': '320px',
                        },
                    },
                })}
            />

            {/* Overlay para cerrar el sidebar en móvil */}
            <Box
                className="Sidebar-overlay"
                sx={{
                    position: 'fixed',
                    zIndex: 1199,
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    opacity: 'var(--SideNavigation-slideIn, 0)',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    transition: 'opacity 0.4s',
                    display: { xs: 'block', md: 'none' },
                    transform: {
                        xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
                    },
                    visibility: showFilters && isMobile ? 'visible' : 'hidden',
                }}
                onClick={() => {
                    closeSidebar();
                    if (setShowFilters) setShowFilters(false);
                }}
            />

            {/* Contenedor principal del sidebar */}
            <Box
                className="FilterSidebar"
                sx={{
                    position: { xs: 'fixed', md: 'sticky' },
                    top: { xs: 0, md: '80px' }, // Ajustar según tu header
                    left: 0,
                    height: { xs: '100vh', md: 'calc(100vh - 80px)' }, // Ajustar según tu header
                    width: 'var(--Sidebar-width)',
                    maxWidth: '100%',
                    zIndex: 1200,
                    overflowY: 'auto',
                    bgcolor: 'background.paper',
                    p: 2,
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    boxShadow: { xs: 3, md: 'none' },
                    transform: {
                        xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
                        md: 'none',
                    },
                    transition: 'transform 0.4s'
                }}
            >
                {/* Cabecera del sidebar (solo en móvil) */}
                {isMobile && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold">Filtros</Typography>
                        <IconButton onClick={() => {
                            closeSidebar();
                            if (setShowFilters) setShowFilters(false);
                        }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                )}

                {/* Solo Subcategorías */}
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography fontWeight="bold">Categorías</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {subcategories && subcategories.length > 0 ? (
                            <List disablePadding dense>
                                {subcategories.map(subcat => (
                                    <ListItem disablePadding key={subcat._id || `subcat-${subcat.name}`}>
                                        <Link
                                            href={`/product-list?gender=${selectedGender}&category=${subcat.slug}`}
                                            passHref
                                            style={{textDecoration: 'none', color: 'inherit', width: '100%'}}
                                            onClick={() => isMobile && closeSidebar()}
                                        >
                                            <ListItemText primary={subcat.name} />
                                        </Link>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                No hay subcategorías disponibles para este género
                            </Typography>
                        )}
                    </AccordionDetails>
                </Accordion>

                <Divider sx={{ my: 2 }} />

                {/* Marcas */}
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography fontWeight="bold">Marcas</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormGroup>
                            {BRANDS.map(brand => (
                                <FormControlLabel
                                    key={brand.id}
                                    control={
                                        <Checkbox
                                            checked={filters.brands.includes(brand.id)}
                                            onChange={() => handleCheckbox('brands', brand.id)}
                                            size="small"
                                        />
                                    }
                                    label={brand.label}
                                />
                            ))}
                        </FormGroup>
                    </AccordionDetails>
                </Accordion>

                <Divider sx={{ my: 2 }} />

                {/* Colores */}
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography fontWeight="bold">Colores</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormGroup>
                            {COLORS.map(color => (
                                <FormControlLabel
                                    key={color.id}
                                    control={
                                        <Checkbox
                                            checked={filters.colors.includes(color.id)}
                                            onChange={() => handleCheckbox('colors', color.id)}
                                            size="small"
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Box
                                                sx={{
                                                    width: 16,
                                                    height: 16,
                                                    borderRadius: '50%',
                                                    backgroundColor: color.cssColor || color.id,
                                                    border: '1px solid #ddd',
                                                    mr: 1
                                                }}
                                            />
                                            {color.label}
                                        </Box>
                                    }
                                />
                            ))}
                        </FormGroup>
                    </AccordionDetails>
                </Accordion>

                <Divider sx={{ my: 2 }} />

                {/* Precio */}
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography fontWeight="bold">Precio</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <TextField
                                label="Mínimo"
                                type="number"
                                size="small"
                                fullWidth
                                InputProps={{ inputProps: { min: 0 } }}
                                value={filters.priceMin}
                                onChange={(e) => handlePriceChange('priceMin', e.target.value)}
                            />
                            <TextField
                                label="Máximo"
                                type="number"
                                size="small"
                                fullWidth
                                InputProps={{ inputProps: { min: 0 } }}
                                value={filters.priceMax}
                                onChange={(e) => handlePriceChange('priceMax', e.target.value)}
                            />
                        </Box>
                        <Button
                            variant="outlined"
                            size="small"
                            fullWidth
                            onClick={applyPriceFilter}
                        >
                            Aplicar
                        </Button>
                    </AccordionDetails>
                </Accordion>

                <Divider sx={{ my: 2 }} />

                {/* Rating */}
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography fontWeight="bold">Valoración</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormGroup>
                            {[5, 4, 3].map((rating) => (
                                <FormControlLabel
                                    key={rating}
                                    control={
                                        <Checkbox
                                            checked={filters.ratings.includes(rating)}
                                            onChange={() => handleCheckbox('ratings', rating)}
                                            size="small"
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Rating value={rating} readOnly size="small" />
                                            <Typography variant="body2" sx={{ ml: 1 }}>
                                                o más
                                            </Typography>
                                        </Box>
                                    }
                                />
                            ))}
                        </FormGroup>
                    </AccordionDetails>
                </Accordion>

                {/* Botón de aplicar filtros (solo móvil) */}
                {isMobile && (
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => {
                            closeSidebar();
                            if (setShowFilters) setShowFilters(false);
                        }}
                    >
                        Ver resultados
                    </Button>
                )}
            </Box>
        </>
    );
};

export default FilterSidebar;