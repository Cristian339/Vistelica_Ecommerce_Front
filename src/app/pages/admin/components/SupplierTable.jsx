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

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import PublicIcon from '@mui/icons-material/Public';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';

const suppliers = [
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
    {
        id: 'SUP-004',
        companyName: 'Suministros Industriales Norte',
        email: 'pedidos@suministros-norte.com',
        address: 'Rue Commerce 101, París, Francia',
        phone: '+33 1 2345 6789',
        country: 'Francia',
        iban: 'FR76 3000 6000 0112 3456 7890 134'
    },
    {
        id: 'SUP-005',
        companyName: 'Materiales Premium Italia',
        email: 'amministrazione@materiales-premium.it',
        address: 'Via Roma 202, Milán, Italia',
        phone: '+39 02 1234 5678',
        country: 'Italia',
        iban: 'IT60 X054 2811 1010 0000 0123 456'
    },
];

function RowMenu() {
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
                <Divider />
                <MenuItem color="danger">Eliminar</MenuItem>
            </Menu>
        </Dropdown>
    );
}

export default function SupplierTable() {
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('id');
    const [selected, setSelected] = React.useState([]);
    const [nameFilter, setNameFilter] = React.useState('');
    const [emailFilter, setEmailFilter] = React.useState('');

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const filteredSuppliers = suppliers.filter(supplier => {
        const matchesName = supplier.companyName.toLowerCase().includes(nameFilter.toLowerCase());
        const matchesEmail = supplier.email.toLowerCase().includes(emailFilter.toLowerCase());
        return matchesName && matchesEmail;
    });

    const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
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
                        placeholder="Nombre del proveedor"
                        startDecorator={<PersonIcon />}
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                    />
                </FormControl>
                <FormControl sx={{ flex: 1 }} size="sm">
                    <FormLabel>Buscar por email</FormLabel>
                    <Input
                        size="sm"
                        placeholder="Email del proveedor"
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
                                    selected.length > 0 && selected.length !== suppliers.length
                                }
                                checked={selected.length === suppliers.length}
                                onChange={(event) => {
                                    setSelected(
                                        event.target.checked ? suppliers.map((row) => row.id) : [],
                                    );
                                }}
                                color={
                                    selected.length > 0 || selected.length === suppliers.length
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
                        <th style={{ width: 180, padding: '12px 6px' }}>
                            <Link
                                underline="none"
                                color="primary"
                                component="button"
                                onClick={() => handleSort('companyName')}
                                endDecorator={<ArrowDropDownIcon />}
                                sx={{
                                    fontWeight: 'lg',
                                    '& svg': {
                                        transition: '0.2s',
                                        transform: orderBy === 'companyName' && order === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                                    },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <BusinessIcon fontSize="small" />
                                    <span>Empresa</span>
                                </Box>
                            </Link>
                        </th>
                        <th style={{ width: 160, padding: '12px 6px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EmailIcon fontSize="small" />
                                <span>Email</span>
                            </Box>
                        </th>
                        <th style={{ width: 200, padding: '12px 6px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOnIcon fontSize="small" />
                                <span>Dirección</span>
                            </Box>
                        </th>
                        <th style={{ width: 140, padding: '12px 6px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PhoneIcon fontSize="small" />
                                <span>Teléfono</span>
                            </Box>
                        </th>
                        <th style={{ width: 120, padding: '12px 6px' }}>
                            <Link
                                underline="none"
                                color="primary"
                                component="button"
                                onClick={() => handleSort('country')}
                                endDecorator={<ArrowDropDownIcon />}
                                sx={{
                                    fontWeight: 'lg',
                                    '& svg': {
                                        transition: '0.2s',
                                        transform: orderBy === 'country' && order === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                                    },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PublicIcon fontSize="small" />
                                    <span>País</span>
                                </Box>
                            </Link>
                        </th>
                        <th style={{ width: 160, padding: '12px 6px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AccountBalanceIcon fontSize="small" />
                                <span>IBAN</span>
                            </Box>
                        </th>
                        <th style={{ width: 80, padding: '12px 6px' }}></th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedSuppliers.map((supplier) => (
                        <tr key={supplier.id}>
                            <td style={{ textAlign: 'center' }}>
                                <Checkbox
                                    size="sm"
                                    checked={selected.includes(supplier.id)}
                                    color={selected.includes(supplier.id) ? 'primary' : undefined}
                                    onChange={(event) => {
                                        setSelected((ids) =>
                                            event.target.checked
                                                ? ids.concat(supplier.id)
                                                : ids.filter((itemId) => itemId !== supplier.id),
                                        );
                                    }}
                                    slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                                    sx={{ verticalAlign: 'text-bottom' }}
                                />
                            </td>
                            <td>
                                <Typography level="body-xs">{supplier.id}</Typography>
                            </td>
                            <td>
                                <Typography level="body-xs">{supplier.companyName}</Typography>
                            </td>
                            <td>
                                <Typography level="body-xs">{supplier.email}</Typography>
                            </td>
                            <td>
                                <Typography level="body-xs" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                                    {supplier.address}
                                </Typography>
                            </td>
                            <td>
                                <Typography level="body-xs">{supplier.phone}</Typography>
                            </td>
                            <td>
                                <Chip variant="outlined" size="sm">
                                    {supplier.country}
                                </Chip>
                            </td>
                            <td>
                                <Typography level="body-xs">{supplier.iban}</Typography>
                            </td>
                            <td>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <RowMenu />
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