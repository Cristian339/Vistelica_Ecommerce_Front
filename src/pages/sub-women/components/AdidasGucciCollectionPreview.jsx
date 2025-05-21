'use client'
import React, { useState } from 'react';

const AdidasGucciCollectionPreview = () => {
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
            backgroundColor: '#006341', // Verde Gucci
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
            justifyContent: 'space-between', // Distribuye el espacio entre los elementos
        },
        imageSection: {
            position: 'relative',
            width: '100%',
            height: '450px',
            flex: '1 1 65%',
            minWidth: '300px',
            backgroundColor: '#006341',
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
            opacity: 0.6,
            zIndex: 1,
            background: 'linear-gradient(135deg, #006341 0%, #3C9F6C 100%)', // Verde Gucci a verde claro
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
            padding: '25px 20px',
            flex: '1 1 35%',
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
            color: '#E6BE00', // Dorado para Gucci
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
            color: '#E6BE00', // Dorado para Gucci
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
            color: '#006341',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.9rem',
            marginTop: '15px',
            transition: 'all 0.3s ease',
        },
        buttonHovered: {
            backgroundColor: '#E6BE00',
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
            color: '#006341',
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
        backgroundColor: '#E6BE00', // Dorado para Gucci
        opacity: 0.4,
    }));

    return (
        <div style={styles.container}>
            <div style={{...styles.mainContainer, width: '100%'}}>
                <div style={styles.contentWrapper}>
                    {/* Sección de la imagen (izquierda) */}
                    <div style={{...styles.imageSection, order: 1}}>
                        {/* Fondo con efecto de plástico */}
                        <div style={styles.blueBackground}></div>
                        <div style={styles.plasticWrapEffect}>
                            {plasticLines.map((lineStyle, index) => (
                                <div key={index} style={lineStyle}></div>
                            ))}
                        </div>

                        {/* Imagen de la colección Adidas x Gucci */}
                        <div style={styles.artist}>
                            <img
                                src="https://res.cloudinary.com/dhyv4dpk2/image/upload/v1747852702/vistelica/subcategorias/Mujer/i5juqmyshdjd2zjmktwo.jpg"
                                alt="Adidas x Gucci Collection"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    objectPosition: 'center',
                                    zIndex: 5
                                }}
                            />
                        </div>
                    </div>

                    {/* Sección de texto (derecha) */}
                    <div style={{...styles.textSection, order: 2}}>
                        {/* Nombre de las marcas */}
                        <h2 style={styles.artistName}>Adidas<br />Gucci</h2>

                        {/* Nombre de la colección */}
                        <h3 style={styles.tourName}>Colección<br />Exclusiva</h3>


                        {/* Texto promocional en español */}
                        <p style={styles.promoText}>
                            Descubre nuestra colaboración especial<br />
                            Adidas x Gucci disponible el 15/06 en nuestra tienda
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

export default AdidasGucciCollectionPreview;