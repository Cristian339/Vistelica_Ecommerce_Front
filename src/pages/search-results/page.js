'use client';
import React, { useEffect, useState, useCallback, memo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Container, Typography, Alert } from '@mui/material';
import Head from 'next/head';
import productService from '@/services/productService';
import SearchResults from './components/SearchResults';
import Navbar from "@/components/layout/HeaderComponent";
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';

const SearchResultsPage = memo(function SearchResultsPage() {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('query') || '';
    const categoryIdsParam = searchParams.get('categories');

    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Optimización del método fetch con useCallback
    const fetchResults = useCallback(async () => {
        if (!searchQuery) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const categoryIds = categoryIdsParam ? categoryIdsParam.split(',').map(Number) : [];
            const data = await productService.getProductsBasicInfo(searchQuery, categoryIds);
            setResults(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching search results:', error);
            setError('No se pudieron cargar los resultados. Por favor, inténtalo de nuevo.');
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, categoryIdsParam]);

    // Efecto para cargar los datos
    useEffect(() => {
        fetchResults();
    }, [fetchResults]);

    // Título dinámico para SEO
    const pageTitle = searchQuery
        ? `Resultados para "${searchQuery}" | Vistelica`
        : 'Búsqueda de productos | Vistelica';

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta
                    name="description"
                    content={`Explora los resultados de búsqueda para ${searchQuery} en Vistelica. Encuentra productos y ofertas.`}
                />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:type" content="website" />
            </Head>

            <Box
                component="main"
                id="main-content"
                className="min-h-screen"
                sx={{
                    backgroundColor: vistelicaColors.backgroundLight,
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Navbar />

                <Container
                    component="section"
                    maxWidth={false}
                    disableGutters
                    sx={{ flex: 1 }}
                >
                    {error ? (
                        <Alert
                            severity="error"
                            sx={{
                                maxWidth: "xl",
                                mx: "auto",
                                mt: 4,
                                borderRadius: 2
                            }}
                            aria-live="assertive"
                        >
                            {error}
                        </Alert>
                    ) : (
                        <SearchResults
                            results={results}
                            isLoading={isLoading}
                            searchQuery={searchQuery}
                        />
                    )}
                </Container>
            </Box>
        </>
    );
});

SearchResultsPage.displayName = 'SearchResultsPage';

export default SearchResultsPage;