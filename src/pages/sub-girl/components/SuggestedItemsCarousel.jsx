'use client'
import React from 'react';
import GenericSuggestedItemsCarousel from '@/components/shared/GenericSuggestedItemsCarousel';

const SuggestedItemsCarousel = () => {
    // Usar el componente genérico y pasar la categoría 3 (chicas)
    return <GenericSuggestedItemsCarousel categoryId={3} />;
};

export default SuggestedItemsCarousel;
