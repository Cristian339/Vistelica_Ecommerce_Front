import React from 'react';
import { Box, Typography, Rating, styled } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';

// Estilos
const ProductCardContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    cursor: 'pointer',
    position: 'relative',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: theme.shadows[4],
        '& .product-image': {
            transform: 'scale(1.05)',
        }
    }
}));

const ImageContainer = styled(Box)({
    position: 'relative',
    width: '100%',
    paddingTop: '133%', // Ratio 3:4
    overflow: 'hidden',
    borderRadius: '8px',
});

const ProductImage = styled(Image)({
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
});

const ProductCard = ({ product }) => {
    return (
        <Link href={`/product/${product._id}`} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
            <ProductCardContainer>
                <ImageContainer>
                    <ProductImage
                        src={product.images?.[0] || '/placeholder.jpg'}
                        alt={product.name}
                        fill
                        className="product-image"
                    />
                </ImageContainer>

                <Box sx={{ mt: 2, flexGrow: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                        {product.brand}
                    </Typography>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 500, mb: 1 }}>
                        {product.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={product.rating || 0} precision={0.5} size="small" readOnly />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                            ({product.numReviews || 0})
                        </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                        {(parseFloat(product.price) || 0).toFixed(2)}€
                    </Typography>
                </Box>
            </ProductCardContainer>
        </Link>
    );
};

export default ProductCard;