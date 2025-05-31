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
import { useRouter } from 'next/navigation';
import LowStockCarousel from "@/pages/home/components/LowStockCarousel";

const HomePage = () => {
    const router = useRouter();

    useEffect(() => {
        const initializeUserSession = () => {
            // Evitar múltiples inicializaciones
            if (typeof window === 'undefined' || localStorage.getItem('sessionInitialized')) return;

            // 1. Verificar si ya tiene token de autenticación (usando 'token')
            const token = localStorage.getItem('token');
            if (!token) {

                localStorage.removeItem('token');
                // 2. Verificar si ya tiene sessionId
                let sessionId = localStorage.getItem('sessionId');

                if (!sessionId) {
                    // 3. Generar nuevo sessionId si no existe
                    sessionId = typeof crypto !== 'undefined' && crypto.randomUUID
                        ? crypto.randomUUID()
                        : ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                            (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4)).toString(16)
                        );
                    localStorage.setItem('sessionId', sessionId);
                }
            }

            localStorage.setItem('sessionInitialized', 'true');
        }; // Marcar como inicializado


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

            {/* Centrar ValuesCard */}
            <Box className="w-full mb-8" mb={6}>
                <ValuesCard />
            </Box>
            {/* Contenedor para Banner con Material UI */}
            <BannerSection/>
            <LowStockCarousel/>
            <div>
                <FeaturedCategories/>
            </div>
            <AutomaticCarousel/>
            <FooterComponent/>
        </div>
    );
};

export default HomePage;