'use client';
import React, { useState, useEffect } from 'react';
import {
    Avatar,
    Box,
    Button,
    Chip,
    Divider,
    FormControl,
    Input,
    Sheet,
    Table,
    Typography,
    Modal,
    ModalDialog,
    DialogTitle,
    DialogContent,
    Stack,
    Textarea
} from '@mui/joy';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import adminService from '@/services/adminService';
import FormLabel from "@mui/joy/FormLabel";

export default function RefundTable() {
    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRefund, setSelectedRefund] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [openRejectModal, setOpenRejectModal] = useState(false);

    useEffect(() => {
        const fetchRefunds = async () => {
            try {
                const data = await adminService.getRefundsInReview();
                setRefunds(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchRefunds();
    }, []);

    const handleApproveRefund = async (refundId) => {
        try {
            await adminService.updateRefundStatus(refundId, 'Aceptado');
            setRefunds(refunds.filter(refund => refund.order_detail_id !== refundId));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRejectRefund = async () => {
        if (!rejectionReason) {
            setError('Debe proporcionar un motivo de rechazo');
            return;
        }

        try {
            await adminService.updateRefundStatus(
                selectedRefund.order_detail_id,
                'Rechazado',
                rejectionReason
            );
            setRefunds(refunds.filter(refund => refund.order_detail_id !== selectedRefund.order_detail_id));
            setOpenRejectModal(false);
            setRejectionReason('');
        } catch (err) {
            setError(err.message);
        }
    };

    const filteredRefunds = refunds.filter(refund => {
        const searchLower = searchTerm.toLowerCase();
        return (
            refund.order?.order_number.toLowerCase().includes(searchLower) ||
            refund.product?.name.toLowerCase().includes(searchLower) ||
            refund.order?.user?.email.toLowerCase().includes(searchLower)
        );
    });

    if (loading) return <Typography>Cargando devoluciones...</Typography>;
    if (error) return <Typography color="danger">Error: {error}</Typography>;

    return (
        <React.Fragment>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}
            >
                <Typography level="h4" component="h1">
                    Devoluciones en Revisión
                </Typography>

                <FormControl sx={{ width: 300 }}>
                    <Input
                        size="sm"
                        placeholder="Buscar devoluciones..."
                        startDecorator={<SearchIcon />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </FormControl>
            </Box>

            <Sheet variant="outlined" sx={{ borderRadius: 'sm', overflow: 'auto' }}>
                <Table hoverRow>
                    <thead>
                    <tr>
                        <th>Pedido</th>
                        <th>Producto</th>
                        <th>Usuario</th>
                        <th>Motivo</th>
                        <th>Imagen</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredRefunds.map((refund) => (
                        <tr key={refund.order_detail_id}>
                            <td>
                                <Typography fontWeight="lg">
                                    #{refund.order?.order_number}
                                </Typography>
                            </td>
                            <td>
                                <Typography fontWeight="lg">{refund.product?.name}</Typography>
                                <Typography level="body-xs">
                                    {refund.size && `Talla: ${refund.size}`}
                                    {refund.color && ` | Color: ${refund.color}`}
                                </Typography>
                            </td>
                            <td>
                                <Typography>{refund.order?.user?.email}</Typography>
                            </td>
                            <td>
                                <Typography level="body-sm">
                                    {refund.motivo_devolucion}
                                </Typography>
                            </td>
                            <td>
                                {refund.foto_devolucion_url && (
                                    <Avatar
                                        src={refund.foto_devolucion_url}
                                        size="lg"
                                        onClick={() => window.open(refund.foto_devolucion_url, '_blank')}
                                        sx={{ cursor: 'pointer' }}
                                    />
                                )}
                            </td>
                            <td>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="solid"
                                        color="success"
                                        startDecorator={<CheckCircleIcon />}
                                        size="sm"
                                        onClick={() => handleApproveRefund(refund.order_detail_id)}
                                    >
                                        Aprobar
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="danger"
                                        startDecorator={<CancelIcon />}
                                        size="sm"
                                        onClick={() => {
                                            setSelectedRefund(refund);
                                            setOpenRejectModal(true);
                                        }}
                                    >
                                        Rechazar
                                    </Button>
                                </Box>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Sheet>

            {/* Modal para rechazar devolución */}
            <Modal open={openRejectModal} onClose={() => setOpenRejectModal(false)}>
                <ModalDialog>
                    <DialogTitle>Rechazar Devolución</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2}>
                            <Typography>
                                Estás a punto de rechazar la devolución del producto: <strong>{selectedRefund?.product?.name}</strong>
                            </Typography>
                            <Typography>
                                Pedido: <strong>#{selectedRefund?.order?.order_number}</strong>
                            </Typography>

                            <FormControl>
                                <FormLabel>Motivo del rechazo</FormLabel>
                                <Textarea
                                    minRows={3}
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Explica por qué se rechaza esta devolución..."
                                    required
                                />
                            </FormControl>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setOpenRejectModal(false);
                                        setRejectionReason('');
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    color="danger"
                                    onClick={handleRejectRefund}
                                    disabled={!rejectionReason}
                                >
                                    Confirmar Rechazo
                                </Button>
                            </Box>
                        </Stack>
                    </DialogContent>
                </ModalDialog>
            </Modal>

            {refunds.length === 0 && !loading && (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4,
                    textAlign: 'center'
                }}>
                    <CheckCircleIcon sx={{ fontSize: 60, color: 'success.500', mb: 2 }} />
                    <Typography level="h5" sx={{ mb: 1 }}>
                        No hay devoluciones pendientes
                    </Typography>
                    <Typography level="body-sm" color="neutral">
                        Todas las solicitudes de devolución están gestionadas.
                    </Typography>
                </Box>
            )}
        </React.Fragment>
    );
}