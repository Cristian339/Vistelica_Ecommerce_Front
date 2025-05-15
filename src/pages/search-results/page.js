'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import productService from '@/services/productService';
import SearchResults from './components/SearchResults';
import Navbar from "@/components/layout/HeaderComponent";

export default function SearchResultsPage() {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('query');
    const categoryIdsParam = searchParams.get('categories');

    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setIsLoading(true);
                const categoryIds = categoryIdsParam ? categoryIdsParam.split(',').map(Number) : [];
                const data = await productService.getProductsBasicInfo(searchQuery, categoryIds);
                setResults(data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (searchQuery) {
            fetchResults();
        }
    }, [searchQuery, categoryIdsParam]);

    return (
        <div className="min-h-screen">
            <Navbar />
            <SearchResults
                results={results}
                isLoading={isLoading}
                searchQuery={searchQuery}
            />
        </div>
    );
}