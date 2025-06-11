'use client'
import React from 'react';
import GenericCollectionPreview from '@/components/shared/collections/GenericCollectionPreview';

const CollectionPreview = () => {
    return (
        <GenericCollectionPreview 
            name="Billie Eilish"
            subname="Hit Me Hard and Soft"
            description="Explora nuevos productos de la mano de Billie Eilish"
            imageUrl="https://res.cloudinary.com/dhyv4dpk2/image/upload/v1747333712/vistelica/subcategorias/Hombre/Coleccion/chnqzrgnzbnqopnjqt55.jpg"
            releaseDate="14/06"
            mainColor="#121C6B"           // Azul
            accentColor="#FFA500"         // Naranja/amarillo
            hoverColor="#FFA500"          // Naranja/amarillo para hover
            gradientStart="#102365"       // Azul oscuro
            gradientEnd="#1F3CA2"         // Azul claro
            lineColor="#8CA6FF"           // Azul claro para líneas
            imageLeft={true}              // Imagen a la izquierda
            labelText="Productos"         // Etiqueta para productos
        />
    );
};

export default CollectionPreview;
