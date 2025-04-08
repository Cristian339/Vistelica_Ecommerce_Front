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
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import CategoryIcon from '@mui/icons-material/Category';
import ListIcon from '@mui/icons-material/List';
import SearchIcon from '@mui/icons-material/Search';
import adminService from '../../../services/adminService';

export default function CategoryTable() {
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('id');
    const [selected, setSelected] = React.useState([]);
    const [categoriesData, setCategoriesData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [nameFilter, setNameFilter] = React.useState('');
    const [editingCategory, setEditingCategory] = React.useState(null);
    const [formMode, setFormMode] = React.useState('add');
    const [newSubcategory, setNewSubcategory] = React.useState('');

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await adminService.getCategories();
                // Transformar los datos del backend al formato esperado por el frontend
                const transformedCategories = categories.map(category => ({
                    id: `CAT-${category.category_id.toString().padStart(3, '0')}`,
                    categoryId: category.category_id,
                    name: category.name,
                    subcategories: category.subcategories.map(sc => sc.name),
                    rawSubcategories: category.subcategories // Mantenemos los datos originales
                }));
                setCategoriesData(transformedCategories);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleAddCategory = () => {
        setFormMode('add');
        setEditingCategory({
            id: `CAT-${(categoriesData.length + 1).toString().padStart(3, '0')}`,
            name: '',
            subcategories: []
        });
    };

    const handleEditCategory = (category) => {
        setFormMode('edit');
        setEditingCategory({
            ...category,
            subcategories: [...category.subcategories] // Copia de las subcategorías
        });
    };

    const handleSaveCategory = async (updatedCategory) => {
        try {
            if (formMode === 'add') {
                // Lógica para añadir nueva categoría
                const response = await axios.post(`${API_URL}/categories`, {
                    name: updatedCategory.name,
                    subcategories: updatedCategory.subcategories.map(name => ({ name }))
                });

                const newCategory = {
                    ...updatedCategory,
                    categoryId: response.data.category_id,
                    id: `CAT-${response.data.category_id.toString().padStart(3, '0')}`,
                    rawSubcategories: updatedCategory.subcategories.map(name => ({ name }))
                };
                setCategoriesData(prev => [...prev, newCategory]);
            } else {
                // Lógica para actualizar categoría existente
                await axios.put(`${API_URL}/categories/${updatedCategory.categoryId}`, {
                    name: updatedCategory.name,
                    subcategories: updatedCategory.subcategories.map(name => ({ name }))
                });

                setCategoriesData(prev => prev.map(cat =>
                    cat.id === updatedCategory.id ? {
                        ...updatedCategory,
                        rawSubcategories: updatedCategory.subcategories.map(name => ({ name }))
                    } : cat
                ));
            }
            setEditingCategory(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            const category = categoriesData.find(c => c.id === categoryId);
            await axios.delete(`${API_URL}/categories/${category.categoryId}`);
            setCategoriesData(prev => prev.filter(c => c.id !== categoryId));
        } catch (err) {
            setError(err.message);
        }
    };

    const filteredCategories = categoriesData.filter(category => {
        const matchesName = category.name.toLowerCase().includes(nameFilter.toLowerCase());
        return matchesName;
    });

    const sortedCategories = [...filteredCategories].sort((a, b) => {
        if (a[orderBy] < b[orderBy]) {
            return order === 'asc' ? -1 : 1;
        }
        if (a[orderBy] > b[orderBy]) {
            return order === 'asc' ? 1 : -1;
        }
        return 0;
    });

    function RowMenu({ category }) {
        return (
            <Dropdown>
                <MenuButton
                    slots={{ root: IconButton }}
                    slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
                >
                    <MoreHorizRoundedIcon />
                </MenuButton>
                <Menu size="sm" sx={{ minWidth: 140 }}>
                    <MenuItem onClick={() => handleEditCategory(category)}>Editar</MenuItem>
                    <Divider />
                    <MenuItem color="danger" onClick={() => handleDeleteCategory(category.id)}>
                        Eliminar
                    </MenuItem>
                </Menu>
            </Dropdown>
        );
    }

    function CategoryForm() {
        const [formData, setFormData] = React.useState(editingCategory || {
            id: '',
            name: '',
            subcategories: []
        });

        React.useEffect(() => {
            if (editingCategory) {
                setFormData(editingCategory);
            }
        }, [editingCategory]);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleAddSubcategory = () => {
            if (newSubcategory.trim() && !formData.subcategories.includes(newSubcategory.trim())) {
                setFormData(prev => ({
                    ...prev,
                    subcategories: [...prev.subcategories, newSubcategory.trim()]
                }));
                setNewSubcategory('');
            }
        };

        const handleRemoveSubcategory = (subcatToRemove) => {
            setFormData(prev => ({
                ...prev,
                subcategories: prev.subcategories.filter(subcat => subcat !== subcatToRemove)
            }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            handleSaveCategory(formData);
        };

        if (!editingCategory) return null;

        return (
            <Modal open={!!editingCategory} onClose={() => setEditingCategory(null)}>
                <ModalDialog>
                    <DialogTitle>{formMode === 'add' ? 'Añadir nueva categoría' : 'Editar categoría'}</DialogTitle>
                    <DialogContent>
                        {formMode === 'add' ? 'Complete los detalles de la categoría' : 'Modifique los detalles de la categoría'}
                    </DialogContent>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel>ID</FormLabel>
                                <Input
                                    name="id"
                                    value={formData.id}
                                    disabled
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
                                <FormLabel>Subcategorías</FormLabel>
                                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                    <Input
                                        value={newSubcategory}
                                        onChange={(e) => setNewSubcategory(e.target.value)}
                                        placeholder="Añadir subcategoría"
                                        sx={{ flex: 1 }}
                                    />
                                    <Button onClick={handleAddSubcategory}>Añadir</Button>
                                </Box>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {formData.subcategories.map((subcat) => (
                                        <Chip
                                            key={subcat}
                                            variant="soft"
                                            color="neutral"
                                            endDecorator={
                                                <IconButton
                                                    size="sm"
                                                    variant="plain"
                                                    color="neutral"
                                                    onClick={() => handleRemoveSubcategory(subcat)}
                                                >
                                                    ✕
                                                </IconButton>
                                            }
                                        >
                                            {subcat}
                                        </Chip>
                                    ))}
                                </Box>
                            </FormControl>
                            <Button type="submit">
                                {formMode === 'add' ? 'Añadir Categoría' : 'Guardar Cambios'}
                            </Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        );
    }

    if (loading) return <Typography>Cargando categorías...</Typography>;
    if (error) return <Typography color="danger">Error: {error}</Typography>;

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
                        placeholder="Nombre de categoría"
                        startDecorator={<SearchIcon />}
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                    />
                </FormControl>
                <Button
                    size="sm"
                    variant="solid"
                    color="primary"
                    startDecorator={<AddIcon />}
                    onClick={handleAddCategory}
                    sx={{ alignSelf: 'flex-end' }}
                >
                    Añadir
                </Button>
            </Box>

            <CategoryForm />

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
                                    selected.length > 0 && selected.length !== categoriesData.length
                                }
                                checked={selected.length === categoriesData.length}
                                onChange={(event) => {
                                    setSelected(
                                        event.target.checked ? categoriesData.map((row) => row.id) : [],
                                    );
                                }}
                                color={
                                    selected.length > 0 || selected.length === categoriesData.length
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
                                    <CategoryIcon fontSize="small" />
                                    <span>Nombre</span>
                                </Box>
                            </Link>
                        </th>
                        <th style={{ width: 300, padding: '12px 6px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ListIcon fontSize="small" />
                                <span>Subcategorías</span>
                            </Box>
                        </th>
                        <th style={{ width: 80, padding: '12px 6px' }}></th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedCategories.map((category) => (
                        <tr key={category.id}>
                            <td style={{ textAlign: 'center' }}>
                                <Checkbox
                                    size="sm"
                                    checked={selected.includes(category.id)}
                                    color={selected.includes(category.id) ? 'primary' : undefined}
                                    onChange={(event) => {
                                        setSelected((ids) =>
                                            event.target.checked
                                                ? ids.concat(category.id)
                                                : ids.filter((itemId) => itemId !== category.id),
                                        );
                                    }}
                                    slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                                    sx={{ verticalAlign: 'text-bottom' }}
                                />
                            </td>
                            <td>
                                <Typography level="body-xs">{category.id}</Typography>
                            </td>
                            <td>
                                <Typography level="body-xs">{category.name}</Typography>
                            </td>
                            <td>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {category.subcategories.map((subcat) => (
                                        <Chip key={subcat} size="sm" variant="outlined">
                                            {subcat}
                                        </Chip>
                                    ))}
                                </Box>
                            </td>
                            <td>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <RowMenu category={category} />
                                </Box>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Sheet>
        </React.Fragment>
    );
}