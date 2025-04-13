'use client';

import React, { useEffect, useState } from 'react';
import categoryService from '@/services/categoryService'; // Ajusta el path si es diferente

const ClothingCategories = () => {
    const [subcategories, setSubcategories] = useState([]);

    useEffect(() => {
        const loadSubcategories = async () => {
            try {
                const categories = await categoryService.fetchCategories();

                const hombreCategory = categories.find(
                    (cat) => cat.name.toLowerCase() === 'hombre'
                );

                if (hombreCategory && hombreCategory.subcategories) {
                    const visibles = hombreCategory.subcategories.filter(
                        (sub) => !sub.discard
                    );
                    setSubcategories(visibles);
                }
            } catch (error) {
                console.error('Error al cargar subcategorías de Hombre:', error);
            }
        };

        loadSubcategories();
    }, []);

    // Mapa de imágenes (usa URLs reales si las tienes)
    const imageMap = {
        'Camisetas': 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb',
        'Polo': 'https://images.unsplash.com/photo-1562158070-7bfc3b5ad9a5',
        'Pantalones': 'https://images.unsplash.com/photo-1587385789090-871c6de24d0e',
        'Bermudas': 'https://images.unsplash.com/photo-1624378441939-1c2f1c4a0a14',
        'Chandal': 'https://images.unsplash.com/photo-1585081895257-4e6e7e472d99',
        'Sudaderas': 'https://images.unsplash.com/photo-1520975979642-45d3f32cc7cd',

    };

    const styles = {
        container: {
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
            padding: '20px 0'
        },
        categoryItem: {
            position: 'relative',
            width: 'calc(16.666% - 4px)',
            height: '300px',
            margin: '2px',
            overflow: 'hidden',
            cursor: 'pointer'
        },
        image: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
        },
        overlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.2)'
        },
        categoryName: {
            color: '#ffffff',
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
            textTransform: 'uppercase',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)'
        }
    };

    return (
        <div style={styles.container}>
            {subcategories.map((subcat) => (
                <div key={subcat.subcategory_id} style={styles.categoryItem}>
                    <img
                        src={imageMap[subcat.name] || `https://via.placeholder.com/300x300?text=${subcat.name}`}
                        alt={subcat.name}
                        style={styles.image}
                    />
                    <div style={styles.overlay}>
                        <span style={styles.categoryName}>{subcat.name}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ClothingCategories;
