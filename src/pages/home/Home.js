'use client';
import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import ProgressBarCarousel from "@/pages/home/components/ImageCarousel";
import Navbar from "@/components/layout/HeaderComponent";
import ValuesCard from "@/pages/home/components/ValuesCard";
import ProductShowcase from "@/pages/home/components/ProductShowcase";
import FeaturedCategories from "@/pages/home/components/FeaturedCategories";
import BannerSection from "@/pages/home/components/BannerSection";
import FooterComponent from "@/components/layout/FooterComponent";
import AutomaticCarousel from "@/pages/home/components/AutomaticCarousel";
import ProductCarousel from "@/pages/home/components/ProductCarousel";
import LowStockCarousel from "@/pages/home/components/LowStockCarousel";
import { useRouter } from 'next/navigation';

const HomePage = () => {
    const router = useRouter();

    useEffect(() => {
        const initializeUserSession = () => {
            // Código existente...
        };

        initializeUserSession();
    }, [router]);

    return (
        <div>
            <Navbar/>

            {/* Contenedor para ProgressBarCarousel con ancho completo */}
            <div className="w-full h-auto">
                <ProgressBarCarousel/>
            </div>

            {/* Contenedor para ProductShowcase */}
            <div className="w-full mt-8">
                <ProductShowcase/>
            </div>
            <ProductCarousel/>

            {/* Banner integrado con LowStockCarousel */}
            <div className="w-full mt-8">
                <BannerSection/>
                <LowStockCarousel title="" subtitle="" />
            </div>

            {/* Centrar ValuesCard */}
            <div className="w-full mt-8">
                <ValuesCard/>
            </div>

            {/* Eliminamos BannerSection de aquí ya que ahora está arriba */}
            {/* <BannerSection/> */}

            <div>
                <FeaturedCategories/>
            </div>
            <AutomaticCarousel/>
            <FooterComponent/>
        </div>
    );
};

export default HomePage;