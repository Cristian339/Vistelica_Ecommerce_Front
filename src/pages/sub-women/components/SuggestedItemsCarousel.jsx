'use client'
import React from 'react';
import GenericSuggestedItemsCarousel from '@/components/shared/GenericSuggestedItemsCarousel';

const SuggestedItemsCarousel = () => {
    // Usar el componente genérico y pasar la categoría 2 (mujeres)
    return <GenericSuggestedItemsCarousel categoryId={2} />;
};

export default SuggestedItemsCarousel;
