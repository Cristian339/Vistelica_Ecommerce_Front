"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Typography, Button, Fade, Grid, Divider, Chip, IconButton } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// Servicios y utilidades
import productService from '@/services/productService';
import categoryService from '@/services/categoryService';
import { sortProducts } from './components/SortUtils';
import { COLORS, BRANDS } from './constants/filterOptions';
// Componentes
import ProductGrid from './components/ProductGrid';
import SortDropdown from './components/SortDropdown';
import FilterSidebar from './components/FilterSidebar';
import { vistelicaColors } from '../shared-theme/vistelicaColors';

const ProductList = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const gender = searchParams.get('gender');
    const category = searchParams.get('category');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Estados
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showFilters, setShowFilters] = useState(!isMobile);
    const [sortOption, setSortOption] = useState('relevancia');
    const [filters, setFilters] = useState({
        brands: [],
        colors: [],
        ratings: [],
        priceMin: '',
        priceMax: '',
    });
    const [loading, setLoading] = useState(true);

    // Cargar categorías
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAllWithSubcategories();
                setCategories(data);
            } catch (err) {
                console.error('Error al cargar categorías:', err);
            }
        };

        fetchCategories();
    }, []);

    // Cargar productos según género y categoría
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await productService.getAll();
                let filteredData = data;

                if (gender) {
                    filteredData = filteredData.filter(p =>
                        p.gender.toLowerCase() === gender.toLowerCase()
                    );
                }

                if (category && category !== 'todos') {
                    filteredData = filteredData.filter(p =>
                        p.category.toLowerCase() === category.toLowerCase()
                    );

                    // Encontrar la categoría seleccionada para mostrar su nombre
                    if (categories.length > 0) {
                        const found = categories.find(c =>
                            c.slug === category ||
                            c.subcategories.some(s => s.slug === category)
                        );

                        if (found) {
                            if (found.slug === category) {
                                setSelectedCategory(found);
                            } else {
                                const subcat = found.subcategories.find(s => s.slug === category);
                                if (subcat) setSelectedCategory(subcat);
                            }
                        }
                    }
                } else {
                    setSelectedCategory({ name: 'Todos los productos' });
                }

                setProducts(filteredData);
                setFilteredProducts(filteredData);
            } catch (err) {
                console.error('Error al cargar productos:', err);
            } finally {
                setLoading(false);
            }
        };

        // Ya no es necesario verificar router.isReady en App Router
        fetchProducts();
    }, [gender, category, categories]);

    // Aplicar filtros a los productos
    useEffect(() => {
        let result = [...products];

        // Filtro por marcas
        if (filters.brands.length > 0) {
            result = result.filter(p => filters.brands.includes(p.brand));
        }

        // Filtro por colores
        if (filters.colors.length > 0) {
            result = result.filter(p => filters.colors.includes(p.color));
        }

        // Filtro por rating
        if (filters.ratings.length > 0) {
            result = result.filter(p => filters.ratings.includes(Math.floor(p.rating)));
        }

        // Filtro por precio
        if (filters.priceMin !== '') {
            result = result.filter(p => p.price >= parseInt(filters.priceMin));
        }
        if (filters.priceMax !== '') {
            result = result.filter(p => p.price <= parseInt(filters.priceMax));
        }

        // Ordenamiento
        result = sortProducts(result, sortOption);

        setFilteredProducts(result);
    }, [filters, sortOption, products]);

    // Resetear filtros
    const resetFilters = () => {
        setFilters({
            brands: [],
            colors: [],
            ratings: [],
            priceMin: '',
            priceMax: '',
        });
        setSortOption('relevancia');
    };

    // Verificar si hay filtros activos
    const hasActiveFilters = () => {
        return (
            filters.brands.length > 0 ||
            filters.colors.length > 0 ||
            filters.ratings.length > 0 ||
            filters.priceMin !== '' ||
            filters.priceMax !== '' ||
            sortOption !== 'relevancia'
        );
    };

    return (
        <Box sx={{
            maxWidth: '1400px',
            margin: '0 auto',
            px: { xs: 2, sm: 3, md: 4 },
            py: 4
        }}>
            <Grid container spacing={3}>
                {/* Sidebar con filtros */}
                <Grid item xs={12} md={3}>
                    <Fade in={showFilters}>
                        <Box sx={{
                            display: showFilters ? 'block' : 'none',
                            position: { xs: 'fixed', md: 'static' },
                            top: 0,
                            left: 0,
                            width: { xs: '100%', sm: '300px', md: '100%' },
                            height: { xs: '100vh', md: 'auto' },
                            backgroundColor: 'background.paper',
                            zIndex: 1000,
                            p: { xs: 2, md: 0 },
                            boxShadow: { xs: 24, md: 0 },
                            overflowY: 'auto'
                        }}>
                            {isMobile && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6">Filtros</Typography>
                                    <IconButton onClick={() => setShowFilters(false)}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            )}

                            <FilterSidebar
                                filters={filters}
                                setFilters={setFilters}
                                categories={categories}
                                selectedGender={gender}
                            />

                            {hasActiveFilters() && (
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    fullWidth
                                    onClick={resetFilters}
                                    sx={{ mt: 2 }}
                                >
                                    Limpiar filtros
                                </Button>
                            )}
                        </Box>
                    </Fade>
                </Grid>

                {/* Contenido principal */}
                <Grid item xs={12} md={showFilters ? 9 : 12}>
                    {/* Encabezado y controles */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: { xs: 'column', sm: 'row' },
                        mb: 3
                    }}>
                        <Box>
                            <Typography variant="h4" component="h1" fontWeight="bold">
                                {selectedCategory?.name || 'Productos'}
                                <Box component="span" sx={{ color: 'text.secondary', ml: 1 }}>
                                    ({filteredProducts.length})
                                </Box>
                            </Typography>

                            {/* Filtros activos */}
                            {hasActiveFilters() && (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                    {filters.brands.map(brandId => {
                                        const brand = BRANDS.find(b => b.id === brandId);
                                        return (
                                            <Chip
                                                key={brandId}
                                                label={brand?.label || brandId}
                                                size="small"
                                                onDelete={() => {
                                                    setFilters(prev => ({
                                                        ...prev,
                                                        brands: prev.brands.filter(b => b !== brandId)
                                                    }));
                                                }}
                                            />
                                        );
                                    })}

                                    {filters.colors.map(colorId => {
                                        const color = COLORS.find(c => c.id === colorId);
                                        return (
                                            <Chip
                                                key={colorId}
                                                label={color?.label || colorId}
                                                size="small"
                                                onDelete={() => {
                                                    setFilters(prev => ({
                                                        ...prev,
                                                        colors: prev.colors.filter(c => c !== colorId)
                                                    }));
                                                }}
                                            />
                                        );
                                    })}
                                    {filters.ratings.map(rating => (
                                        <Chip
                                            key={rating}
                                            label={`${rating}★ o más`}
                                            size="small"
                                            onDelete={() => {
                                                setFilters(prev => ({
                                                    ...prev,
                                                    ratings: prev.ratings.filter(r => r !== rating)
                                                }));
                                            }}
                                        />
                                    ))}
                                    {(filters.priceMin !== '' || filters.priceMax !== '') && (
                                        <Chip
                                            label={`${filters.priceMin || 0}€ - ${filters.priceMax || '∞'}€`}
                                            size="small"
                                            onDelete={() => {
                                                setFilters(prev => ({
                                                    ...prev,
                                                    priceMin: '',
                                                    priceMax: ''
                                                }));
                                            }}
                                        />
                                    )}
                                </Box>
                            )}
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            mt: { xs: 2, sm: 0 },
                            width: { xs: '100%', sm: 'auto' }
                        }}>
                            <Button
                                startIcon={showFilters ? <CloseIcon /> : <FilterListIcon />}
                                onClick={() => setShowFilters(!showFilters)}
                                color="inherit"
                                sx={{ display: { xs: 'flex', md: 'none' }, minWidth: 'auto' }}
                            >
                                {showFilters ? 'Ocultar filtros' : 'Filtros'}
                            </Button>

                            <Button
                                onClick={() => setShowFilters(!showFilters)}
                                color="inherit"
                                sx={{ display: { xs: 'none', md: 'flex' } }}
                            >
                                {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
                            </Button>

                            <SortDropdown onSortChange={setSortOption} />
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* Grid de productos */}
                    {loading ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography>Cargando productos...</Typography>
                        </Box>
                    ) : (
                        <ProductGrid products={filteredProducts} />
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProductList;