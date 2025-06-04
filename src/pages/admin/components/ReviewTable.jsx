import React, { useState, useEffect } from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
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
import DeleteIcon from '@mui/icons-material/Delete';
import ReportIcon from '@mui/icons-material/Report';
import WarningIcon from '@mui/icons-material/Warning';
import StarIcon from '@mui/icons-material/Star';

export default function ReportTable() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchFilter, setSearchFilter] = useState('');
    const [reasonFilter, setReasonFilter] = useState('all');
    const [viewingReport, setViewingReport] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllReports();
            setReports(response);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // Función para eliminar una reseña completa
    const handleDeleteReview = async (reviewId) => {
        try {
            setProcessingId(reviewId);
            await adminService.deleteReview(reviewId);
            await fetchReports();
        } catch (error) {
            setError(error.message);
        } finally {
            setProcessingId(null);
        }
    };

    // Función para eliminar un reporte específico
    const handleDeleteReport = async (reportId) => {
        try {
            setProcessingId(reportId);
            await adminService.deleteReport(reportId);
            await fetchReports();
        } catch (error) {
            setError(error.message);
        } finally {
            setProcessingId(null);
        }
    };

    // Función para eliminar todos los reportes de una reseña
    const handleDeleteReportsForReview = async (reviewId) => {
        try {
            setProcessingId(reviewId);
            await adminService.deleteReportsForReview(reviewId);
            await fetchReports();
        } catch (error) {
            setError(error.message);
        } finally {
            setProcessingId(null);
        }
    };

    const getReasonColor = (reason) => {
        const reasonColors = {
            'Contenido ofensivo': 'danger',
            'Spam': 'warning',
            'Información falsa': 'neutral',
            'Contenido inapropiado': 'danger',
            'Otro': 'primary'
        };
        return reasonColors[reason] || 'neutral';
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

    // Filtrar reportes
    const filteredReports = reports.filter(report => {
        const matchesSearch = searchFilter === '' ||
            report.review.comment.toLowerCase().includes(searchFilter.toLowerCase()) ||
            report.review.user.user_id.toString().includes(searchFilter) ||
            report.review.product.name.toLowerCase().includes(searchFilter.toLowerCase());

        const matchesReason = reasonFilter === 'all' || report.reason === reasonFilter;

        return matchesSearch && matchesReason;
    });

    function RowMenu({ report }) {
        const isProcessing = processingId === report.report_id || processingId === report.review.review_id;

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
                <Menu size="sm" sx={{ minWidth: 180 }}>
                    <MenuItem onClick={() => setViewingReport(report)}>
                        <VisibilityIcon sx={{ mr: 1 }} /> Ver Detalles
                    </MenuItem>

                    <MenuItem
                        onClick={() => handleDeleteReport(report.report_id)}
                        disabled={isProcessing}
                        sx={{ color: 'warning.main' }}
                    >
                        <DeleteIcon sx={{ mr: 1 }} />
                        {isProcessing ? 'Procesando...' : 'Eliminar Reporte'}
                    </MenuItem>

                    <MenuItem
                        onClick={() => handleDeleteReportsForReview(report.review.review_id)}
                        disabled={isProcessing}
                        sx={{ color: 'warning.main' }}
                    >
                        <WarningIcon sx={{ mr: 1 }} />
                        {isProcessing ? 'Procesando...' : 'Eliminar Todos los Reportes'}
                    </MenuItem>

                    <Divider />

                    <MenuItem
                        onClick={() => handleDeleteReview(report.review.review_id)}
                        disabled={isProcessing}
                        sx={{ color: 'danger.main' }}
                    >
                        <DeleteIcon sx={{ mr: 1 }} />
                        {isProcessing ? 'Procesando...' : 'Eliminar Reseña'}
                    </MenuItem>
                </Menu>
            </Dropdown>
        );
    }

    function ReportDetailsModal({ report, onClose }) {
        if (!report) return null;

        return (
            <Modal open onClose={onClose}>
                <ModalDialog
                    sx={{
                        maxWidth: '700px',
                        width: '90vw',
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Detalles del Reporte</span>
                            <Chip
                                color={getReasonColor(report.reason)}
                                size="sm"
                                variant="soft"
                                startDecorator={<ReportIcon />}
                            >
                                {report.reason}
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
                            {/* Información del Reporte */}
                            <Box>
                                <Typography level="title-md" sx={{ mb: 1 }}>
                                    Información del Reporte
                                </Typography>
                                <Typography level="body-sm">
                                    <strong>Motivo:</strong> {report.reason}
                                </Typography>
                                {report.other_reason_text && (
                                    <Typography level="body-sm">
                                        <strong>Descripción adicional:</strong> {report.other_reason_text}
                                    </Typography>
                                )}
                                <Typography level="body-sm">
                                    <strong>Fecha del reporte:</strong> {formatDate(report.reported_at)}
                                </Typography>
                                <Typography level="body-sm">
                                    <strong>Reportado por:</strong> Usuario ID #{report.user.user_id}
                                </Typography>
                            </Box>

                            <Divider />

                            {/* Información de la Reseña Reportada */}
                            <Box>
                                <Typography level="title-md" sx={{ mb: 1 }}>
                                    Reseña Reportada
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography level="body-sm">
                                        <strong>Calificación:</strong>
                                    </Typography>
                                    {renderStars(report.review.rating)}
                                    <Typography level="body-sm" color="primary">
                                        ({report.review.rating}/5)
                                    </Typography>
                                </Box>
                                <Typography level="body-sm" sx={{ mb: 1 }}>
                                    <strong>Comentario:</strong>
                                </Typography>
                                <Box sx={{
                                    p: 2,
                                    bgcolor: 'background.level1',
                                    borderRadius: 'sm',
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}>
                                    <Typography level="body-sm">
                                        "{report.review.comment}"
                                    </Typography>
                                </Box>
                                <Typography level="body-sm" sx={{ mt: 1 }}>
                                    <strong>Fecha de la reseña:</strong> {formatDate(report.review.created_at)}
                                </Typography>
                                <Typography level="body-sm">
                                    <strong>Autor:</strong> Usuario ID #{report.review.user.user_id}
                                </Typography>
                            </Box>

                            <Divider />

                            {/* Información del Producto */}
                            <Box>
                                <Typography level="title-md" sx={{ mb: 1 }}>
                                    Producto Asociado
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Avatar
                                        src={report.review.product.images?.[0]?.image_url}
                                        size="lg"
                                        sx={{ borderRadius: 'sm' }}
                                    />
                                    <Box>
                                        <Typography level="title-sm">
                                            {report.review.product.name}
                                        </Typography>
                                        <Typography level="body-xs" color="neutral">
                                            ID: {report.review.product.product_id}
                                        </Typography>
                                        <Typography level="body-xs" color="neutral">
                                            Precio: ${report.review.product.price}
                                        </Typography>
                                    </Box>
                                </Box>
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
                            <Button
                                variant="soft"
                                color="warning"
                                size="sm"
                                startDecorator={<DeleteIcon />}
                                onClick={() => {
                                    handleDeleteReport(report.report_id);
                                    onClose();
                                }}
                                disabled={processingId === report.report_id}
                            >
                                Eliminar Reporte
                            </Button>

                            <Button
                                variant="soft"
                                color="danger"
                                size="sm"
                                startDecorator={<DeleteIcon />}
                                onClick={() => {
                                    handleDeleteReview(report.review.review_id);
                                    onClose();
                                }}
                                disabled={processingId === report.review.review_id}
                            >
                                Eliminar Reseña
                            </Button>
                        </Box>

                        <Button variant="outlined" onClick={onClose}>Cerrar</Button>
                    </Box>
                </ModalDialog>
            </Modal>
        );
    }

    if (loading) return <Typography>Cargando reportes...</Typography>;
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
                        placeholder="Buscar por comentario, producto o usuario..."
                        startDecorator={<SearchIcon />}
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                    />
                </FormControl>

                <FormControl sx={{ minWidth: 200 }}>
                    <Select
                        size="sm"
                        value={reasonFilter}
                        onChange={(e, newValue) => setReasonFilter(newValue)}
                    >
                        <Option value="all">Todos los Motivos</Option>
                        <Option value="Contenido ofensivo">Contenido ofensivo</Option>
                        <Option value="Spam">Spam</Option>
                        <Option value="Información falsa">Información falsa</Option>
                        <Option value="Contenido inapropiado">Contenido inapropiado</Option>
                        <Option value="Otro">Otro</Option>
                    </Select>
                </FormControl>
            </Box>

            {viewingReport && (
                <ReportDetailsModal
                    report={viewingReport}
                    onClose={() => setViewingReport(null)}
                />
            )}

            <Sheet variant="outlined" sx={{ borderRadius: 'sm', overflow: 'auto' }}>
                <Table hoverRow>
                    <thead>
                    <tr>
                        <th>Reseña</th>
                        <th>Producto</th>
                        <th>Motivo</th>
                        <th>Reportado por</th>
                        <th>Fecha</th>
                        <th>Calificación</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredReports.map((report) => (
                        <tr key={report.report_id}>
                            <td>
                                <Box sx={{ maxWidth: 200 }}>
                                    <Typography level="body-sm" sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                    }}>
                                        "{report.review.comment}"
                                    </Typography>
                                    <Typography level="body-xs" color="neutral">
                                        Por Usuario #{report.review.user.user_id}
                                    </Typography>
                                </Box>
                            </td>
                            <td>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Avatar
                                        src={report.review.product.images?.[0]?.image_url}
                                        size="sm"
                                        sx={{ borderRadius: 'sm' }}
                                    />
                                    <Box>
                                        <Typography level="body-sm" fontWeight="lg">
                                            {report.review.product.name.substring(0, 30)}...
                                        </Typography>
                                        <Typography level="body-xs" color="primary">
                                            ${report.review.product.price}
                                        </Typography>
                                    </Box>
                                </Box>
                            </td>
                            <td>
                                <Chip
                                    color={getReasonColor(report.reason)}
                                    size="sm"
                                    variant="soft"
                                    startDecorator={<ReportIcon />}
                                >
                                    {report.reason}
                                </Chip>
                            </td>
                            <td>
                                <Typography level="body-sm">
                                    Usuario #{report.user.user_id}
                                </Typography>
                            </td>
                            <td>
                                <Typography level="body-sm">
                                    {formatDate(report.reported_at)}
                                </Typography>
                            </td>
                            <td>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    {renderStars(report.review.rating)}
                                    <Typography level="body-xs" color="neutral">
                                        ({report.review.rating})
                                    </Typography>
                                </Box>
                            </td>
                            <td>
                                <RowMenu report={report} />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Sheet>

            {filteredReports.length === 0 && !loading && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography level="body-md" color="neutral">
                        No se encontraron reportes que coincidan con los filtros.
                    </Typography>
                </Box>
            )}

            {/* Estadísticas rápidas */}
            <Box sx={{
                display: 'flex',
                gap: 4,
                mt: 3,
                p: 2,
                bgcolor: 'background.level1',
                borderRadius: 'sm'
            }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography level="h4" color="danger">
                        {reports.length}
                    </Typography>
                    <Typography level="body-xs">
                        Total Reportes
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography level="h4" color="warning">
                        {new Set(reports.map(r => r.review.review_id)).size}
                    </Typography>
                    <Typography level="body-xs">
                        Reseñas Reportadas
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography level="h4" color="neutral">
                        {new Set(reports.map(r => r.review.product.product_id)).size}
                    </Typography>
                    <Typography level="body-xs">
                        Productos Afectados
                    </Typography>
                </Box>
            </Box>
        </React.Fragment>
    );
}