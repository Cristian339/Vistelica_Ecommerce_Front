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
    CircularProgress
} from '@mui/material';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import {useRouter, useSearchParams} from 'next/navigation';
import Navbar from "@/components/layout/HeaderComponent";
import { getStyleById } from "@/services/styleService";
import Link from 'next/link';
const Page = ({ params }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const styleId = searchParams.get('id');
    const [loading, setLoading] = useState(true);
    const [styleData, setStyleData] = useState(null);
    const [favorites, setFavorites] = useState({});
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedThumbnail, setSelectedThumbnail] = useState(0);






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
                const initialFavorites = {};
                processedData.products.forEach(product => {
                    initialFavorites[product.product_id] = false;
                });
                setFavorites(initialFavorites);

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
                                setFavorites={setFavorites}
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
                                setFavorites
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

    const toggleFavorite = (id) => {
        setFavorites(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
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
                                    onToggleFavorite={() => toggleFavorite(product.product_id)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};



const ProductCard = ({ product, isFavorite, onToggleFavorite }) => {
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
                            e.preventDefault(); // previene la navegación si se hace clic en el corazón
                            onToggleFavorite();
                        }}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'white',
                            opacity: 0.7,
                            '&:hover': { bgcolor: 'white', opacity: 1 },
                            padding: '4px',
                            zIndex: 2
                        }}
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        size="small"
                    >
                        <Heart
                            fill={isFavorite ? "black" : "none"}
                            stroke="black"
                            size={18}
                        />
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
