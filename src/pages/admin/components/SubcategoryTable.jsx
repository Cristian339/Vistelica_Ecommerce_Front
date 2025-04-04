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
import CategoryIcon from '@mui/icons-material/Category';
import SearchIcon from '@mui/icons-material/Search';

// Datos iniciales de subcategorías
const initialSubcategories = [
    { id: 'SUB-001', name: 'Camisetas', category: 'Ropa' },
    { id: 'SUB-002', name: 'Pantalones', category: 'Ropa' },
    { id: 'SUB-003', name: 'Teléfonos', category: 'Electrónica' },
    { id: 'SUB-004', name: 'Computadoras', category: 'Electrónica' },
    { id: 'SUB-005', name: 'Muebles', category: 'Hogar' },
];

// Lista de categorías disponibles
const categories = ['Ropa', 'Electrónica', 'Hogar', 'Deportes', 'Juguetes'];

function RowMenu({ subcategory, onEdit }) {
    return (
        <Dropdown>
            <MenuButton
                slots={{ root: IconButton }}
                slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
            >
                <MoreHorizRoundedIcon />
            </MenuButton>
            <Menu size="sm" sx={{ minWidth: 140 }}>
                <MenuItem onClick={() => onEdit(subcategory)}>Editar</MenuItem>
                <Divider />
                <MenuItem color="danger">Eliminar</MenuItem>
            </Menu>
        </Dropdown>
    );
}

function SubcategoryForm({ subcategory, onClose, mode = 'add', onSave }) {
    const [formData, setFormData] = React.useState(subcategory || {
        id: '',
        name: '',
        category: ''
    });

    React.useEffect(() => {
        if (subcategory) {
            setFormData(subcategory);
        }
    }, [subcategory]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal open={!!subcategory} onClose={onClose}>
            <ModalDialog>
                <DialogTitle>{mode === 'add' ? 'Añadir subcategoría' : 'Editar subcategoría'}</DialogTitle>
                <DialogContent>
                    {mode === 'add' ? 'Complete los detalles' : 'Modifique los detalles'}
                </DialogContent>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <FormControl>
                            <FormLabel>ID</FormLabel>
                            <Input
                                name="id"
                                value={formData.id}
                                disabled={mode === 'edit'}
                                required
                            />
                        </FormControl>
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
                            <FormLabel>Categoría</FormLabel>
                            <Select
                                value={formData.category}
                                onChange={(e, value) => {
                                    setFormData(prev => ({ ...prev, category: value }));
                                }}
                                required
                            >
                                {categories.map(category => (
                                    <Option key={category} value={category}>{category}</Option>
                                ))}
                            </Select>
                        </FormControl>
                        <Button type="submit">
                            {mode === 'add' ? 'Añadir' : 'Guardar cambios'}
                        </Button>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    );
}

export default function SubcategoryTable() {
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('id');
    const [selected, setSelected] = React.useState([]);
    const [subcategories, setSubcategories] = React.useState(initialSubcategories);
    const [editingSubcategory, setEditingSubcategory] = React.useState(null);
    const [formMode, setFormMode] = React.useState('add');
    const [nameFilter, setNameFilter] = React.useState('');
    const [categoryFilter, setCategoryFilter] = React.useState('');

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleAddSubcategory = () => {
        setFormMode('add');
        setEditingSubcategory({
            id: `SUB-${(subcategories.length + 1).toString().padStart(3, '0')}`,
            name: '',
            category: ''
        });
    };

    const handleEditSubcategory = (subcategory) => {
        setFormMode('edit');
        setEditingSubcategory(subcategory);
    };

    const handleSaveSubcategory = (updatedSubcategory) => {
        if (formMode === 'add') {
            setSubcategories(prev => [...prev, updatedSubcategory]);
        } else {
            setSubcategories(prev => prev.map(item =>
                item.id === updatedSubcategory.id ? updatedSubcategory : item
            ));
        }
        setEditingSubcategory(null);
    };

    const filteredSubcategories = subcategories.filter(subcategory => {
        const matchesName = subcategory.name.toLowerCase().includes(nameFilter.toLowerCase());
        const matchesCategory = categoryFilter ? subcategory.category === categoryFilter : true;
        return matchesName && matchesCategory;
    });

    const sortedSubcategories = [...filteredSubcategories].sort((a, b) => {
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
                        placeholder="Nombre"
                        startDecorator={<SearchIcon />}
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                    />
                </FormControl>

                <FormControl size="sm">
                    <FormLabel>Filtrar por categoría</FormLabel>
                    <Select
                        size="sm"
                        placeholder="Todas"
                        value={categoryFilter}
                        onChange={(e, value) => setCategoryFilter(value)}
                    >
                        <Option value="">Todas</Option>
                        {categories.map(category => (
                            <Option key={category} value={category}>{category}</Option>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    size="sm"
                    variant="solid"
                    color="primary"
                    startDecorator={<AddIcon />}
                    onClick={handleAddSubcategory}
                    sx={{ alignSelf: 'flex-end' }}
                >
                    Añadir
                </Button>
            </Box>

            <SubcategoryForm
                subcategory={editingSubcategory}
                onClose={() => setEditingSubcategory(null)}
                mode={formMode}
                onSave={handleSaveSubcategory}
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
                                    selected.length > 0 && selected.length !== subcategories.length
                                }
                                checked={selected.length === subcategories.length}
                                onChange={(event) => {
                                    setSelected(
                                        event.target.checked ? subcategories.map((row) => row.id) : [],
                                    );
                                }}
                                color={
                                    selected.length > 0 || selected.length === subcategories.length
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
                                Nombre
                            </Link>
                        </th>
                        <th style={{ width: 200, padding: '12px 6px' }}>
                            <Link
                                underline="none"
                                color="primary"
                                component="button"
                                onClick={() => handleSort('category')}
                                endDecorator={<ArrowDropDownIcon />}
                                sx={{
                                    fontWeight: 'lg',
                                    '& svg': {
                                        transition: '0.2s',
                                        transform: orderBy === 'category' && order === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                                    },
                                }}
                            >
                                Categoría
                            </Link>
                        </th>
                        <th style={{ width: 80, padding: '12px 6px' }}></th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedSubcategories.map((subcategory) => (
                        <tr key={subcategory.id}>
                            <td style={{ textAlign: 'center' }}>
                                <Checkbox
                                    size="sm"
                                    checked={selected.includes(subcategory.id)}
                                    color={selected.includes(subcategory.id) ? 'primary' : undefined}
                                    onChange={(event) => {
                                        setSelected((ids) =>
                                            event.target.checked
                                                ? ids.concat(subcategory.id)
                                                : ids.filter((itemId) => itemId !== subcategory.id),
                                        );
                                    }}
                                    slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                                    sx={{ verticalAlign: 'text-bottom' }}
                                />
                            </td>
                            <td>
                                <Typography level="body-xs">{subcategory.id}</Typography>
                            </td>
                            <td>
                                <Typography level="body-xs">{subcategory.name}</Typography>
                            </td>
                            <td>
                                <Chip variant="soft" size="sm">
                                    {subcategory.category}
                                </Chip>
                            </td>
                            <td>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <RowMenu subcategory={subcategory} onEdit={handleEditSubcategory} />
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