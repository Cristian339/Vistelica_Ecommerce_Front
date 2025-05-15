// components/ProductTable.tsx
import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Link from '@mui/joy/Link';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Textarea from '@mui/joy/Textarea';
import adminService from "@/services/adminService";
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import UndoIcon from '@mui/icons-material/Undo';

export default function ProductTable() {
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [nameFilter, setNameFilter] = React.useState('');
    const [selected, setSelected] = React.useState([]);
    const [editingProduct, setEditingProduct] = React.useState(null);
    const [categories, setCategories] = React.useState([]);
    const [subcategories, setSubcategories] = React.useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

    // Estados para la paginación
    const [page, setPage] = React.useState(1);
    const [rowsPerPage] = React.useState(20);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, categoriesData] = await Promise.all([
                    adminService.getAllProducts(),
                    adminService.getCategories()
                ]);

                setProducts(productsData);
                setCategories(categoriesData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    React.useEffect(() => {
        if (editingProduct?.categoryId) {
            const fetchSubcategories = async () => {
                const category = categories.find(c => c.category_id === editingProduct.categoryId);
                if (category) {
                    setSubcategories(category.subcategories || []);
                }
            };
            fetchSubcategories();
        }
    }, [editingProduct?.categoryId, categories]);

    const handleDeleteProduct = async (id) => {
        try {
            await adminService.deleteProduct(id);
            setProducts(prev => prev.filter(product => product.product_id !== id));
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCreateProduct = async (productData) => {
        try {
            const processedData = {
                ...productData,
                sizes: typeof productData.sizes === 'string'
                    ? productData.sizes.split(',').map(s => s.trim())
                    : productData.sizes,
                colors: typeof productData.colors === 'string'
                    ? productData.colors.split(',').map(c => c.trim())
                    : productData.colors
            };

            const newProduct = await adminService.createProduct(processedData);
            setProducts(prev => [...prev, newProduct]);
            setIsCreateModalOpen(false);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleUpdateProduct = async (productData) => {
        try {
            const dataToSend = {
                ...productData,
                product_id: Number(productData.product_id),
                price: Number(productData.price),
                stock_quantity: Number(productData.stock_quantity),
                discount_percentage: productData.discount_percentage ? Number(productData.discount_percentage) : null,
                category_id: Number(productData.category_id),
                subcategory_id: Number(productData.subcategory_id),
                sizes: typeof productData.sizes === 'string'
                    ? productData.sizes.split(',').map(s => s.trim())
                    : productData.sizes,
                colors: typeof productData.colors === 'string'
                    ? productData.colors.split(',').map(c => c.trim())
                    : productData.colors
            };

            const updatedProduct = await adminService.updateProduct(dataToSend.product_id, dataToSend);
            setProducts(prev => prev.map(p =>
                p.product_id === updatedProduct.product_id ? updatedProduct : p
            ));
            setEditingProduct(null);
        } catch (error) {
            setError(error.message);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(nameFilter.toLowerCase())
    );

    // Calcular productos paginados
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

    const handleToggleDiscard = async (productId) => {
        try {
            const updatedProduct = await adminService.toggleDiscardProduct(productId);

            if (!updatedProduct.category || !updatedProduct.subcategory) {
                const fullProduct = await adminService.getProductById(productId);
                updatedProduct.category = fullProduct.category;
                updatedProduct.subcategory = fullProduct.subcategory;
            }

            setProducts(prev => prev.map(p =>
                p.product_id === updatedProduct.product_id ? {
                    ...updatedProduct,
                    category: updatedProduct.category || p.category,
                    subcategory: updatedProduct.subcategory || p.subcategory
                } : p
            ));
        } catch (error) {
            setError(error.message);
        }
    };

    function RowMenu({ product }) {
        return (
            <Dropdown>
                <MenuButton
                    slots={{ root: IconButton }}
                    slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
                >
                    <MoreHorizRoundedIcon />
                </MenuButton>
                <Menu size="sm" sx={{ minWidth: 140 }}>
                    <MenuItem onClick={() => setEditingProduct(product)}>
                        <EditIcon sx={{ mr: 1 }} /> Editar
                    </MenuItem>
                    <MenuItem
                        color={product.discard ? "success" : "danger"}
                        onClick={() => handleToggleDiscard(product.product_id)}
                    >
                        {product.discard ? (
                            <>
                                <UndoIcon sx={{ mr: 1 }} /> Recuperar
                            </>
                        ) : (
                            <>
                                <DeleteIcon sx={{ mr: 1 }} /> Descartar
                            </>
                        )}
                    </MenuItem>
                </Menu>
            </Dropdown>
        );
    }

    function ProductForm({ product, onSubmit, onCancel }) {
        const [formData, setFormData] = React.useState({
            product_id: product?.product_id || undefined,
            name: product?.name || '',
            description: product?.description || '',
            price: product?.price || 0,
            stock_quantity: product?.stock_quantity || 0,
            sizes: product?.sizes?.join(', ') || '',
            colors: product?.colors?.join(', ') || '',
            discount_percentage: product?.discount_percentage || null,
            category_id: product?.category?.category_id || '',
            subcategory_id: product?.subcategory?.subcategory_id || ''
        });

        const [availableSubcategories, setAvailableSubcategories] = React.useState([]);

        React.useEffect(() => {
            if (formData.category_id) {
                const selectedCategory = categories.find(c => c.category_id === formData.category_id);
                if (selectedCategory && selectedCategory.subcategories) {
                    setAvailableSubcategories(selectedCategory.subcategories);

                    if (formData.subcategory_id && !selectedCategory.subcategories.some(
                        sc => sc.subcategory_id === formData.subcategory_id
                    )) {
                        setFormData(prev => ({ ...prev, subcategory_id: '' }));
                    }
                } else {
                    setAvailableSubcategories([]);
                    setFormData(prev => ({ ...prev, subcategory_id: '' }));
                }
            } else {
                setAvailableSubcategories([]);
                setFormData(prev => ({ ...prev, subcategory_id: '' }));
            }
        }, [formData.category_id, categories]);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        };

        const handleFileChange = (e) => {
            setFormData(prev => ({
                ...prev,
                image: e.target.files[0]
            }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            onSubmit(formData);
        };

        return (
            <Modal open onClose={onCancel}>
                <ModalDialog
                    sx={{
                        maxWidth: '800px',
                        width: '90vw',
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    <DialogTitle>{product ? 'Editar Producto' : 'Crear Producto'}</DialogTitle>

                    <DialogContent
                        sx={{
                            overflowY: 'auto',
                            flexGrow: 1,
                            px: 0,
                            '&::-webkit-scrollbar': {
                                width: '6px'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                borderRadius: '3px'
                            }
                        }}
                    >
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={2} sx={{ px: 2 }}>
                                <FormControl>
                                    <FormLabel>Nombre</FormLabel>
                                    <Input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Descripción</FormLabel>
                                    <Textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Precio</FormLabel>
                                    <Input
                                        name="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Cantidad en Stock</FormLabel>
                                    <Input
                                        name="stock_quantity"
                                        type="number"
                                        value={formData.stock_quantity}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Tallas (separadas por comas)</FormLabel>
                                    <Input
                                        name="sizes"
                                        value={formData.sizes}
                                        onChange={handleChange}
                                        placeholder="Ej: XS, S, M, L, XL"
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Colores (separados por comas)</FormLabel>
                                    <Input
                                        name="colors"
                                        value={formData.colors}
                                        onChange={handleChange}
                                        placeholder="Ej: BLUE, PINK, BLACK"
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Porcentaje de Descuento</FormLabel>
                                    <Input
                                        name="discount_percentage"
                                        type="number"
                                        value={formData.discount_percentage || ''}
                                        onChange={handleChange}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Categoría</FormLabel>
                                    <Select
                                        name="category_id"
                                        value={formData.category_id}
                                        onChange={(e, newValue) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                category_id: newValue,
                                                subcategory_id: ''
                                            }));
                                        }}
                                        required
                                    >
                                        <Option value="">Seleccione una categoría</Option>
                                        {categories.map(category => (
                                            <Option key={category.category_id} value={category.category_id}>
                                                {category.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Subcategoría</FormLabel>
                                    <Select
                                        name="subcategory_id"
                                        value={formData.subcategory_id}
                                        onChange={(e, newValue) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                subcategory_id: newValue
                                            }));
                                        }}
                                        required
                                        disabled={!formData.category_id || availableSubcategories.length === 0}
                                    >
                                        <Option value="">Seleccione una subcategoría</Option>
                                        {availableSubcategories.map(subcategory => (
                                            <Option key={subcategory.subcategory_id} value={subcategory.subcategory_id}>
                                                {subcategory.name}
                                            </Option>
                                        ))}
                                    </Select>
                                    {!availableSubcategories.length && formData.category_id && (
                                        <Typography level="body-xs" color="neutral">
                                            No hay subcategorías disponibles para esta categoría
                                        </Typography>
                                    )}
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Imagen</FormLabel>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        startDecorator={<ImageIcon />}
                                    />
                                    {product?.image_url && !formData.image && (
                                        <Box sx={{ mt: 1 }}>
                                            <Typography level="body-xs">Imagen actual:</Typography>
                                            <Avatar src={product.image_url} size="lg" />
                                        </Box>
                                    )}
                                </FormControl>
                            </Stack>
                        </form>
                    </DialogContent>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2,
                        pt: 2,
                        pb: 1,
                        px: 2,
                        borderTop: '1px solid',
                        borderColor: 'divider'
                    }}>
                        <Button variant="outlined" onClick={onCancel}>Cancelar</Button>
                        <Button onClick={handleSubmit}>Guardar</Button>
                    </Box>
                </ModalDialog>
            </Modal>
        );
    }

    if (loading) return <Typography>Cargando productos...</Typography>;
    if (error) return <Typography color="danger">Error: {error}</Typography>;

    return (
        <React.Fragment>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}
            >
                <FormControl sx={{ flex: 1, maxWidth: 400 }}>
                    <Input
                        size="sm"
                        placeholder="Buscar productos..."
                        startDecorator={<SearchIcon />}
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                    />
                </FormControl>

                <Button
                    startDecorator={<AddIcon />}
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Nuevo Producto
                </Button>
            </Box>

            {isCreateModalOpen && (
                <ProductForm
                    product={null}
                    onSubmit={handleCreateProduct}
                    onCancel={() => setIsCreateModalOpen(false)}
                />
            )}

            {editingProduct && (
                <ProductForm
                    product={editingProduct}
                    onSubmit={handleUpdateProduct}
                    onCancel={() => setEditingProduct(null)}
                />
            )}

            <Sheet variant="outlined" sx={{ borderRadius: 'sm', overflow: 'auto' }}>
                <Table hoverRow>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Tallas</th>
                        <th>Colores</th>
                        <th>Categoría</th>
                        <th>Subcategoría</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedProducts.map((product) => (
                        <tr key={product.product_id}>
                            <td>{product.product_id}</td>
                            <td>
                                <Typography fontWeight="lg">{product.name}</Typography>
                                <Typography level="body-xs">{product.description.substring(0, 50)}...</Typography>
                            </td>
                            <td>
                                ${product.price}
                                {product.discount_percentage && (
                                    <Typography level="body-xs" color="success">
                                        {product.discount_percentage}%
                                    </Typography>
                                )}
                            </td>
                            <td>
                                <Chip color={product.stock_quantity > 0 ? 'success' : 'danger'} size="sm">
                                    {product.stock_quantity}
                                </Chip>
                            </td>
                            <td>
                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', maxWidth: 120 }}>
                                    {product.sizes?.map((size, index) => (
                                        <Chip key={index} size="sm" variant="outlined">
                                            {size}
                                        </Chip>
                                    ))}
                                </Box>
                            </td>
                            <td>
                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', maxWidth: 120 }}>
                                    {product.colors?.map((color, index) => (
                                        <Chip
                                            key={index}
                                            size="sm"
                                            variant="outlined"
                                            sx={{
                                                textTransform: 'capitalize',
                                                backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' :
                                                    color.toLowerCase() === 'black' ? '#000000' :
                                                        color.toLowerCase(),
                                                color: ['black', 'blue', 'brown'].includes(color.toLowerCase()) ? '#ffffff' : '#000000'
                                            }}
                                        >
                                            {color.toLowerCase()}
                                        </Chip>
                                    ))}
                                </Box>
                            </td>
                            <td>{product.category?.name}</td>
                            <td>{product.subcategory?.name}</td>
                            <td>
                                <RowMenu product={product}/>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Sheet>

            {/* Custom Pagination */}
            {filteredProducts.length > rowsPerPage && (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2,
                    mt: 2,
                    p: 1,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Button
                        variant="outlined"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                        Anterior
                    </Button>

                    <Typography level="body-md">
                        Página {page} de {totalPages}
                    </Typography>

                    <Button
                        variant="outlined"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    >
                        Siguiente
                    </Button>
                </Box>
            )}
        </React.Fragment>
    );
}