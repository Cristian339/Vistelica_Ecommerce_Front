import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
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
import AddIcon from '@mui/icons-material/Add';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import LabelIcon from '@mui/icons-material/Label';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';
import StraightenIcon from '@mui/icons-material/Straighten';
import CategoryIcon from '@mui/icons-material/Category';
import WidgetsIcon from '@mui/icons-material/Widgets';
import SearchIcon from '@mui/icons-material/Search';

const products = [
    {
        id: 'PROD-001',
        name: 'Camiseta Básica Algodón',
        description: 'Camiseta 100% algodón orgánico, corte clásico',
        price: 19.99,
        stock: 150,
        size: 'M',
        category: 'Ropa',
        subcategory: 'Camisetas'
    },
    {
        id: 'PROD-002',
        name: 'Pantalón Vaquero Slim',
        description: 'Pantalón vaquero ajustado, color azul oscuro',
        price: 49.99,
        stock: 75,
        size: 'L',
        category: 'Ropa',
        subcategory: 'Pantalones'
    },
    {
        id: 'PROD-003',
        name: 'Zapatillas Running',
        description: 'Zapatillas deportivas para running, amortiguación avanzada',
        price: 89.99,
        stock: 42,
        size: 'XXL',
        category: 'Calzado',
        subcategory: 'Deportivo'
    },
    {
        id: 'PROD-004',
        name: 'Gorra Ajustable',
        description: 'Gorra plana con ajuste trasero, 100% algodón',
        price: 24.99,
        stock: 200,
        size: 'L',
        category: 'Accesorios',
        subcategory: 'Gorras'
    },
    {
        id: 'PROD-005',
        name: 'Chaqueta Impermeable',
        description: 'Chaqueta resistente al agua con capucha',
        price: 79.99,
        stock: 30,
        size: 'XL',
        category: 'Ropa',
        subcategory: 'Chaquetas'
    },
];

function RowMenu({ product, onEdit }) {
    return (
        <Dropdown>
            <MenuButton
                slots={{ root: IconButton }}
                slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
            >
                <MoreHorizRoundedIcon />
            </MenuButton>
            <Menu size="sm" sx={{ minWidth: 140 }}>
                <MenuItem onClick={() => onEdit(product)}>Editar</MenuItem>
                <Divider />
                <MenuItem color="danger">Eliminar</MenuItem>
            </Menu>
        </Dropdown>
    );
}

