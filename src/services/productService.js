import axios from 'axios';

// URL base para las peticiones API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Obtiene todos los productos desde el servidor
 * @returns {Promise<Array>} Lista de productos
 */
const getAll = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudieron cargar los productos. Inténtalo más tarde.'
        );
    }
};

/**
 * Obtiene un producto por su ID
 * @param {string} id - ID del producto
 * @returns {Promise<Object>} Datos del producto
 */
const getById = async (id) => {
    try {
        console.log("El id usado fue: "+id);
        const response = await axios.get(`${API_URL}/products/${id}`);
        console.log("Info producto: " + JSON.stringify(response));
        return response.data;
    } catch (error) {
        console.error(`Error al obtener producto con ID ${id}:`, error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudo cargar el producto solicitado'
        );
    }
};

/**
 * Obtiene productos filtrados por categoría y subcategoría
 * @param {string} categoryId - ID de la categoría
 * @param {string} subcategoryId - ID de la subcategoría
 * @returns {Promise<Array>} Lista de productos filtrados
 */
const getByCategoryAndSubcategory = async (categoryId, subcategoryId) => {
    try {
        const response = await axios.get(`${API_URL}/products/category/${categoryId}/subcategory/${subcategoryId}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener productos por categoría ${categoryId} y subcategoría ${subcategoryId}:`, error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudieron cargar los productos para esta categoría y subcategoría.'
        );
    }
};

/**
 * Obtiene todas las imágenes principales de los productos
 * @returns {Promise<Array>} Lista de imágenes principales con sus IDs de producto
 */
const getMainProductImages = async () => {
    try {
        const response = await axios.get(`${API_URL}/products/images/main`);
        console.log("Respuesta de imágenes principales:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error al obtener imágenes principales de productos:', error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudieron cargar las imágenes de los productos.'
        );
    }
};

/**
 * Obtiene la imagen principal de un producto específico
 * @param {string} productId - ID del producto
 * @returns {Promise<Object>} Datos de la imagen principal
 */
const getMainImageByProductId = async (productId) => {
    try {
        const response = await axios.get(`${API_URL}/products/${productId}/image/main`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener imagen principal del producto ${productId}:`, error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudo cargar la imagen del producto.'
        );
    }
};

/**
 * Obtiene todas las imágenes de un producto específico por su ID
 * @param {string} productId - ID del producto
 * @returns {Promise<Array>} Lista de todas las imágenes del producto
 */
const getAllImagesByProductId = async (productId) => {
    try {
        const response = await axios.get(`${API_URL}/products/${productId}/images`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener imágenes del producto ${productId}:`, error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudieron cargar las imágenes del producto.'
        );
    }
};

/**
 * Obtiene las reseñas de un producto por su nombre
 * @param {number} productId - Nombre del producto
 * @returns {Promise<Array>} Lista de reseñas
 */
export const getReviewsByProductName = async (productId) => {
    try {
        const response = await axios.get(
            `${API_URL}/reviews/product/${productId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error al obtener reseñas por nombre de producto:", error);
        throw error;
    }
};

export const getReviewsByProductId = async (productId) => {
    try {
        const response = await axios.get(
            `${API_URL}/reviews/product/${productId}`
        );
        // Ajustamos para devolver solo el array de reseñas (response.data.data)
        return response.data.data || [];
    } catch (error) {
        console.error("Error al obtener reseñas por ID de producto:", error);
        throw error;
    }
};

export const createProductReview = async (productId, rating, reviewText, userid) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Debes iniciar sesión para dejar una reseña');
        }

        const response = await axios.post(
            `${API_URL}/review`,
            {
                user_id: userid,
                product_id: productId,
                rating,
                review_text: reviewText
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al crear reseña:", error);
        throw error;
    }
};
/**
 * Obtiene productos destacados aleatorios
 * @returns {Promise<Array>} Lista de productos destacados
 */
export const getRandomFeaturedProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products/featured/random`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener productos destacados aleatorios:', error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudieron cargar los productos destacados.'
        );
    }
};
/**
 * Obtiene productos destacados con mejor rating
 * @returns {Promise<Array>} Lista de productos destacados ordenados por rating
 */
export const getTopRatedFeaturedProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products/featured/top-rated`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener productos destacados por rating:', error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudieron cargar los productos destacados por rating.'
        );
    }
};
export const getRandomAccessoryProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products/featured/accessories`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener productos aleatorios de accesorios:', error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudieron cargar los productos aleatorios de accesorios.'
        );
    }
};


