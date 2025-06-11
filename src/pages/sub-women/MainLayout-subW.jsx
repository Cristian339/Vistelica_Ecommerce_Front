'use client'
import React from 'react';
import Carousel from './components/Carousel';
import ClothingCategories from './components/ClothingCategories';
import StylesShowcase from "@/pages/sub-women/components/StylesShowcase";
import SuggestedItemsCarousel from "@/pages/sub-women/components/SuggestedItemsCarousel";
import AdidasGucciCollectionPreview from "@/pages/sub-women/components/AdidasGucciCollectionPreview";
import GenericMainLayout from '@/components/shared/GenericMainLayout';

const MainLayoutSubW = () => {
    return (
        <GenericMainLayout
            Carousel={Carousel}
            ClothingCategories={ClothingCategories}
            CollectionComponent={AdidasGucciCollectionPreview}
            StylesShowcase={StylesShowcase}
            SuggestedItemsCarousel={SuggestedItemsCarousel}
        />
    );
};

export default MainLayoutSubW;
