'use client'
import React from 'react';
import GenericCarousel from '@/components/shared/Carousel';

const BoyCarousel = () => {
    // Imágenes específicas para la categoría de chicos
    const images = [
        'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1749558477/vistelica/subcategorias/Chico/SChico/rokj0y6j41u0kedfyihq.jpg',
        'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1749558477/vistelica/subcategorias/Chico/SChico/pt2vetk5hambr8kj2icv.jpg',
        'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1749558477/vistelica/subcategorias/Chico/SChico/tog8q7plyzq25qcne8fp.jpg',
        'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1749558476/vistelica/subcategorias/Chico/SChico/goj9lsfv5qcokhsixbkb.jpg',
    ];

    return <GenericCarousel images={images} title="Moda para Chicos" />;
};

export default React.memo(BoyCarousel);
