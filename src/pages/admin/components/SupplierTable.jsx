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
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import AddIcon from '@mui/icons-material/Add';

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
import adminService from "@/services/adminService";
import PersonIcon from '@mui/icons-material/Person';

export default function SupplierTable() {
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('id');
    const [selected, setSelected] = React.useState([]);
    const [suppliersData, setSuppliersData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [nameFilter, setNameFilter] = React.useState('');
    const [emailFilter, setEmailFilter] = React.useState('');
    const [editingSupplier, setEditingSupplier] = React.useState(null);
    const [formMode, setFormMode] = React.useState('add');
    const [countries] = React.useState(['España', 'Alemania', 'Francia', 'Italia', 'Chile', 'Portugal', 'EE.UU.']);

    // Estados para la paginación
    const [page, setPage] = React.useState(1);
    const [rowsPerPage] = React.useState(20);

    // Cargar proveedores al montar el componente
    React.useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const suppliers = await adminService.getSuppliers();
                const transformedSuppliers = suppliers.map(supplier => ({
                    id: `SUP-${supplier.supplier_id.toString().padStart(3, '0')}`,
                    supplierId: supplier.supplier_id,
                    companyName: supplier.name,
                    email: supplier.email,
                    address: supplier.address,
                    phone: supplier.phone,
                    country: supplier.country,
                    iban: supplier.IBAN
                }));
                setSuppliersData(transformedSuppliers);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchSuppliers();
    }, []);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleAddSupplier = () => {
        setFormMode('add');
        setEditingSupplier({
            id: `SUP-${(suppliersData.length + 1).toString().padStart(3, '0')}`,
            companyName: '',
            email: '',
            address: '',
            phone: '',
            country: 'España',
            iban: ''
        });
    };

    const handleEditSupplier = (supplier) => {
        setFormMode('edit');
        setEditingSupplier({ ...supplier });
    };

    const handleSaveSupplier = async (updatedSupplier) => {
        try {
            if (formMode === 'add') {
                const newSupplier = {
                    name: updatedSupplier.companyName,
                    email: updatedSupplier.email,
                    address: updatedSupplier.address,
                    phone: updatedSupplier.phone,
                    country: updatedSupplier.country,
                    IBAN: updatedSupplier.iban
                };

                const response = await adminService.createSupplier(newSupplier);

                // Actualizar el estado con el nuevo proveedor
                const addedSupplier = {
                    ...updatedSupplier,
                    supplierId: response.supplier_id,
                    id: `SUP-${response.supplier_id.toString().padStart(3, '0')}`
                };
                setSuppliersData(prev => [...prev, addedSupplier]);
            } else {
                const updateData = {
                    name: updatedSupplier.companyName,
                    email: updatedSupplier.email,
                    address: updatedSupplier.address,
                    phone: updatedSupplier.phone,
                    country: updatedSupplier.country,
                    IBAN: updatedSupplier.iban
                };

                await adminService.updateSupplier(updatedSupplier.supplierId, updateData);

                setSuppliersData(prev => prev.map(supplier =>
                    supplier.id === updatedSupplier.id ? updatedSupplier : supplier
                ));
            }
            setEditingSupplier(null);
        } catch (err) {
            setError(err.message || 'Error al guardar el proveedor');
        }
    };

    const handleDeleteSupplier = async (supplierId) => {
        try {
            const supplier = suppliersData.find(s => s.id === supplierId);
            if (!supplier) return;

            await adminService.deleteSupplier(supplier.supplierId);
            setSuppliersData(prev => prev.filter(s => s.id !== supplierId));
        } catch (err) {
            setError(err.message || 'Error al eliminar el proveedor');
        }
    };

    const handleSearchSuppliers = async (name) => {
        try {
            const results = await adminService.searchSuppliersByName(name);
            const transformed = results.map(supplier => ({
                id: `SUP-${supplier.supplier_id.toString().padStart(3, '0')}`,
                supplierId: supplier.supplier_id,
                companyName: supplier.name,
                email: supplier.email,
                address: supplier.address,
                phone: supplier.phone,
                country: supplier.country,
                iban: supplier.IBAN
            }));
            setSuppliersData(transformed);
        } catch (err) {
            setError(err.message || 'Error en la búsqueda');
        }
    };

    const filteredSuppliers = suppliersData.filter(supplier => {
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

    // Calcular proveedores paginados
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedSuppliers = sortedSuppliers.slice(startIndex, endIndex);
    const totalPages = Math.ceil(sortedSuppliers.length / rowsPerPage);

    function RowMenu({ supplier }) {
        return (
            <Dropdown>
                <MenuButton
                    slots={{ root: IconButton }}
                    slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
                >
                    <MoreHorizRoundedIcon />
                </MenuButton>
                <Menu size="sm" sx={{ minWidth: 140 }}>
                    <MenuItem onClick={() => handleEditSupplier(supplier)}>Editar</MenuItem>
                    <Divider />
                    <MenuItem color="danger" onClick={() => handleDeleteSupplier(supplier.id)}>
                        Eliminar
                    </MenuItem>
                </Menu>
            </Dropdown>
        );
    }

    function SupplierForm() {
        const [formData, setFormData] = React.useState(editingSupplier || {
            id: '',
            companyName: '',
            email: '',
            address: '',
            phone: '',
            country: 'España',
            iban: ''
        });

        React.useEffect(() => {
            if (editingSupplier) {
                setFormData(editingSupplier);
            }
        }, [editingSupplier]);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            handleSaveSupplier(formData);
        };

        if (!editingSupplier) return null;

        return (
            <Modal open={!!editingSupplier} onClose={() => setEditingSupplier(null)}>
                <ModalDialog>
                    <DialogTitle>{formMode === 'add' ? 'Añadir nuevo proveedor' : 'Editar proveedor'}</DialogTitle>
                    <DialogContent>
                        {formMode === 'add' ? 'Complete los detalles del proveedor' : 'Modifique los detalles del proveedor'}
                    </DialogContent>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel>ID</FormLabel>
                                <Input
                                    name="id"
                                    value={formData.id}
                                    disabled={formMode === 'edit'}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Nombre de la empresa</FormLabel>
                                <Input
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    required
                                    startDecorator={<BusinessIcon />}
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
                                    startDecorator={<EmailIcon />}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Dirección</FormLabel>
                                <Input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    startDecorator={<LocationOnIcon />}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Teléfono</FormLabel>
                                <Input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    startDecorator={<PhoneIcon />}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>País</FormLabel>
                                <Select
                                    name="country"
                                    value={formData.country}
                                    onChange={(e, value) => setFormData(prev => ({ ...prev, country: value }))}
                                    startDecorator={<PublicIcon />}
                                >
                                    {countries.map(country => (
                                        <Option key={country} value={country}>{country}</Option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl>
                                <FormLabel>IBAN</FormLabel>
                                <Input
                                    name="iban"
                                    value={formData.iban}
                                    onChange={handleChange}
                                    required
                                    startDecorator={<AccountBalanceIcon />}
                                />
                            </FormControl>
                            <Button type="submit">
                                {formMode === 'add' ? 'Añadir Proveedor' : 'Guardar Cambios'}
                            </Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        );
    }

    if (loading) return <Typography>Cargando proveedores...</Typography>;
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
                        placeholder="Nombre del proveedor"
                        startDecorator={<BusinessIcon />}
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
                <Button
                    size="sm"
                    variant="solid"
                    color="primary"
                    startDecorator={<AddIcon />}
                    onClick={handleAddSupplier}
                    sx={{ alignSelf: 'flex-end' }}
                >
                    Añadir
                </Button>
            </Box>

            <SupplierForm />

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
                                    selected.length > 0 && selected.length !== suppliersData.length
                                }
                                checked={selected.length === suppliersData.length}
                                onChange={(event) => {
                                    setSelected(
                                        event.target.checked ? suppliersData.map((row) => row.id) : [],
                                    );
                                }}
                                color={
                                    selected.length > 0 || selected.length === suppliersData.length
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
                    {paginatedSuppliers.map((supplier) => (
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
                                    <RowMenu supplier={supplier} />
                                </Box>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Sheet>

            {/* Custom Pagination */}
            {sortedSuppliers.length > rowsPerPage && (
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
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        startDecorator={<KeyboardArrowLeftIcon />}
                    >
                        Anterior
                    </Button>

                    <Typography level="body-md">
                        Página {page} de {totalPages}
                    </Typography>

                    <Button
                        variant="outlined"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        endDecorator={<KeyboardArrowRightIcon />}
                    >
                        Siguiente
                    </Button>
                </Box>
            )}
        </React.Fragment>
    );
}