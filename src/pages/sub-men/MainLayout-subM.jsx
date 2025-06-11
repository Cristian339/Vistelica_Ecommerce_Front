'use client'
import React from 'react';
import Carousel from './components/Carousel';
import ClothingCategories from './components/ClothingCategories';
import CollectionPreview from "@/pages/sub-men/components/CollectionPreview";
import StylesShowcase from "@/pages/sub-men/components/StylesShowcase";
import SuggestedItemsCarousel from "@/pages/sub-men/components/SuggestedItemsCarousel";
import GenericMainLayout from '@/components/shared/GenericMainLayout';

const MainLayoutSubM = () => {
    return (
        <GenericMainLayout
            Carousel={Carousel}
            ClothingCategories={ClothingCategories}
            CollectionComponent={CollectionPreview}
            StylesShowcase={StylesShowcase}
            SuggestedItemsCarousel={SuggestedItemsCarousel}
        />
    );
};

export default MainLayoutSubM;
