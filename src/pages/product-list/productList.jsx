"use client"

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Box, Typography, Button, Divider, Chip, IconButton, GlobalStyles,
    Tooltip, Breadcrumbs, Link as MuiLink, CircularProgress,
    Snackbar, Alert, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import HomeIcon from '@mui/icons-material/Home';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';
import Breadcrumb from './components/Breadcrumb';

// Importación del Navbar
import HeaderComponent from '@/components/layout/HeaderComponent';

// Servicios y utilidades
import wishlistService from '@/services/wishlistService';
import categoryService from '@/services/categoryService';
import { sortProducts } from '../../components/productlist/SortUtils';
import { COLORS, BRANDS, SIZES } from '../../components/productlist/filterOptions';
// Componentes
import ProductGrid from './components/ProductGrid';
import SortDropdown from './components/SortDropdown';
import FilterSidebar from './components/FilterSidebar';
import { vistelicaColors } from '../../components/shared/vistelicaColors';
import productService from "@/services/productService";
import { typography } from "@/components/shared/themePrimitives";

const ProductList = () => {
// Router y parámetros de búsqueda optimizados
    const router = useRouter();
    const searchParams = useSearchParams();
    const gender = searchParams.get('gender');
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const subcategoryName = searchParams.get('name');
    const theme = useTheme();

// Detección mejorada de dispositivos para mejor responsividad
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

// Estados organizados por categoría funcional
// Estados de productos
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [topRatedProducts, setTopRatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [refreshing, setRefreshing] = useState({ active: false, message: '' });

// Estados de categorización
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [categorySubcategories, setCategorySubcategories] = useState([]);
    const [loadingSubcategories, setLoadingSubcategories] = useState(false);

// Estados UI y filtros
    const [showFilters, setShowFilters] = useState(!isMobile);
    const [sortOption, setSortOption] = useState('relevancia');
    const [gridView, setGridView] = useState(isMobile ? 'grid2' : 'grid4');
    const [filters, setFilters] = useState({
        brands: [],
        colors: [],
        ratings: [],
        sizes: [],
        priceMin: '',
        priceMax: '',
        subcategories: [],
        lowStock: false,
        hasDiscount: false,
    });
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

// Estados de usuario
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [favoriteIds, setFavoriteIds] = useState([]);

// Estados de paginación adaptativa según dispositivo
    const [itemsPerPage, setItemsPerPage] = useState(
        isMobile ? 8 : (isTablet ? 9 : 12)
    );
    const [currentPage, setCurrentPage] = useState(
        parseInt(searchParams.get('page') || '1', 10)
    );

// Optimización de cálculos de paginación con useMemo
    const paginationData = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;

        return {
            currentItems: filteredProducts.slice(indexOfFirstItem, indexOfLastItem),
            totalPages: Math.ceil(filteredProducts.length / itemsPerPage),
            totalProducts: filteredProducts.length
        };
    }, [filteredProducts, currentPage, itemsPerPage]);

// Destructuración para código más limpio
    const { currentItems, totalPages } = paginationData;

// Navegación de página optimizada con useCallback y efectos visuales
    const nextPage = useCallback(() => {
        if (currentPage < totalPages) {
            // Indicación visual de cambio de página
            setRefreshing({
                active: true,
                message: 'Cargando siguiente página...'
            });

            // Actualizar URL para permitir compartir/navegación por historial
            const nextURL = new URL(window.location);
            nextURL.searchParams.set('page', currentPage + 1);
            window.history.pushState({}, '', nextURL);

            setCurrentPage(prev => prev + 1);

            // Scroll suave adaptado para todos los navegadores
            if ('scrollBehavior' in document.documentElement.style) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                window.scrollTo(0, 0);
            }

            // Quitar indicador después de tiempo suficiente para transición
            setTimeout(() => {
                setRefreshing({ active: false, message: '' });
            }, 500);
        }
    }, [currentPage, totalPages]);

    const prevPage = useCallback(() => {
        if (currentPage > 1) {
            setRefreshing({
                active: true,
                message: 'Cargando página anterior...'
            });

            // Gestión de URL limpia (eliminar parámetro en página 1)
            const prevURL = new URL(window.location);
            if (currentPage === 2) {
                prevURL.searchParams.delete('page');
            } else {
                prevURL.searchParams.set('page', currentPage - 1);
            }
            window.history.pushState({}, '', prevURL);

            setCurrentPage(prev => prev - 1);

            if ('scrollBehavior' in document.documentElement.style) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                window.scrollTo(0, 0);
            }

            setTimeout(() => {
                setRefreshing({ active: false, message: '' });
            }, 500);
        }
    }, [currentPage]);

// Aplicación inteligente de filtros desde URL con caché
    useEffect(() => {
        const urlFilter = searchParams.get('filter');
        if (!urlFilter || products.length === 0) return;

        // Evitar recargar filtros ya aplicados
        const cacheKey = `filter_applied_${urlFilter}`;
        if (sessionStorage.getItem(cacheKey)) return;

        const applyFilter = () => {
            setRefreshing({
                active: true,
                message: 'Aplicando filtros...'
            });

            setFilters(prevFilters => {
                const newFilters = { ...prevFilters };
                let filterMessage = '';

                switch (urlFilter) {
                    case 'lowStock':
                        newFilters.lowStock = true;
                        filterMessage = 'Mostrando últimas unidades';
                        break;
                    case 'hasDiscount':
                        newFilters.hasDiscount = true;
                        filterMessage = 'Mostrando productos en oferta';
                        break;
                    case 'topRated':
                        loadTopRatedProducts();
                        filterMessage = 'Mostrando productos mejor valorados';
                        break;
                }

                // Feedback visual tipográficamente consistente
                if (filterMessage) {
                    setTimeout(() => {
                        setRefreshing({ active: false, message: '' });
                        setToast({
                            open: true,
                            message: filterMessage,
                            severity: 'info'
                        });
                    }, 600);
                }

                return newFilters;
            });

            // Caché para evitar re-aplicar filtros
            sessionStorage.setItem(cacheKey, 'true');
        };

        setTimeout(applyFilter, 100);
    }, [searchParams, products.length]);


    const getAvailableSizes = (products) => {
        const sizeSet = new Set();
        products.forEach(product => {
            if (product.sizes && Array.isArray(product.sizes)) {
                product.sizes.forEach(size => sizeSet.add(size));
            }
        });
        return Array.from(sizeSet);
    };



// Limpieza eficiente de filtros URL con retroalimentación visual
    const clearURLFilters = useCallback(() => {
        const currentURL = new URL(window.location);
        const hadFilter = currentURL.searchParams.has('filter');

        currentURL.searchParams.delete('filter');
        window.history.replaceState({}, '', currentURL);

        // Limpiar caché de filtros aplicados
        Object.keys(sessionStorage).forEach(key => {
            if (key.startsWith('filter_applied_')) {
                sessionStorage.removeItem(key);
            }
        });

        // Confirmar visualmente la acción al usuario
        if (hadFilter) {
            setToast({
                open: true,
                message: 'Filtros eliminados',
                severity: 'success'
            });
        }
    }, []);

