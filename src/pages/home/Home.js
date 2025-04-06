'use client';
import React from 'react';

import ProgressBarCarousel from "@/pages/home/components/ImageCarousel";
import Navbar from "@/components/layout/HeaderComponent";
import ValuesCard from "@/pages/home/components/ValuesCard";
import ProductShowcase from "@/pages/home/components/ProductShowcase";

const HomePage = () => {
    return (
        <div>
            <Navbar />

            {/* Contenedor para ProgressBarCarousel con ancho completo */}
            <div className="w-full h-auto">
                <ProgressBarCarousel />
            </div>

            {/* Contenedor para ProductShowcase */}
            <div className="w-full mt-8">
                <ProductShowcase />
            </div>

            {/* Centrar ValuesCard */}
            <div className="w-full mt-8">
                <ValuesCard />
            </div>
        </div>
    );
};

export default HomePage;