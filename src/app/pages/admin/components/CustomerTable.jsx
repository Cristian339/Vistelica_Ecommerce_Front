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
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
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
    {
        id: 'USR-004',
        email: 'cliente4@example.com',
        banned: true,
        name: 'Ana Martínez',
        avatar: '/static/images/avatar/4.jpg'
    },
    {
        id: 'USR-005',
        email: 'cliente5@example.com',
        banned: false,
        name: 'Pedro Sánchez',
        avatar: '/static/images/avatar/5.jpg'
    },
];

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
                <MenuItem>Editar</MenuItem>
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

export default function CustomerTable() {
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('id');
    const [selected, setSelected] = React.useState([]);
    const [customersData, setCustomersData] = React.useState(customers);
    const [nameFilter, setNameFilter] = React.useState('');
    const [emailFilter, setEmailFilter] = React.useState('');

    const handleToggleBan = (customerId, banStatus) => {
        setCustomersData(prev => prev.map(customer =>
            customer.id === customerId ? { ...customer, banned: banStatus } : customer
        ));
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
                                    <RowMenu customer={customer} onToggleBan={handleToggleBan} />
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