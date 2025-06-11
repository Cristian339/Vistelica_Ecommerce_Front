'use client'
import React from 'react';
import GenericSuggestedItemsCarousel from '@/components/shared/GenericSuggestedItemsCarousel';

const SuggestedItemsCarousel = () => {
    // Usar el componente genérico y pasar la categoría 1 (hombres)
    return <GenericSuggestedItemsCarousel categoryId={1} />;
};

export default SuggestedItemsCarousel;
