'use client'
import React, { useState } from 'react';

const StrangerThingsCollectionPreview = () => {
    const [isHovered, setIsHovered] = useState(false);

    const styles = {
        container: {
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
        },
        mainContainer: {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#1A0315', // Fondo oscuro para Stranger Things (tono purpura oscuro)
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            width: '100vw', // Ancho completo de la ventana
        },
        contentWrapper: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap', // Para que sea responsive
            width: '100%',
            maxWidth: '100vw',
        },
        imageSection: {
            position: 'relative',
            width: '100%',
            height: '500px',
            flex: '1 1 60%',
            minWidth: '300px',
            backgroundColor: '#1A0315',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        blueBackground: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.7,
            zIndex: 1,
            background: 'linear-gradient(135deg, #1A0315 0%, #500A3C 100%)', // Gradiente oscuro a rojizo/morado
        },
        plasticWrapEffect: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0.2,
            zIndex: 2,
        },
        artist: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
        },
        textSection: {
            padding: '30px 20px',
            flex: '1 1 40%',
            minWidth: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 10,
        },
        artistName: {
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#E62C2F', // Rojo para Stranger Things
            marginBottom: '5px',
            lineHeight: '1',
            textTransform: 'uppercase',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '1px',
            marginTop: '0',
        },
        tourName: {
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: '#E62C2F', // Rojo para Stranger Things
            marginBottom: '5px',
            lineHeight: '1.1',
            textTransform: 'uppercase',
            fontFamily: 'Arial, sans-serif',
        },
        tourLabel: {
            fontSize: '1.2rem',
            color: '#EEE',
            marginBottom: '30px',
            textTransform: 'uppercase',
        },
        promoText: {
            fontSize: '1rem',
            margin: '20px 0',
            lineHeight: '1.4',
        },
        button: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 20px',
            borderRadius: '50px',
            backgroundColor: 'white',
            color: '#1A0315',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.9rem',
            marginTop: '15px',
            transition: 'all 0.3s ease',
        },
        buttonHovered: {
            backgroundColor: '#E62C2F',
        },
        buttonIcon: {
            marginLeft: '8px',
            width: '16px',
            height: '16px',
        },
        accessibilityButton: {
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            width: '30px',
            height: '30px',
            backgroundColor: 'white',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1A0315',
            zIndex: 20,
        }
    };

    // Crea líneas para simular el efecto plástico
    const plasticLines = Array.from({ length: 20 }).map((_, index) => ({
        height: '1px',
        width: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        transform: `rotate(${Math.random() * 360}deg)`,
        position: 'absolute',
        backgroundColor: '#E62C2F', // Lineas rojas para efecto ST
        opacity: 0.4,
    }));

    return (
        <div style={styles.container}>
            <div style={{...styles.mainContainer, width: '100%'}}>
                <div style={styles.contentWrapper}>
                    {/* Sección de la imagen (izquierda) */}
                    <div style={styles.imageSection}>
                        {/* Fondo con efecto de plástico */}
                        <div style={styles.blueBackground}></div>
                        <div style={styles.plasticWrapEffect}>
                            {plasticLines.map((lineStyle, index) => (
                                <div key={index} style={lineStyle}></div>
                            ))}
                        </div>

                        {/* Imagen de la colección Stranger Things */}
                        <div style={styles.artist}>
                            <img
                                src="https://res.cloudinary.com/dhyv4dpk2/image/upload/v1747850681/vistelica/subcategorias/Chica/dutqii5vmisykfo7br45.jpg"
                                alt="Stranger Things Collection"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                    zIndex: 5
                                }}
                            />
                        </div>
                    </div>

                    {/* Sección de texto (derecha) */}
                    <div style={styles.textSection}>
                        {/* Nombre de la serie */}
                        <h2 style={styles.artistName}>Stranger<br />Things</h2>

                        {/* Nombre de la colección */}
                        <h3 style={styles.tourName}>Colección<br />Exclusiva</h3>

                        {/* Etiqueta "Productos" */}
                        <p style={styles.tourLabel}></p>

                        {/* Texto promocional en español */}
                        <p style={styles.promoText}>
                            Descubre nuestra colección exclusiva<br />
                            Stranger Things disponible el 20/07 en nuestra tienda
                        </p>

                        {/* Botón CTA */}
                        <button
                            style={{
                                ...styles.button,
                                ...(isHovered ? styles.buttonHovered : {})
                            }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            Explorar productos
                            <svg style={styles.buttonIcon} viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StrangerThingsCollectionPreview;