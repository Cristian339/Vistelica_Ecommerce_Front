import * as React from 'react';
import Box from '@mui/joy/Box';
import Avatar from '@mui/joy/Avatar';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListDivider from '@mui/joy/ListDivider';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Button from '@mui/joy/Button';

import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import LabelIcon from '@mui/icons-material/Label';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';
import StraightenIcon from '@mui/icons-material/Straighten';
import CategoryIcon from '@mui/icons-material/Category';
import WidgetsIcon from '@mui/icons-material/Widgets';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Sheet from "@mui/joy/Sheet";

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
        size: 'XL',
        category: 'Calzado',
        subcategory: 'Deportivo'
    },
];

function RowMenu() {
    return (
        <Dropdown>
            <MenuButton
                slots={{ root: IconButton }}
                slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
            >
                <MoreHorizRoundedIcon />
            </MenuButton>
            <Menu size="sm" sx={{ minWidth: 140 }}>
                <MenuItem>Editar</MenuItem>
                <Divider />
                <MenuItem color="danger">Eliminar</MenuItem>
            </Menu>
        </Dropdown>
    );
}

export default function ProductList() {
    const [nameFilter, setNameFilter] = React.useState('');
    const [sizeFilter, setSizeFilter] = React.useState('');
    const [categoryFilter, setCategoryFilter] = React.useState('');
    const [subcategoryFilter, setSubcategoryFilter] = React.useState('');
    const [open, setOpen] = React.useState(false);

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

    const renderFilters = () => (
        <React.Fragment>
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
        </React.Fragment>
    );

    return (
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <Sheet
                className="SearchAndFilters-mobile"
                sx={{ display: 'flex', my: 1, gap: 1 }}
            >
                <Input
                    size="sm"
                    placeholder="Buscar por nombre"
                    startDecorator={<SearchIcon />}
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    sx={{ flexGrow: 1 }}
                />
                <IconButton
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    onClick={() => setOpen(true)}
                >
                    <FilterAltIcon />
                </IconButton>
                <Modal open={open} onClose={() => setOpen(false)}>
                    <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
                        <ModalClose />
                        <Typography id="filter-modal" level="h2">
                            Filtros
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Sheet sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {renderFilters()}
                            <Button color="primary" onClick={() => setOpen(false)}>
                                Aplicar filtros
                            </Button>
                        </Sheet>
                    </ModalDialog>
                </Modal>
            </Sheet>

            {filteredProducts.map((product) => (
                <List key={product.id} size="sm" sx={{ '--ListItem-paddingX': 0 }}>
                    <ListItem
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                        }}
                    >
                        <ListItemContent sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                            <ListItemDecorator>
                                <Avatar size="sm">
                                    <LabelIcon fontSize="small" />
                                </Avatar>
                            </ListItemDecorator>
                            <div>
                                <Typography level="title-sm" gutterBottom>
                                    ID: {product.id}
                                </Typography>
                                <Typography level="body-sm" fontWeight="lg" gutterBottom>
                                    {product.name}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <DescriptionIcon fontSize="small" />
                                    <Typography level="body-xs">
                                        {product.description}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <AttachMoneyIcon fontSize="small" />
                                    <Typography level="body-xs">
                                        Precio: ${product.price.toFixed(2)}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <InventoryIcon fontSize="small" />
                                    <Typography level="body-xs">
                                        Stock:
                                    </Typography>
                                    <Chip
                                        variant="soft"
                                        size="sm"
                                        color={product.stock > 50 ? 'success' : product.stock > 10 ? 'warning' : 'danger'}
                                    >
                                        {product.stock}
                                    </Chip>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <StraightenIcon fontSize="small" />
                                    <Typography level="body-xs">
                                        Talla: {product.size}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CategoryIcon fontSize="small" />
                                    <Typography level="body-xs">
                                        {product.category} / {product.subcategory}
                                    </Typography>
                                </Box>
                            </div>
                        </ListItemContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                            <RowMenu />
                        </Box>
                    </ListItem>
                    <ListDivider />
                </List>
            ))}

            <Box
                className="Pagination-mobile"
                sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', py: 2 }}
            >
                <IconButton
                    aria-label="previous page"
                    variant="outlined"
                    color="neutral"
                    size="sm"
                >
                    <KeyboardArrowLeftIcon />
                </IconButton>
                <Typography level="body-sm" sx={{ mx: 'auto' }}>
                    Página 1 de 1
                </Typography>
                <IconButton
                    aria-label="next page"
                    variant="outlined"
                    color="neutral"
                    size="sm"
                >
                    <KeyboardArrowRightIcon />
                </IconButton>
            </Box>
        </Box>
    );
}