/**
 * Busca productos por nombre y/o categorías
 * @param {string} [searchText] - Texto para buscar (opcional)
 * @param {number[]} [categoryIds] - IDs de categorías para filtrar (opcional)
 * @returns {Promise<Array<{id: number, name: string, image: string|null}>>} - Lista de productos
 * @throws {Error} - Cuando hay errores en la búsqueda
 */
const searchProducts = async (searchText, categoryIds = []) => {
    try {
        // Validar que al menos haya un criterio de búsqueda
        if ((!searchText || searchText.trim().length < 2) && (!categoryIds || categoryIds.length === 0)) {
            throw new Error('Ingrese un término de búsqueda (mínimo 2 caracteres) o seleccione categorías');
        }

        // Preparar el cuerpo de la petición
        const body = {};

        if (searchText && searchText.trim().length >= 2) {
            body.searchText = searchText.trim();
        }

        if (categoryIds && categoryIds.length > 0) {
            // Filtrar y asegurar que los IDs sean números válidos
            body.categoryIds = categoryIds
                .map(id => parseInt(id))
                .filter(id => !isNaN(id) && id > 0);
        }

        const response = await axios.post(`${API_URL}/products/search`, body, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Verificar si la respuesta fue exitosa
        if (!response.data.success) {
            throw new Error(response.data.message || 'La búsqueda no devolvió resultados');
        }

        // Mapear los resultados para asegurar consistencia
        return response.data.data.map(product => ({
            id: product.id,
            name: product.name,
            image: product.image || null
        }));

    } catch (error) {
        console.error('Error en searchProducts:', error);

        // Manejar diferentes tipos de errores
        let errorMessage = 'Error al buscar productos';

        if (error.response) {
            // Error de respuesta del servidor
            errorMessage = error.response.data.message || errorMessage;
        } else if (error.request) {
            // Error de conexión
            errorMessage = 'No se pudo conectar al servidor';
        } else if (error.message) {
            // Error lanzado manualmente
            errorMessage = error.message;
        }

        throw new Error(errorMessage);
    }
};


/**
 * Obtiene productos básicos (id, nombre, precio e imagen) con filtros
 * @param {string} searchText - Texto para buscar en nombres de productos
 * @param {Array<number>} [categoryIds=[]] - IDs de categorías para filtrar (opcional)
 * @returns {Promise<Array<{product_id: number, name: string, price: string, main_image: string}>>}
 */
const getProductsBasicInfo = async (searchText, categoryIds = []) => {
    try {
        const response = await axios.post(`${API_URL}/products/basic-info`, {
            searchText,
            categoryIds
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener información básica de productos:', error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudieron cargar los productos. Inténtalo más tarde.'
        );
    }
};
/**
 * Obtiene productos con descuento por categoría
 * @param {string|number} categoryId - ID de la categoría
 * @returns {Promise<Array>} Lista de productos con descuento en esa categoría
 */
const getDiscountedProductsByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL}/products/discount/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener productos con descuento para la categoría ${categoryId}:`, error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudieron cargar los productos con descuento para esta categoría.'
        );
    }
};
/**
 * Obtiene productos con stock bajo (stock entre 1 y 10)
 * @returns {Promise<Array>} Lista de productos con bajo stock
 */
const getLowStockProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/low-stock`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener productos con stock bajo:', error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudieron cargar los productos con stock bajo.'
        );
    }
};
/**
 * Reporta una reseña por contenido inapropiado
 * @param {Object} reportData - Datos del reporte
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const reportReview = async (reportData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Debes iniciar sesión para reportar una reseña');
        }

        const response = await axios.post(
            `${API_URL}/review/report`,
            reportData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al reportar reseña:", error);
        throw new Error(
            error.response?.data?.message ||
            'Error al enviar el reporte'
        );
    }
};


const productService = {
    getAll,
    getById,
    getByCategoryAndSubcategory,
    getMainProductImages,
    getMainImageByProductId,
    getAllImagesByProductId,
    getReviewsByProductId,
    getReviewsByProductName,
    createProductReview,
    getRandomFeaturedProducts,
    getTopRatedFeaturedProducts,
    getRandomAccessoryProducts,
    searchProducts,
    getProductsBasicInfo,
    getDiscountedProductsByCategory,
    getLowStockProducts,
    reportReview,
};

export default productService;