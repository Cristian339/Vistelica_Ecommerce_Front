'use client'
import React from 'react';
import Carousel from './components/Carousel';
import ClothingCategories from './components/ClothingCategories';
import StylesShowcase from "@/pages/sub-girl/components/StylesShowcase";
import SuggestedItemsCarousel from "@/pages/sub-girl/components/SuggestedItemsCarousel";
import StrangerThingsCollectionPreview from "@/pages/sub-girl/components/StrangerThingsCollectionPreview";
import GenericMainLayout from '@/components/shared/GenericMainLayout';

const MainLayoutSubG = () => {
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

export default MainLayoutSubG;
