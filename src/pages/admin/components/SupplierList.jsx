import * as React from 'react';
import Box from '@mui/joy/Box';
import Avatar from '@mui/joy/Avatar';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
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
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import AddIcon from '@mui/icons-material/Add';

import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PublicIcon from '@mui/icons-material/Public';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import PersonIcon from '@mui/icons-material/Person';

const initialSuppliers = [
    {
        id: 'SUP-001',
        companyName: 'Tecnologías Avanzadas S.A.',
        email: 'contacto@tecnologias-avanzadas.com',
        address: 'Calle Innovación 123, Barcelona, España',
        phone: '+34 933 456 789',
        country: 'España',
        iban: 'ES91 2100 0418 4502 0005 1332'
    },
    {
        id: 'SUP-002',
        companyName: 'Componentes Globales Ltd.',
        email: 'info@componentes-globales.com',
        address: 'Av. Industrial 456, Hamburgo, Alemania',
        phone: '+49 40 12345678',
        country: 'Alemania',
        iban: 'DE89 3704 0044 0532 0130 00'
    },
    {
        id: 'SUP-003',
        companyName: 'Electrónica del Pacífico',
        email: 'ventas@electronica-pacifico.cl',
        address: 'Calle Tecnológica 789, Santiago, Chile',
        phone: '+56 2 2345 6789',
        country: 'Chile',
        iban: 'CL09 1234 5678 9012 3456 7890'
    },
];

