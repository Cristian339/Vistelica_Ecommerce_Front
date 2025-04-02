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
];

function renderCountryIcon(country) {
    return <PublicIcon fontSize="small" />;
}

function renderPaymentMethodIcon(iban) {
    return <AccountBalanceIcon fontSize="small" />;
}

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

export default function SupplierList() {
    const [nameFilter, setNameFilter] = React.useState('');
    const [emailFilter, setEmailFilter] = React.useState('');

    const filteredSuppliers = suppliers.filter(supplier => {
        const matchesName = supplier.companyName.toLowerCase().includes(nameFilter.toLowerCase());
        const matchesEmail = supplier.email.toLowerCase().includes(emailFilter.toLowerCase());
        return matchesName && matchesEmail;
    });

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
                        startDecorator={<PersonIcon />}
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
            </Box>

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
                            <RowMenu />
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
                    Página 1 de 1
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