'use client'
import React from 'react';
import GenericCollectionPreview from '@/components/shared/collections/GenericCollectionPreview';

const ArtDecoCollectionPreview = () => {
    return (
        <GenericCollectionPreview
            name="Glamour Deco"
            subname="Elegancia Geométrica"
            description="Revive la sofisticación de los años 20 con nuestra colección inspirada en el Art Deco, donde los patrones geométricos y destellos dorados se encuentran con siluetas modernas"
            imageUrl="https://res.cloudinary.com/dnehunzxx/image/upload/v1752882068/fashion-4819420_1920_vep3mv.jpg"
            releaseDate="25/08"
            mainColor="#14213D"           // Azul marino profundo
            accentColor="#E0B85F"         // Dorado art deco
            hoverColor="#E0B85F"          // Dorado para hover
            gradientStart="#14213D"       // Azul marino profundo
            gradientEnd="#343A61"         // Azul más claro
            lineColor="#E0B85F"           // Líneas doradas
            imageLeft={false}             // Imagen a la derecha para variación
            labelText="Art Deco"          // Etiqueta temática
        />
    );
};

export default ArtDecoCollectionPreview;