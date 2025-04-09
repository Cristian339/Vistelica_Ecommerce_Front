'use client'
import React from 'react';
import Carousel from './components/Carousel';
import ClothingCategories from './components/sub-ca';
import Navbar from "@/components/layout/HeaderComponent";

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
        </div>
    );
};

export default MainLayoutSubM;
