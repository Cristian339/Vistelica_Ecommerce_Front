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
import adminService from '../../../services/adminService';

export default function SubcategoryTable() {
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('id');
    const [selected, setSelected] = React.useState([]);
    const [subcategoriesData, setSubcategoriesData] = React.useState([]);
    const [categoriesData, setCategoriesData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [nameFilter, setNameFilter] = React.useState('');
    const [categoryFilter, setCategoryFilter] = React.useState('');
    const [editingSubcategory, setEditingSubcategory] = React.useState(null);
    const [formMode, setFormMode] = React.useState('add');

    // Cargar datos al montar el componente
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const categories = await adminService.getCategories();
                setCategoriesData(categories);

                // Extraer y transformar todas las subcategorías
                const allSubcategories = categories.flatMap(category =>
                    category.subcategories.map(subcat => ({
                        id: `SUB-${subcat.subcategory_id.toString().padStart(3, '0')}`,
                        subcategoryId: subcat.subcategory_id,
                        name: subcat.name,
                        category: category.name,
                        categoryId: category.category_id
                    }))
                );

                setSubcategoriesData(allSubcategories);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleAddSubcategory = () => {
        setFormMode('add');
        setEditingSubcategory({
            id: `SUB-${(subcategoriesData.length + 1).toString().padStart(3, '0')}`,
            name: '',
            category: '',
            categoryId: null
        });
    };

    const handleEditSubcategory = (subcategory) => {
        setFormMode('edit');
        setEditingSubcategory({ ...subcategory });
    };

    const handleSaveSubcategory = async (updatedSubcategory) => {
        try {
            if (formMode === 'add') {
                // En una API real, aquí harías el POST a /categories/{categoryId}/subcategories
                // Como no tenemos API para subcategorías individuales, simulamos la actualización
                const newSubcategory = {
                    ...updatedSubcategory,
                    subcategoryId: Math.max(...subcategoriesData.map(s => s.subcategoryId), 0) + 1,
                    id: `SUB-${(Math.max(...subcategoriesData.map(s => s.subcategoryId), 0) + 1).toString().padStart(3, '0')}`
                };

                setSubcategoriesData(prev => [...prev, newSubcategory]);

                // Actualizar también las categorías para mantener consistencia
                setCategoriesData(prev => prev.map(cat =>
                    cat.category_id === updatedSubcategory.categoryId
                        ? {
                            ...cat,
                            subcategories: [
                                ...cat.subcategories,
                                {
                                    subcategory_id: newSubcategory.subcategoryId,
                                    name: newSubcategory.name
                                }
                            ]
                        }
                        : cat
                ));
            } else {
                // Simular actualización
                setSubcategoriesData(prev => prev.map(subcat =>
                    subcat.id === updatedSubcategory.id ? updatedSubcategory : subcat
                ));

                // Actualizar también las categorías
                setCategoriesData(prev => prev.map(cat =>
                    cat.category_id === updatedSubcategory.categoryId
                        ? {
                            ...cat,
                            subcategories: cat.subcategories.map(sc =>
                                sc.subcategory_id === updatedSubcategory.subcategoryId
                                    ? { ...sc, name: updatedSubcategory.name }
                                    : sc
                            )
                        }
                        : cat
                ));
            }
            setEditingSubcategory(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteSubcategory = async (subcategoryId) => {
        try {
            const subcategory = subcategoriesData.find(s => s.id === subcategoryId);

            // Simular eliminación
            setSubcategoriesData(prev => prev.filter(s => s.id !== subcategoryId));

            // Actualizar también las categorías
            setCategoriesData(prev => prev.map(cat =>
                cat.category_id === subcategory.categoryId
                    ? {
                        ...cat,
                        subcategories: cat.subcategories.filter(
                            sc => sc.subcategory_id !== subcategory.subcategoryId
                        )
                    }
                    : cat
            ));
        } catch (err) {
            setError(err.message);
        }
    };

    const filteredSubcategories = subcategoriesData.filter(subcategory => {
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

    function RowMenu({ subcategory }) {
        return (
            <Dropdown>
                <MenuButton
                    slots={{ root: IconButton }}
                    slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
                >
                    <MoreHorizRoundedIcon />
                </MenuButton>
                <Menu size="sm" sx={{ minWidth: 140 }}>
                    <MenuItem onClick={() => handleEditSubcategory(subcategory)}>Editar</MenuItem>
                    <Divider />
                    <MenuItem color="danger" onClick={() => handleDeleteSubcategory(subcategory.id)}>
                        Eliminar
                    </MenuItem>
                </Menu>
            </Dropdown>
        );
    }

    function SubcategoryForm() {
        const [formData, setFormData] = React.useState(editingSubcategory || {
            id: '',
            name: '',
            category: '',
            categoryId: null
        });

        React.useEffect(() => {
            if (editingSubcategory) {
                setFormData(editingSubcategory);
            }
        }, [editingSubcategory]);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleCategoryChange = (e, value) => {
            const selectedCategory = categoriesData.find(cat => cat.name === value);
            setFormData(prev => ({
                ...prev,
                category: value,
                categoryId: selectedCategory ? selectedCategory.category_id : null
            }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            handleSaveSubcategory(formData);
        };

        if (!editingSubcategory) return null;

        return (
            <Modal open={!!editingSubcategory} onClose={() => setEditingSubcategory(null)}>
                <ModalDialog>
                    <DialogTitle>{formMode === 'add' ? 'Añadir subcategoría' : 'Editar subcategoría'}</DialogTitle>
                    <DialogContent>
                        {formMode === 'add' ? 'Complete los detalles' : 'Modifique los detalles'}
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
                                <FormLabel>Categoría</FormLabel>
                                <Select
                                    value={formData.category}
                                    onChange={handleCategoryChange}
                                    required
                                >
                                    {categoriesData.map(category => (
                                        <Option key={category.category_id} value={category.name}>
                                            {category.name}
                                        </Option>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button type="submit">
                                {formMode === 'add' ? 'Añadir' : 'Guardar cambios'}
                            </Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        );
    }

    if (loading) return <Typography>Cargando subcategorías...</Typography>;
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
                        {[...new Set(categoriesData.map(cat => cat.name))].map(category => (
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

            <SubcategoryForm />

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
                                    selected.length > 0 && selected.length !== subcategoriesData.length
                                }
                                checked={selected.length === subcategoriesData.length}
                                onChange={(event) => {
                                    setSelected(
                                        event.target.checked ? subcategoriesData.map((row) => row.id) : [],
                                    );
                                }}
                                color={
                                    selected.length > 0 || selected.length === subcategoriesData.length
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
                                    <RowMenu subcategory={subcategory} />
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