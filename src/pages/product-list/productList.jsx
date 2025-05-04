"use client"

import React, { useEffect, useState,useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Box, Typography, Button, Divider, Chip, IconButton, GlobalStyles,
    Tooltip, Breadcrumbs, Link as MuiLink, CircularProgress,
    Snackbar, Alert
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import HomeIcon from '@mui/icons-material/Home';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';

// Importación del Navbar
import HeaderComponent from '@/components/layout/HeaderComponent';

// Servicios y utilidades
import wishlistService from '@/services/wishlistService';
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
    const subcategory = searchParams.get('subcategory');
    const subcategoryName = searchParams.get('name');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Estados
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [showFilters, setShowFilters] = useState(!isMobile);
    const [sortOption, setSortOption] = useState('relevancia');
    const [gridView, setGridView] = useState('grid4');
    const [categorySubcategories, setCategorySubcategories] = useState([]);
    const [loadingSubcategories, setLoadingSubcategories] = useState(false);
    const [filters, setFilters] = useState({
        brands: [],
        colors: [],
        ratings: [],
        priceMin: '',
        priceMax: '',
        subcategories: []
    });
    const [loading, setLoading] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [favoriteIds, setFavoriteIds] = useState([]);



    // Función para cambiar la vista de cuadrícula
    const toggleGridView = () => {
        setGridView(gridView === 'grid4' ? 'grid2' : 'grid4');
    };

    // Funciones para sidebar
    const openSidebar = () => {
        document.documentElement.style.setProperty('--SideNavigation-slideIn', '1');
        setShowFilters(true);
    };

    const closeSidebar = () => {
        document.documentElement.style.setProperty('--SideNavigation-slideIn', '0');
        if (isMobile) setShowFilters(false);
    };

    useEffect(() => {
        setShowFilters(!isMobile);
    }, [isMobile]);

    // Cargar categorías y subcategorías
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await categoryService.fetchCategories();
                setCategories(categories);

                // Extraer todas las subcategorías para navegación global
                const allSubcats = [];
                categories.forEach(category => {
                    if (category.subcategories && category.subcategories.length > 0) {
                        allSubcats.push(...category.subcategories.map(subcat => ({
                            ...subcat,
                            parentCategory: category.name,
                            parentCategoryId: category.category_id,
                            parentSlug: category.slug || category.name.toLowerCase(),
                            gender: category.gender
                        })));
                    }
                });
                setSubcategories(allSubcats);

                // Si hay una categoría en la URL, cargar sus subcategorías específicas
                if (category) {
                    const foundCategory = categories.find(c =>
                        c.slug === category ||
                        c.name.toLowerCase() === category.toLowerCase() ||
                        c.category_id === parseInt(category)
                    );

                    if (foundCategory) {
                        setSelectedCategory(foundCategory);
                        loadCategorySubcategories(foundCategory.category_id);
                    }
                }
            } catch (err) {
                console.error('Error al cargar categorías:', err);
            }
        };

        fetchCategories();
    }, [category]);

    // Función para cargar subcategorías específicas de una categoría
    const loadCategorySubcategories = async (categoryId) => {
        if (!categoryId) return [];

        setLoadingSubcategories(true);
        try {
            const subcats = await categoryService.getSubcategoriesByCategory(categoryId);
            setCategorySubcategories(subcats);
            setLoadingSubcategories(false);
            return subcats;
        } catch (error) {
            console.error(`Error al cargar subcategorías para la categoría ${categoryId}:`, error);
            setCategorySubcategories([]);
            setLoadingSubcategories(false);
            return [];
        }
    };

