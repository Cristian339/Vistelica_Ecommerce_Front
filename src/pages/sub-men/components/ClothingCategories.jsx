'use client';

import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/navigation';
import categoryService from '@/services/categoryService';
import Box from '@mui/material/Box';

const ClothingCategories = () => {
    const [subcategories, setSubcategories] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const loadSubcategories = async () => {
            try {
                const categories = await categoryService.fetchCategories();

                const hombreCategory = categories.find(
                    (cat) => cat.name.toLowerCase() === 'hombre'
                );

                if (hombreCategory?.subcategories) {
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

    // Función para navegar a la página de productos filtrada por subcategoría
    const handleCategoryClick = (subcat) => {
        // Guardar en localStorage para sincronizar con el sidebar
        localStorage.setItem('selectedCategory', 'hombre');
        localStorage.setItem('selectedSubcategory', subcat.subcategory_id.toString());

        // Navegar a la página de productos con filtrado
        router.push(`/product-list?category=hombre&subcategory=${subcat.subcategory_id}&name=${encodeURIComponent(subcat.name)}`);
    };

    return (
        <Grid container spacing={1} sx={{ backgroundColor: '#ffffff', padding: '20px 0' }}>
            {subcategories.map((subcat) => (
                <Grid
                    item
                    key={subcat.subcategory_id}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={2}
                    onClick={() => handleCategoryClick(subcat)}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            width: '100%',
                            height: '180px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                '& img': {
                                    transform: 'scale(1.05)'
                                },
                                '& .overlay': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                                }
                            }
                        }}
                    >
                        <img
                            src={subcat.image_url_sub}
                            alt={subcat.name}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease'
                            }}
                        />
                        <Box
                            className="overlay"
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                transition: 'background-color 0.3s ease'
                            }}
                        >
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
                        </Box>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
};

export default ClothingCategories;