// Breadcrumbs enriquecidos con tipografía consistente
    const getBreadcrumbItems = useCallback(() => {
        const items = [];
        const urlFilter = searchParams.get('filter');

        // Mapa de filtros a etiquetas con estilos tipográficos
        const filterLabels = {
            'topRated': {
                label: 'Productos Mejor Valorados',
                href: '#',
                sx: {
                    fontFamily: typography.fontFamily,
                    fontWeight: 500,
                    fontSize: { xs: '0.9rem', md: '1rem' }
                }
            },
            'lowStock': {
                label: 'Últimas Unidades',
                href: '#',
                sx: {
                    fontFamily: typography.fontFamily,
                    fontWeight: 500,
                    fontSize: { xs: '0.9rem', md: '1rem' }
                }
            },
            'hasDiscount': {
                label: 'Productos en Oferta',
                href: '#',
                sx: {
                    fontFamily: typography.fontFamily,
                    fontWeight: 500,
                    fontSize: { xs: '0.9rem', md: '1rem' }
                }
            }
        };

        if (urlFilter && filterLabels[urlFilter]) {
            items.push(filterLabels[urlFilter]);
        } else if (selectedSubcategory?.name) {
            items.push({
                label: selectedSubcategory.name,
                href: '#',
                sx: {
                    fontFamily: typography.fontFamily,
                    fontWeight: 500,
                    fontSize: { xs: '0.9rem', md: '1rem' }
                }
            });
        } else if (gender) {
            items.push({
                label: gender.charAt(0).toUpperCase() + gender.slice(1),
                href: `/product-list?gender=${gender}`,
                sx: {
                    fontFamily: typography.fontFamily,
                    fontWeight: 500,
                    fontSize: { xs: '0.9rem', md: '1rem' }
                }
            });
        }

        return items;
    }, [searchParams, selectedSubcategory, gender]);

    // Primero definimos closeSidebar
    const closeSidebar = useCallback(() => {
        document.documentElement.style.setProperty('--SideNavigation-slideIn', '0');

        if (isMobile) {
            // Eliminar TODOS los overlays posibles (por si hubiera alguno duplicado)
            const overlay = document.getElementById('sidebar-overlay');

            // Eliminar inmediatamente cualquier overlay existente sin animación
            if (overlay) {
                document.body.style.overflow = '';
                overlay.remove();
            }

            // Buscar si hay otros overlays residuales con la misma apariencia
            const allOverlays = document.querySelectorAll('div[style*="z-index: 98"]');
            if (allOverlays.length > 0) {
                allOverlays.forEach(el => el.remove());
            }

            // Restaurar el scroll del body
            document.body.style.overflow = '';

            // Cambiar el estado para cerrar el sidebar
            setShowFilters(false);
        } else {
            setShowFilters(false);
        }
    }, [isMobile]);

// Después definimos openSidebar, que puede usar closeSidebar
    const openSidebar = useCallback(() => {
        document.documentElement.style.setProperty('--SideNavigation-slideIn', '1');

        if (isMobile) {
            // Solo bloquear scroll de página sin crear overlay
            document.body.style.overflow = 'hidden';
        }

        setShowFilters(true);
    }, [isMobile]);

