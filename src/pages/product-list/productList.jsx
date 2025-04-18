"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Typography, Button, Fade, Grid, Divider, Chip, IconButton, GlobalStyles, Tooltip } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import ViewModuleIcon from '@mui/icons-material/ViewModule';  // Para vista de 4 productos
import ViewComfyIcon from '@mui/icons-material/ViewComfy';    // Para vista de 2 productos
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
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showFilters, setShowFilters] = useState(!isMobile);
    const [sortOption, setSortOption] = useState('relevancia');
    const [gridView, setGridView] = useState('grid4'); // Estado para la vista de cuadrícula
    const [filters, setFilters] = useState({
        brands: [],
        colors: [],
        ratings: [],
        priceMin: '',
        priceMax: '',
    });
    const [loading, setLoading] = useState(true);

    // Función para cambiar la vista de cuadrícula
    const toggleGridView = () => {
        setGridView(gridView === 'grid4' ? 'grid2' : 'grid4');
    };

    // Función para abrir el sidebar en móvil
    const openSidebar = () => {
        document.documentElement.style.setProperty('--SideNavigation-slideIn', '1');
        setShowFilters(true);
    };

    // Función para cerrar el sidebar en móvil
    const closeSidebar = () => {
        document.documentElement.style.setProperty('--SideNavigation-slideIn', '0');
        if (isMobile) setShowFilters(false);
    };

    // Efecto para controlar la visibilidad en cambios de viewport
    useEffect(() => {
        setShowFilters(!isMobile);
    }, [isMobile]);

    // Cargar categorías y subcategorías
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAllWithSubcategories();
                setCategories(data);

                // Extraer todas las subcategorías para facilitar la búsqueda
                const allSubcats = [];
                data.forEach(category => {
                    if (category.subcategories && category.subcategories.length > 0) {
                        allSubcats.push(...category.subcategories.map(subcat => ({
                            ...subcat,
                            parentCategory: category.name,
                            parentSlug: category.slug,
                            gender: category.gender
                        })));
                    }
                });
                setSubcategories(allSubcats);
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
                    // Verificar si es una categoría principal o subcategoría
                    const isMainCategory = categories.some(c => c.slug === category);
                    const isSubCategory = subcategories.some(s => s.slug === category);

                    if (isMainCategory) {
                        // Si es categoría principal, incluir productos de sus subcategorías también
                        const categoryObj = categories.find(c => c.slug === category);
                        const subcatSlugs = categoryObj?.subcategories?.map(s => s.slug) || [];

                        filteredData = filteredData.filter(p =>
                            p.category.toLowerCase() === category.toLowerCase() ||
                            subcatSlugs.includes(p.category.toLowerCase())
                        );

                        setSelectedCategory(categoryObj);
                    }
                    else if (isSubCategory) {
                        // Si es subcategoría, filtrar solo por ella
                        filteredData = filteredData.filter(p =>
                            p.category.toLowerCase() === category.toLowerCase()
                        );

                        const subcatObj = subcategories.find(s => s.slug === category);
                        setSelectedCategory({
                            ...subcatObj,
                            isSubcategory: true
                        });
                    }
                    else {
                        // Filtro genérico si no se identifica claramente
                        filteredData = filteredData.filter(p =>
                            p.category.toLowerCase() === category.toLowerCase()
                        );

                        setSelectedCategory({ name: `Categoría: ${category}` });
                    }
                } else {
                    setSelectedCategory({ name: gender ? `${gender.charAt(0).toUpperCase() + gender.slice(1)}` : 'Todos los productos' });
                }

                setProducts(filteredData);
                setFilteredProducts(filteredData);
            } catch (err) {
                console.error('Error al cargar productos:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [gender, category, categories, subcategories]);

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

    // Obtener un título más informativo para la página
    const getPageTitle = () => {
        if (selectedCategory) {
            if (selectedCategory.isSubcategory) {
                const parentCategory = categories.find(c =>
                    c.subcategories?.some(s => s._id === selectedCategory._id)
                );
                return (
                    <>
                        {selectedCategory.name}
                        {parentCategory && (
                            <Typography variant="subtitle1" color="text.secondary">
                                {parentCategory.name}
                            </Typography>
                        )}
                    </>
                );
            }
            return selectedCategory.name;
        }
        return gender ? `${gender.charAt(0).toUpperCase() + gender.slice(1)}` : 'Productos';
    };

    return (
        <>
            <GlobalStyles
                styles={(theme) => ({
                    ':root': {
                        '--Sidebar-width': '300px',
                        '--SideNavigation-slideIn': '0',
                    },
                })}
            />

            <Box sx={{
                maxWidth: '100%',
                margin: '0 auto',
                py: 4,
                display: 'flex',
                position: 'relative'
            }}>
                {/* Contenedor para el sidebar con filtros */}
                <Box
                    sx={{
                        position: { xs: 'static', md: 'relative' },
                        width: { md: showFilters ? 'var(--Sidebar-width)' : '0px' },
                        flexShrink: 0,
                        overflow: 'hidden',
                        transition: 'width 0.3s ease-in-out',
                    }}
                >
                    <FilterSidebar
                        filters={filters}
                        setFilters={setFilters}
                        categories={categories}
                        subcategories={subcategories}
                        selectedGender={gender}
                        currentCategory={category}
                        showFilters={showFilters}
                        setShowFilters={setShowFilters}
                        closeSidebar={closeSidebar}
                    />
                </Box>

                {/* Contenido principal */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        width: { xs: '100%', md: '100%' },
                        ml: { xs: 0 },
                        transition: 'margin-left 0.3s',
                        px: { xs: 2, sm: 3, md: 4 },
                    }}
                >
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
                                {getPageTitle()}
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
                            {/* Botón de vista de productos */}
                            <Tooltip title={gridView === 'grid4' ? "Ver 2 por fila" : "Ver 4 por fila"}>
                                <IconButton
                                    onClick={toggleGridView}
                                    color="primary"
                                    size="large"
                                    sx={{
                                        border: '1px solid rgba(0,0,0,0.12)',
                                        borderRadius: '8px',
                                        p: 1
                                    }}
                                >
                                    {gridView === 'grid4' ? <ViewComfyIcon fontSize="medium" /> : <ViewModuleIcon fontSize="medium" />}
                                </IconButton>
                            </Tooltip>

                            <Button
                                startIcon={<FilterListIcon />}
                                onClick={() => {
                                    if (isMobile) {
                                        openSidebar();
                                    } else {
                                        setShowFilters(!showFilters);
                                    }
                                }}
                                color="inherit"
                                sx={{ display: { xs: 'flex', md: 'none' }, minWidth: 'auto' }}
                            >
                                Filtros
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
                    ) : filteredProducts.length > 0 ? (
                        <ProductGrid products={filteredProducts} gridView={gridView} />
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography>No se encontraron productos con los filtros seleccionados</Typography>
                            {hasActiveFilters() && (
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={resetFilters}
                                    sx={{ mt: 2 }}
                                >
                                    Limpiar filtros
                                </Button>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>
        </>
    );
};

export default ProductList;