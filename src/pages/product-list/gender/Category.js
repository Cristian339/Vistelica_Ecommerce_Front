import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import productService from '../../../services/productService';
import ProductGrid from '../components/ProductGrid';
import FilterSidebar from '../components/FilterSidebar';
import SortDropdown from '../components/SortDropdown';
import { sortProducts } from '../components/SortUtils';
const CategoryPage = () => {
    const { query } = useRouter();
    const { gender, category } = query;

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortOption, setSortOption] = useState('relevancia');
    const [filters, setFilters] = useState({
        brands: [],
        colors: [],
        ratings: [],
        priceMin: null,
        priceMax: null,
    });

    const [showFilters, setShowFilters] = useState(true);
    const [categoryTitle, setCategoryTitle] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getAll();
                const base = data.filter(product => {
                    return (
                        product.gender?.toLowerCase() === gender?.toLowerCase() &&
                        (category === 'todos' || product.category?.toLowerCase() === category?.toLowerCase())
                    );
                });

                setProducts(base);
                setCategoryTitle(category?.charAt(0).toUpperCase() + category?.slice(1));
            } catch (err) {
                console.error('Error al cargar productos:', err.message);
            }
        };

        fetchProducts();
    }, [gender, category]);

    useEffect(() => {
        let result = [...products];

        // Filtro por marcas
        if (filters.brands.length > 0) {
            result = result.filter(p => filters.brands.includes(p.brand));
        }

        // Filtro por colores
        if (filters.colors.length > 0) {
            result = result.filter(p => filters.colors.includes(p.color));
        }

        // Filtro por rating
        if (filters.ratings.length > 0) {
            result = result.filter(p => filters.ratings.includes(Math.floor(p.rating)));
        }

        // Filtro por precio
        if (filters.priceMin !== null && filters.priceMin !== '') {
            result = result.filter(p => p.price >= filters.priceMin);
        }
        if (filters.priceMax !== null && filters.priceMax !== '') {
            result = result.filter(p => p.price <= filters.priceMax);
        }

        // Ordenamiento
        result = sortProducts(result, sortOption);

        setFilteredProducts(result);
    }, [filters, sortOption, products]);

    return (
        <div className="flex px-6 py-8 gap-6">
            {showFilters && (
                <div className="w-64 transition-opacity duration-300">
                    <FilterSidebar setFilters={setFilters} filters={filters} />
                </div>
            )}

            <div className="flex-1">
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-3xl font-semibold">
                        {categoryTitle} ({filteredProducts.length})
                    </h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="text-sm text-gray-500 hover:text-black transition"
                        >
                            {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
                        </button>
                        <SortDropdown onSortChange={setSortOption} />
                    </div>
                </div>

                <ProductGrid products={filteredProducts} />
            </div>
        </div>
    );
};

export default CategoryPage;
