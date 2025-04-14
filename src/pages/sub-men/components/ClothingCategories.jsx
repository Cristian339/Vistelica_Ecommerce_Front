'use client';

import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import categoryService from '@/services/categoryService';

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

    const imageMap = {
        'Camisetas': 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb',
        'Polo': 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb',
        'Pantalones': 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb',
        'Bermudas': 'https://images.unsplash.com/photo-1417325384643-aac51acc9e5d?q=75&fm=jpg&w=200&fit=max',
        'Chandal': 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb',
        'Sudaderas': 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb',
    };

    return (
        <Grid container spacing={1} sx={{ backgroundColor: '#ffffff', padding: '20px 0' }}>
            {subcategories.map((subcat) => (
                <Grid
                    item
                    key={subcat.subcategory_id}
                    xs={12} // 1 por fila en móvil
                    sm={6}  // 2 por fila en pantallas pequeñas (>600px)
                    md={4}  // 3 por fila en pantallas medianas (>900px)
                    lg={2}  // 6 por fila en pantallas grandes (>1200px)
                >
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '180px',
                        overflow: 'hidden',
                        cursor: 'pointer'
                    }}>
                        <img
                            src={imageMap[subcat.name] || `https://via.placeholder.com/300x300?text=${subcat.name}`}
                            alt={subcat.name}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease'
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.2)'
                        }}>
                            <span style={{
                                color: '#ffffff',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                textTransform: 'uppercase',
                                textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)'
                            }}>
                                {subcat.name}
                            </span>
                        </div>
                    </div>
                </Grid>
            ))}
        </Grid>
    );
};

export default ClothingCategories;
