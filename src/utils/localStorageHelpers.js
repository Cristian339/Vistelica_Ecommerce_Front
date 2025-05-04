
/**
 * Funciones para manejar favoritos en localStorage
 * Estas funciones permiten gestionar la lista de deseos del usuario
 * cuando la API no está disponible o hay problemas de conexión.
 */

// Clave utilizada para el almacenamiento en localStorage
const WISHLIST_KEY = 'vistelica_wishlist';

/**
 * Obtiene la lista de deseos desde localStorage
 * @returns {Array} - Lista de productos favoritos
 */
export const getLocalWishlist = () => {
    if (typeof window === 'undefined') return [];

    try {
        const wishlist = localStorage.getItem(WISHLIST_KEY);
        return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
        console.error('Error al obtener favoritos del localStorage:', error);
        return [];
    }
};

/**
 * Guarda la lista de deseos en localStorage
 * @param {Array} products - Lista de productos a guardar
 * @returns {void}
 */
export const setLocalWishlist = (products) => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(products || []));
    } catch (error) {
        console.error('Error al guardar favoritos en localStorage:', error);
    }
};

/**
 * Añade un producto a la lista de deseos
 * @param {Object} product - Producto a añadir
 * @returns {Array} - Lista actualizada de favoritos
 */
export const addToLocalWishlist = (product) => {
    if (!product || !product.id) {
        console.error('Producto inválido para añadir a favoritos');
        return getLocalWishlist();
    }

    const wishlist = getLocalWishlist();

    // Verificar si el producto ya existe por id o product_id
    if (!wishlist.some(item => (item.id === product.id || item.product_id === product.id))) {
        const productToAdd = {
            id: product.id,
            product_id: product.id,
            name: product.name || 'Producto sin nombre',
            price: product.price || 0,
            image: product.image || product.images?.[0] || '',
            description: product.description || '',
            slug: product.slug || `product-${product.id}`
        };

        const updatedWishlist = [...wishlist, productToAdd];
        setLocalWishlist(updatedWishlist);
        return updatedWishlist;
    }

    return wishlist;
};

/**
 * Elimina un producto de la lista de deseos
 * @param {number|string} productId - ID del producto a eliminar
 * @returns {Array} - Lista actualizada de favoritos
 */
export const removeFromLocalWishlist = (productId) => {
    if (!productId) return getLocalWishlist();

    const wishlist = getLocalWishlist();
    const updatedWishlist = wishlist.filter(product =>
        product.id !== productId && product.product_id !== productId
    );

    setLocalWishlist(updatedWishlist);
    return updatedWishlist;
};

/**
 * Verifica si un producto está en la lista de deseos
 * @param {number|string} productId - ID del producto a verificar
 * @returns {boolean} - true si el producto está en favoritos
 */
export const isInLocalWishlist = (productId) => {
    if (!productId) return false;

    const wishlist = getLocalWishlist();
    return wishlist.some(product =>
        product.id === productId || product.product_id === productId
    );
};

/**
 * Obtiene el número de productos en la lista de deseos
 * @returns {number} - Cantidad de productos en favoritos
 */
export const getLocalWishlistCount = () => {
    return getLocalWishlist().length;
};

/**
 * Limpia toda la lista de deseos
 * @returns {void}
 */
export const clearLocalWishlist = () => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(WISHLIST_KEY);
    } catch (error) {
        console.error('Error al limpiar favoritos del localStorage:', error);
    }
};

/**
 * Sincroniza la lista local con una lista del servidor
 * @param {Array} serverWishlist - Lista de productos del servidor
 * @returns {Array} - Lista combinada y actualizada
 */
export const syncLocalWishlist = (serverWishlist = []) => {
    const localWishlist = getLocalWishlist();

    // Combinar productos del servidor con los locales
    const combinedWishlist = [...serverWishlist];

    // Añadir productos locales que no estén en la lista del servidor
    localWishlist.forEach(localProduct => {
        if (!combinedWishlist.some(item =>
            item.id === localProduct.id || item.product_id === localProduct.id
        )) {
            combinedWishlist.push(localProduct);
        }
    });

    setLocalWishlist(combinedWishlist);
    return combinedWishlist;
};