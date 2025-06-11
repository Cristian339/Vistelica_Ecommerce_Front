'use client'
import React from 'react';
import GenericCarousel from '@/components/shared/Carousel';

const MenCarousel = () => {
    // Imágenes específicas para la categoría de hombres
    const images = [
        'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1749558485/vistelica/subcategorias/Hombre/SHombre/b6fhty2fptabeyccgsny.jpg',
        'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1749558485/vistelica/subcategorias/Hombre/SHombre/w6v8ubrfeipnvxbyyzy6.jpg',
        'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1749558485/vistelica/subcategorias/Hombre/SHombre/vtepta4qyblx6082kphq.jpg',
        'https://res.cloudinary.com/dhyv4dpk2/image/upload/v1749558484/vistelica/subcategorias/Hombre/SHombre/s1tsii2tnmr0uan6dr6d.jpg',
    ];

    return <GenericCarousel images={images} title="Moda Masculina" />;
};

export default React.memo(MenCarousel);