function ProductForm({ product, onClose, mode = 'add' }) {
    return (
        <Modal open={!!product} onClose={onClose}>
            <ModalDialog>
                <DialogTitle>{mode === 'add' ? 'Añadir nuevo producto' : 'Editar producto'}</DialogTitle>
                <DialogContent>
                    {mode === 'add' ? 'Complete los detalles del producto' : 'Modifique los detalles del producto'}
                </DialogContent>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        onClose();
                    }}
                >
                    <Stack spacing={2}>
                        <FormControl>
                            <FormLabel>ID del Producto</FormLabel>
                            <Input
                                autoFocus
                                required
                                value={product?.id || ''}
                                disabled={mode === 'edit'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Nombre</FormLabel>
                            <Input
                                required
                                value={product?.name || ''}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Descripción</FormLabel>
                            <Input
                                required
                                value={product?.description || ''}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Precio</FormLabel>
                            <Input
                                type="number"
                                required
                                startDecorator="$"
                                value={product?.price || ''}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Stock</FormLabel>
                            <Input
                                type="number"
                                required
                                value={product?.stock || ''}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Talla</FormLabel>
                            <Select value={product?.size || ''}>
                                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                    <Option key={size} value={size}>{size}</Option>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Categoría</FormLabel>
                            <Select value={product?.category || ''}>
                                {[...new Set(products.map(p => p.category))].map(category => (
                                    <Option key={category} value={category}>{category}</Option>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Subcategoría</FormLabel>
                            <Select value={product?.subcategory || ''}>
                                {[...new Set(products.map(p => p.subcategory))].map(subcategory => (
                                    <Option key={subcategory} value={subcategory}>{subcategory}</Option>
                                ))}
                            </Select>
                        </FormControl>
                        <Button type="submit">
                            {mode === 'add' ? 'Añadir Producto' : 'Guardar Cambios'}
                        </Button>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    );
}

export default function ProductTable() {
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('id');
    const [selected, setSelected] = React.useState([]);
    const [nameFilter, setNameFilter] = React.useState('');
    const [sizeFilter, setSizeFilter] = React.useState('');
    const [categoryFilter, setCategoryFilter] = React.useState('');
    const [subcategoryFilter, setSubcategoryFilter] = React.useState('');
    const [formProduct, setFormProduct] = React.useState(null);
    const [formMode, setFormMode] = React.useState('add');

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleAddProduct = () => {
        setFormMode('add');
        setFormProduct({
            id: '',
            name: '',
            description: '',
            price: '',
            stock: '',
            size: '',
            category: '',
            subcategory: ''
        });
    };

    const handleEditProduct = (product) => {
        setFormMode('edit');
        setFormProduct({ ...product });
    };

    const handleCloseForm = () => {
        setFormProduct(null);
    };

    // Tallas estándar para el desplegable
    const standardSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    // Obtener categorías y subcategorías únicas para los selects
    const categories = [...new Set(products.map(product => product.category))];
    const subcategories = [...new Set(products.map(product => product.subcategory))];

    const filteredProducts = products.filter(product => {
        const matchesName = product.name.toLowerCase().includes(nameFilter.toLowerCase());
        const matchesSize = sizeFilter ? product.size === sizeFilter : true;
        const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
        const matchesSubcategory = subcategoryFilter ? product.subcategory === subcategoryFilter : true;

        return matchesName && matchesSize && matchesCategory && matchesSubcategory;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (a[orderBy] < b[orderBy]) {
            return order === 'asc' ? -1 : 1;
        }
        if (a[orderBy] > b[orderBy]) {
            return order === 'asc' ? 1 : -1;
        }
        return 0;
    });

    return (
        <React.Fragment>
            <Box
                className="SearchAndFilters-tabletUp"
                sx={{
                    borderRadius: 'sm',
                    py: 2,
                    display: { xs: 'none', sm: 'flex' },
                    flexWrap: 'wrap',
                    gap: 1.5,
                    '& > *': {
                        minWidth: { xs: '120px', md: '160px' },
                    },
                }}
            >
                <FormControl sx={{ flex: 1 }} size="sm">
                    <FormLabel>Buscar por nombre</FormLabel>
                    <Input
                        size="sm"
                        placeholder="Nombre del producto"
                        startDecorator={<SearchIcon />}
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                    />
                </FormControl>

                <FormControl size="sm">
                    <FormLabel>Talla</FormLabel>
                    <Select
                        size="sm"
                        placeholder="Todas las tallas"
                        value={sizeFilter}
                        onChange={(e, newValue) => setSizeFilter(newValue)}
                    >
                        <Option value="">Todas</Option>
                        {standardSizes.map(size => (
                            <Option key={size} value={size}>{size}</Option>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="sm">
                    <FormLabel>Categoría</FormLabel>
                    <Select
                        size="sm"
                        placeholder="Todas las categorías"
                        value={categoryFilter}
                        onChange={(e, newValue) => setCategoryFilter(newValue)}
                    >
                        <Option value="">Todas</Option>
                        {categories.map(category => (
                            <Option key={category} value={category}>{category}</Option>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="sm">
                    <FormLabel>Subcategoría</FormLabel>
                    <Select
                        size="sm"
                        placeholder="Todas las subcategorías"
                        value={subcategoryFilter}
                        onChange={(e, newValue) => setSubcategoryFilter(newValue)}
                    >
                        <Option value="">Todas</Option>
                        {subcategories.map(subcategory => (
                            <Option key={subcategory} value={subcategory}>{subcategory}</Option>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    size="sm"
                    variant="solid"
                    color="primary"
                    startDecorator={<AddIcon />}
                    onClick={handleAddProduct}
                    sx={{ alignSelf: 'flex-end' }}
                >
                    Añadir
                </Button>
            </Box>

            {/* Formulario para añadir/editar producto */}
            <ProductForm
                product={formProduct}
                onClose={handleCloseForm}
                mode={formMode}
            />

            <Sheet
                className="OrderTableContainer"
                variant="outlined"
                sx={{
                    display: { xs: 'none', sm: 'initial' },
                    width: '100%',
                    borderRadius: 'sm',
                    flexShrink: 1,
                    overflow: 'auto',
                    minHeight: 0,
                }}
            >
                <Table
                    aria-labelledby="tableTitle"
                    stickyHeader
                    hoverRow
                    sx={{
                        '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
                        '--Table-headerUnderlineThickness': '1px',
                        '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
                        '--TableCell-paddingY': '4px',
                        '--TableCell-paddingX': '8px',
                    }}
                >
                    <thead>
                    <tr>
                        <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
                            <Checkbox
                                size="sm"
                                indeterminate={
                                    selected.length > 0 && selected.length !== products.length
                                }
                                checked={selected.length === products.length}
                                onChange={(event) => {
                                    setSelected(
                                        event.target.checked ? products.map((row) => row.id) : [],
                                    );
                                }}
                                color={
                                    selected.length > 0 || selected.length === products.length
                                        ? 'primary'
                                        : undefined
                                }
                                sx={{ verticalAlign: 'text-bottom' }}
                            />
                        </th>
                        <th style={{ width: 120, padding: '12px 6px' }}>
                            <Link
                                underline="none"
                                color="primary"
                                component="button"
                                onClick={() => handleSort('id')}
                                endDecorator={<ArrowDropDownIcon />}
                                sx={{
                                    fontWeight: 'lg',
                                    '& svg': {
                                        transition: '0.2s',
                                        transform: orderBy === 'id' && order === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                                    },
                                }}
                            >
                                ID
                            </Link>
                        </th>
                        <th style={{ width: 200, padding: '12px 6px' }}>
                            <Link
                                underline="none"
                                color="primary"
                                component="button"
                                onClick={() => handleSort('name')}
                                endDecorator={<ArrowDropDownIcon />}
                                sx={{
                                    fontWeight: 'lg',
                                    '& svg': {
                                        transition: '0.2s',
                                        transform: orderBy === 'name' && order === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                                    },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LabelIcon fontSize="small" />
                                    <span>Nombre</span>
                                </Box>
                            </Link>
                        </th>
                        <th style={{ width: 240, padding: '12px 6px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <DescriptionIcon fontSize="small" />
                                <span>Descripción</span>
                            </Box>
                        </th>
                        <th style={{ width: 100, padding: '12px 6px' }}>
                            <Link
                                underline="none"
                                color="primary"
                                component="button"
                                onClick={() => handleSort('price')}
                                endDecorator={<ArrowDropDownIcon />}
                                sx={{
                                    fontWeight: 'lg',
                                    '& svg': {
                                        transition: '0.2s',
                                        transform: orderBy === 'price' && order === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                                    },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AttachMoneyIcon fontSize="small" />
                                    <span>Precio</span>
                                </Box>
                            </Link>
                        </th>
                        <th style={{ width: 100, padding: '12px 6px' }}>
                            <Link
                                underline="none"
                                color="primary"
                                component="button"
                                onClick={() => handleSort('stock')}
                                endDecorator={<ArrowDropDownIcon />}
                                sx={{
                                    fontWeight: 'lg',
                                    '& svg': {
                                        transition: '0.2s',
                                        transform: orderBy === 'stock' && order === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                                    },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <InventoryIcon fontSize="small" />
                                    <span>Stock</span>
                                </Box>
                            </Link>
                        </th>
                        <th style={{ width: 80, padding: '12px 6px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <StraightenIcon fontSize="small" />
                                <span>Talla</span>
                            </Box>
                        </th>
                        <th style={{ width: 120, padding: '12px 6px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CategoryIcon fontSize="small" />
                                <span>Categoría</span>
                            </Box>
                        </th>
                        <th style={{ width: 120, padding: '12px 6px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <WidgetsIcon fontSize="small" />
                                <span>Subcategoría</span>
                            </Box>
                        </th>
                        <th style={{ width: 80, padding: '12px 6px' }}></th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedProducts.map((product) => (
                        <tr key={product.id}>
                            <td style={{ textAlign: 'center' }}>
                                <Checkbox
                                    size="sm"
                                    checked={selected.includes(product.id)}
                                    color={selected.includes(product.id) ? 'primary' : undefined}
                                    onChange={(event) => {
                                        setSelected((ids) =>
                                            event.target.checked
                                                ? ids.concat(product.id)
                                                : ids.filter((itemId) => itemId !== product.id),
                                        );
                                    }}
                                    slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                                    sx={{ verticalAlign: 'text-bottom' }}
                                />
                            </td>
                            <td>
                                <Typography level="body-xs">{product.id}</Typography>
                            </td>
                            <td>
                                <Typography level="body-xs">{product.name}</Typography>
                            </td>
                            <td>
                                <Typography level="body-xs" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                                    {product.description}
                                </Typography>
                            </td>
                            <td>
                                <Typography level="body-xs">${product.price.toFixed(2)}</Typography>
                            </td>
                            <td>
                                <Chip
                                    variant="soft"
                                    size="sm"
                                    color={product.stock > 50 ? 'success' : product.stock > 10 ? 'warning' : 'danger'}
                                >
                                    {product.stock}
                                </Chip>
                            </td>
                            <td>
                                <Chip variant="outlined" size="sm">
                                    {product.size}
                                </Chip>
                            </td>
                            <td>
                                <Typography level="body-xs">{product.category}</Typography>
                            </td>
                            <td>
                                <Typography level="body-xs">{product.subcategory}</Typography>
                            </td>
                            <td>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <RowMenu product={product} onEdit={handleEditProduct} />
                                </Box>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Sheet>
            <Box
                className="Pagination-laptopUp"
                sx={{
                    pt: 2,
                    gap: 1,
                    [`& .${iconButtonClasses.root}`]: { borderRadius: '50%' },
                    display: {
                        xs: 'none',
                        md: 'flex',
                    },
                }}
            >
                <Button
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    startDecorator={<KeyboardArrowLeftIcon />}
                >
                    Anterior
                </Button>
                <Box sx={{ flex: 1 }} />
                {['1', '2', '3', '…', '8', '9', '10'].map((page) => (
                    <IconButton
                        key={page}
                        size="sm"
                        variant={Number(page) ? 'outlined' : 'plain'}
                        color="neutral"
                    >
                        {page}
                    </IconButton>
                ))}
                <Box sx={{ flex: 1 }} />
                <Button
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    endDecorator={<KeyboardArrowRightIcon />}
                >
                    Siguiente
                </Button>
            </Box>
        </React.Fragment>
    );
}