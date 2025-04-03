import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Stack from '@mui/joy/Stack';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const initialRows = [
    {
        id: 'INV-1234',
        date: '3 Feb, 2023',
        status: 'Reembolsado',
        customer: {
            initial: 'O',
            name: 'Olivia Ryhe',
            email: 'olivia@email.com',
        },
        shippingAddress: 'Calle Principal 123, Madrid, España',
        paymentMethod: 'tarjeta'
    },
    {
        id: 'INV-1233',
        date: '3 Feb, 2023',
        status: 'Pagado',
        customer: {
            initial: 'S',
            name: 'Steve Hampton',
            email: 'steve.hamp@email.com',
        },
        shippingAddress: 'Avenida Secundaria 456, Barcelona, España',
        paymentMethod: 'bizum'
    },
    {
        id: 'INV-1232',
        date: '3 Feb, 2023',
        status: 'Reembolsado',
        customer: {
            initial: 'C',
            name: 'Ciaran Murray',
            email: 'ciaran.murray@email.com',
        },
        shippingAddress: 'Plaza Central 789, Valencia, España',
        paymentMethod: 'paypal'
    },
    {
        id: 'INV-1231',
        date: '4 Feb, 2023',
        status: 'Reembolsado',
        customer: {
            initial: 'M',
            name: 'Maria Macdonald',
            email: 'maria.mc@email.com',
        },
        shippingAddress: 'Callejón 101, Sevilla, España',
        paymentMethod: 'tarjeta'
    },
    {
        id: 'INV-1230',
        date: '5 Feb, 2023',
        status: 'Cancelado',
        customer: {
            initial: 'C',
            name: 'Charles Fulton',
            email: 'fulton@email.com',
        },
        shippingAddress: 'Paseo Marítimo 202, Málaga, España',
        paymentMethod: 'bizum'
    },
];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function EditOrderForm({ order, onSave, onClose }) {
    const [formData, setFormData] = React.useState(order || {
        id: '',
        date: '',
        status: 'Pagado',
        customer: {
            initial: '',
            name: '',
            email: '',
        },
        shippingAddress: '',
        paymentMethod: 'tarjeta'
    });

    React.useEffect(() => {
        if (order) {
            setFormData(order);
        }
    }, [order]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            if (name.startsWith('customer.')) {
                const field = name.split('.')[1];
                return {
                    ...prev,
                    customer: {
                        ...prev.customer,
                        [field]: value
                    }
                };
            }
            return { ...prev, [name]: value };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!order) return null;

    return (
        <Modal open={!!order} onClose={onClose}>
            <ModalDialog>
                <DialogTitle>Editar Pedido</DialogTitle>
                <DialogContent>Modifique los detalles del pedido</DialogContent>
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
                            <FormLabel>Fecha</FormLabel>
                            <Input
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Estado</FormLabel>
                            <Select
                                value={formData.status}
                                onChange={(e, value) => {
                                    setFormData(prev => ({ ...prev, status: value }));
                                }}
                            >
                                <Option value="Pagado">Pagado</Option>
                                <Option value="Reembolsado">Reembolsado</Option>
                                <Option value="Cancelado">Cancelado</Option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Nombre del Cliente</FormLabel>
                            <Input
                                name="customer.name"
                                value={formData.customer.name}
                                onChange={handleChange}
                                required
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Email del Cliente</FormLabel>
                            <Input
                                name="customer.email"
                                type="email"
                                value={formData.customer.email}
                                onChange={handleChange}
                                required
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Dirección de Envío</FormLabel>
                            <Input
                                name="shippingAddress"
                                value={formData.shippingAddress}
                                onChange={handleChange}
                                required
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Método de Pago</FormLabel>
                            <Select
                                value={formData.paymentMethod}
                                onChange={(e, value) => {
                                    setFormData(prev => ({ ...prev, paymentMethod: value }));
                                }}
                            >
                                <Option value="tarjeta">Tarjeta</Option>
                                <Option value="bizum">Bizum</Option>
                                <Option value="paypal">PayPal</Option>
                            </Select>
                        </FormControl>
                        <Button type="submit">Guardar cambios</Button>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    );
}

function RowMenu({ order, onEdit }) {
    return (
        <Dropdown>
            <MenuButton
                slots={{ root: IconButton }}
                slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
            >
                <MoreHorizRoundedIcon />
            </MenuButton>
            <Menu size="sm" sx={{ minWidth: 140 }}>
                <MenuItem onClick={() => onEdit(order)}>Editar</MenuItem>
                <MenuItem>Renombrar</MenuItem>
                <Divider />
                <MenuItem color="danger">Eliminar</MenuItem>
            </Menu>
        </Dropdown>
    );
}