// Carga optimizada de productos top-rated con caché y retroalimentación
    const loadTopRatedProducts = useCallback(async () => {
        // Evitar cargas duplicadas
        if (window._loadingTopRated) return;
        window._loadingTopRated = true;

        try {
            setLoading(true);
            setRefreshing({
                active: true,
                message: 'Cargando productos destacados...'
            });

            // Verificar caché para mejorar rendimiento
            const cacheKey = 'top_rated_products_cache';
            const cachedData = sessionStorage.getItem(cacheKey);

            if (cachedData) {
                const { data, timestamp } = JSON.parse(cachedData);
                const isRecent = Date.now() - timestamp < 5 * 60 * 1000; // 5 minutos

                if (isRecent) {
                    setTopRatedProducts(data);
                    setFilteredProducts(data);
                    setProducts(data);
                    return;
                }
            }

            // Uso de AbortController para cancelar peticiones redundantes
            const controller = new AbortController();
            const signal = controller.signal;

            // Peticiones paralelas para optimizar tiempo de carga
            const [topRated, images] = await Promise.all([
                productService.getTopRatedFeaturedProducts(signal),
                productService.getMainProductImages(signal)
            ]);

            // Optimizar mapa de imágenes para búsqueda O(1)
            const imagesMap = {};
            if (Array.isArray(images)) {
                images.forEach(img => {
                    const productId = String(img.product_id);
                    const imageUrl = img.image_url.startsWith('http')
                        ? img.image_url
                        : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${img.image_url}`;
                    imagesMap[productId] = imageUrl;
                });
            }

            // Enriquecimiento de productos con tipografía y estilos visuales
            const productsWithImages = topRated.map(product => {
                const productId = String(product.product_id || product._id);
                return {
                    ...product,
                    imageUrl: imagesMap[productId] || '/placeholder-image.jpg',
                    // Propiedades tipográficas consistentes
                    titleProps: {
                        fontFamily: typography.fontFamily,
                        fontWeight: 400
                    },
                    priceProps: {
                        fontFamily: typography.fontFamily,
                        fontWeight: 500
                    }
                };
            });

            // Actualizar estados y caché
            setTopRatedProducts(productsWithImages);
            setFilteredProducts(productsWithImages);
            setProducts(productsWithImages);

            sessionStorage.setItem(cacheKey, JSON.stringify({
                data: productsWithImages,
                timestamp: Date.now()
            }));

        } catch (error) {
            console.error('Error al cargar productos destacados:', error);
            setToast({
                open: true,
                message: 'No se pudieron cargar los productos destacados',
                severity: 'error'
            });
        } finally {
            setLoading(false);
            setRefreshing({ active: false, message: '' });
            window._loadingTopRated = false;
        }
    }, []);

// Reset de página al cambiar filtros con animación y SEO-friendly
    useEffect(() => {
        if (currentPage !== 1) {
            // Animación suave al cambiar filtros
            setRefreshing({
                active: true,
                message: 'Aplicando filtros...'
            });

            // Actualizar URL limpiamente
            const currentURL = new URL(window.location);
            currentURL.searchParams.delete('page');
            window.history.replaceState({}, '', currentURL);

            setCurrentPage(1);

            setTimeout(() => {
                setRefreshing({ active: false, message: '' });
            }, 500);
        }
    }, [filters, sortOption, itemsPerPage]);

// Toggle vista cuadrícula con animación y adaptado a dispositivo
    const toggleGridView = useCallback(() => {
        // Evitar cambios en móvil (siempre grid2)
        if (isMobile) return;

        // Añadir clase para transición visual suave
        const gridContainer = document.querySelector('.products-container');
        if (gridContainer) {
            gridContainer.classList.add('grid-transition');
            setTimeout(() => {
                gridContainer.classList.remove('grid-transition');
            }, 300);
        }

        const newView = gridView === 'grid4' ? 'grid2' : 'grid4';
        setGridView(newView);

        // Guardar preferencia de usuario
        localStorage.setItem('vistelica_grid_preference', newView);
    }, [gridView, isMobile]);



// Carga eficiente de categorías con memoria caché - Optimizado
    useEffect(() => {
        // Indicador para evitar actualizar estado en componentes desmontados
        let isMounted = true;
        // Mejorar el feedback visual durante la carga
        const loadingTimeout = setTimeout(() => {
            if (isMounted && !categories.length) {
                setLoading(prev => prev || true);
            }
        }, 200);

        const fetchCategories = async () => {
            try {
                // Intentar recuperar datos de caché
                const cacheKey = 'vistelica_categories_v2';
                const cachedData = sessionStorage.getItem(cacheKey);

                if (cachedData) {
                    const parsedCache = JSON.parse(cachedData);
                    if (isMounted) {
                        setCategories(parsedCache);
                        processSubcategories(parsedCache);
                    }
                } else {
                    // Petición con cancelación para evitar fugas de memoria
                    const controller = new AbortController();
                    const signal = controller.signal;
                    const categories = await categoryService.fetchCategories(signal);

                    if (isMounted) {
                        setCategories(categories);
                        // Cachear para futuras visitas
                        sessionStorage.setItem(cacheKey, JSON.stringify(categories));
                        processSubcategories(categories);
                    }

                    return () => controller.abort();
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Error al cargar categorías:', err);

                    if (isMounted) {
                        // Mensaje de error con tipografía consistente
                        setToast({
                            open: true,
                            message: 'No pudimos cargar las categorías',
                            severity: 'error'
                        });
                    }
                }
            } finally {
                if (isMounted) setLoading(false);
                clearTimeout(loadingTimeout);
            }
        };

        // Procesar subcategorías de manera optimizada
        const processSubcategories = (categories) => {
            if (!isMounted) return;

            // Usar un Map para buscar más eficiente
            const allSubcats = [];

            categories.forEach(category => {
                if (category.subcategories?.length > 0) {
                    allSubcats.push(...category.subcategories.map(subcat => ({
                        ...subcat,
                        parentCategory: category.name,
                        parentCategoryId: category.category_id,
                        parentSlug: category.slug || category.name.toLowerCase(),
                        gender: category.gender,
                        // Tipografía consistente para UI
                        typographyProps: {
                            fontFamily: typography.fontFamily
                        }
                    })));
                }
            });

            setSubcategories(allSubcats);

            // Procesamiento de categoría actual optimizado
            if (category) {
                const foundCategory = categories.find(c =>
                    c.slug === category ||
                    c.name.toLowerCase() === category.toLowerCase() ||
                    c.category_id === parseInt(category)
                );

                if (foundCategory && isMounted) {
                    setSelectedCategory(foundCategory);
                    loadCategorySubcategories(foundCategory.category_id);
                }
            }
        };

        fetchCategories();

        return () => {
            isMounted = false;
            clearTimeout(loadingTimeout);
        };
    }, [category]);

// Carga optimizada de subcategorías con caché
    const loadCategorySubcategories = async (categoryId) => {
        if (!categoryId) return [];

        setLoadingSubcategories(true);

        try {
            // Implementación de caché para subcategorías
            const cacheKey = `vistelica_subcategories_${categoryId}`;
            const cachedSubcats = sessionStorage.getItem(cacheKey);

            if (cachedSubcats) {
                const parsedSubcats = JSON.parse(cachedSubcats);
                setCategorySubcategories(parsedSubcats);
                setLoadingSubcategories(false);
                return parsedSubcats;
            }

            // Usar AbortController para cancelar peticiones pendientes
            const controller = new AbortController();
            const signal = controller.signal;

            const subcats = await categoryService.getSubcategoriesByCategory(categoryId, signal);

            // Aplicar tipografía al resultado
            const formattedSubcats = subcats.map(subcat => ({
                ...subcat,
                typographyProps: {
                    fontFamily: typography.fontFamily
                }
            }));

            // Guardar en caché
            sessionStorage.setItem(cacheKey, JSON.stringify(formattedSubcats));
            setCategorySubcategories(formattedSubcats);

            return formattedSubcats;
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error(`Error al cargar subcategorías para categoría ${categoryId}:`, error);

                // UI para error con tipografía consistente
                setToast({
                    open: true,
                    message: 'No se pudieron cargar las subcategorías',
                    severity: 'error'
                });
            }

            return [];
        } finally {
            setLoadingSubcategories(false);
        }
    };

// Gestión de favoritos optimizada - compatible con dispositivos móviles
    useEffect(() => {
        let isMounted = true;
        let loadingTimeout;

        // Indicador visual para móviles
        if (window.innerWidth < 768) {
            loadingTimeout = setTimeout(() => {
                if (isMounted) {
                    setRefreshing({
                        active: true,
                        message: 'Cargando favoritos...'
                    });
                }
            }, 100);
        }

        const loadFavorites = async () => {
            try {
                if (isAuthenticated) {
                    // Para usuarios autenticados
                    const controller = new AbortController();
                    const signal = controller.signal;

                    try {
                        const wishlistItems = await wishlistService.getWishlist(signal);

                        if (isMounted) {
                            const ids = wishlistItems.map(item => item.product_id);
                            setFavoriteIds(ids);
                        }
                    } catch (error) {
                        if (error.name !== 'AbortError') {
                            console.error("Error al cargar favoritos:", error);

                            // Mostrar mensaje sutilmente
                            if (isMounted) {
                                setToast({
                                    open: true,
                                    message: 'No pudimos cargar tus favoritos',
                                    severity: 'warning'
                                });
                            }
                        }
                    }

                    return () => controller.abort();
                } else {
                    // Para usuarios no autenticados - optimizado para dispositivos móviles
                    try {
                        const localWishlist = JSON.parse(localStorage.getItem('vistelica_wishlist') || '[]');
                        if (isMounted) {
                            const ids = localWishlist.map(item => item.id || item.product_id);
                            setFavoriteIds(ids);
                        }
                    } catch (storageError) {
                        console.error("Error al acceder localStorage:", storageError);
                        localStorage.setItem('vistelica_wishlist', '[]');
                        if (isMounted) setFavoriteIds([]);
                    }
                }
            } finally {
                if (isMounted) {
                    setRefreshing({ active: false, message: '' });
                }
                clearTimeout(loadingTimeout);
            }
        };

        loadFavorites();

        return () => {
            isMounted = false;
            clearTimeout(loadingTimeout);
        };
    }, [isAuthenticated]);

// Gestión de favoritos optimizada para interacción táctil/móvil
    const handleAddToWishlist = useCallback(async (product, isRemove) => {
        // Prevenir múltiples clics rápidos
        setRefreshing({
            active: true,
            message: isRemove ? 'Eliminando de favoritos...' : 'Añadiendo a favoritos...'
        });

        const productId = product.id || product.product_id;

        try {
            if (isAuthenticated) {
                // Gestión más rápida para usuarios autenticados
                if (isRemove) {
                    // Optimista: actualizar UI inmediatamente
                    setFavoriteIds(prev => prev.filter(id => id !== productId));

                    try {
                        await wishlistService.removeFromWishlist(productId);
                        setToast({
                            open: true,
                            message: 'Producto eliminado de favoritos',
                            severity: 'info'
                        });
                    } catch (error) {
                        // Revertir en caso de error
                        console.error("Error al eliminar:", error);
                        setFavoriteIds(prev => [...prev, productId]);
                        throw error;
                    }
                } else {
                    // Optimista: actualizar UI inmediatamente
                    if (!favoriteIds.includes(productId)) {
                        setFavoriteIds(prev => [...prev, productId]);
                    }

                    try {
                        await wishlistService.addToWishlist(productId);
                        setToast({
                            open: true,
                            message: 'Producto añadido a favoritos',
                            severity: 'success'
                        });
                    } catch (error) {
                        if (error.message?.includes("ya está en la lista de deseos")) {
                            setToast({
                                open: true,
                                message: 'Este producto ya está en tus favoritos',
                                severity: 'info'
                            });
                        } else {
                            // Solo revertir si fue un error real
                            console.error("Error al añadir:", error);
                            setFavoriteIds(prev => prev.filter(id => id !== productId));
                            throw error;
                        }
                    }
                }
            } else {
                // Para usuarios no autenticados - compatible con todos los dispositivos
                try {
                    let localWishlist = [];
                    try {
                        localWishlist = JSON.parse(localStorage.getItem('vistelica_wishlist') || '[]');
                    } catch (parseError) {
                        console.error("Error al leer localStorage:", parseError);
                        localWishlist = [];
                    }

                    if (isRemove) {
                        // Actualización optimista
                        setFavoriteIds(prev => prev.filter(id => id !== productId));

                        const updatedWishlist = localWishlist.filter(
                            item => (item.id || item.product_id) !== productId
                        );
                        localStorage.setItem('vistelica_wishlist', JSON.stringify(updatedWishlist));

                        setToast({
                            open: true,
                            message: 'Producto eliminado de favoritos',
                            severity: 'info'
                        });
                    } else {
                        if (!localWishlist.some(item => (item.id || item.product_id) === productId)) {
                            // Actualización optimista
                            setFavoriteIds(prev => [...prev, productId]);

                            const wishlistItem = {
                                id: productId,
                                product_id: productId,
                                name: product.name,
                                image_url: product.image_url || product.imageUrl,
                                price: product.price,
                                added_at: new Date().toISOString()
                            };

                            localWishlist.push(wishlistItem);
                            localStorage.setItem('vistelica_wishlist', JSON.stringify(localWishlist));
                            localStorage.setItem('wishlist_sessionId', sessionId);

                            setToast({
                                open: true,
                                message: 'Producto añadido a favoritos',
                                severity: 'success'
                            });
                        } else {
                            setToast({
                                open: true,
                                message: 'Este producto ya está en tus favoritos',
                                severity: 'info'
                            });
                        }
                    }
                } catch (storageError) {
                    console.error("Error con localStorage:", storageError);
                    throw storageError;
                }
            }
        } catch (error) {
            console.error("Error al procesar favoritos:", error);
            setToast({
                open: true,
                message: 'Error al procesar tu solicitud',
                severity: 'error'
            });
        } finally {
            setRefreshing({ active: false, message: '' });
        }
    }, [isAuthenticated, sessionId, favoriteIds]);

// Verificación segura de sesión - compatible con diferentes navegadores
    useEffect(() => {
        // Implementar un debounce para no bloquear renderizado inicial
        const initTimeout = setTimeout(() => {
            const initializeUserSession = () => {
                try {
                    const token = localStorage.getItem('token');
                    setIsAuthenticated(!!token);

                    if (!token) {
                        let sessionId;
                        try {
                            sessionId = localStorage.getItem('sessionId');
                        } catch (storageError) {
                            console.error("Error al acceder al localStorage:", storageError);
                        }

                        // Generación de ID segura y compatible con todos los navegadores
                        if (!sessionId) {
                            if (typeof crypto !== 'undefined') {
                                if (crypto.randomUUID) {
                                    sessionId = crypto.randomUUID();
                                } else if (window.crypto?.getRandomValues) {
                                    const arr = new Uint8Array(16);
                                    window.crypto.getRandomValues(arr);
                                    sessionId = Array.from(arr, b =>
                                        b.toString(16).padStart(2, '0')).join('');
                                } else {
                                    // Fallback para navegadores antiguos
                                    sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
                                }
                            } else {
                                sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
                            }

                            try {
                                localStorage.setItem('sessionId', sessionId);
                            } catch (storageError) {
                                console.error("Error al escribir en localStorage:", storageError);
                            }
                        }

                        setSessionId(sessionId);
                    }
                } catch (error) {
                    console.error("Error al inicializar sesión:", error);
                }
            };

            initializeUserSession();
        }, 10);

        return () => clearTimeout(initTimeout);
    }, []);
// Componente de indicador de carga optimizado
    const LoadingIndicator = () => (
        <Box sx={{
            position: 'fixed',
            top: { xs: '50%', md: '60px' },
            left: '50%',
            transform: { xs: 'translate(-50%, -50%)', md: 'translate(-50%, 0)' },
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.5,
            px: 3,
            py: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(5px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            fontFamily: typography.fontFamily,
            width: { xs: '80%', sm: 'auto' },
            maxWidth: '320px'
        }}>
            <CircularProgress size={36} sx={{ color: vistelicaColors.primary }} />
            <Typography
                variant="body2"
                sx={{
                    color: vistelicaColors.secondary,
                    fontFamily: typography.fontFamily,
                    fontSize: { xs: '0.85rem', md: '0.95rem' },
                    fontWeight: 500,
                    textAlign: 'center'
                }}
            >
                {refreshing.message || 'Cargando productos...'}
            </Typography>
        </Box>
    );

// En la interfaz (dentro del return), añadir el indicador de carga
    {refreshing.active && !loading && <LoadingIndicator />}


    // Actualizar subcategorías - Optimizado
    useEffect(() => {
        if (selectedCategory?.category_id) {
            const loadSubcategories = async () => {
                // Indicador visual de carga adaptado a pantalla
                setLoadingSubcategories(true);

                try {
                    // Verificar si ya tenemos datos en caché para evitar peticiones innecesarias
                    const cacheKey = `subcats_${selectedCategory.category_id}`;
                    const cached = sessionStorage.getItem(cacheKey);

                    if (cached) {
                        const parsedCache = JSON.parse(cached);
                        setCategorySubcategories(parsedCache);
                    } else {
                        // Uso de AbortController para cancelar peticiones si cambia la categoría
                        const controller = new AbortController();
                        const signal = controller.signal;

                        const subcats = await loadCategorySubcategories(selectedCategory.category_id, signal);

                        // Guardar en caché para futuras visitas
                        if (subcats.length > 0) {
                            sessionStorage.setItem(cacheKey, JSON.stringify(subcats));
                        }
                    }
                } catch (error) {
                    if (error.name !== 'AbortError') {
                        console.error(`Error al cargar subcategorías: ${error.message}`);
                        // Mostrar indicador de error con tipografía adecuada
                        setSubcategoryError({
                            message: 'No pudimos cargar las subcategorías',
                            retry: () => loadSubcategories()
                        });
                    }
                } finally {
                    setLoadingSubcategories(false);
                }
            };

            loadSubcategories();
        }
    }, [selectedCategory]);

// Carga de productos optimizada
    useEffect(() => {
        // Referencias para control y limpieza
        let isMounted = true;
        const abortController = new AbortController();
        const signal = abortController.signal;

        // Mostrar estado de carga con indicación visual adaptativa
        if (isInitialLoad) {
            setLoading(true);
        } else if (isMounted) {
            // Indicador de recarga parcial más sutil en dispositivos grandes
            setRefreshing({
                active: true,
                message: window.innerWidth > 768 ?
                    'Actualizando productos...' :
                    'Cargando...'
            });
        }

        // Función optimizada para obtención de datos
        const fetchProducts = async () => {
            if (!isMounted) return;

            try {
                // Implementación de caché para imágenes
                const cacheKey = 'product_images_cache_v1';
                let imagesMap = {};

                try {
                    // Intentar recuperar imágenes de caché
                    const cachedImages = sessionStorage.getItem(cacheKey);

                    if (cachedImages) {
                        imagesMap = JSON.parse(cachedImages);
                        console.info('⚡ Usando caché de imágenes');
                    } else {
                        console.time('⏱️ Carga de imágenes');
                        const images = await productService.getMainProductImages();

                        if (Array.isArray(images)) {
                            images.forEach(img => {
                                const productId = String(img.product_id);
                                const imageUrl = img.image_url.startsWith('http')
                                    ? img.image_url
                                    : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${img.image_url}`;

                                imagesMap[productId] = imageUrl;
                            });

                            // Guardar en caché para reducir peticiones
                            try {
                                sessionStorage.setItem(cacheKey, JSON.stringify(imagesMap));
                            } catch (cacheErr) {
                                console.warn('Caché no disponible:', cacheErr.message);
                            }
                        }
                        console.timeEnd('⏱️ Carga de imágenes');
                    }
                } catch (imgError) {
                    console.error("Error al cargar imágenes:", imgError);
                }

                // Estrategia optimizada de carga de datos
                let data = [];
                let foundSubcategory = null;
                let parentCategory = null;

                // Manejo optimizado basado en rutas
                if (subcategory) {
                    // Carga de subcategorías con optimización de búsqueda
                    const subcategoriesMap = new Map(
                        subcategories.map(s => [
                            String(s.subcategory_id), s
                        ])
                    );

                    foundSubcategory = subcategoriesMap.get(String(subcategory)) ||
                        subcategories.find(s => s.slug === subcategory);

                    if (foundSubcategory) {
                        // Búsqueda optimizada de categoría padre
                        parentCategory = categories.find(c =>
                            c.category_id === foundSubcategory.parentCategoryId ||
                            c.subcategories?.some(s =>
                                s.subcategory_id === parseInt(subcategory) ||
                                s.slug === subcategory
                            )
                        );

                        if (parentCategory && foundSubcategory) {
                            try {
                                console.time('🔍 Búsqueda por subcategoría');
                                data = await productService.getByCategoryAndSubcategory(
                                    parentCategory.category_id,
                                    foundSubcategory.subcategory_id,
                                    signal
                                );
                                console.timeEnd('🔍 Búsqueda por subcategoría');
                            } catch (err) {
                                // Manejo de error con carga alternativa degradada
                                if (err.name !== 'AbortError') {
                                    console.error("Error al obtener productos específicos:", err);
                                    console.info("⚠️ Usando fallback de filtrado local");

                                    data = await productService.getAll(signal);

                                    // Optimización de filtrado con función memoizada
                                    const filterBySubcategory = (product) => {
                                        const productSubcategory = product.subcategory ?
                                            (typeof product.subcategory === 'string' ?
                                                    product.subcategory.toLowerCase() :
                                                    String(product.subcategory).toLowerCase()
                                            ) : '';

                                        return productSubcategory === foundSubcategory.name.toLowerCase() ||
                                            productSubcategory === subcategoryName?.toLowerCase();
                                    };

                                    data = data.filter(filterBySubcategory);
                                }
                            }
                        } else {
                            const fallbackData = await productService.getAll(signal);
                            data = fallbackData.filter(p => {
                                const pSubcat = p.subcategory ? String(p.subcategory).toLowerCase() : '';
                                return pSubcat === foundSubcategory.name.toLowerCase();
                            });
                        }
                    } else {
                        const fallbackData = await productService.getAll(signal);
                        data = fallbackData.filter(p => {
                            const pSubcat = p.subcategory ? String(p.subcategory).toLowerCase() : '';
                            return pSubcat === subcategoryName?.toLowerCase();
                        });
                    }

                    // Actualización segura para evitar problemas de memoria
                    if (isMounted) {
                        setSelectedSubcategory(foundSubcategory || {
                            name: subcategoryName || "Subcategoría",
                            fontFamily: typography.fontFamily
                        });
                        setSelectedCategory(parentCategory || {
                            name: "Categoría",
                            fontFamily: typography.fontFamily
                        });
                    }
                }
                // Manejo optimizado para categoría única
                else if (category) {
                    const categoryObj = categories.find(c =>
                        c.slug === category ||
                        c.name.toLowerCase() === category.toLowerCase() ||
                        c.category_id === parseInt(category)
                    );

                    if (categoryObj) {
                        // Optimización para filtros de subcategorías seleccionadas
                        if (filters.subcategories?.length > 0) {
                            const allProducts = [];

                            // Carga paralela para mejorar rendimiento en dispositivos potentes
                            const loadPromises = filters.subcategories.map(subcat =>
                                productService.getByCategoryAndSubcategory(
                                    categoryObj.category_id,
                                    subcat,
                                    signal
                                ).catch(err => {
                                    if (err.name !== 'AbortError') {
                                        console.error(`Error con subcategoría ${subcat}:`, err);
                                    }
                                    return [];
                                })
                            );

                            const results = await Promise.allSettled(loadPromises);
                            results.forEach(result => {
                                if (result.status === 'fulfilled') {
                                    allProducts.push(...result.value);
                                }
                            });

                            data = allProducts;
                        } else {
                            const allData = await productService.getAll(signal);

                            // Optimización del filtrado
                            const categoryLower = categoryObj.name.toLowerCase();
                            data = allData.filter(p => {
                                const pCat = typeof p.category === 'string' ?
                                    p.category.toLowerCase() :
                                    String(p.category || '').toLowerCase();
                                return pCat === categoryLower;
                            });
                        }

                        if (isMounted) {
                            setSelectedCategory({
                                ...categoryObj,
                                fontFamily: typography.fontFamily
                            });
                            setSelectedSubcategory(null);
                        }
                    } else {
                        data = await productService.getAll(signal);
                    }
                } else {
                    data = await productService.getAll(signal);

                    if (isMounted) {
                        setSelectedCategory({
                            name: gender
                                ? `${gender.charAt(0).toUpperCase()}${gender.slice(1)}`
                                : 'Todos los productos',
                            fontFamily: typography.fontFamily
                        });
                        setSelectedSubcategory(null);
                    }
                }

                // Filtrado por género optimizado
                if (gender) {
                    const genderLower = gender.toLowerCase();
                    data = data.filter(p => {
                        const pGender = typeof p.gender === 'string'
                            ? p.gender.toLowerCase()
                            : String(p.gender || '').toLowerCase();
                        return pGender === genderLower;
                    });
                }

                if (isMounted) {
                    // Procesamiento de imágenes optimizado para rendimiento
                    console.time('⏱️ Asociación de imágenes');
                    const productsWithImages = data.map(product => {
                        const productId = String(product.product_id || product._id);
                        return {
                            ...product,
                            imageUrl: imagesMap[productId] || '/placeholder-product.jpg',
                            // Aplicar tipografía consistente a elementos clave
                            typography: {
                                fontFamily: typography.fontFamily
                            }
                        };
                    });
                    console.timeEnd('⏱️ Asociación de imágenes');

                    // Uso de requestAnimationFrame para evitar bloquear el hilo principal
                    requestAnimationFrame(() => {
                        if (isMounted) {
                            setProducts(productsWithImages);
                            setFilteredProducts(productsWithImages);
                            setIsInitialLoad(false);
                        }
                    });

                    // Analítica de rendimiento
                    const perfData = {
                        loadTime: Date.now() - performance.now(),
                        itemCount: productsWithImages.length
                    };
                    console.info('📊 Metrics:', perfData);
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Error al cargar productos:', err);

                    if (isMounted) {
                        setIsInitialLoad(false);
                        setError({
                            message: 'No pudimos cargar los productos',
                            retry: fetchProducts,
                            fontFamily: typography.fontFamily
                        });
                    }
                }
            } finally {
                if (isMounted) {
                    if (isInitialLoad) {
                        setLoading(false);
                    }
                    setRefreshing({ active: false, message: '' });
                }
            }
        };

        // Uso de timeout para darle tiempo al navegador a renderizar la UI antes de cargar
        const timeoutId = setTimeout(() => {
            requestAnimationFrame(fetchProducts);
        }, 10);

        // Limpieza para evitar fugas de memoria
        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
            abortController.abort();
        };
    }, [gender, category, subcategory, subcategoryName, categories.length, subcategories.length, filters.subcategories]);

    // Aplicar filtros al cambiar los criterios - Optimizado
    useEffect(() => {
        // Usar un callback de efecto para mejorar el rendimiento
        const applyFilters = () => {
            const urlFilter = searchParams.get('filter');

            // Evitar procesamiento innecesario
            if (urlFilter === 'topRated' || products.length === 0) {
                return;
            }

            // Usar una función de filtrado más eficiente
            try {
                console.time('filtrado'); // Para medir rendimiento

                let result = [...products];

                // Filtro por marcas
                if (filters.brands.length > 0) {
                    const brandsSet = new Set(filters.brands); // Uso de Set para búsquedas más rápidas
                    result = result.filter(p => brandsSet.has(p.brand));
                }

                // Filtro por colores - optimizado
                if (filters.colors.length > 0) {
                    const colorsSet = new Set(filters.colors);
                    result = result.filter(p =>
                        p.colors?.some(c => colorsSet.has(c))
                    );
                }

                // Filtro por tallas - optimizado
                if (filters.sizes.length > 0) {
                    const sizesSet = new Set(filters.sizes);
                    result = result.filter(p =>
                        p.sizes?.some(s => sizesSet.has(s))
                    );
                }

        if (filters.ratings.length > 0) {
            result = result.filter(product => {
                const productRating = parseFloat(product.average_rating) || 0;

                return filters.ratings.some(selectedRating => {
                    if (selectedRating === 5) {
                        // Para 5 estrellas: exactamente 5.0
                        return productRating === 5.0;
                    } else {
                        // Para 1-4 estrellas: rango de X.0 a X.99
                        return productRating >= selectedRating && productRating < selectedRating + 1;
                    }
                });
            });
        }

                // Filtros de precio - con validaciones robustas
                if (filters.priceMin !== '') {
                    const minPrice = parseFloat(filters.priceMin);
                    if (!isNaN(minPrice)) {
                        result = result.filter(p => parseFloat(p.price || 0) >= minPrice);
                    }
                }

                if (filters.priceMax !== '') {
                    const maxPrice = parseFloat(filters.priceMax);
                    if (!isNaN(maxPrice)) {
                        result = result.filter(p => parseFloat(p.price || 0) <= maxPrice);
                    }
                }

                // Filtros de descuento y stock
                if (filters.hasDiscount) {
                    result = result.filter(p => parseFloat(p.discount_percentage || 0) > 0);
                }

                if (filters.lowStock) {
                    result = result.filter(p => (p.stock_quantity || 0) <= 15);
                }

                // Ordenamiento
                if (sortOption !== 'relevancia') {
                    result = sortProducts(result, sortOption);
                }

                console.timeEnd('filtrado');
                setFilteredProducts(result);

            } catch (error) {
                console.error("Error al aplicar filtros:", error);
                // Fallback en caso de error
                setFilteredProducts(products);
            }
        };

        // Uso de requestAnimationFrame para evitar bloqueo de UI en dispositivos móviles
        const timeoutId = setTimeout(() => {
            requestAnimationFrame(applyFilters);
        }, 10);

        return () => clearTimeout(timeoutId);
    }, [filters, sortOption, products, searchParams]);

