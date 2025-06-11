'use client'
import React from 'react';
import Carousel from './components/Carousel';
import ClothingCategories from './components/ClothingCategories';
import StylesShowcase from "@/pages/sub-boy/components/StylesShowcase";
import SuggestedItemsCarousel from "@/pages/sub-boy/components/SuggestedItemsCarousel";
import StrangerThingsCollectionPreview from "@/pages/sub-boy/components/StrangerThingsCollectionPreview";
import GenericMainLayout from '@/components/shared/GenericMainLayout';

const MainLayoutSubB = () => {
    return (
        <GenericMainLayout
            Carousel={Carousel}
            ClothingCategories={ClothingCategories}
            CollectionComponent={StrangerThingsCollectionPreview}
            StylesShowcase={StylesShowcase}
            SuggestedItemsCarousel={SuggestedItemsCarousel}
        />
    );
};

export default MainLayoutSubB;
