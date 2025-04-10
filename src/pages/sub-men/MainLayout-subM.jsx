'use client'
import React from 'react';
import Carousel from './components/Carousel';
import ClothingCategories from './components/ClothingCategories';
import Navbar from "@/components/layout/HeaderComponent";
import CollectionPreview from "@/pages/sub-men/components/CollectionPreview";
import StylesShowcase from "@/pages/sub-men/components/StylesShowcase";
import BannerSection from "@/pages/home/components/BannerSection";
import SuggestedItemsCarousel from "@/pages/sub-men/components/SuggestedItemsCarousel";
import FooterComponent from "@/components/layout/FooterComponent";

const MainLayoutSubM = () => {
    const styles = {
        container: {
            width: '100%',
            margin: '0',
            padding: '0',
            boxSizing: 'border-box',
            fontFamily: 'Arial, sans-serif'
        }
    };

    React.useEffect(() => {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.boxSizing = 'border-box';

        return () => {
            document.body.style.margin = '';
            document.body.style.padding = '';
            document.body.style.boxSizing = '';
        };
    }, []);

    return (
        <div style={styles.container}>
            <Navbar />
            <Carousel />
            <ClothingCategories />
            <CollectionPreview />
            <StylesShowcase />
            <div style={{marginBottom: '16px'}}>
                <BannerSection/>
            </div>


            <SuggestedItemsCarousel/>
            <FooterComponent />
        </div>
    );
};

export default MainLayoutSubM;
