'use client'
import React from 'react';

const StylesShowcase = () => {
    // Datos de los estilos
    const styles = [
        {
            id: 1,
            name: 'STREETWEAR',
            image: 'https://picsum.photos/200/300?random=1',
            description: 'Estilo urbano inspirado en la cultura callejera'
        },
        {
            id: 2,
            name: 'CASUAL',
            image: 'https://picsum.photos/200/300?random=2',
            description: 'Looks cómodos para el día a día'
        },
        {
            id: 3,
            name: 'TRENDY',
            image: 'https://picsum.photos/200/300?random=3',
            description: 'Las últimas tendencias de la temporada'
        },
        {
            id: 4,
            name: 'BASIC',
            image: 'https://picsum.photos/200/300?random=4',
            description: 'Básicos atemporales para cualquier ocasión'
        }
    ];

    const componentStyles = {
        container: {
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            padding: '10px 0',
            borderBottom: '1px solid #eaeaea',
        },
        title: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#000',
        },
        arrow: {
            fontSize: '24px',
        },
        subtitle: {
            fontSize: '14px',
            maxWidth: '500px',
            color: '#333',
        },
        viewAllButton: {
            backgroundColor: '#fff',
            border: '1px solid #000',
            borderRadius: '25px',
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '15px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            padding: '10px 0',
        },
        styleCard: {
            position: 'relative',
            borderRadius: '0',
            overflow: 'hidden',
            aspectRatio: '3/4',
            scrollSnapAlign: 'start',
        },
        styleImage: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
        },
        styleName: {
            position: 'absolute',
            bottom: '20px',
            left: '0',
            width: '100%',
            textAlign: 'center',
            color: '#fff',
            fontSize: '18px',
            fontWeight: 'bold',
            textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
            backgroundColor: 'rgba(0,0,0,0.3)',
            padding: '10px 0',
        },
        responsiveContainer: {
            '@media (max-width: 768px)': {
                grid: {
                    gridTemplateColumns: 'repeat(2, 1fr)',
                },
            },
            '@media (max-width: 480px)': {
                grid: {
                    gridTemplateColumns: 'repeat(1, 1fr)',
                },
            },
        }
    };

    return (
        <div style={componentStyles.container}>
            <div style={componentStyles.header}>
                <div>
                    <div style={componentStyles.title}>
                        <span style={componentStyles.arrow}>→</span>
                        GET THE LOOK
                    </div>
                    <p style={componentStyles.subtitle}>
                        INSPÍRATE CON NUESTRA GALERÍA Y COMPARTE TUS LOOKS EN REDES SOCIALES CON @VÍSTELICA.
                    </p>
                </div>
                <button style={componentStyles.viewAllButton}>
                    <p style={componentStyles.subtitle}>
                        Ver todos los estilos
                    </p>

                </button>
            </div>

            <div style={componentStyles.grid}>
                {styles.map((style) => (
                    <div key={style.id} style={componentStyles.styleCard}>
                        <img
                            src={style.image}
                            alt={`Estilo ${style.name}`}
                            style={componentStyles.styleImage}
                        />
                        <div style={componentStyles.styleName}>
                            {style.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StylesShowcase;