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
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import CategoryIcon from '@mui/icons-material/Category';
import SearchIcon from '@mui/icons-material/Search';

// Lista de categorías disponibles
const categories = ['Ropa', 'Electrónica', 'Hogar', 'Deportes', 'Juguetes'];

function EditSubcategoryForm({ subcategory, onClose, mode = 'add', onSave }) {
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

export default function SubcategoryList() {
    const [subcategories, setSubcategories] = React.useState([
        { id: 'SUB-001', name: 'Camisetas', category: 'Ropa' },
        { id: 'SUB-002', name: 'Pantalones', category: 'Ropa' },
        { id: 'SUB-003', name: 'Teléfonos', category: 'Electrónica' },
        { id: 'SUB-004', name: 'Computadoras', category: 'Electrónica' },
        { id: 'SUB-005', name: 'Muebles', category: 'Hogar' },
    ]);
    const [editingSubcategory, setEditingSubcategory] = React.useState(null);
    const [formMode, setFormMode] = React.useState('add');
    const [nameFilter, setNameFilter] = React.useState('');

    const handleEditSubcategory = (subcategory) => {
        setFormMode('edit');
        setEditingSubcategory(subcategory);
    };

    const handleAddSubcategory = () => {
        setFormMode('add');
        setEditingSubcategory({
            id: `SUB-${(subcategories.length + 1).toString().padStart(3, '0')}`,
            name: '',
            category: ''
        });
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
        return matchesName;
    });

    return (
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Input
                    size="sm"
                    placeholder="Buscar subcategoría"
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
                    onClick={handleAddSubcategory}
                >
                    Añadir
                </Button>
            </Box>

            <EditSubcategoryForm
                subcategory={editingSubcategory}
                onClose={() => setEditingSubcategory(null)}
                mode={formMode}
                onSave={handleSaveSubcategory}
            />

            {filteredSubcategories.map((subcategory) => (
                <List key={subcategory.id} size="sm" sx={{ '--ListItem-paddingX': 0 }}>
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
                                    {subcategory.name}
                                </Typography>
                                <Typography level="body-xs">ID: {subcategory.id}</Typography>
                                <Box sx={{ mt: 1 }}>
                                    <Chip size="sm" variant="soft">
                                        {subcategory.category}
                                    </Chip>
                                </Box>
                            </div>
                        </ListItemContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                            <RowMenu subcategory={subcategory} onEdit={handleEditSubcategory} />
                        </Box>
                    </ListItem>
                    <ListDivider />
                </List>
            ))}
        </Box>
    );
}