export default function OrderTable() {
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('id');
    const [selected, setSelected] = React.useState([]);
    const [rows, setRows] = React.useState(initialRows);
    const [editingOrder, setEditingOrder] = React.useState(null);
    const [nameFilter, setNameFilter] = React.useState('');
    const [emailFilter, setEmailFilter] = React.useState('');
    const [dateFilter, setDateFilter] = React.useState('');

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleEditOrder = (order) => {
        setEditingOrder(order);
    };

    const handleSaveOrder = (updatedOrder) => {
        setRows(prev => prev.map(order =>
            order.id === updatedOrder.id ? updatedOrder : order
        ));
        setEditingOrder(null);
    };

    const renderPaymentMethodIcon = (method) => {
        switch(method) {
            case 'tarjeta':
                return <CreditCardIcon fontSize="small" />;
            case 'bizum':
                return <PaymentIcon fontSize="small" />;
            case 'paypal':
                return <AccountBalanceWalletIcon fontSize="small" />;
            default:
                return <CreditCardIcon fontSize="small" />;
        }
    };

    const filteredRows = rows.filter(row => {
        const matchesName = row.customer.name.toLowerCase().includes(nameFilter.toLowerCase());
        const matchesEmail = row.customer.email.toLowerCase().includes(emailFilter.toLowerCase());
        const matchesDate = row.date.toLowerCase().includes(dateFilter.toLowerCase());

        return matchesName && matchesEmail && matchesDate;
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
                <FormControl sx={{ flex: 1 }} size="sm">
                    <FormLabel>Buscar por fecha</FormLabel>
                    <Input
                        size="sm"
                        placeholder="Fecha del pedido"
                        startDecorator={<CalendarMonthIcon />}
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    />
                </FormControl>
            </Box>

            <EditOrderForm
                order={editingOrder}
                onSave={handleSaveOrder}
                onClose={() => setEditingOrder(null)}
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
                                    selected.length > 0 && selected.length !== filteredRows.length
                                }
                                checked={selected.length === filteredRows.length}
                                onChange={(event) => {
                                    setSelected(
                                        event.target.checked ? filteredRows.map((row) => row.id) : [],
                                    );
                                }}
                                color={
                                    selected.length > 0 || selected.length === filteredRows.length
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
                        <th style={{ width: 140, padding: '12px 6px' }}>
                            <Link
                                underline="none"
                                color="primary"
                                component="button"
                                onClick={() => handleSort('date')}
                                endDecorator={<ArrowDropDownIcon />}
                                sx={{
                                    fontWeight: 'lg',
                                    '& svg': {
                                        transition: '0.2s',
                                        transform: orderBy === 'date' && order === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                                    },
                                }}
                            >
                                Fecha
                            </Link>
                        </th>
                        <th style={{ width: 140, padding: '12px 6px' }}>Estado</th>
                        <th style={{ width: 200, padding: '12px 6px' }}>Cliente</th>
                        <th style={{ width: 220, padding: '12px 6px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOnIcon fontSize="small" />
                                <span>Dirección</span>
                            </Box>
                        </th>
                        <th style={{ width: 150, padding: '12px 6px' }}>
                            <Link
                                underline="none"
                                color="primary"
                                component="button"
                                onClick={() => handleSort('paymentMethod')}
                                endDecorator={<ArrowDropDownIcon />}
                                sx={{
                                    fontWeight: 'lg',
                                    '& svg': {
                                        transition: '0.2s',
                                        transform: orderBy === 'paymentMethod' && order === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                                    },
                                }}
                            >
                                Método Pago
                            </Link>
                        </th>
                        <th style={{ width: 80, padding: '12px 6px' }}></th>
                    </tr>
                    </thead>
                    <tbody>
                    {[...filteredRows].sort(getComparator(order, orderBy)).map((row) => (
                        <tr key={row.id}>
                            <td style={{ textAlign: 'center' }}>
                                <Checkbox
                                    size="sm"
                                    checked={selected.includes(row.id)}
                                    color={selected.includes(row.id) ? 'primary' : undefined}
                                    onChange={(event) => {
                                        setSelected((ids) =>
                                            event.target.checked
                                                ? ids.concat(row.id)
                                                : ids.filter((itemId) => itemId !== row.id),
                                        );
                                    }}
                                    slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                                    sx={{ verticalAlign: 'text-bottom' }}
                                />
                            </td>
                            <td>
                                <Typography level="body-xs">{row.id}</Typography>
                            </td>
                            <td>
                                <Typography level="body-xs">{row.date}</Typography>
                            </td>
                            <td>
                                <Chip
                                    variant="soft"
                                    size="sm"
                                    startDecorator={
                                        {
                                            Pagado: <CheckRoundedIcon />,
                                            Reembolsado: <AutorenewRoundedIcon />,
                                            Cancelado: <BlockIcon />,
                                        }[row.status]
                                    }
                                    color={
                                        {
                                            Pagado: 'success',
                                            Reembolsado: 'neutral',
                                            Cancelado: 'danger',
                                        }[row.status]
                                    }
                                >
                                    {row.status}
                                </Chip>
                            </td>
                            <td>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Avatar size="sm">{row.customer.initial}</Avatar>
                                    <div>
                                        <Typography level="body-xs">{row.customer.name}</Typography>
                                        <Typography level="body-xs">{row.customer.email}</Typography>
                                    </div>
                                </Box>
                            </td>
                            <td>
                                <Typography level="body-xs" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                                    {row.shippingAddress}
                                </Typography>
                            </td>
                            <td>
                                <Chip
                                    variant="outlined"
                                    size="sm"
                                    startDecorator={renderPaymentMethodIcon(row.paymentMethod)}
                                >
                                    {row.paymentMethod === 'tarjeta' ? 'Tarjeta' :
                                        row.paymentMethod === 'bizum' ? 'Bizum' : 'PayPal'}
                                </Chip>
                            </td>
                            <td>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <RowMenu order={row} onEdit={handleEditOrder} />
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