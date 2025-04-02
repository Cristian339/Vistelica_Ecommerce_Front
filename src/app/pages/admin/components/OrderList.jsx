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
import Button from '@mui/joy/Button'; // Importación añadida

import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const listItems = [
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
];

function renderPaymentMethodIcon(method) {
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

export default function OrderList() {
    const [nameFilter, setNameFilter] = React.useState('');
    const [emailFilter, setEmailFilter] = React.useState('');
    const [dateFilter, setDateFilter] = React.useState('');
    const [open, setOpen] = React.useState(false);

    const filteredItems = listItems.filter(item => {
        const matchesName = item.customer.name.toLowerCase().includes(nameFilter.toLowerCase());
        const matchesEmail = item.customer.email.toLowerCase().includes(emailFilter.toLowerCase());
        const matchesDate = item.date.toLowerCase().includes(dateFilter.toLowerCase());

        return matchesName && matchesEmail && matchesDate;
    });

    return (
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Input
                    size="sm"
                    placeholder="Buscar nombre"
                    startDecorator={<PersonIcon />}
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    sx={{ flex: 1 }}
                />
                <IconButton
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    onClick={() => setOpen(true)}
                >
                    <FilterAltIcon />
                </IconButton>
            </Box>

            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
                    <ModalClose />
                    <Typography id="filter-modal" level="h2">
                        Filtros avanzados
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                        <FormControl size="sm">
                            <FormLabel>Buscar por fecha</FormLabel>
                            <Input
                                size="sm"
                                placeholder="Fecha del pedido"
                                startDecorator={<CalendarMonthIcon />}
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                        </FormControl>
                        <Button color="primary" onClick={() => setOpen(false)}>
                            Aplicar filtros
                        </Button>
                    </Box>
                </ModalDialog>
            </Modal>

            {filteredItems.map((listItem) => (
                <List key={listItem.id} size="sm" sx={{ '--ListItem-paddingX': 0 }}>
                    <ListItem
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                        }}
                    >
                        <ListItemContent sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                            <ListItemDecorator>
                                <Avatar size="sm">{listItem.customer.initial}</Avatar>
                            </ListItemDecorator>
                            <div>
                                <Typography level="title-sm" gutterBottom>
                                    ID: {listItem.id}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography level="body-xs">Fecha: {listItem.date}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography level="body-sm">{listItem.customer.name}</Typography>
                                </Box>
                                <Typography level="body-xs" gutterBottom>
                                    {listItem.customer.email}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <LocationOnIcon fontSize="small" />
                                    <Typography level="body-xs">
                                        {listItem.shippingAddress}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {renderPaymentMethodIcon(listItem.paymentMethod)}
                                    <Typography level="body-xs">
                                        {listItem.paymentMethod === 'tarjeta' ? 'Tarjeta' :
                                            listItem.paymentMethod === 'bizum' ? 'Bizum' : 'PayPal'}
                                    </Typography>
                                </Box>
                            </div>
                        </ListItemContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                            <Chip
                                variant="soft"
                                size="sm"
                                startDecorator={
                                    {
                                        Pagado: <CheckRoundedIcon />,
                                        Reembolsado: <AutorenewRoundedIcon />,
                                        Cancelado: <BlockIcon />,
                                    }[listItem.status]
                                }
                                color={
                                    {
                                        Pagado: 'success',
                                        Reembolsado: 'neutral',
                                        Cancelado: 'danger',
                                    }[listItem.status]
                                }
                            >
                                {listItem.status}
                            </Chip>
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
                    Página 1 de {Math.ceil(filteredItems.length / 5)}
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