'use client'
import React from 'react';

const CollectionPreview = () => {
    // Dado que no podemos usar la imagen adjuntada directamente,
    // deberíamos usar una URL a la imagen real o un placeholder
    // Para este ejemplo, usaré un placeholder y agregamos el texto como se muestra en la imagen

    const styles = {
        container: {
            width: '100%',
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
            overflow: 'hidden',
            position: 'relative',
        },
        collectionWrapper: {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '1200px',
            position: 'relative',
        },
        imageContainer: {
            position: 'relative',
            width: '45%',
            margin: '0 1%',
            overflow: 'hidden',
        },
        image: {
            width: '100%',
            height: 'auto',
            display: 'block',
            borderRadius: '8px',
        },
        blueOutline: {
            position: 'absolute',
            top: '5%',
            left: '10%',
            width: '80%',
            height: '90%',
            border: '3px dashed #00a0ff',
            borderRadius: '50%',
            zIndex: 2,
            pointerEvents: 'none',
        },
        spoilerText: {
            position: 'absolute',
            bottom: '15%',
            left: '0',
            width: '100%',
            textAlign: 'center',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#000',
            textTransform: 'uppercase',
        },
        titleContainer: {
            position: 'absolute',
            bottom: '8%',
            left: '0',
            width: '100%',
            textAlign: 'center',
        },
        title: {
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#000',
            fontFamily: 'Arial, sans-serif',
            textTransform: 'lowercase',
            letterSpacing: '1px',
        },
        backgroundHands: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.3,
            zIndex: 0,
            pointerEvents: 'none',
        }
    };

    return (
        <div style={styles.container}>
            {/* Manos de fondo */}
            <div style={styles.backgroundHands}>
                {/* Aquí irían los elementos decorativos de manos en el fondo */}
            </div>

            <div style={styles.collectionWrapper}>
                {/* Primera imagen - Modelo con camiseta negra/blanca */}
                <div style={styles.imageContainer}>
                    <img
                        src="https://i.ytimg.com/vi/KgUFIfNr5Q8/hqdefault.jpg"
                        alt="Modelo con camiseta de diseño"
                        style={styles.image}
                    />
                    <div style={styles.blueOutline}></div>
                </div>

                {/* Segunda imagen - Modelo con camiseta blanca */}
                <div style={styles.imageContainer}>
                    <img
                        src="https://i.ytimg.com/vi/KgUFIfNr5Q8/hqdefault.jpg"
                        alt="Modelo con camiseta blanca de la colección"
                        style={styles.image}
                    />
                    <div style={styles.blueOutline}></div>
                </div>
            </div>

            {/* Texto de spoiler */}
            <div style={styles.spoilerText}>
                SPOILER DE LA PRÓXIMA COLECCIÓN
            </div>

            {/* Título de la colección */}
            <div style={styles.titleContainer}>
                <h1 style={styles.title}>VEGETTA 777 & Willyrex</h1>
            </div>
        </div>
    );
};

export default CollectionPreview;