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
                    sessionId = self.crypto.randomUUID();
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
            <div className="w-full mt-8">
                <ValuesCard/>
            </div>

            {/* Contenedor para Banner con Material UI */}
            <BannerSection/>

            <div>
                <FeaturedCategories/>
            </div>
            <AutomaticCarousel/>
            <FooterComponent/>
        </div>
    );
};

export default HomePage;