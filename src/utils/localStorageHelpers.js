// Funciones para manejar favoritos en localStorage

export const getLocalWishlist = () => {
    if (typeof window === 'undefined') return [];

    try {
        const wishlist = localStorage.getItem('vistelica_wishlist');
        return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
        console.error('Error al obtener favoritos del localStorage:', error);
        return [];
    }
};

export const setLocalWishlist = (products) => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem('vistelica_wishlist', JSON.stringify(products));
    } catch (error) {
        console.error('Error al guardar favoritos en localStorage:', error);
    }
};

export const addToLocalWishlist = (product) => {
    const wishlist = getLocalWishlist();
    if (!wishlist.some(item => item.id === product.id)) {
        const updatedWishlist = [...wishlist, product];
        setLocalWishlist(updatedWishlist);
        return updatedWishlist;
    }
    return wishlist;
};

export const removeFromLocalWishlist = (productId) => {
    const wishlist = getLocalWishlist();
    const updatedWishlist = wishlist.filter(product => product.id !== productId);
    setLocalWishlist(updatedWishlist);
    return updatedWishlist;
};