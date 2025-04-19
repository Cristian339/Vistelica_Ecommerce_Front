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
                >
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '180px',
                        overflow: 'hidden',
                        cursor: 'pointer'
                    }}>
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
