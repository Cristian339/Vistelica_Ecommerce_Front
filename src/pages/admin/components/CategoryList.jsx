import * as React from 'react';
import Box from '@mui/joy/Box';
import Avatar from '@mui/joy/Avatar';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
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
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import CategoryIcon from '@mui/icons-material/Category';
import SearchIcon from '@mui/icons-material/Search';

function EditCategoryForm({ category, onClose, mode = 'add', onSave }) {
    const [formData, setFormData] = React.useState(category || {
        id: '',
        name: '',
        subcategories: []
    });
    const [newSubcategory, setNewSubcategory] = React.useState('');

    React.useEffect(() => {
        if (category) {
            setFormData(category);
        }
    }, [category]);

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
        onSave(formData);
        onClose();
    };

    return (
        <Modal open={!!category} onClose={onClose}>
            <ModalDialog>
                <DialogTitle>{mode === 'add' ? 'Añadir nueva categoría' : 'Editar categoría'}</DialogTitle>
                <DialogContent>
                    {mode === 'add' ? 'Complete los detalles de la categoría' : 'Modifique los detalles de la categoría'}
                </DialogContent>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <FormControl>
                            <FormLabel>ID</FormLabel>
                            <Input
                                name="id"
                                value={formData.id}
                                onChange={handleChange}
                                required
                                disabled={mode === 'edit'}
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
                            {mode === 'add' ? 'Añadir Categoría' : 'Guardar Cambios'}
                        </Button>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    );
}

function RowMenu({ category, onEdit }) {
    return (
        <Dropdown>
            <MenuButton
                slots={{ root: IconButton }}
                slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
            >
                <MoreHorizRoundedIcon />
            </MenuButton>
            <Menu size="sm" sx={{ minWidth: 140 }}>
                <MenuItem onClick={() => onEdit(category)}>Editar</MenuItem>
                <Divider />
                <MenuItem color="danger">Eliminar</MenuItem>
            </Menu>
        </Dropdown>
    );
}

export default function CategoryList() {
    const [categories, setCategories] = React.useState([
        {
            id: 'CAT-001',
            name: 'Ropa',
            subcategories: ['Camisetas', 'Pantalones', 'Chaquetas']
        },
        {
            id: 'CAT-002',
            name: 'Electrónica',
            subcategories: ['Teléfonos', 'Computadoras', 'Accesorios']
        },
        {
            id: 'CAT-003',
            name: 'Hogar',
            subcategories: ['Muebles', 'Decoración', 'Cocina']
        },
    ]);
    const [editingCategory, setEditingCategory] = React.useState(null);
    const [formMode, setFormMode] = React.useState('add');
    const [nameFilter, setNameFilter] = React.useState('');

    const handleEditCategory = (category) => {
        setFormMode('edit');
        setEditingCategory(category);
    };

    const handleAddCategory = () => {
        setFormMode('add');
        setEditingCategory({
            id: `CAT-${(categories.length + 1).toString().padStart(3, '0')}`,
            name: '',
            subcategories: []
        });
    };

    const handleSaveCategory = (updatedCategory) => {
        if (formMode === 'add') {
            setCategories(prev => [...prev, updatedCategory]);
        } else {
            setCategories(prev => prev.map(cat =>
                cat.id === updatedCategory.id ? updatedCategory : cat
            ));
        }
        setEditingCategory(null);
    };

    const filteredCategories = categories.filter(category => {
        const matchesName = category.name.toLowerCase().includes(nameFilter.toLowerCase());
        return matchesName;
    });

    return (
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Input
                    size="sm"
                    placeholder="Buscar categoría"
                    startDecorator={<SearchIcon />}
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    sx={{ flex: 1 }}
                />
                <Button
                    size="sm"
                    variant="solid"
                    color="primary"
                    startDecorator={<AddIcon />}
                    onClick={handleAddCategory}
                >
                    Añadir
                </Button>
            </Box>

            <EditCategoryForm
                category={editingCategory}
                onClose={() => setEditingCategory(null)}
                mode={formMode}
                onSave={handleSaveCategory}
            />

            {filteredCategories.map((category) => (
                <List key={category.id} size="sm" sx={{ '--ListItem-paddingX': 0 }}>
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
                                    <CategoryIcon />
                                </Avatar>
                            </ListItemDecorator>
                            <div>
                                <Typography level="title-sm" gutterBottom>
                                    {category.name}
                                </Typography>
                                <Typography level="body-xs">ID: {category.id}</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                    {category.subcategories.map((subcat) => (
                                        <Chip key={subcat} size="sm" variant="outlined">
                                            {subcat}
                                        </Chip>
                                    ))}
                                </Box>
                            </div>
                        </ListItemContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                            <RowMenu category={category} onEdit={handleEditCategory} />
                        </Box>
                    </ListItem>
                    <ListDivider />
                </List>
            ))}
        </Box>
    );
}