export default function SupplierList() {
    const [suppliersData, setSuppliersData] = React.useState(initialSuppliers);
    const [nameFilter, setNameFilter] = React.useState('');
    const [emailFilter, setEmailFilter] = React.useState('');
    const [editingSupplier, setEditingSupplier] = React.useState(null);
    const [formMode, setFormMode] = React.useState('add');
    const [countries] = React.useState(['España', 'Alemania', 'Francia', 'Italia', 'Chile', 'Portugal', 'EE.UU.']);

    const handleAddSupplier = () => {
        setFormMode('add');
        setEditingSupplier({
            id: `SUP-${(suppliersData.length + 1).toString().padStart(3, '0')}`,
            companyName: '',
            email: '',
            address: '',
            phone: '',
            country: 'España',
            iban: ''
        });
    };

    const handleEditSupplier = (supplier) => {
        setFormMode('edit');
        setEditingSupplier({ ...supplier });
    };

    const handleSaveSupplier = (updatedSupplier) => {
        if (formMode === 'add') {
            setSuppliersData(prev => [...prev, updatedSupplier]);
        } else {
            setSuppliersData(prev => prev.map(supplier =>
                supplier.id === updatedSupplier.id ? updatedSupplier : supplier
            ));
        }
        setEditingSupplier(null);
    };

    const filteredSuppliers = suppliersData.filter(supplier => {
        const matchesName = supplier.companyName.toLowerCase().includes(nameFilter.toLowerCase());
        const matchesEmail = supplier.email.toLowerCase().includes(emailFilter.toLowerCase());
        return matchesName && matchesEmail;
    });

    function renderCountryIcon(country) {
        return <PublicIcon fontSize="small" />;
    }

    function renderPaymentMethodIcon(iban) {
        return <AccountBalanceIcon fontSize="small" />;
    }

    function RowMenu({ supplier }) {
        return (
            <Dropdown>
                <MenuButton
                    slots={{ root: IconButton }}
                    slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
                >
                    <MoreHorizRoundedIcon />
                </MenuButton>
                <Menu size="sm" sx={{ minWidth: 140 }}>
                    <MenuItem onClick={() => handleEditSupplier(supplier)}>Editar</MenuItem>
                    <Divider />
                    <MenuItem color="danger">Eliminar</MenuItem>
                </Menu>
            </Dropdown>
        );
    }

    function SupplierForm() {
        const [formData, setFormData] = React.useState(editingSupplier || {
            id: '',
            companyName: '',
            email: '',
            address: '',
            phone: '',
            country: 'España',
            iban: ''
        });

        React.useEffect(() => {
            if (editingSupplier) {
                setFormData(editingSupplier);
            }
        }, [editingSupplier]);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            handleSaveSupplier(formData);
        };

        if (!editingSupplier) return null;

        return (
            <Modal open={!!editingSupplier} onClose={() => setEditingSupplier(null)}>
                <ModalDialog>
                    <DialogTitle>{formMode === 'add' ? 'Añadir nuevo proveedor' : 'Editar proveedor'}</DialogTitle>
                    <DialogContent>
                        {formMode === 'add' ? 'Complete los detalles del proveedor' : 'Modifique los detalles del proveedor'}
                    </DialogContent>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel>ID</FormLabel>
                                <Input
                                    name="id"
                                    value={formData.id}
                                    disabled={formMode === 'edit'}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Nombre de la empresa</FormLabel>
                                <Input
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    required
                                    startDecorator={<BusinessIcon />}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    startDecorator={<EmailIcon />}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Dirección</FormLabel>
                                <Input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    startDecorator={<LocationOnIcon />}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Teléfono</FormLabel>
                                <Input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    startDecorator={<PhoneIcon />}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>País</FormLabel>
                                <Select
                                    name="country"
                                    value={formData.country}
                                    onChange={(e, value) => setFormData(prev => ({ ...prev, country: value }))}
                                    startDecorator={<PublicIcon />}
                                >
                                    {countries.map(country => (
                                        <Option key={country} value={country}>{country}</Option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl>
                                <FormLabel>IBAN</FormLabel>
                                <Input
                                    name="iban"
                                    value={formData.iban}
                                    onChange={handleChange}
                                    required
                                    startDecorator={<AccountBalanceIcon />}
                                />
                            </FormControl>
                            <Button type="submit">
                                {formMode === 'add' ? 'Añadir Proveedor' : 'Guardar Cambios'}
                            </Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        );
    }

    return (
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <Box
                sx={{
                    borderRadius: 'sm',
                    py: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                }}
            >
                <FormControl size="sm">
                    <FormLabel>Buscar por nombre</FormLabel>
                    <Input
                        size="sm"
                        placeholder="Nombre del proveedor"
                        startDecorator={<BusinessIcon />}
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                    />
                </FormControl>
                <FormControl size="sm">
                    <FormLabel>Buscar por email</FormLabel>
                    <Input
                        size="sm"
                        placeholder="Email del proveedor"
                        startDecorator={<EmailIcon />}
                        value={emailFilter}
                        onChange={(e) => setEmailFilter(e.target.value)}
                    />
                </FormControl>
                <Button
                    size="sm"
                    variant="solid"
                    color="primary"
                    startDecorator={<AddIcon />}
                    onClick={handleAddSupplier}
                >
                    Añadir Proveedor
                </Button>
            </Box>

            <SupplierForm />

            {filteredSuppliers.map((supplier) => (
                <List key={supplier.id} size="sm" sx={{ '--ListItem-paddingX': 0 }}>
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
                                    <BusinessIcon fontSize="small" />
                                </Avatar>
                            </ListItemDecorator>
                            <div>
                                <Typography level="title-sm" gutterBottom>
                                    ID: {supplier.id}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography level="body-sm" fontWeight="lg">
                                        {supplier.companyName}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <EmailIcon fontSize="small" />
                                    <Typography level="body-xs">
                                        {supplier.email}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <PhoneIcon fontSize="small" />
                                    <Typography level="body-xs">
                                        {supplier.phone}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <LocationOnIcon fontSize="small" />
                                    <Typography level="body-xs">
                                        {supplier.address}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {renderCountryIcon(supplier.country)}
                                    <Typography level="body-xs">
                                        {supplier.country}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                    {renderPaymentMethodIcon(supplier.iban)}
                                    <Typography level="body-xs" sx={{ fontFamily: 'monospace' }}>
                                        {supplier.iban}
                                    </Typography>
                                </Box>
                            </div>
                        </ListItemContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                            <RowMenu supplier={supplier} />
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
                    Página 1 de {Math.ceil(filteredSuppliers.length / 3)}
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