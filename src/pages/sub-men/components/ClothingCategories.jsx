'use client'
import React from 'react';

const ClothingCategories = () => {
    // Categorías de ropa como en la imagen
    const categories = [
        { name: 'CAMISETAS', image: 'https://images.unsplash.com/photo-1417325384643-aac51acc9e5d?q=75&fm=jpg&w=400&fit=max' },
        { name: 'JEANS', image: 'https://images.unsplash.com/photo-1417325384643-aac51acc9e5d?q=75&fm=jpg&w=400&fit=max' },
        { name: 'SUDADERAS', image: 'https://images.unsplash.com/photo-1417325384643-aac51acc9e5d?q=75&fm=jpg&w=400&fit=max' },
        { name: 'BERMUDAS', image: 'https://images.unsplash.com/photo-1417325384643-aac51acc9e5d?q=75&fm=jpg&w=400&fit=max' },
        { name: 'CAMISAS', image: 'https://images.unsplash.com/photo-1417325384643-aac51acc9e5d?q=75&fm=jpg&w=400&fit=max' },
        { name: 'BAÑADORES', image: 'https://images.unsplash.com/photo-1417325384643-aac51acc9e5d?q=75&fm=jpg&w=400&fit=max' }
    ];

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
            overflow: 'hidden'
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
            {categories.map((category, index) => (
                <div key={index} style={styles.categoryItem}>
                    <img src={category.image} alt={category.name} style={styles.image} />
                    <div style={styles.overlay}>
                        <span style={styles.categoryName}>{category.name}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ClothingCategories;