'use client'
import React from 'react';
import Carousel from './components/Carousel';
import ClothingCategories from './components/ClothingCategories';
import Navbar from "@/components/layout/HeaderComponent";
import CollectionPreview from "@/pages/sub-girl/components/StrangerThingsCollectionPreview";
import StylesShowcase from "@/pages/sub-girl/components/StylesShowcase";

import SuggestedItemsCarousel from "@/pages/sub-girl/components/SuggestedItemsCarousel";
import FooterComponent from "@/components/layout/FooterComponent";
import { GlobalStyles } from '@mui/material';
import BannerVideoSection from "@/components/layout/BannerVideo";
import StrangerThingsCollectionPreview from "@/pages/sub-girl/components/StrangerThingsCollectionPreview";

const MainLayoutSubW = () => {
    const styles = {
        container: {
            width: '100%',
            margin: '0',
            padding: '0',
            boxSizing: 'border-box',
            fontFamily: 'Arial, sans-serif',
            overflowY: 'auto', // Habilitamos el scroll vertical
            height: '100vh', // Aseguramos que ocupe toda la altura de la ventana
            position: 'relative' // Para contexto de posicionamiento
        }
    };

    React.useEffect(() => {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.boxSizing = 'border-box';
        document.body.style.overflow = 'hidden'; // Evitamos scroll doble

        return () => {
            document.body.style.margin = '';
            document.body.style.padding = '';
            document.body.style.boxSizing = '';
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <>
            <GlobalStyles
                styles={{
                    'html, body': {
                        margin: 0,
                        padding: 0,
                        overflow: 'hidden', // Prevenimos scroll en body
                        height: '100%'
                    }
                }}
            />

            <div style={styles.container}>
                <Navbar/>
                <Carousel/>
                <ClothingCategories/>
                <StrangerThingsCollectionPreview/>
                <StylesShowcase/>
                <div style={{marginBottom: '15px'}}>
                    <BannerVideoSection/>
                </div>
                <div style={{marginBottom: '15px'}}>
                    <SuggestedItemsCarousel/>
                </div>

                <FooterComponent/>
            </div>
        </>
    );
};

export default MainLayoutSubW;