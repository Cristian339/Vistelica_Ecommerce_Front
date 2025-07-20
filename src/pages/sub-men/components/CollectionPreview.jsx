import React from 'react';
import GenericCollectionPreview from '@/components/shared/collections/GenericCollectionPreview';

const CollectionPreview = () => {
    return (
        <GenericCollectionPreview
            name="Vintage Style"
            subname="Retro Collection 2024"
            description="Descubre nuestra colección inspirada en la moda vintage y los clásicos atemporales."
            imageUrl="https://res.cloudinary.com/dnehunzxx/image/upload/v1752881113/man-4035612_1920_tqltot.jpg" // Imagen libre de copyright de Pixabay
            releaseDate="20/08"
            mainColor="#7C3F00"         // Marrón vintage
            accentColor="#FFD700"        // Mostaza
            hoverColor="#B22234"         // Burdeos
            gradientStart="#F5E9DA"      // Beige claro
            gradientEnd="#7C3F00"        // Marrón
            lineColor="#B22234"          // Burdeos
            imageLeft={true}
            labelText="Productos"
        />
    );
};

export default CollectionPreview;