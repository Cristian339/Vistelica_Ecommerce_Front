import React, { useState, useEffect } from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import IconButton from '@mui/joy/IconButton';
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
import adminService from "@/services/adminService";
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

export default function OrderTable() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchFilter, setSearchFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewingOrder, setViewingOrder] = useState(null);
    const [processingOrderId, setProcessingOrderId] = useState(null);

    // Estados para la paginación
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalOrders: 0,
        ordersPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false
    });

    useEffect(() => {
        fetchOrders();
    }, [page, statusFilter, searchFilter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllOrders({
                page,
                status: statusFilter,
                search: searchFilter,
                sortBy: 'created_at',
                sortOrder: 'DESC'
            });

            setOrders(response.orders);
            setPagination(response.pagination);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // Función específica para marcar como enviado
    const handleMarkAsShipped = async (orderId) => {
        try {
            setProcessingOrderId(orderId);
            await adminService.markOrderAsShipped(orderId);
            // Refrescar la lista de órdenes
            await fetchOrders();
        } catch (error) {
            setError(error.message);
        } finally {
            setProcessingOrderId(null);
        }
    };

    // Función específica para marcar como entregado
    const handleMarkAsDelivered = async (orderId) => {
        try {
            setProcessingOrderId(orderId);
            await adminService.markOrderAsDelivered(orderId);
            // Refrescar la lista de órdenes
            await fetchOrders();
        } catch (error) {
            setError(error.message);
        } finally {
            setProcessingOrderId(null);
        }
    };

    // Función genérica para otros cambios de estado
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            setProcessingOrderId(orderId);
            await adminService.updateOrderStatus(orderId, newStatus);
            await fetchOrders();
        } catch (error) {
            setError(error.message);
        } finally {
            setProcessingOrderId(null);
        }
    };

    const getStatusColor = (status) => {
        const statusColors = {
            'Pendiente': 'warning',
            'Almacen': 'primary',
            'Enviado': 'info',
            'Entregado': 'success',
            'Cancelado': 'danger'
        };
        return statusColors[status] || 'neutral';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    function RowMenu({ order }) {
        const isProcessing = processingOrderId === order.order_id;

        return (
            <Dropdown>
                <MenuButton
                    slots={{ root: IconButton }}
                    slotProps={{
                        root: {
                            variant: 'plain',
                            color: 'neutral',
                            size: 'sm',
                            disabled: isProcessing
                        }
                    }}
                >
                    <MoreHorizRoundedIcon />
                </MenuButton>
                <Menu size="sm" sx={{ minWidth: 140 }}>
                    <MenuItem onClick={() => setViewingOrder(order)}>
                        <VisibilityIcon sx={{ mr: 1 }} /> Ver Detalles
                    </MenuItem>

                    {/* Solo mostrar opción de envío si el estado lo permite */}
                    {(order.status === 'Pendiente' || order.status === 'Almacen') && (
                        <MenuItem
                            onClick={() => handleMarkAsShipped(order.order_id)}
                            disabled={isProcessing}
                        >
                            <LocalShippingIcon sx={{ mr: 1 }} />
                            {isProcessing ? 'Procesando...' : 'Marcar Enviado'}
                        </MenuItem>
                    )}

                    {/* Solo mostrar opción de entrega si está enviado */}
                    {order.status === 'Enviado' && (
                        <MenuItem
                            onClick={() => handleMarkAsDelivered(order.order_id)}
                            disabled={isProcessing}
                        >
                            <EditIcon sx={{ mr: 1 }} />
                            {isProcessing ? 'Procesando...' : 'Marcar Entregado'}
                        </MenuItem>
                    )}

                    {/* Opción para cancelar si aún no está enviado */}
                    {(order.status === 'Pendiente' || order.status === 'Almacen') && (
                        <MenuItem
                            onClick={() => handleStatusChange(order.order_id, 'Cancelado')}
                            disabled={isProcessing}
                            sx={{ color: 'danger.main' }}
                        >
                            <EditIcon sx={{ mr: 1 }} />
                            {isProcessing ? 'Procesando...' : 'Cancelar Orden'}
                        </MenuItem>
                    )}
                </Menu>
            </Dropdown>
        );
    }

    function OrderDetailsModal({ order, onClose }) {
        if (!order) return null;

        return (
            <Modal open onClose={onClose}>
                <ModalDialog
                    sx={{
                        maxWidth: '800px',
                        width: '90vw',
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Detalles de la Orden #{order.order_number}</span>
                            <Chip
                                color={getStatusColor(order.status)}
                                size="sm"
                                variant="soft"
                            >
                                {order.status}
                            </Chip>
                        </Box>
                    </DialogTitle>

                    <DialogContent
                        sx={{
                            overflowY: 'auto',
                            flexGrow: 1,
                            px: 0,
                            '&::-webkit-scrollbar': {
                                width: '6px'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                borderRadius: '3px'
                            }
                        }}
                    >
                        <Stack spacing={3} sx={{ px: 2 }}>
                            {/* Información del Cliente */}
                            <Box>
                                <Typography level="title-md" sx={{ mb: 1 }}>
                                    Información del Cliente
                                </Typography>
                                <Typography level="body-sm">
                                    <strong>Nombre:</strong> {order.user.profile.first_name} {order.user.profile.last_name}
                                </Typography>
                                <Typography level="body-sm">
                                    <strong>Email:</strong> {order.user.email}
                                </Typography>
                                <Typography level="body-sm">
                                    <strong>Teléfono:</strong> {order.user.profile.phone}
                                </Typography>
                            </Box>

                            <Divider />

                            {/* Dirección de Envío */}
                            <Box>
                                <Typography level="title-md" sx={{ mb: 1 }}>
                                    Dirección de Envío
                                </Typography>
                                <Typography level="body-sm">
                                    {order.address.street}
                                </Typography>
                                <Typography level="body-sm">
                                    {order.address.city}, {order.address.state} {order.address.postal_code}
                                </Typography>
                                <Typography level="body-sm">
                                    {order.address.country}
                                </Typography>
                                {order.address.label && (
                                    <Chip size="sm" variant="outlined" sx={{ mt: 0.5 }}>
                                        {order.address.label}
                                    </Chip>
                                )}
                            </Box>

                            <Divider />

                            {/* Productos */}
                            <Box>
                                <Typography level="title-md" sx={{ mb: 2 }}>
                                    Productos ({order.details.length})
                                </Typography>
                                {order.details.map((detail, index) => (
                                    <Box key={detail.order_detail_id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 'sm' }}>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Avatar
                                                src={detail.product.images.find(img => img.is_main)?.image_url}
                                                size="lg"
                                                sx={{ borderRadius: 'sm' }}
                                            />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography level="title-sm">
                                                    {detail.product.name}
                                                </Typography>
                                                <Typography level="body-xs" sx={{ mt: 0.5, mb: 1 }}>
                                                    {detail.product.description.substring(0, 100)}...
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                                                    {detail.size && (
                                                        <Chip size="sm" variant="outlined">
                                                            Talla: {detail.size}
                                                        </Chip>
                                                    )}
                                                    {detail.color && (
                                                        <Chip size="sm" variant="outlined">
                                                            Color: {detail.color}
                                                        </Chip>
                                                    )}
                                                    <Chip size="sm" variant="outlined">
                                                        Cantidad: {detail.quantity}
                                                    </Chip>
                                                </Box>
                                                <Typography level="title-sm" color="primary">
                                                    ${detail.price} c/u
                                                </Typography>
                                                {detail.product.discount_percentage > 0 && (
                                                    <Typography level="body-xs" color="success">
                                                        Descuento: {detail.product.discount_percentage}%
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>

                            <Divider />

                            {/* Información de Pago */}
                            <Box>
                                <Typography level="title-md" sx={{ mb: 1 }}>
                                    Información de Pago
                                </Typography>
                                <Typography level="body-sm">
                                    <strong>Método:</strong> {order.payment_method_name}
                                </Typography>
                                <Typography level="body-sm">
                                    <strong>Subtotal:</strong> ${order.total_price}
                                </Typography>
                                <Typography level="body-sm">
                                    <strong>Envío:</strong> ${order.shipping_cost}
                                </Typography>
                                <Typography level="title-sm" color="primary">
                                    <strong>Total:</strong> ${(parseFloat(order.total_price) + parseFloat(order.shipping_cost)).toFixed(2)}
                                </Typography>

                                {order.payments && order.payments.length > 0 && (
                                    <Box sx={{ mt: 1 }}>
                                        <Typography level="body-sm">
                                            <strong>Estado del Pago:</strong>
                                            <Chip size="sm" color="success" sx={{ ml: 1 }}>
                                                {order.payments[0].payment_status}
                                            </Chip>
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                            <Divider />

                            {/* Fechas */}
                            <Box>
                                <Typography level="title-md" sx={{ mb: 1 }}>
                                    Fechas Importantes
                                </Typography>
                                <Typography level="body-sm">
                                    <strong>Fecha de Pedido:</strong> {formatDate(order.created_at)}
                                </Typography>
                                <Typography level="body-sm">
                                    <strong>Entrega Estimada:</strong> {formatDate(order.estimated_delivery_date)}
                                </Typography>
                                {order.delivered_at && (
                                    <Typography level="body-sm">
                                        <strong>Fecha de Entrega:</strong> {formatDate(order.delivered_at)}
                                    </Typography>
                                )}
                            </Box>
                        </Stack>
                    </DialogContent>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 2,
                        pt: 2,
                        pb: 1,
                        px: 2,
                        borderTop: '1px solid',
                        borderColor: 'divider'
                    }}>
                        {/* Acciones rápidas en el modal */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {(order.status === 'Pendiente' || order.status === 'Almacen') && (
                                <Button
                                    variant="soft"
                                    color="primary"
                                    size="sm"
                                    startDecorator={<LocalShippingIcon />}
                                    onClick={() => {
                                        handleMarkAsShipped(order.order_id);
                                        onClose();
                                    }}
                                    disabled={processingOrderId === order.order_id}
                                >
                                    Marcar Enviado
                                </Button>
                            )}

                            {order.status === 'Enviado' && (
                                <Button
                                    variant="soft"
                                    color="success"
                                    size="sm"
                                    startDecorator={<EditIcon />}
                                    onClick={() => {
                                        handleMarkAsDelivered(order.order_id);
                                        onClose();
                                    }}
                                    disabled={processingOrderId === order.order_id}
                                >
                                    Marcar Entregado
                                </Button>
                            )}
                        </Box>

                        <Button variant="outlined" onClick={onClose}>Cerrar</Button>
                    </Box>
                </ModalDialog>
            </Modal>
        );
    }

    if (loading) return <Typography>Cargando órdenes...</Typography>;
    if (error) return <Typography color="danger">Error: {error}</Typography>;

    return (
        <React.Fragment>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    gap: 2
                }}
            >
                <FormControl sx={{ flex: 1, maxWidth: 300 }}>
                    <Input
                        size="sm"
                        placeholder="Buscar por número de orden o cliente..."
                        startDecorator={<SearchIcon />}
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                    />
                </FormControl>

                <FormControl sx={{ minWidth: 150 }}>
                    <Select
                        size="sm"
                        value={statusFilter}
                        onChange={(e, newValue) => setStatusFilter(newValue)}
                    >
                        <Option value="all">Todos los Estados</Option>
                        <Option value="Pendiente">Pendiente</Option>
                        <Option value="Almacen">Almacén</Option>
                        <Option value="Enviado">Enviado</Option>
                        <Option value="Entregado">Entregado</Option>
                        <Option value="Cancelado">Cancelado</Option>
                    </Select>
                </FormControl>
            </Box>

            {viewingOrder && (
                <OrderDetailsModal
                    order={viewingOrder}
                    onClose={() => setViewingOrder(null)}
                />
            )}

            <Sheet variant="outlined" sx={{ borderRadius: 'sm', overflow: 'auto' }}>
                <Table hoverRow>
                    <thead>
                    <tr>
                        <th>Número de Orden</th>
                        <th>Cliente</th>
                        <th>Estado</th>
                        <th>Total</th>
                        <th>Método de Pago</th>
                        <th>Fecha</th>
                        <th>Productos</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order.order_id}>
                            <td>
                                <Typography fontWeight="lg" level="body-sm">
                                    {order.order_number}
                                </Typography>
                            </td>
                            <td>
                                <Box>
                                    <Typography level="body-sm" fontWeight="lg">
                                        {order.user.profile.first_name} {order.user.profile.last_name}
                                    </Typography>
                                    <Typography level="body-xs" color="neutral">
                                        {order.user.email}
                                    </Typography>
                                </Box>
                            </td>
                            <td>
                                <Chip
                                    color={getStatusColor(order.status)}
                                    size="sm"
                                    variant="soft"
                                >
                                    {order.status}
                                </Chip>
                            </td>
                            <td>
                                <Typography fontWeight="lg" color="primary">
                                    ${order.total_price}
                                </Typography>
                                {order.shipping_cost > 0 && (
                                    <Typography level="body-xs" color="neutral">
                                        + ${order.shipping_cost} envío
                                    </Typography>
                                )}
                            </td>
                            <td>
                                <Chip size="sm" variant="outlined">
                                    {order.payment_method_name}
                                </Chip>
                            </td>
                            <td>
                                <Typography level="body-sm">
                                    {formatDate(order.created_at)}
                                </Typography>
                            </td>
                            <td>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                    {order.details.slice(0, 2).map((detail, index) => (
                                        <Typography key={index} level="body-xs">
                                            {detail.quantity}x {detail.product.name.substring(0, 20)}...
                                        </Typography>
                                    ))}
                                    {order.details.length > 2 && (
                                        <Typography level="body-xs" color="neutral">
                                            +{order.details.length - 2} más
                                        </Typography>
                                    )}
                                </Box>
                            </td>
                            <td>
                                <RowMenu order={order} />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Sheet>

            {pagination.totalPages > 1 && (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2,
                    mt: 2,
                    p: 1,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Button
                        variant="outlined"
                        size="sm"
                        disabled={!pagination.hasPrevPage}
                        onClick={() => setPage(p => p - 1)}
                    >
                        Anterior
                    </Button>

                    <Typography level="body-md">
                        Página {pagination.currentPage} de {pagination.totalPages}
                    </Typography>

                    <Button
                        variant="outlined"
                        size="sm"
                        disabled={!pagination.hasNextPage}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Siguiente
                    </Button>
                </Box>
            )}

            {/* Estadísticas rápidas */}
            <Box sx={{
                display: 'flex',
                gap: 2,
                mt: 3,
                p: 2,
                bgcolor: 'background.level1',
                borderRadius: 'sm'
            }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography level="h4" color="primary">
                        {pagination.totalOrders}
                    </Typography>
                    <Typography level="body-xs">
                        Total Órdenes
                    </Typography>
                </Box>
            </Box>
        </React.Fragment>
    );
}