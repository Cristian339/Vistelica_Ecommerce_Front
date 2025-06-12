import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import productService from '../../../services/productService';
import ProductGrid from '../components/ProductGrid';
import FilterSidebar from '../components/FilterSidebar';
import SortDropdown from '../components/SortDropdown';
import { sortProducts } from '../../../components/productlist/SortUtils';
import { Box, Typography, Button, CircularProgress, Fade, Drawer, IconButton, useMediaQuery, Alert } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { vistelicaColors } from "@/components/shared/vistelicaColors";

const CategoryPage = () => {
    const router = useRouter();
    const { gender, category } = router.query;
    const isMobile = useMediaQuery('(max-width:768px)');

    // Estados
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortOption, setSortOption] = useState('relevancia');
    const [filters, setFilters] = useState({
        brands: [],
        colors: [],
        ratings: [],
        priceMin: null,
        priceMax: null,
        sizes: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(!isMobile);
    const [categoryTitle, setCategoryTitle] = useState('');

    // Recuperar y formatear el título de la categoría
    const formattedCategoryTitle = useMemo(() => {
        if (!category) return '';
        return category === 'todos'
            ? 'Todos los productos'
            : category.charAt(0).toUpperCase() + category.slice(1);
    }, [category]);

    // Cargar productos - optimizado con useCallback
    const fetchProducts = useCallback(async () => {
        if (!gender || !category) return;

        setLoading(true);
        setError(null);

        try {
            const data = await productService.getAll();
            const normalizedGender = gender.toLowerCase();
            const normalizedCategory = category.toLowerCase();

            const filteredData = data.filter(product => {
                const productGender = product.gender?.toLowerCase() || '';
                const productCategory = product.category?.toLowerCase() || '';

                return productGender === normalizedGender &&
                    (normalizedCategory === 'todos' || productCategory === normalizedCategory);
            });

            setProducts(filteredData);
            setCategoryTitle(formattedCategoryTitle);
        } catch (err) {
            console.error('Error al cargar productos:', err.message);
            setError('No pudimos cargar los productos. Por favor, inténtalo de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    }, [gender, category, formattedCategoryTitle]);

    // Efecto para cargar productos cuando cambian los parámetros
    useEffect(() => {
        if (router.isReady) {
            fetchProducts();
        }
    }, [router.isReady, fetchProducts]);

    // Ajuste de filtros cuando cambia el tamaño de la pantalla
    useEffect(() => {
        setShowFilters(!isMobile);
    }, [isMobile]);

    // Aplicar filtros - optimizado con useMemo
    const applyFilters = useCallback(() => {
        let result = [...products];

        // Filtro por marcas
        if (filters.brands.length > 0) {
            result = result.filter(p => p.brand && filters.brands.includes(p.brand.toLowerCase()));
        }

        // Filtro por colores
        if (filters.colors.length > 0) {
            result = result.filter(p => p.color && filters.colors.includes(p.color.toLowerCase()));
        }

        // Filtro por tallas
        if (filters.sizes.length > 0) {
            result = result.filter(p =>
                p.sizes && p.sizes.some(size => filters.sizes.includes(size))
            );
        }

        // Filtro por rating
        if (filters.ratings.length > 0) {
            result = result.filter(p =>
                p.rating && filters.ratings.includes(Math.floor(p.rating))
            );
        }

        // Filtro por precio
        const minPrice = parseFloat(filters.priceMin);
        const maxPrice = parseFloat(filters.priceMax);

        if (!isNaN(minPrice)) {
            result = result.filter(p => {
                const price = p.discountedPrice ?? p.price;
                return price >= minPrice;
            });
        }

        if (!isNaN(maxPrice)) {
            result = result.filter(p => {
                const price = p.discountedPrice ?? p.price;
                return price <= maxPrice;
            });
        }

        return sortProducts(result, sortOption);
    }, [filters, sortOption, products]);

    // Aplicar filtros y ordenar
    useEffect(() => {
        setFilteredProducts(applyFilters());
    }, [applyFilters]);

    // Handler para cambiar el criterio de ordenación
    const handleSortChange = useCallback((option) => {
        setSortOption(option);
    }, []);

    // Handler para mostrar/ocultar filtros
    const toggleFilters = useCallback(() => {
        setShowFilters(prev => !prev);
    }, []);

    // Contenido del filtro para dispositivos móviles/desktop
    const filterContent = (
        <FilterSidebar
            setFilters={setFilters}
            filters={filters}
            onClose={isMobile ? toggleFilters : undefined}
        />
    );

    // Título de la página para SEO
    const pageTitle = `${formattedCategoryTitle} ${gender ? `para ${gender}` : ''} | Vistelica`;

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={`Explora nuestra colección de ${formattedCategoryTitle.toLowerCase()} ${gender ? `para ${gender.toLowerCase()}` : ''}`} />
            </Head>

            <Box
                component="main"
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    padding: { xs: 2, sm: 3, md: 4 },
                    gap: 3,
                    minHeight: '80vh'
                }}
            >
                {/* Filtros para desktop */}
                {!isMobile && showFilters && (
                    <Fade in={showFilters}>
                        <Box
                            sx={{
                                width: { sm: '240px', md: '280px' },
                                flexShrink: 0,
                                transition: 'all 0.3s ease'
                            }}
                            role="complementary"
                            aria-label="Filtros de productos"
                        >
                            {filterContent}
                        </Box>
                    </Fade>
                )}

                {/* Drawer para móvil */}
                {isMobile && (
                    <Drawer
                        anchor="left"
                        open={showFilters}
                        onClose={toggleFilters}
                        sx={{
                            '& .MuiDrawer-paper': {
                                width: '85%',
                                maxWidth: '320px',
                                padding: 2
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                            <Typography variant="h6" component="h2">Filtros</Typography>
                            <IconButton onClick={toggleFilters} aria-label="Cerrar filtros">
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        {filterContent}
                    </Drawer>
                )}

                {/* Contenido principal */}
                <Box sx={{ flex: 1 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            mb: 3,
                            gap: 2
                        }}
                    >
                        {/* Título y contador de productos */}
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                fontWeight: 400,
                                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                            }}
                        >
                            {categoryTitle}
                            <Box
                                component="span"
                                sx={{
                                    ml: 1,
                                    color: 'text.secondary',
                                    fontSize: '0.8em'
                                }}
                                aria-live="polite"
                            >
                                ({filteredProducts.length})
                            </Box>
                        </Typography>

                        {/* Controles */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                flexWrap: 'wrap',
                                justifyContent: { xs: 'space-between', sm: 'flex-end' },
                                width: { xs: '100%', sm: 'auto' }
                            }}
                        >
                            <Button
                                onClick={toggleFilters}
                                startIcon={<FilterListIcon />}
                                aria-expanded={showFilters}
                                aria-controls="product-filters"
                                color="inherit"
                                size="small"
                                sx={{
                                    color: vistelicaColors?.primary || '#E4B002',
                                    '&:hover': {
                                        backgroundColor: `${vistelicaColors?.primary || '#E4B002'}10`
                                    }
                                }}
                            >
                                {isMobile ? 'Filtros' : (showFilters ? 'Ocultar filtros' : 'Mostrar filtros')}
                            </Button>

                            <SortDropdown onSortChange={handleSortChange} />
                        </Box>
                    </Box>

                    {/* Estados de carga y error */}
                    {loading ? (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '300px'
                            }}
                        >
                            <CircularProgress color="primary" />
                        </Box>
                    ) : error ? (
                        <Alert
                            severity="error"
                            sx={{ my: 3 }}
                        >
                            {error}
                        </Alert>
                    ) : filteredProducts.length === 0 ? (
                        <Box
                            sx={{
                                textAlign: 'center',
                                py: 8,
                                px: 2
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                No se encontraron productos
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Prueba con otros filtros o categorías
                            </Typography>
                        </Box>
                    ) : (
                        <ProductGrid products={filteredProducts} />
                    )}
                </Box>
            </Box>
        </>
    );
};

export default memo(CategoryPage);