// Resetear filtros - Optimizado
    const resetFilters = useCallback(() => {
        // Uso de useCallback para evitar recreaciones innecesarias de la función
        setFilters({
            brands: [],
            colors: [],
            sizes: [],
            ratings: [],
            priceMin: '',
            priceMax: '',
            subcategories: [],
            lowStock: false,
            hasDiscount: false,
        });

        setSortOption('relevancia');
        clearURLFilters();

        const urlFilter = searchParams.get('filter');
        if (urlFilter === 'topRated') {
            // Mostrar indicador de carga antes de redirigir
            setLoading(true);
            // Utilizar router para navegación más limpia en lugar de window.location
            router.push('/product-list/productList');
        }

        // Opcional: mostrar confirmación visual de reseteo
        setToast({
            open: true,
            message: 'Filtros restablecidos',
            severity: 'info'
        });

    }, [searchParams, router, clearURLFilters, setLoading, setToast]);

// Verificar si hay filtros activos - Optimizado
    const hasActiveFilters = useCallback(() => {
        // Optimizado para ejecución más rápida y con lógica más clara
        return !!(
            filters.brands.length ||
            filters.colors.length ||
            filters.sizes.length ||
            filters.ratings.length ||
            filters.priceMin ||
            filters.priceMax ||
            filters.subcategories.length ||
            sortOption !== 'relevancia' ||
            filters.lowStock ||
            filters.hasDiscount
        );
    }, [filters, sortOption]);

