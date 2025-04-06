'use client';
import React from 'react';

import ProgressBarCarousel from "@/pages/home/components/ImageCarousel";
import ProductShowcase from "@/pages/home/components/ProductShowcase";
import Navbar from "@/components/layout/HeaderComponent";




const HomePage = () => {
    return (
        <div>
            <Navbar />
            {/* Contenedor para ProgressBarCarousel con ancho completo */}
            <div className="w-full h-auto">
                <ProgressBarCarousel />
            </div>

            <div className="flex flex-row items-center justify-center mt-4">
            <ProductShowcase />
                </div>
        </div>
    );
};

export default HomePage;
