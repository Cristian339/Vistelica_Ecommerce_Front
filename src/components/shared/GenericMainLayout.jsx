'use client'
import React from 'react';
import Navbar from "@/components/layout/HeaderComponent";
import FooterComponent from "@/components/layout/FooterComponent";
import { GlobalStyles } from '@mui/material';
import BannerVideoSection from "@/components/layout/BannerVideo";
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

const GenericMainLayout = ({ 
    Carousel, 
    ClothingCategories, 
    CollectionComponent,
    StylesShowcase,
    SuggestedItemsCarousel 
}) => {
    const styles = {
        container: {
            width: '100%',
            margin: '0',
            padding: '0',
            boxSizing: 'border-box',
            fontFamily: typography.fontFamily,
            overflowY: 'auto',
            height: '100vh',
            position: 'relative',
            backgroundColor: vistelicaColors.backgroundLight,
            color: vistelicaColors.textDark,
            scrollBehavior: 'smooth',
        },
        section: {
            margin: '2rem 0 3rem',
            position: 'relative',
            transition: 'transform 0.3s ease-out',
        },
        sectionTitle: {
            fontFamily: typography.fontFamily,
            fontSize: '1.8rem',
            color: vistelicaColors.primary,
            textAlign: 'center',
            margin: '0 0 2rem',
            fontWeight: 700,
            letterSpacing: '1px',
            position: 'relative',
            paddingBottom: '0.5rem',
        },
        titleUnderline: {
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '3px',
            background: vistelicaColors.primary,
            borderRadius: '3px',
        },
        divider: {
            height: '2px',
            width: '80%',
            margin: '2rem auto',
            background: `linear-gradient(90deg, transparent, ${vistelicaColors.primary}40, transparent)`,
            borderRadius: '1px',
        },
        videoSectionWrapper: {
            marginBottom: '3rem',
            boxShadow: `0 10px 30px rgba(0,0,0,0.08)`,
            borderRadius: '12px',
            overflow: 'hidden',
        },
        suggestedSectionWrapper: {
            marginBottom: '3rem',
        }
    };

    React.useEffect(() => {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.boxSizing = 'border-box';
        document.body.style.overflow = 'hidden';

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
                        overflow: 'hidden',
                        height: '100%',
                        fontFamily: typography.fontFamily,
                    },
                    '::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '::-webkit-scrollbar-track': {
                        background: `${vistelicaColors.backgroundLight}`,
                    },
                    '::-webkit-scrollbar-thumb': {
                        background: `${vistelicaColors.secondary}80`,
                        borderRadius: '4px',
                    },
                    '::-webkit-scrollbar-thumb:hover': {
                        background: `${vistelicaColors.primary}`,
                    },
                    '.scroll-animate': {
                        opacity: 0,
                        transform: 'translateY(20px)',
                        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
                    },
                    '.section-visible': {
                        opacity: 1,
                        transform: 'translateY(0)',
                    },
                    '.hover-scale': {
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                            transform: 'scale(1.02)',
                        }
                    }
                }}
            />

            <div style={styles.container}>
                <Navbar />
                <Carousel />
                <ClothingCategories />
                {CollectionComponent && <CollectionComponent />}
                <StylesShowcase />
                <div style={{marginBottom: '15px'}}>
                    <BannerVideoSection />
                </div>
                <div style={{marginBottom: '15px'}}>
                    <SuggestedItemsCarousel />
                </div>
                <FooterComponent />
            </div>
        </>
    );
};

export default GenericMainLayout;
