'use client'
import React from 'react';
import GenericSuggestedItemsCarousel from '@/components/shared/GenericSuggestedItemsCarousel';

const SuggestedItemsCarousel = () => {
    // Usar el componente genérico y pasar la categoría 7 (chicos)
    return <GenericSuggestedItemsCarousel categoryId={7} />;
};

export default SuggestedItemsCarousel;
