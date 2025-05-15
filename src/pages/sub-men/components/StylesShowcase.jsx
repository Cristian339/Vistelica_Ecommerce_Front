'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styleService from '@/services/styleService'; // Ajusta la ruta según tu proyecto

const StylesShowcase = () => {
    const [styles, setStyles] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchStyles = async () => {
            try {
                const data = await styleService.getAllStyles();
                const mapped = data.map(style => {
                    const mainImage = style.styleImages?.find(img => img.is_main);
                    return {
                        id: style.style_id,
                        name: style.name,
                        description: style.description,
                        image: mainImage?.image_url || 'https://via.placeholder.com/300x400?text=No+Image'
                    };
                });
                setStyles(mapped);
            } catch (error) {
                console.error('Error al cargar estilos:', error.message);
            }
        };

        fetchStyles();
    }, []);

    // Función para navegar al StylePage con el ID seleccionado
    const handleStyleClick = (styleId) => {
        router.push(`/styles/${styleId}`);
    };

    // Función para ver todos los estilos
    const handleViewAllStyles = () => {
        router.push('/styles');
    };

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
            cursor: 'pointer', // Añadir cursor pointer para indicar que es clickeable
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
                transform: 'scale(1.03)',
            },
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
                        INSPÍRATE CON NUESTRA ESTILOS ESPECIALES Y COMPARTE TUS LOOKS EN REDES SOCIALES CON @VÍSTELICA.
                    </p>
                </div>
                <button
                    style={componentStyles.viewAllButton}
                    onClick={handleViewAllStyles}
                >
                    <p style={componentStyles.subtitle}>
                        Ver los estilos
                    </p>
                </button>
            </div>

            <div style={componentStyles.grid}>
                {styles.map((style) => (
                    <div
                        key={style.id}
                        style={{
                            ...componentStyles.styleCard,
                            cursor: 'pointer',
                        }}
                        onClick={() => handleStyleClick(style.id)}
                    >
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