//  useEffect para cargar favoritos actuales
    useEffect(() => {
        const loadFavorites = async () => {
            if (isAuthenticated) {
                try {
                    const wishlistItems = await wishlistService.getWishlist();
                    const ids = wishlistItems.map(item => item.product_id);
                    setFavoriteIds(ids);
                    console.log("IDs de favoritos cargados:", ids);
                } catch (error) {
                    console.error("Error al cargar favoritos:", error);
                    // Fallar silenciosamente
                }
            } else {
                const localWishlist = JSON.parse(localStorage.getItem('vistelica_wishlist') || '[]');
                const ids = localWishlist.map(item => item.id || item.product_id);
                setFavoriteIds(ids);
            }
        };

        loadFavorites();
    }, [isAuthenticated]);



// Función para manejar agregar a favoritos
    const handleAddToWishlist = useCallback(async (product, isRemove) => {
        console.log("===== INICIO handleAddToWishlist =====");
        console.log("Producto recibido:", product);
        console.log("¿Eliminar de favoritos?:", isRemove);

        const productId = product.id || product.product_id;

        try {
            if (isAuthenticated) {
                if (isRemove) {
                    // Eliminar de favoritos
                    await wishlistService.removeFromWishlist(productId);
                    setFavoriteIds(prev => prev.filter(id => id !== productId));
                    setToast({
                        open: true,
                        message: 'Producto eliminado de favoritos',
                        severity: 'info'
                    });
                } else {
                    // Añadir a favoritos
                    try {
                        await wishlistService.addToWishlist(productId);

                        // Actualizar el estado favoriteIds
                        if (!favoriteIds.includes(productId)) {
                            setFavoriteIds(prev => [...prev, productId]);
                        }

                        setToast({
                            open: true,
                            message: 'Producto añadido a favoritos',
                            severity: 'success'
                        });
                    } catch (error) {
                        console.error("Error en wishlistService:", error);
                        // Ignorar el error de producto duplicado
                        if (!error.message?.includes("ya está en la lista de deseos")) {
                            setToast({
                                open: true,
                                message: 'Error al añadir a favoritos',
                                severity: 'error'
                            });
                        } else if (!favoriteIds.includes(productId)) {
                            // Si el error es por duplicado pero no lo tenemos en el state, añadirlo
                            setFavoriteIds(prev => [...prev, productId]);
                        }
                    }
                }
            } else {
                // Usuario no autenticado: usar localStorage
                const localWishlist = JSON.parse(localStorage.getItem('vistelica_wishlist') || '[]');

                if (isRemove) {
                    // Eliminar de favoritos
                    const updatedWishlist = localWishlist.filter(
                        item => (item.id || item.product_id) !== productId
                    );
                    localStorage.setItem('vistelica_wishlist', JSON.stringify(updatedWishlist));
                    setFavoriteIds(prev => prev.filter(id => id !== productId));
                    setToast({
                        open: true,
                        message: 'Producto eliminado de favoritos',
                        severity: 'info'
                    });
                } else {
                    // Verificar si ya existe
                    if (!localWishlist.some(item => (item.id || item.product_id) === productId)) {
                        // Guardar solo la información necesaria
                        const wishlistItem = {
                            id: productId,
                            product_id: productId,
                            name: product.name,
                            image_url: product.image_url || product.imageUrl,
                            price: product.price
                        };

                        localWishlist.push(wishlistItem);
                        localStorage.setItem('vistelica_wishlist', JSON.stringify(localWishlist));
                        localStorage.setItem('wishlist_sessionId', sessionId);

                        setFavoriteIds(prev => [...prev, productId]);
                        setToast({
                            open: true,
                            message: 'Producto añadido a favoritos',
                            severity: 'success'
                        });
                    }
                }
            }
        } catch (error) {
            console.error("Error general:", error);
            setToast({
                open: true,
                message: 'Error al procesar tu solicitud',
                severity: 'error'
            });
        }

        console.log("===== FIN handleAddToWishlist =====");
    }, [isAuthenticated, sessionId, favoriteIds]);

    // Verificar autenticación al cargar la página
    useEffect(() => {
        const initializeUserSession = () => {
            // Verificar si existe un token (usuario autenticado)
            const token = localStorage.getItem('token');
            setIsAuthenticated(!!token);

            // Para usuarios no autenticados, gestionar sessionId
            if (!token) {
                let sessionId = localStorage.getItem('sessionId');

                if (!sessionId) {
                    // Generar nuevo sessionId si no existe
                    sessionId = typeof crypto !== 'undefined' && crypto.randomUUID
                        ? crypto.randomUUID()
                        : ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                            (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4)).toString(16)
                        );
                    localStorage.setItem('sessionId', sessionId);
                }

                setSessionId(sessionId);
            }
        };

        initializeUserSession();
    }, []);

    // Actualizar las subcategorías cuando cambia la categoría seleccionada
    useEffect(() => {
        if (selectedCategory && selectedCategory.category_id) {
            loadCategorySubcategories(selectedCategory.category_id);
        }
    }, [selectedCategory]);

    // Cargar productos con la nueva API para subcategorías
    useEffect(() => {
        let isMounted = true;

        const fetchProducts = async () => {
            if (!isMounted) return;

            if (isInitialLoad) {
                setLoading(true);
            }

            try {
                // Cargar imágenes primero y crear un mapa
                let imagesMap = {};
                try {
                    const images = await productService.getMainProductImages();
                    console.log("Imágenes recibidas del backend:", images);

                    // Convertir el array de imágenes a un objeto para acceso rápido
                    if (Array.isArray(images)) {
                        images.forEach(img => {
                            // Asegurar que usamos el ID correcto como clave
                            const productId = String(img.product_id);
                            // Verificar si la URL de la imagen es completa o necesita prefijo
                            const imageUrl = img.image_url.startsWith('http')
                                ? img.image_url
                                : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${img.image_url}`;

                            imagesMap[productId] = imageUrl;
                            //console.log(`Imagen mapeada: Producto ${productId} -> ${imageUrl}`);
                        });
                    }
                } catch (imgError) {
                    console.error("Error al cargar imágenes de productos:", imgError);
                }

                // Cargar productos
                let data = [];
                let foundSubcategory = null;
                let parentCategory = null;

                // Si tenemos subcategoría específica en la URL
                if (subcategory) {
                    console.log("Filtrando por subcategoría ID:", subcategory);

                    // Encontrar la subcategoría por ID
                    foundSubcategory = subcategories.find(s =>
                        s.subcategory_id === parseInt(subcategory) ||
                        s.slug === subcategory
                    );

                    if (foundSubcategory) {
                        console.log("Subcategoría encontrada:", foundSubcategory.name);

                        // Buscar la categoría padre
                        parentCategory = categories.find(c =>
                            c.category_id === foundSubcategory.parentCategoryId ||
                            c.subcategories?.some(s =>
                                s.subcategory_id === parseInt(subcategory) ||
                                s.slug === subcategory
                            )
                        );

                        if (parentCategory && foundSubcategory) {
                            // Usar la nueva API para obtener productos por categoría y subcategoría
                            try {
                                data = await productService.getByCategoryAndSubcategory(
                                    parentCategory.category_id,
                                    foundSubcategory.subcategory_id
                                );
                                console.log(`Productos obtenidos con getByCategoryAndSubcategory: ${data.length}`);
                            } catch (err) {
                                console.error("Error al obtener productos por categoría/subcategoría:", err);
                                // Fallback a filtrado manual si la API falla
                                data = await productService.getAll();
                                data = data.filter(product => {
                                    const productSubcategory = product.subcategory ?
                                        (typeof product.subcategory === 'string' ?
                                                product.subcategory.toLowerCase() :
                                                String(product.subcategory).toLowerCase()
                                        ) : '';

                                    return productSubcategory === foundSubcategory.name.toLowerCase() ||
                                        productSubcategory === subcategoryName?.toLowerCase();
                                });
                            }
                        } else {
                            // Fallback si no tenemos la información completa
                            data = await productService.getAll();
                            data = data.filter(p => {
                                const pSubcat = p.subcategory ? String(p.subcategory).toLowerCase() : '';
                                return pSubcat === foundSubcategory.name.toLowerCase();
                            });
                        }
                    } else {
                        // Si no encontramos la subcategoría en nuestra memoria caché
                        data = await productService.getAll();
                        data = data.filter(p => {
                            const pSubcat = p.subcategory ? String(p.subcategory).toLowerCase() : '';
                            return pSubcat === subcategoryName?.toLowerCase();
                        });
                    }

                    if (isMounted) {
                        setSelectedSubcategory(foundSubcategory || {name: subcategoryName || "Subcategoría"});
                        setSelectedCategory(parentCategory || {name: "Categoría"});
                    }
                }
                // Si solo tenemos categoría en la URL
                else if (category) {
                    const categoryObj = categories.find(c =>
                        c.slug === category ||
                        c.name.toLowerCase() === category.toLowerCase() ||
                        c.category_id === parseInt(category)
                    );

                    if (categoryObj) {
                        // Si tenemos un filtro de subcategorías, aplicarlo
                        if (filters.subcategories && filters.subcategories.length > 0) {
                            const allProducts = [];
                            for (const subcat of filters.subcategories) {
                                try {
                                    const subProducts = await productService.getByCategoryAndSubcategory(
                                        categoryObj.category_id,
                                        subcat
                                    );
                                    allProducts.push(...subProducts);
                                } catch (err) {
                                    console.error(`Error al cargar productos para subcategoría ${subcat}:`, err);
                                }
                            }
                            data = allProducts;
                        }
                        // Si no, cargar todos los productos de esa categoría
                        else {
                            data = await productService.getAll();
                            data = data.filter(p =>
                                (typeof p.category === 'string' ?
                                    p.category.toLowerCase() :
                                    String(p.category || '').toLowerCase()) === categoryObj.name.toLowerCase()
                            );
                        }

                        if (isMounted) {
                            setSelectedCategory(categoryObj);
                            setSelectedSubcategory(null);
                        }
                    } else {
                        data = await productService.getAll();
                    }
                } else {
                    data = await productService.getAll();
                    if (isMounted) {
                        setSelectedCategory(gender ? {name: gender.charAt(0).toUpperCase() + gender.slice(1)} : {name: 'Todos los productos'});
                        setSelectedSubcategory(null);
                    }
                }

                // Filtrar por género si existe
                if (gender) {
                    data = data.filter(p =>
                        (typeof p.gender === 'string' ? p.gender.toLowerCase() : String(p.gender || '').toLowerCase()) === gender.toLowerCase()
                    );
                }

                if (isMounted) {
                    console.log(`Productos finales obtenidos: ${data.length}`);

                    // Asociar las imágenes a los productos correctamente
                    const productsWithImages = data.map(product => {
                        // Probar con diferentes formatos de ID para mayor compatibilidad
                        const productId = String(product.product_id || product._id);
                        const imageUrl = imagesMap[productId];

                        console.log(`Producto ${productId}: ${product.name || 'sin nombre'}`);
                        console.log(`- ID usado para buscar imagen: ${productId}`);
                        console.log(`- Imagen encontrada: ${imageUrl || 'NO ENCONTRADA'}`);

                        return {
                            ...product,
                            imageUrl: imageUrl || '/images/placeholder-product.jpg'
                        };
                    });

                    setProducts(productsWithImages);
                    setFilteredProducts(productsWithImages);
                    setIsInitialLoad(false);
                }
            } catch (err) {
                console.error('Error al cargar productos:', err);
                if (isMounted) {
                    setIsInitialLoad(false);
                }
            } finally {
                if (isMounted && isInitialLoad) {
                    setLoading(false);
                }
            }
        };

        fetchProducts();

        return () => {
            isMounted = false;
        };
    }, [gender, category, subcategory, subcategoryName, categories.length, subcategories.length, filters.subcategories]);

    // Aplicar filtros al cambiar los criterios
    useEffect(() => {
        if (products.length === 0) return;

        let result = [...products];

        // Aplicar filtros
        if (filters.brands.length > 0) {
            result = result.filter(p => filters.brands.includes(p.brand));
        }

        if (filters.colors.length > 0) {
            result = result.filter(p =>
                p.colors && p.colors.some(c => filters.colors.includes(c))
            );
        }

        if (filters.ratings.length > 0) {
            const minRating = Math.min(...filters.ratings);
            result = result.filter(p => p.rating >= minRating);
        }

        if (filters.priceMin !== '') {
            result = result.filter(p => p.price >= parseFloat(filters.priceMin));
        }

        if (filters.priceMax !== '') {
            result = result.filter(p => p.price <= parseFloat(filters.priceMax));
        }

        // Aplicar ordenamiento
        if (sortOption !== 'relevancia') {
            result = sortProducts(result, sortOption);
        }

        setFilteredProducts(result);
    }, [filters.brands, filters.colors, filters.ratings, filters.priceMin, filters.priceMax, sortOption, products]);

    // Resetear filtros
    const resetFilters = () => {
        setFilters({
            brands: [],
            colors: [],
            ratings: [],
            priceMin: '',
            priceMax: '',
            subcategories: []
        });
        setSortOption('relevancia');
    };

    // Verificar si hay filtros activos
    const hasActiveFilters = () => {
        return filters.brands.length > 0 ||
            filters.colors.length > 0 ||
            filters.ratings.length > 0 ||
            filters.priceMin !== '' ||
            filters.priceMax !== '' ||
            filters.subcategories.length > 0 ||
            sortOption !== 'relevancia';
    };

    // Obtener título para la página - solo la subcategoría si existe
    const getPageTitle = () => {
        if (selectedSubcategory && selectedSubcategory.name) {
            return selectedSubcategory.name;
        } else if (selectedCategory && selectedCategory.name) {
            return selectedCategory.name;
        }
        return gender ? `${gender.charAt(0).toUpperCase() + gender.slice(1)}` : 'Productos';
    };

    return (
        <>
            {/* Incluir el navbar */}
            <HeaderComponent />

            <GlobalStyles
                styles={() => ({
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
                {/* Sidebar con filtros - Corregido para buen funcionamiento del scroll */}
                <Box
                    sx={{
                        position: { xs: 'fixed', md: 'sticky' },
                        top: { xs: 0, md: '64px' },
                        left: { xs: showFilters ? 0 : '-100%', md: 0 },
                        height: { xs: '100vh', md: 'calc(100vh - 64px)' },
                        width: { xs: '270px', md: showFilters ? 'var(--Sidebar-width)' : '0px' },
                        backgroundColor: 'white',
                        zIndex: { xs: 1200, md: 100 },
                        transition: 'all 0.3s ease-in-out',
                        boxShadow: { xs: showFilters ? '0 0 10px rgba(0,0,0,0.2)' : 'none', md: 'none' },
                        overflowY: 'auto',
                        flexShrink: 0,
                        overflowX: 'hidden',
                        borderRight: '1px solid rgba(0,0,0,0.08)'
                    }}
                >
                    <FilterSidebar
                        filters={filters}
                        setFilters={setFilters}
                        categories={categories}
                        subcategories={categorySubcategories}
                        loadingSubcategories={loadingSubcategories}
                        selectedCategory={selectedCategory}
                        selectedGender={gender}
                        currentCategory={category}
                        showFilters={showFilters}
                        setShowFilters={setShowFilters}
                        closeSidebar={closeSidebar}
                        onSubcategorySelect={(subcatId) => {
                            if (filters.subcategories.includes(subcatId)) {
                                setFilters(prev => ({
                                    ...prev,
                                    subcategories: prev.subcategories.filter(id => id !== subcatId)
                                }));
                            } else {
                                setFilters(prev => ({
                                    ...prev,
                                    subcategories: [...prev.subcategories, subcatId]
                                }));
                            }
                        }}
                    />
                </Box>

                {/* Contenido principal */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        width: { xs: '100%', md: showFilters ? 'calc(100% - var(--Sidebar-width))' : '100%' },
                        ml: { xs: 0 },
                        transition: 'margin-left 0.3s, width 0.3s',
                        px: { xs: 2, sm: 3, md: 4 },
                    }}
                >
                    {/* Título centrado */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography variant="h4" component="h1" fontWeight="bold">
                            {getPageTitle()}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
                            ({filteredProducts.length} productos)
                        </Typography>
                    </Box>

                    {/* Encabezado y controles */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: { xs: 'stretch', md: 'center' },
                        flexDirection: { xs: 'column', md: 'row' },
                        mb: 3,
                        gap: 2
                    }}>
                        {/* Breadcrumb */}
                        <Box sx={{ flex: 1 }}>
                            <Breadcrumbs aria-label="breadcrumb">
                                <MuiLink
                                    component={Link}
                                    underline="hover"
                                    color="inherit"
                                    href="/"
                                    sx={{ display: 'flex', alignItems: 'center' }}
                                >
                                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                                    Inicio
                                </MuiLink>

                                {selectedCategory && selectedCategory.name && selectedCategory.name !== 'Todos los productos' && (
                                    <MuiLink
                                        component={Link}
                                        underline="hover"
                                        color="inherit"
                                        href={`/product-list?category=${selectedCategory.slug || selectedCategory.name.toLowerCase()}`}
                                    >
                                        {selectedCategory.name}
                                    </MuiLink>
                                )}

                                {selectedSubcategory && selectedSubcategory.name && (
                                    <Typography color="text.primary">
                                        {selectedSubcategory.name}
                                    </Typography>
                                )}
                            </Breadcrumbs>
                        </Box>

                        {/* Controles */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            justifyContent: { xs: 'flex-end', md: 'flex-end' },
                            minWidth: { xs: 'auto', md: '320px' }
                        }}>
                            <Tooltip title={gridView === 'grid4' ? "Ver 2 por fila" : "Ver 4 por fila"}>
                                <IconButton
                                    onClick={toggleGridView}
                                    size="large"
                                    sx={{
                                        border: '1px solid rgba(0,0,0,0.12)',
                                        borderRadius: '8px',
                                        p: 1,
                                        color: vistelicaColors.primary
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

                    {/* Filtros activos */}
                    {hasActiveFilters() && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, mb: 3 }}>
                            {/* Chips para subcategorías */}
                            {filters.subcategories.map(subcatId => {
                                const subcat = categorySubcategories.find(s => s.subcategory_id === subcatId);
                                return subcat && (
                                    <Chip
                                        key={`subcat-${subcatId}`}
                                        label={subcat.name || `Subcategoría ${subcatId}`}
                                        size="small"
                                        onDelete={() => {
                                            setFilters(prev => ({
                                                ...prev,
                                                subcategories: prev.subcategories.filter(id => id !== subcatId)
                                            }));
                                        }}
                                    />
                                );
                            })}

                            {/* Otras chips de filtros */}
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

                    <Divider sx={{ mb: 3 }} />

                    {/* Grid de productos */}
                    {loading ? (
                        <Box sx={{ textAlign: 'center', py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <CircularProgress color="primary" size={40} sx={{ mb: 2 }} />
                            <Typography>Cargando productos...</Typography>
                        </Box>
                    ) : filteredProducts.length > 0 ? (
                        <ProductGrid
                            products={filteredProducts}
                            gridView={gridView}
                            onAddToWishlist={handleAddToWishlist}
                            favoriteIds={favoriteIds}
                        />
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

            {/* Toast de confirmación */}
            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={() => setToast(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setToast(prev => ({ ...prev, open: false }))}
                    severity={toast.severity}
                    sx={{ width: '100%' }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ProductList;