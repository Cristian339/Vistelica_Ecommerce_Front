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
                    (cat) => cat.name.toLowerCase() === 'mujer'
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
    const handleCategoryClick = async (subcat) => {
        console.log("Subcategoría clickeada:", subcat);
        const categories = await categoryService.fetchCategories();

        // Encuentra la categoría "Hombre" y asigna su category_id
        const hombreCategory = categories.find(
            (cat) => cat.name.toLowerCase() === 'hombre'
        );

        const categoryId = hombreCategory ? hombreCategory.category_id : '';
        const categorySlug = hombreCategory ? hombreCategory.slug || 'hombre' : 'hombre';

        // Guardar en localStorage para posible uso posterior
        localStorage.setItem('selectedCategory', categoryId);
        localStorage.setItem('selectedSubcategory', subcat.subcategory_id);


        const subcategorySlug = subcat.slug || subcat.subcategory_id;

        router.push(`/product-list/productList?category=${categorySlug}&subcategory=${subcategorySlug}`);
    };


    return (
        <Grid container spacing={1} sx={{ backgroundColor: '#ffffff', padding: '20px 0', paddingLeft: '20px', }}>
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
                            height: '300px',
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