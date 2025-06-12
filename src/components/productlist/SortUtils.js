/**
 * Ordena una colección de productos según el criterio especificado.
 *
 * @param {Array} products - Array de productos a ordenar
 * @param {string} sortOption - Criterio de ordenación
 * @returns {Array} - Array de productos ordenados
 */
export const sortProducts = (products, sortOption) => {
    // Validación de entrada
    if (!Array.isArray(products) || products.length <= 1) {
        return [...(products || [])];
    }

    // Creación de una copia para no modificar el array original
    const sortedProducts = [...products];

    // Cache para valores calculados frecuentemente
    const priceCache = new Map();
    const dateCache = new Map();

    /**
     * Obtiene el precio actual considerando descuentos (con caché)
     */
    const getCurrentPrice = (product) => {
        if (!product) return 0;

        const productId = product.id || product._id;
        if (productId && priceCache.has(productId)) {
            return priceCache.get(productId);
        }

        let price = 0;
        if (product.discountedPrice !== undefined) {
            price = Number(product.discountedPrice);
        } else if (product.originalPrice !== undefined) {
            price = Number(product.originalPrice);
        } else if (product.price !== undefined) {
            price = Number(product.price);
        }

        // Almacenar en caché si tenemos un ID
        if (productId) {
            priceCache.set(productId, price);
        }

        return isNaN(price) ? 0 : price;
    };

    /**
     * Obtiene la fecha de creación como objeto Date (con caché)
     */
    const getCreationDate = (product) => {
        if (!product) return new Date(0);

        const productId = product.id || product._id;
        if (productId && dateCache.has(productId)) {
            return dateCache.get(productId);
        }

        let date;
        try {
            date = product.createdAt ? new Date(product.createdAt) : new Date(0);

            // Validar que la fecha es válida
            if (isNaN(date.getTime())) {
                date = new Date(0);
            }
        } catch (e) {
            date = new Date(0);
        }

        // Almacenar en caché
        if (productId) {
            dateCache.set(productId, date);
        }

        return date;
    };

    // Opciones para comparaciones de texto sensibles a locale
    const collatorOptions = { numeric: true, sensitivity: 'base' };
    const collator = new Intl.Collator(undefined, collatorOptions);

    // Ordenamiento según criterio
    switch (sortOption) {
        case 'precio-asc':
            return sortedProducts.sort((a, b) => getCurrentPrice(a) - getCurrentPrice(b));

        case 'precio-desc':
            return sortedProducts.sort((a, b) => getCurrentPrice(b) - getCurrentPrice(a));

        case 'valoracion':
            return sortedProducts.sort((a, b) =>
                ((b?.rating || 0) - (a?.rating || 0)) ||
                ((b?.numReviews || 0) - (a?.numReviews || 0))
            );

        case 'nombre-asc':
            return sortedProducts.sort((a, b) =>
                collator.compare(a?.name || '', b?.name || '')
            );

        case 'nombre-desc':
            return sortedProducts.sort((a, b) =>
                collator.compare(b?.name || '', a?.name || '')
            );

        case 'nuevo':
            return sortedProducts.sort((a, b) =>
                getCreationDate(b).getTime() - getCreationDate(a).getTime()
            );

        case 'antiguo':
            return sortedProducts.sort((a, b) =>
                getCreationDate(a).getTime() - getCreationDate(b).getTime()
            );

        case 'relevancia':
        default:
            return sortedProducts;
    }
};