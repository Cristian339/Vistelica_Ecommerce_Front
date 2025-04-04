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
import adminService from '../../../services/adminService';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';

export default function CustomerTable() {
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('id');
    const [selected, setSelected] = React.useState([]);
    const [customersData, setCustomersData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [nameFilter, setNameFilter] = React.useState('');
    const [emailFilter, setEmailFilter] = React.useState('');
    const [editingCustomer, setEditingCustomer] = React.useState(null);

    React.useEffect(() => {
        const fetchClients = async () => {
            try {
                const clients = await adminService.getClients();
                // Transformar los datos del backend al formato esperado por el frontend
                const transformedClients = clients.map(client => ({
                    id: `USR-${client.user_id.toString().padStart(3, '0')}`,
                    userId: client.user_id,
                    email: client.email,
                    banned: client.banned,
                    name: client.profile?.name || 'Sin nombre',
                    avatar: client.profile?.avatar || '/static/images/avatar/default.jpg',
                    ban_reason: client.ban_reason
                }));
                setCustomersData(transformedClients);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    const handleToggleBan = async (customerId, banStatus) => {
        try {
            const customer = customersData.find(c => c.id === customerId);
            if (banStatus) {
                // Pide razón para banear
                setEditingCustomer({
                    ...customer,
                    action: 'ban',
                    showReasonModal: true
                });
            } else {
                await adminService.unbanUser(customer.userId);
                setCustomersData(prev => prev.map(c =>
                    c.id === customerId ? { ...c, banned: false } : c
                ));
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleConfirmBan = async () => {
        try {
            const { userId, ban_reason } = editingCustomer;
            await adminService.banUser(userId, ban_reason);
            setCustomersData(prev => prev.map(c =>
                c.userId === userId ? { ...c, banned: true, ban_reason } : c
            ));
            setEditingCustomer(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditCustomer = (customer) => {
        setEditingCustomer({
            ...customer,
            action: 'edit',
            showEditModal: true
        });
    };

    const handleSaveCustomer = (updatedCustomer) => {
        setCustomersData(prev => prev.map(c =>
            c.id === updatedCustomer.id ? updatedCustomer : c
        ));
        setEditingCustomer(null);
    };

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const filteredCustomers = customersData.filter(customer => {
        const matchesName = customer.name.toLowerCase().includes(nameFilter.toLowerCase());
        const matchesEmail = customer.email.toLowerCase().includes(emailFilter.toLowerCase());
        return matchesName && matchesEmail;
    });

    const sortedCustomers = [...filteredCustomers].sort((a, b) => {
        if (a[orderBy] < b[orderBy]) {
            return order === 'asc' ? -1 : 1;
        }
        if (a[orderBy] > b[orderBy]) {
            return order === 'asc' ? 1 : -1;
        }
        return 0;
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
            if (editingCustomer.action === 'edit') {
                handleSaveCustomer(formData);
            } else if (editingCustomer.action === 'ban') {
                handleConfirmBan();
            }
        };

        if (!editingCustomer) return null;

        return (
            <Modal open={!!editingCustomer} onClose={() => setEditingCustomer(null)}>
                <ModalDialog>
                    <DialogTitle>
                        {editingCustomer.action === 'edit' ? 'Editar cliente' : 'Banear cliente'}
                    </DialogTitle>
                    <DialogContent>
                        {editingCustomer.action === 'edit'
                            ? 'Modifique los detalles del cliente'
                            : 'Ingrese la razón del baneo'}
                    </DialogContent>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            {editingCustomer.action === 'edit' ? (
                                <>
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
                                </>
                            ) : (
                                <FormControl>
                                    <FormLabel>Razón del baneo</FormLabel>
                                    <Input
                                        name="ban_reason"
                                        value={formData.ban_reason || ''}
                                        onChange={handleChange}
                                        required
                                        multiline
                                        minRows={3}
                                    />
                                </FormControl>
                            )}
                            <Button type="submit">
                                {editingCustomer.action === 'edit' ? 'Guardar cambios' : 'Confirmar baneo'}
                            </Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        );
    }

    if (loading) return <Typography>Cargando clientes...</Typography>;
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
                        placeholder="Nombre del cliente"
                        startDecorator={<PersonIcon />}
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                    />
                </FormControl>
                <FormControl sx={{ flex: 1 }} size="sm">
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

            {editingCustomer && <EditCustomerForm />}

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
                                    selected.length > 0 && selected.length !== customersData.length
                                }
                                checked={selected.length === customersData.length}
                                onChange={(event) => {
                                    setSelected(
                                        event.target.checked ? customersData.map((row) => row.id) : [],
                                    );
                                }}
                                color={
                                    selected.length > 0 || selected.length === customersData.length
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
                        <th style={{ width: 240, padding: '12px 6px' }}>
                            <Link
                                underline="none"
                                color="primary"
                                component="button"
                                onClick={() => handleSort('email')}
                                endDecorator={<ArrowDropDownIcon />}
                                sx={{
                                    fontWeight: 'lg',
                                    '& svg': {
                                        transition: '0.2s',
                                        transform: orderBy === 'email' && order === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                                    },
                                }}
                            >
                                Email
                            </Link>
                        </th>
                        <th style={{ width: 140, padding: '12px 6px' }}>Estado</th>
                        <th style={{ width: 100, padding: '12px 6px' }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedCustomers.map((customer) => (
                        <tr key={customer.id}>
                            <td style={{ textAlign: 'center' }}>
                                <Checkbox
                                    size="sm"
                                    checked={selected.includes(customer.id)}
                                    color={selected.includes(customer.id) ? 'primary' : undefined}
                                    onChange={(event) => {
                                        setSelected((ids) =>
                                            event.target.checked
                                                ? ids.concat(customer.id)
                                                : ids.filter((itemId) => itemId !== customer.id),
                                        );
                                    }}
                                    slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                                    sx={{ verticalAlign: 'text-bottom' }}
                                />
                            </td>
                            <td>
                                <Typography level="body-xs">{customer.id}</Typography>
                            </td>
                            <td>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Avatar size="sm" src={customer.avatar} />
                                    <Typography level="body-xs">{customer.name}</Typography>
                                </Box>
                            </td>
                            <td>
                                <Typography level="body-xs">{customer.email}</Typography>
                            </td>
                            <td>
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
                            </td>
                            <td>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <RowMenu
                                        customer={customer}
                                        onToggleBan={handleToggleBan}
                                    />
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