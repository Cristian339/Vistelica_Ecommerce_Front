export const sortProducts = (products, sortOption) => {
    let sortedProducts = [...products];

    switch (sortOption) {
        case 'precio-asc':
            return sortedProducts.sort((a, b) => a.price - b.price);
        case 'precio-desc':
            return sortedProducts.sort((a, b) => b.price - a.price);
        case 'valoracion':
            return sortedProducts.sort((a, b) => b.rating - a.rating);
        case 'nombre-asc':
            return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        case 'nombre-desc':
            return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        case 'relevancia':
        default:
            return sortedProducts;
    }
};