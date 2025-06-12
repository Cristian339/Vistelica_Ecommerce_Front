'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import productService from '@/services/productService';
import SearchResults from './components/SearchResults';
import Navbar from "@/components/layout/HeaderComponent";

// Componente que usa useSearchParams
function SearchResultsContent() {
    const searchParams = useSearchParams();
    const searchQuery = searchParams?.get('query');
    const categoryIdsParam = searchParams?.get('categories');

    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const categoryIds = categoryIdsParam ? categoryIdsParam.split(',').map(Number) : [];
                const data = await productService.getProductsBasicInfo(searchQuery, categoryIds);

                if (data && Array.isArray(data)) {
                    setResults(data);
                } else if (data) {
                    setResults(data.products || data.data || []);
                } else {
                    setResults([]);
                }
            } catch (error) {
                console.error('Error fetching search results:', error);
                setError(error.message || 'Error al buscar productos');
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (searchQuery && searchQuery.trim()) {
            fetchResults();
        } else {
            setIsLoading(false);
            setResults([]);
        }
    }, [searchQuery, categoryIdsParam]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p>Cargando resultados...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <SearchResults
            results={results}
            isLoading={isLoading}
            searchQuery={searchQuery}
        />
    );
}

// Componente de carga mientras se monta el componente con useSearchParams
function SearchResultsLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <p>Cargando...</p>
        </div>
    );
}

// Componente principal que envuelve todo en Suspense
export default function SearchResultsPage() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <Suspense fallback={<SearchResultsLoading />}>
                <SearchResultsContent />
            </Suspense>
        </div>
    );
}