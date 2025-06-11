'use client'
import React from 'react';
import GenericCollectionPreview from '@/components/shared/collections/GenericCollectionPreview';

const AdidasGucciCollectionPreview = () => {
    return (
        <GenericCollectionPreview 
            name="Adidas Gucci"
            subname="Colección Exclusiva"
            description="Descubre nuestra colaboración especial Adidas x Gucci"
            imageUrl="https://res.cloudinary.com/dhyv4dpk2/image/upload/v1747852702/vistelica/subcategorias/Mujer/i5juqmyshdjd2zjmktwo.jpg"
            releaseDate="15/06"
            mainColor="#006341"           // Verde Gucci
            accentColor="#E6BE00"         // Dorado para Gucci
            hoverColor="#E6BE00"          // Dorado para hover
            gradientStart="#006341"       // Verde Gucci 
            gradientEnd="#3C9F6C"         // Verde claro
            lineColor="#E6BE00"           // Líneas doradas
            imageLeft={true}              // Imagen a la izquierda
            labelText=""                  // Sin etiqueta
        />
    );
};

export default AdidasGucciCollectionPreview;
