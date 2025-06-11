'use client'
import React from 'react';
import GenericCarousel from '@/components/shared/Carousel';

const GirlCarousel = () => {
    // Imágenes específicas para la categoría de chicas
    const images = [
        'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1749558428/vistelica/subcategorias/Chica/SChica/kxj7yefglo4qg4qd3xwe.jpg',
        'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1749558428/vistelica/subcategorias/Chica/SChica/mtvq5yu40xn51eeyjqel.jpg',
        'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1749558428/vistelica/subcategorias/Chica/SChica/nkqjazq3morgcmg9v76o.jpg',
        'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1749558428/vistelica/subcategorias/Chica/SChica/i5on0s5cvy66ctfpphqr.jpg',
    ];

    return <GenericCarousel images={images} title="Moda para Chicas" />;
};

export default React.memo(GirlCarousel);
