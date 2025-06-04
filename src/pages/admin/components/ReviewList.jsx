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
import adminService from "@/services/adminService";
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export default function ReviewList() {
    const [nameFilter, setNameFilter] = React.useState('');
    const [productFilter, setProductFilter] = React.useState('');
    const [dateFilter, setDateFilter] = React.useState('');
    const [openFilter, setOpenFilter] = React.useState(false);
    const [editingReview, setEditingReview] = React.useState(null);
    const [reviews, setReviews] = React.useState([]);

    React.useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await adminService.getReportedReviews();
            setReviews(response);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleEditReview = (review) => {
        setEditingReview(review);
    };

    const handleSaveReview = (updatedReview) => {
        setReviews(prev => prev.map(review =>
            review.review_id === updatedReview.review_id ? updatedReview : review
        ));
        setEditingReview(null);
    };

    const filteredReviews = reviews.filter(review => {
        // Safe access to nested properties with fallbacks
        const userName = review.user?.name || review.user?.user_id?.toString() || '';
        const productName = review.product?.name || '';
        const createdDate = review.created_at || '';

        const matchesName = userName.toLowerCase().includes(nameFilter.toLowerCase());
        const matchesProduct = productName.toLowerCase().includes(productFilter.toLowerCase());
        const matchesDate = createdDate.toLowerCase().includes(dateFilter.toLowerCase());

        return matchesName && matchesProduct && matchesDate;
    });

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <StarIcon
                key={i}
                sx={{
                    fontSize: 16,
                    color: i < rating ? 'warning.main' : 'neutral.300'
                }}
            />
        ));
    };

    // Helper function to get user display name
    const getUserDisplayName = (user) => {
        if (user?.name) return user.name;
        if (user?.user_id) return `Usuario #${user.user_id}`;
        return 'Usuario desconocido';
    };

    // Helper function to get user initial
    const getUserInitial = (user) => {
        if (user?.name) return user.name.charAt(0).toUpperCase();
        if (user?.user_id) return user.user_id.toString().charAt(0);
        return '?';
    };

    return (
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Input
                    size="sm"
                    placeholder="Buscar usuario"
                    startDecorator={<PersonIcon />}
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    sx={{ flex: 1 }}
                />
                <IconButton
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    onClick={() => setOpenFilter(true)}
                >
                    <FilterAltIcon />
                </IconButton>
            </Box>

            <Modal open={openFilter} onClose={() => setOpenFilter(false)}>
                <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
                    <ModalClose />
                    <Typography id="filter-modal" level="h2">
                        Filtros avanzados
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl size="sm">
                            <FormLabel>Buscar por producto</FormLabel>
                            <Input
                                size="sm"
                                placeholder="Nombre del producto"
                                value={productFilter}
                                onChange={(e) => setProductFilter(e.target.value)}
                            />
                        </FormControl>
                        <FormControl size="sm">
                            <FormLabel>Buscar por fecha</FormLabel>
                            <Input
                                size="sm"
                                placeholder="Fecha de la reseña"
                                startDecorator={<CalendarMonthIcon />}
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                        </FormControl>
                        <Button color="primary" onClick={() => setOpenFilter(false)}>
                            Aplicar filtros
                        </Button>
                    </Box>
                </ModalDialog>
            </Modal>

            {filteredReviews.map((review) => (
                <List key={review.review_id} size="sm" sx={{ '--ListItem-paddingX': 0 }}>
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
                                    {getUserInitial(review.user)}
                                </Avatar>
                            </ListItemDecorator>
                            <div>
                                <Typography level="title-sm" gutterBottom>
                                    Producto: {review.product?.name || 'Producto desconocido'}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography level="body-xs">
                                        Fecha: {review.created_at || 'Fecha no disponible'}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography level="body-sm">
                                        {getUserDisplayName(review.user)}
                                    </Typography>
                                </Box>
                                <Typography level="body-xs" gutterBottom>
                                    "{review.comment || 'Sin comentario'}"
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {renderStars(review.rating || 0)}
                                    <Typography level="body-xs">
                                        ({review.rating || 0}/5)
                                    </Typography>
                                </Box>
                            </div>
                        </ListItemContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                            <Chip
                                variant="soft"
                                size="sm"
                                color="neutral"
                            >
                                Reseña ID: {review.review_id}
                            </Chip>
                            <Dropdown>
                                <MenuButton
                                    slots={{ root: IconButton }}
                                    slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
                                >
                                    <MoreHorizRoundedIcon />
                                </MenuButton>
                                <Menu size="sm" sx={{ minWidth: 140 }}>
                                    <MenuItem onClick={() => handleEditReview(review)}>Editar</MenuItem>
                                    <Divider />
                                    <MenuItem color="danger">Eliminar</MenuItem>
                                </Menu>
                            </Dropdown>
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
                    <CalendarMonthIcon />
                </IconButton>
                <Typography level="body-sm" sx={{ mx: 'auto' }}>
                    Página 1 de {Math.ceil(filteredReviews.length / 5)}
                </Typography>
                <IconButton
                    aria-label="next page"
                    variant="outlined"
                    color="neutral"
                    size="sm"
                >
                    <CalendarMonthIcon />
                </IconButton>
            </Box>
        </Box>
    );
}