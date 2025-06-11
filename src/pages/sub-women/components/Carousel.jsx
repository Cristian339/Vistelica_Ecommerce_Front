'use client'
import React from 'react';
import GenericCarousel from '@/components/shared/Carousel';

const WomenCarousel = () => {
    // Imágenes específicas para la categoría de mujeres
    const images = [
        'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1749558491/vistelica/subcategorias/Mujer/SMujer/zhybl0cta5eyhnsjlnej.jpg',
        'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1749558491/vistelica/subcategorias/Mujer/SMujer/yvtwkwh8uktgrcgerkzu.jpg',
        'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1749558491/vistelica/subcategorias/Mujer/SMujer/ykxibgsqmk1gctnobeyn.jpg',
        'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1749558491/vistelica/subcategorias/Mujer/SMujer/ffmzn4y9ps6d5myg5pgo.jpg',
    ];

    return <GenericCarousel images={images} title="Moda Femenina" />;
};

export default React.memo(WomenCarousel);
