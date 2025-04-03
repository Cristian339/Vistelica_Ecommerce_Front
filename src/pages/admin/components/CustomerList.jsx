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
import Input from '@mui/joy/Input';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';

import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';

const customers = [
    {
        id: 'USR-001',
        email: 'cliente1@example.com',
        banned: false,
        name: 'Juan Pérez',
        avatar: '/static/images/avatar/1.jpg'
    },
    {
        id: 'USR-002',
        email: 'cliente2@example.com',
        banned: true,
        name: 'María García',
        avatar: '/static/images/avatar/2.jpg'
    },
    {
        id: 'USR-003',
        email: 'cliente3@example.com',
        banned: false,
        name: 'Carlos López',
        avatar: '/static/images/avatar/3.jpg'
    },
];

export default function CustomerList() {
    const [customersData, setCustomersData] = React.useState(customers);
    const [nameFilter, setNameFilter] = React.useState('');
    const [emailFilter, setEmailFilter] = React.useState('');
    const [editingCustomer, setEditingCustomer] = React.useState(null);

    const handleToggleBan = (customerId, banStatus) => {
        setCustomersData(prev => prev.map(customer =>
            customer.id === customerId ? { ...customer, banned: banStatus } : customer
        ));
    };

    const handleEditCustomer = (customer) => {
        setEditingCustomer(customer);
    };

    const handleSaveCustomer = (updatedCustomer) => {
        setCustomersData(prev => prev.map(customer =>
            customer.id === updatedCustomer.id ? updatedCustomer : customer
        ));
        setEditingCustomer(null);
    };

    const filteredCustomers = customersData.filter(customer => {
        const matchesName = customer.name.toLowerCase().includes(nameFilter.toLowerCase());
        const matchesEmail = customer.email.toLowerCase().includes(emailFilter.toLowerCase());
        return matchesName && matchesEmail;
    });

    function RowMenu({ customer, onToggleBan }) {
        return (
            <Dropdown>
                <MenuButton
                    slots={{ root: IconButton }}
                    slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
                >
                    <MoreHorizRoundedIcon />
                </MenuButton>
                <Menu size="sm" sx={{ minWidth: 140 }}>
                    <MenuItem onClick={() => handleEditCustomer(customer)}>Editar</MenuItem>
                    {customer.banned ? (
                        <MenuItem onClick={() => onToggleBan(customer.id, false)}>
                            Desbanear
                        </MenuItem>
                    ) : (
                        <MenuItem onClick={() => onToggleBan(customer.id, true)}>
                            Banear
                        </MenuItem>
                    )}
                    <Divider />
                    <MenuItem color="danger">Eliminar</MenuItem>
                </Menu>
            </Dropdown>
        );
    }

    function EditCustomerForm() {
        const [formData, setFormData] = React.useState(editingCustomer || {
            id: '',
            email: '',
            banned: false,
            name: '',
            avatar: ''
        });

        React.useEffect(() => {
            if (editingCustomer) {
                setFormData(editingCustomer);
            }
        }, [editingCustomer]);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            handleSaveCustomer(formData);
        };

        if (!editingCustomer) return null;

        return (
            <Modal open={!!editingCustomer} onClose={() => setEditingCustomer(null)}>
                <ModalDialog>
                    <DialogTitle>Editar cliente</DialogTitle>
                    <DialogContent>Modifique los detalles del cliente</DialogContent>
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
                                <FormLabel>Email</FormLabel>
                                <Input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Estado</FormLabel>
                                <Select
                                    value={formData.banned ? 'banned' : 'active'}
                                    onChange={(e, value) => {
                                        setFormData(prev => ({ ...prev, banned: value === 'banned' }));
                                    }}
                                >
                                    <Option value="active">Activo</Option>
                                    <Option value="banned">Baneado</Option>
                                </Select>
                            </FormControl>
                            <Button type="submit">Guardar cambios</Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        );
    }

    return (
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                <FormControl size="sm">
                    <FormLabel>Buscar por nombre</FormLabel>
                    <Input
                        size="sm"
                        placeholder="Nombre del cliente"
                        startDecorator={<PersonIcon />}
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                    />
                </FormControl>
                <FormControl size="sm">
                    <FormLabel>Buscar por email</FormLabel>
                    <Input
                        size="sm"
                        placeholder="Email del cliente"
                        startDecorator={<EmailIcon />}
                        value={emailFilter}
                        onChange={(e) => setEmailFilter(e.target.value)}
                    />
                </FormControl>
            </Box>

            <EditCustomerForm />

            {filteredCustomers.map((customer) => (
                <List key={customer.id} size="sm" sx={{ '--ListItem-paddingX': 0 }}>
                    <ListItem
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                        }}
                    >
                        <ListItemContent sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                            <ListItemDecorator>
                                <Avatar src={customer.avatar} size="sm" />
                            </ListItemDecorator>
                            <div>
                                <Typography level="title-sm" gutterBottom>
                                    ID: {customer.id}
                                </Typography>
                                <Typography level="body-sm" gutterBottom>
                                    {customer.email}
                                </Typography>
                                <Typography level="body-xs">
                                    {customer.name}
                                </Typography>
                            </div>
                        </ListItemContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                            <Chip
                                variant="soft"
                                size="sm"
                                startDecorator={
                                    customer.banned ? <BlockIcon /> : <CheckRoundedIcon />
                                }
                                color={customer.banned ? 'danger' : 'success'}
                            >
                                {customer.banned ? 'Baneado' : 'Activo'}
                            </Chip>
                            <RowMenu customer={customer} onToggleBan={handleToggleBan} />
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
                    Página 1 de {Math.ceil(filteredCustomers.length / 3)}
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