// Obtener título para la página - Optimizado
    const getPageTitle = useCallback(() => {
        const urlFilter = searchParams.get('filter');

        // Estructura más clara con objetos para mapear títulos
        const filterTitles = {
            topRated: 'Productos Mejor Valorados',
            lowStock: 'Últimas Unidades',
            hasDiscount: 'Productos en Oferta'
        };

        if (urlFilter && filterTitles[urlFilter]) {
            return filterTitles[urlFilter];
        }

        if (selectedSubcategory?.name) {
            return selectedSubcategory.name;
        }

        if (selectedCategory?.name) {
            return selectedCategory.name;
        }

        return gender
            ? `${gender.charAt(0).toUpperCase()}${gender.slice(1)}`
            : 'Productos';
    }, [searchParams, selectedSubcategory, selectedCategory, gender]);

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
                {/* Sidebar con filtros - Optimizado */}
                <Box
                    sx={{
                        position: { xs: 'fixed', md: 'sticky' },
                        top: { xs: 0, md: '64px' },
                        left: { xs: showFilters ? 0 : '-100%', md: 0 },
                        height: { xs: '100vh', md: 'calc(100vh - 64px)' },
                        width: { xs: '270px', md: showFilters ? 'var(--Sidebar-width)' : '0px' },
                        backgroundColor: 'white',
                        zIndex: { xs: 1200, md: 100 },
                        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: {
                            xs: showFilters ? '0 2px 15px rgba(0,0,0,0.15)' : 'none',
                            md: 'none'
                        },
                        overflowY: 'auto',
                        flexShrink: 0,
                        overflowX: 'hidden',
                        borderRight: `1px solid ${vistelicaColors.primary}10`,
                        '& *': {
                            fontFamily: typography.fontFamily
                        },
                        scrollbarWidth: 'thin',
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: `${vistelicaColors.primary}40`,
                            borderRadius: '6px',
                        }
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
                        products={products}
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
                        availableSizes={getAvailableSizes(filteredProducts)}
                    />
                </Box>

                {/* Contenido principal - Optimizado */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        width: { xs: '100%', md: showFilters ? 'calc(100% - var(--Sidebar-width))' : '100%' },
                        ml: { xs: 0 },
                        transition: 'margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1), width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                        px: { xs: 1.5, sm: 3, md: 4 },
                        '& *': {
                            fontFamily: typography.fontFamily
                        }
                    }}
                >
                    {/* Título centrado - Optimizado */}
                    <Box sx={{
                        textAlign: 'center',
                        mb: { xs: 2, sm: 3 },
                        pb: { xs: 1, sm: 2 },
                        borderBottom: `1px solid ${vistelicaColors.primary}10`,
                        maxWidth: { sm: '600px', md: '900px' },
                        mx: 'auto'
                    }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            fontWeight="bold"
                            fontSize={{ xs: '1.7rem', sm: '2rem', md: '2.5rem' }}

                            sx={{
                                fontFamily: typography.fontFamily,
                                color: vistelicaColors.secondary,
                                fontWeight: 500,
                                mb: 0.5
                            }}
                        >
                            {getPageTitle()}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'text.secondary',
                                mt: 0.5,
                                fontFamily: typography.fontFamily,
                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 0.5
                            }}
                        >
                            <Box component="span" sx={{
                                backgroundColor: `${vistelicaColors.primary}15`,
                                px: 1.5,
                                py: 0.25,
                                borderRadius: 4,
                                fontWeight: 500
                            }}>
                                {filteredProducts.length} productos
                            </Box>
                        </Typography>
                    </Box>

                    {/* Encabezado y controles */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', md: 'center' },
                        flexDirection: { xs: 'column', md: 'row' },
                        mb: { xs: 2, sm: 3 },
                        gap: { xs: 1.5, sm: 2 },
                        borderBottom: { xs: `1px solid ${vistelicaColors.primary}15`, md: 'none' },
                        pb: { xs: 2, md: 0 }
                    }}>
                        {/* Breadcrumb */}
                        <Box sx={{
                            flex: 1,
                            width: { xs: '100%', md: 'auto' },
                            overflow: 'auto',
                            '& .MuiBreadcrumbs-ol': {
                                fontFamily: typography.fontFamily
                            }
                        }}>
                            <Breadcrumb
                                items={getBreadcrumbItems()}
                                category={selectedCategory && selectedCategory.name !== 'Todos los productos' ? selectedCategory : null}
                                subcategory={selectedSubcategory}
                            />
                        </Box>

                        {/* Controles */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: { xs: 1, sm: 2 },
                            justifyContent: { xs: 'space-between', md: 'flex-end' },
                            flexWrap: 'wrap',
                            width: { xs: '100%', md: 'auto' },
                            minWidth: { xs: '100%', md: '320px' }
                        }}>
                            <Tooltip title={gridView === 'grid4' ? "Ver 2 por fila" : "Ver 4 por fila"}>
                                <IconButton
                                    onClick={toggleGridView}
                                    size="medium"
                                    sx={{
                                        border: `1px solid ${vistelicaColors.primary}30`,
                                        borderRadius: '8px',
                                        p: { xs: 0.75, sm: 1 },
                                        color: vistelicaColors.primary,
                                        '&:hover': {
                                            backgroundColor: `${vistelicaColors.primary}10`,
                                        }
                                    }}
                                    aria-label={gridView === 'grid4' ? "Cambiar a vista de 2 productos por fila" : "Cambiar a vista de 4 productos por fila"}
                                >
                                    {gridView === 'grid4' ? <ViewComfyIcon fontSize="small" /> : <ViewModuleIcon fontSize="small" />}
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
                                sx={{
                                    display: { xs: 'flex', md: 'none' },
                                    minWidth: 'auto',
                                    fontFamily: typography.fontFamily,
                                    fontSize: '0.85rem',
                                    borderRadius: '8px',
                                    py: 0.75,
                                    border: `1px solid ${vistelicaColors.primary}30`,
                                    '&:hover': {
                                        backgroundColor: `${vistelicaColors.primary}10`,
                                    }
                                }}
                            >
                                Filtros
                            </Button>

                            <Button
                                onClick={() => setShowFilters(!showFilters)}
                                color="inherit"
                                sx={{
                                    display: { xs: 'none', md: 'flex' },
                                    fontFamily: typography.fontFamily,
                                    fontSize: '0.9rem',
                                    borderRadius: '8px',
                                    py: 0.75,
                                    border: `1px solid ${vistelicaColors.primary}30`,
                                    '&:hover': {
                                        backgroundColor: `${vistelicaColors.primary}10`,
                                    }
                                }}
                            >
                                {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
                            </Button>

                            <Box sx={{
                                flexGrow: { xs: 1, md: 0 },
                                '& .MuiFormControl-root, & .MuiInputBase-root, & .MuiInputLabel-root, & .MuiMenuItem-root': {
                                    fontFamily: typography.fontFamily
                                }
                            }}>
                                <SortDropdown onSortChange={setSortOption} />
                            </Box>
                        </Box>
                    </Box>

                    {/* Filtros activos */}
                    {hasActiveFilters() && (
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: { xs: 0.5, sm: 1 },
                            mt: 1,
                            mb: 3,
                            p: { xs: 1, sm: 1.5 },
                            backgroundColor: 'rgba(250, 250, 250, 0.7)',
                            borderRadius: 2,
                            border: `1px solid ${vistelicaColors.primary}15`
                        }}>
                            {/* Etiqueta de filtros activos */}
                            <Typography
                                variant="body2"
                                component="span"
                                sx={{
                                    fontFamily: typography.fontFamily,
                                    fontWeight: 500,
                                    mr: 1,
                                    my: 0.5,
                                    color: vistelicaColors.secondary,
                                    display: { xs: 'none', sm: 'block' }
                                }}
                            >
                                Filtros activos:
                            </Typography>

                            {/* Chips para marcas */}
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
                                        sx={{
                                            m: 0.5,
                                            fontFamily: typography.fontFamily,
                                            fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                            '& .MuiChip-label': { px: { xs: 1, sm: 1.5 }, fontFamily: typography.fontFamily },
                                            '& .MuiChip-deleteIcon': { fontSize: { xs: '0.9rem', sm: '1rem' } },
                                            backgroundColor: `${vistelicaColors.primary}20`,
                                            borderColor: `${vistelicaColors.primary}40`,
                                            color: vistelicaColors.secondary,
                                            '&:hover': {
                                                backgroundColor: `${vistelicaColors.primary}30`,
                                            }
                                        }}
                                    />
                                );
                            })}

                            {/* Chips para colores */}
                            {filters.colors.map(colorId => {
                                const color = COLORS.find(c => c.id === colorId);

                                return (
                                    <Chip
                                        key={colorId}
                                        label={color?.label}
                                        size="small"
                                        onDelete={() => {
                                            setFilters(prev => ({
                                                ...prev,
                                                colors: prev.colors.filter(c => c !== colorId)
                                            }));
                                        }}
                                        sx={{
                                            m: 0.5,
                                            fontFamily: typography.fontFamily,
                                            fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                            '& .MuiChip-label': { px: { xs: 1, sm: 1.5 }, fontFamily: typography.fontFamily },
                                            '& .MuiChip-deleteIcon': { fontSize: { xs: '0.9rem', sm: '1rem' } },
                                            backgroundColor: `${vistelicaColors.primary}20`,
                                            borderColor: `${vistelicaColors.primary}40`,
                                            color: vistelicaColors.secondary,
                                            '&:hover': {
                                                backgroundColor: `${vistelicaColors.primary}30`,
                                            }
                                        }}
                                    />
                                );
                            })}

                            {/* Chips para tallas */}
                            {filters.sizes.map(sizeId => {
                                const size = SIZES.find(s => s.id === sizeId);
                                return (
                                    <Chip
                                        key={sizeId}
                                        label={size?.label || sizeId}
                                        size="small"
                                        onDelete={() => {
                                            setFilters(prev => ({
                                                ...prev,
                                                sizes: prev.sizes.filter(s => s !== sizeId)
                                            }));
                                        }}
                                        sx={{
                                            m: 0.5,
                                            fontFamily: typography.fontFamily,
                                            fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                            '& .MuiChip-label': { px: { xs: 1, sm: 1.5 }, fontFamily: typography.fontFamily },
                                            '& .MuiChip-deleteIcon': { fontSize: { xs: '0.9rem', sm: '1rem' } },
                                            backgroundColor: `${vistelicaColors.primary}20`,
                                            borderColor: `${vistelicaColors.primary}40`,
                                            color: vistelicaColors.secondary,
                                            '&:hover': {
                                                backgroundColor: `${vistelicaColors.primary}30`,
                                            }
                                        }}
                                    />
                                );
                            })}

                            {/* Chips para valoraciones */}
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
                                    sx={{
                                        m: 0.5,
                                        fontFamily: typography.fontFamily,
                                        fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                        '& .MuiChip-label': { px: { xs: 1, sm: 1.5 }, fontFamily: typography.fontFamily },
                                        '& .MuiChip-deleteIcon': { fontSize: { xs: '0.9rem', sm: '1rem' } },
                                        backgroundColor: `${vistelicaColors.primary}20`,
                                        borderColor: `${vistelicaColors.primary}40`,
                                        color: vistelicaColors.secondary,
                                        '&:hover': {
                                            backgroundColor: `${vistelicaColors.primary}30`,
                                        }
                                    }}
                                />
                            ))}

                            {/* Chip para rango de precios */}
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
                                    sx={{
                                        m: 0.5,
                                        fontFamily: typography.fontFamily,
                                        fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                        '& .MuiChip-label': { px: { xs: 1, sm: 1.5 }, fontFamily: typography.fontFamily },
                                        '& .MuiChip-deleteIcon': { fontSize: { xs: '0.9rem', sm: '1rem' } },
                                        backgroundColor: `${vistelicaColors.primary}20`,
                                        borderColor: `${vistelicaColors.primary}40`,
                                        color: vistelicaColors.secondary,
                                        '&:hover': {
                                            backgroundColor: `${vistelicaColors.primary}30`,
                                        }
                                    }}
                                />
                            )}

                            {/* Botón para limpiar todos los filtros */}
                            <Button
                                size="small"
                                onClick={resetFilters}
                                variant="outlined"
                                sx={{
                                    m: 0.5,
                                    minHeight: '24px',
                                    fontFamily: typography.fontFamily,
                                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                    borderColor: `${vistelicaColors.primary}60`,
                                    color: vistelicaColors.secondary,
                                    '&:hover': {
                                        backgroundColor: `${vistelicaColors.primary}10`,
                                        borderColor: vistelicaColors.primary,
                                    }
                                }}
                            >
                                Limpiar filtros
                            </Button>
                        </Box>
                    )}

                    <Divider sx={{ mb: 3 }} />
                    {/* Grid de productos */}
                    {loading ? (
                        <Box sx={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            zIndex: 2000,
                            backdropFilter: 'blur(4px)'
                        }}>
                            <CircularProgress
                                size={48}
                                sx={{
                                    color: vistelicaColors.primary
                                }}
                            />
                            <Typography
                                sx={{
                                    mt: 2,
                                    fontSize: { xs: '1rem', md: '1.1rem' },
                                    fontFamily: typography.fontFamily,
                                    fontWeight: 500,
                                    color: vistelicaColors.primary
                                }}
                            >
                                Cargando productos...
                            </Typography>
                        </Box>
                    ) : filteredProducts.length > 0 ? (
                        <>
                            <ProductGrid
                                products={currentItems}
                                gridView={gridView}
                                onAddToWishlist={handleAddToWishlist}
                                favoriteIds={favoriteIds}
                            />

                            {/* Controles de paginación - Diseño mejorado y responsivo */}
                            <Box sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: { xs: 2, sm: 3 },
                                mt: 5,
                                pt: 3,
                                borderTop: `1px solid ${vistelicaColors.primary}20`
                            }}>
                                {/* Selector de items por página */}
                                <FormControl sx={{ minWidth: { xs: '100%', sm: 120 }, maxWidth: { xs: '100%', sm: 'auto' } }} size="small">
                                    <InputLabel id="items-per-page-label" sx={{ fontFamily: typography.fontFamily }}>Por página</InputLabel>
                                    <Select
                                        labelId="items-per-page-label"
                                        value={itemsPerPage}
                                        label="Por página"
                                        onChange={(e) => setItemsPerPage(e.target.value)}
                                        sx={{
                                            fontFamily: typography.fontFamily,
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: `${vistelicaColors.primary}80`,
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: vistelicaColors.primary,
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: vistelicaColors.primary,
                                            },
                                            '& .MuiSelect-select': {
                                                fontFamily: typography.fontFamily,
                                            }
                                        }}
                                    >
                                        <MenuItem value={12} sx={{ fontFamily: typography.fontFamily }}>12</MenuItem>
                                        <MenuItem value={16} sx={{ fontFamily: typography.fontFamily }}>16</MenuItem>
                                        <MenuItem value={20} sx={{ fontFamily: typography.fontFamily }}>20</MenuItem>
                                        <MenuItem value={28} sx={{ fontFamily: typography.fontFamily }}>28</MenuItem>
                                    </Select>
                                </FormControl>

                                {/* Contador de páginas elegante */}
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: { xs: 'center', sm: 'flex-start' },
                                    gap: 1.5,
                                    width: { xs: '100%', sm: 'auto' }
                                }}>
                                    <Typography
                                        variant="body1"
                                        component="span"
                                        sx={{
                                            fontWeight: 500,
                                            color: vistelicaColors.secondary,
                                            fontFamily: typography.fontFamily,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.7,
                                        }}
                                    >
                                        Página
                                        <Box
                                            component="span"
                                            sx={{
                                                fontWeight: 400,
                                                fontSize: '1rem',
                                                color: vistelicaColors.secondary,
                                                fontFamily: typography.fontFamily,
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minWidth: '28px',
                                                height: '28px',
                                                borderBottom: `2px solid ${vistelicaColors.primary}`,
                                            }}
                                        >
                                            {currentPage}
                                        </Box>
                                        de {totalPages}
                                    </Typography>

                                    <Chip
                                        label={`${filteredProducts.length} productos`}
                                        size="small"
                                        sx={{
                                            backgroundColor: vistelicaColors.primary,
                                            color: vistelicaColors.secondary,
                                            fontWeight: 400,
                                            fontFamily: typography.fontFamily,
                                            '& .MuiChip-label': { px: 1, fontFamily: typography.fontFamily }
                                        }}
                                    />
                                </Box>

                                {/* Botones de navegación */}
                                <Box sx={{
                                    display: 'flex',
                                    gap: 1,
                                    width: { xs: '100%', sm: 'auto' },
                                    justifyContent: { xs: 'space-between', sm: 'flex-end' }
                                }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<ChevronLeft />}
                                        onClick={prevPage}
                                        disabled={currentPage === 1}
                                        sx={{
                                            borderColor: vistelicaColors.primary,
                                            color: vistelicaColors.secondary,
                                            fontWeight: 500,
                                            fontFamily: typography.fontFamily,
                                            flex: { xs: 1, sm: 'none' },
                                            '&:hover': {
                                                borderColor: vistelicaColors.primary,
                                                backgroundColor: `${vistelicaColors.primary}10`,
                                            },
                                            '&:disabled': {
                                                borderColor: '#E0E0E0',
                                                color: '#9E9E9E',
                                            }
                                        }}
                                    >
                                        Anterior
                                    </Button>
                                    <Button
                                        variant="contained"
                                        endIcon={<ChevronRight />}
                                        onClick={nextPage}
                                        disabled={currentPage === totalPages}
                                        sx={{
                                            backgroundColor: vistelicaColors.primary,
                                            color: vistelicaColors.secondary,
                                            fontWeight: 500,
                                            fontFamily: typography.fontFamily,
                                            flex: { xs: 1, sm: 'none' },
                                            '&:hover': {
                                                backgroundColor: vistelicaColors.primary,
                                                opacity: 0.9,
                                            },
                                            '&:disabled': {
                                                backgroundColor: '#E0E0E0',
                                                color: '#9E9E9E',
                                            }
                                        }}
                                    >
                                        Siguiente
                                    </Button>
                                </Box>
                            </Box>
                        </>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography sx={{ fontFamily: typography.fontFamily }}>
                                No se encontraron productos con los filtros seleccionados
                            </Typography>
                            {hasActiveFilters() && (
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={resetFilters}
                                    sx={{
                                        mt: 2,
                                        fontFamily: typography.fontFamily
                                    }}
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
                    sx={{
                        width: '100%',
                        fontFamily: typography.fontFamily,
                        '& .MuiAlert-message': {
                            fontFamily: typography.fontFamily
                        }
                    }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ProductList;