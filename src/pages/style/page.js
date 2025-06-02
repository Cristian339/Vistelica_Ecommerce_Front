'use client';
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import {useRouter, useSearchParams} from 'next/navigation';
import Navbar from "@/components/layout/HeaderComponent";
import { getStyleById } from "@/services/styleService";
import wishlistService from '@/services/wishlistService';
import { getToken } from '@/services/authService';
import { isInLocalWishlist, addToLocalWishlist, removeFromLocalWishlist } from "@/utils/localStorageHelpers";
import Link from 'next/link';

const Page = ({ params }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const styleId = searchParams.get('id');
    const [loading, setLoading] = useState(true);
    const [styleData, setStyleData] = useState(null);
    const [favorites, setFavorites] = useState({});
    const [loadingWishlist, setLoadingWishlist] = useState({});
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedThumbnail, setSelectedThumbnail] = useState(0);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        const fetchStyleData = async () => {
            try {
                setLoading(true);
                const data = await getStyleById(styleId);
                const processedData = {
                    ...data,
                    products: data.products.map(product => {
                        const relatedProduct = data.relatedProducts.find(rp => rp.product_id === product.product_id);
                        if (relatedProduct) {
                            return {
                                ...product,
                                main_image: relatedProduct.main_image,
                                images: relatedProduct.images
                            };
                        }
                        return product;
                    })
                };
                setStyleData(processedData);

                // Inicializar estado de favoritos
                await initializeFavorites(processedData.products);

                const mainImageIndex = processedData.styleImages.findIndex(img => img.is_main);
                if (mainImageIndex !== -1) {
                    setCurrentImageIndex(mainImageIndex);
                    setSelectedThumbnail(mainImageIndex);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error al cargar el estilo:", error);
                setLoading(false);
            }
        };

        if (styleId) {
            fetchStyleData();
        } else {
            console.error("No se proporcionó un ID de estilo válido");
            setLoading(false);
        }
    }, [styleId]);

    const initializeFavorites = async (products) => {
        const token = getToken();
        const initialFavorites = {};
        const initialLoadingState = {};

        if (!token) {
            // Para usuarios invitados: verificar localStorage
            products.forEach(product => {
                initialFavorites[product.product_id] = isInLocalWishlist(product.product_id);
                initialLoadingState[product.product_id] = false;
            });
        } else {
            // Para usuarios registrados: verificar API
            try {
                const wishlist = await wishlistService.getWishlist();
                products.forEach(product => {
                    const found = wishlist.some(item => item.product_id === product.product_id);
                    initialFavorites[product.product_id] = found;
                    initialLoadingState[product.product_id] = false;
                });
            } catch (error) {
                console.error('Error al cargar wishlist:', error);
                products.forEach(product => {
                    initialFavorites[product.product_id] = false;
                    initialLoadingState[product.product_id] = false;
                });
            }
        }

        setFavorites(initialFavorites);
        setLoadingWishlist(initialLoadingState);
    };

    const toggleFavorite = async (productId, product) => {
        const token = getToken();

        if (!token) {
            setToast({
                open: true,
                message: 'Inicia sesión para guardar productos en favoritos',
                severity: 'warning'
            });

            // Para usuarios invitados: usar localStorage
            const newFavStatus = !favorites[productId];
            setFavorites(prev => ({
                ...prev,
                [productId]: newFavStatus
            }));

            if (newFavStatus) {
                addToLocalWishlist(product);
            } else {
                removeFromLocalWishlist(productId);
            }
            return;
        }

        try {
            setLoadingWishlist(prev => ({
                ...prev,
                [productId]: true
            }));

            if (favorites[productId]) {
                await wishlistService.removeFromWishlist(productId);
            } else {
                await wishlistService.addToWishlist(productId);
            }

            setFavorites(prev => ({
                ...prev,
                [productId]: !prev[productId]
            }));

            setToast({
                open: true,
                message: favorites[productId]
                    ? 'Producto eliminado de favoritos'
                    : 'Producto añadido a favoritos',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error actualizando wishlist:', error);
            setToast({
                open: true,
                message: 'Error al actualizar favoritos',
                severity: 'error'
            });
        } finally {
            setLoadingWishlist(prev => ({
                ...prev,
                [productId]: false
            }));
        }
    };

    return (
        <>
            <Navbar />
            <Box>
                {loading ? (
                    <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress />
                    </Container>
                ) : styleData ? (
                    <>
                        <HeaderComponent
                            title={styleData.name}
                            subtitle={styleData.description}
                            articleCount={`${styleData.products.length} artículos`}
                        />
                        <Box sx={{ width: '100%' }}>
                            <MainContentSection
                                styleImages={styleData.styleImages}
                                currentImageIndex={currentImageIndex}
                                setCurrentImageIndex={setCurrentImageIndex}
                                selectedThumbnail={selectedThumbnail}
                                setSelectedThumbnail={setSelectedThumbnail}
                                products={styleData.products}
                                favorites={favorites}
                                loadingWishlist={loadingWishlist}
                                toggleFavorite={toggleFavorite}
                            />
                        </Box>
                    </>
                ) : (
                    <Container maxWidth="lg">
                        <Typography variant="h5" color="error" sx={{ py: 4 }}>
                            No se pudo cargar el estilo. Por favor, inténtalo más tarde.
                        </Typography>
                    </Container>
                )}
            </Box>

            {/* Toast de notificaciones */}
            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={() => setToast({ ...toast, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setToast({ ...toast, open: false })}
                    severity={toast.severity}
                    sx={{ width: '100%' }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </>
    );
};

const HeaderComponent = ({ title, subtitle, articleCount }) => (
    <Box sx={{ width: '100%', borderBottom: '1px solid', borderColor: 'divider', py: 2, mb: 4 }}>
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" fontWeight="bold">{title}</Typography>
                <Typography variant="h5" fontWeight="bold">{subtitle}</Typography>
                <Typography variant="body2" color="text.secondary">{articleCount}</Typography>
            </Box>
        </Container>
    </Box>
);

const MainContentSection = ({
                                styleImages,
                                currentImageIndex,
                                setCurrentImageIndex,
                                selectedThumbnail,
                                setSelectedThumbnail,
                                products,
                                favorites,
                                loadingWishlist,
                                toggleFavorite
                            }) => {
    const handlePrevImage = () => {
        const prevIndex = currentImageIndex === 0 ? styleImages.length - 1 : currentImageIndex - 1;
        setCurrentImageIndex(prevIndex);
        setSelectedThumbnail(prevIndex);
    };

    const handleNextImage = () => {
        const nextIndex = currentImageIndex === styleImages.length - 1 ? 0 : currentImageIndex + 1;
        setCurrentImageIndex(nextIndex);
        setSelectedThumbnail(nextIndex);
    };

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index);
        setSelectedThumbnail(index);
    };

    return (
        <Container maxWidth="lg" disableGutters>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', ml: 0 }}>
                {/* Galería de imágenes con flechas */}
                <Box sx={{ width: '50%', maxWidth: 450, bgcolor: 'grey.100', borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
                    <IconButton
                        onClick={handlePrevImage}
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: 8,
                            transform: 'translateY(-50%)',
                            zIndex: 2,
                            bgcolor: 'rgba(255, 255, 255, 0.7)',
                            border: '1px solid #ddd',
                            borderRadius: '50%',
                            backdropFilter: 'blur(4px)',
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.9)'
                            }
                        }}
                    >
                        <ChevronLeft />
                    </IconButton>

                    <IconButton
                        onClick={handleNextImage}
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            right: 8,
                            transform: 'translateY(-50%)',
                            zIndex: 2,
                            bgcolor: 'rgba(255,255,255,0.2)',
                            border: '2px solid #ddd',
                            borderRadius: '50%',
                            backdropFilter: 'blur(4px)',
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.2)'
                            }
                        }}
                    >
                        <ChevronRight />
                    </IconButton>

                    <Box
                        component="img"
                        src={styleImages[currentImageIndex]?.image_url || "/api/placeholder/600/800"}
                        alt="Estilo"
                        sx={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, flexWrap: 'wrap' }}>
                        {styleImages.map((img, index) => (
                            <Box
                                key={index}
                                component="img"
                                src={img.image_url}
                                onClick={() => handleThumbnailClick(index)}
                                alt={`Thumbnail ${index}`}
                                sx={{
                                    width: 50,
                                    height: 70,
                                    objectFit: 'cover',
                                    m: 0.5,
                                    border: index === selectedThumbnail ? '2px solid black' : '1px solid gray',
                                    cursor: 'pointer',
                                    borderRadius: 1
                                }}
                            />
                        ))}
                    </Box>
                </Box>

                {/* Grid de productos */}
                <Box sx={{ flexGrow: 1, pl: 4 }}>
                    <Grid container spacing={2}>
                        {products.map((product) => (
                            <Grid item xs={12} sm={6} md={4} key={product.product_id}>
                                <ProductCard
                                    product={product}
                                    isFavorite={favorites[product.product_id]}
                                    isLoadingWishlist={loadingWishlist[product.product_id]}
                                    onToggleFavorite={() => toggleFavorite(product.product_id, product)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

const ProductCard = ({ product, isFavorite, isLoadingWishlist, onToggleFavorite }) => {
    const formattedPrice = `${product.price} €`;
    const hasDiscount = product.discount_percentage && parseFloat(product.discount_percentage) > 0;
    const mainImage = product.main_image ||
        (product.images?.find(img => img.is_main)?.image_url) ||
        "/api/placeholder/400";

    return (
        <Link href={`/product-detail/page?id=${product.product_id}`} passHref>
            <Card
                sx={{
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                    boxShadow: 0,
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: '100%',
                    transform: 'scale(0.9)',
                    transformOrigin: 'center',
                    textDecoration: 'none',
                    cursor: 'pointer'
                }}
            >
                <Box sx={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        image={mainImage}
                        alt={product.name}
                        sx={{
                            textDecoration: 'none',
                            aspectRatio: '1/1',
                            bgcolor: 'white',
                            objectFit: 'contain',
                            height: '250px'
                        }}
                    />
                    <IconButton
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onToggleFavorite();
                        }}
                        disabled={isLoadingWishlist}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'white',
                            opacity: 0.9,
                            '&:hover': {
                                bgcolor: 'white',
                                opacity: 1,
                                transform: 'scale(1.1)'
                            },
                            padding: '8px',
                            zIndex: 2,
                            transition: 'all 0.2s ease-in-out'
                        }}
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        size="small"
                    >
                        {isLoadingWishlist ? (
                            <CircularProgress size={20} />
                        ) : isFavorite ? (
                            <Favorite
                                sx={{
                                    color: 'red',
                                    fontSize: '1.5rem'
                                }}
                            />
                        ) : (
                            <FavoriteBorder
                                sx={{
                                    color: 'black',
                                    fontSize: '1.5rem'
                                }}
                            />
                        )}
                    </IconButton>

                    {hasDiscount && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 8,
                                left: 8,
                                bgcolor: 'error.main',
                                color: 'white',
                                px: 0.75,
                                py: 0.25,
                                borderRadius: 1,
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                zIndex: 2
                            }}
                        >
                            -{product.discount_percentage}%
                        </Box>
                    )}
                </Box>

                <CardContent sx={{ py: 1, px: 1.5 }}>
                    {product.sizes && (
                        <Typography variant="caption" sx={{
                            color: 'orange',
                            fontWeight: 600,
                            display: 'block',
                            mb: 0.25,
                            fontSize: '0.65rem'
                        }}>
                            {product.sizes.join(" · ")}
                        </Typography>
                    )}
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.25, fontSize: '0.8rem' }}>
                        {product.name}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                        {formattedPrice}
                    </Typography>
                </CardContent>
            </Card>
        </Link>
    );
};

export default Page;