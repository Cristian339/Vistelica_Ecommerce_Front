'use client';
import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import adminTheme from "@/theme/adminTheme";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import dynamic from 'next/dynamic';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import RefundTable from "@/pages/admin/components/RefundTable";

// Componentes dinámicos
const OrderTable = dynamic(() => import('./components/OrderTable'), { ssr: false });
const OrderList = dynamic(() => import('./components/OrderList'), { ssr: false });
const CustomerTable = dynamic(() => import('./components/CustomerTable'), { ssr: false });
const CustomerList = dynamic(() => import('./components/CustomerList'), { ssr: false });
const SupplierTable = dynamic(() => import('./components/SupplierTable'), { ssr: false });
const SupplierList = dynamic(() => import('./components/SupplierList'), { ssr: false });
const ProductTable = dynamic(() => import('./components/ProductTable'), { ssr: false });
const ProductList = dynamic(() => import('./components/ProductList'), { ssr: false });
const CategoryTable = dynamic(() => import('./components/CategoryTable'), { ssr: false });
const CategoryList = dynamic(() => import('./components/CategoryList'), { ssr: false });
const SubcategoryTable = dynamic(() => import('./components/SubcategoryTable'), { ssr: false });
const SubcategoryList = dynamic(() => import('./components/SubcategoryList'), { ssr: false });

const JoyOrderDashboardTemplate = ({ children }) => {
    const [activeTab, setActiveTab] = React.useState('orders');

    const renderContent = () => {
        switch (activeTab) {
            case 'orders':
                return (
                    <>
                        <Typography level="h2" component="h1">
                            Pedidos
                        </Typography>
                        <OrderTable />
                        <OrderList />
                    </>
                );
            case 'suppliers':
                return (
                    <>
                        <Typography level="h2" component="h1">
                            Proveedores
                        </Typography>
                        <SupplierTable/>
                        <SupplierList/>
                    </>
                );
            case 'customers':
                return (
                    <>
                        <Typography level="h2" component="h1">
                            Clientes
                        </Typography>
                        <CustomerTable/>
                        <CustomerList/>
                    </>
                );
            case 'products':
                return (
                    <>
                        <Typography level="h2" component="h1">
                            Productos
                        </Typography>
                        <ProductTable/>
                        <ProductList/>
                    </>
                );
            case 'categories':
                return (
                    <>
                        <Typography level="h2" component="h1">
                            Categorías
                        </Typography>
                        <CategoryTable/>
                        <CategoryList/>
                    </>
                );
            case 'subcategories':
                return (
                    <>
                        <Typography level="h2" component="h1">
                            Subcategorías
                        </Typography>
                        <SubcategoryTable/>
                        <SubcategoryList/>
                    </>
                );
            case 'refunds':
                return (
                    <>
                        <Typography level="h2" component="h1">
                            Devoluciones
                        </Typography>
                        <RefundTable />
                    </>
                );
            default:
                return (
                    <>
                        <Typography level="h2" component="h1">
                            Pedidos
                        </Typography>
                        <OrderTable />
                        <OrderList />
                    </>
                );
        }
    };

    const getBreadcrumbText = () => {
        switch (activeTab) {
            case 'orders': return 'Pedidos';
            case 'suppliers': return 'Proveedores';
            case 'customers': return 'Clientes';
            case 'products': return 'Productos';
            case 'categories': return 'Categorías';
            case 'subcategories': return 'Subcategorías';
            case 'refunds': return 'Devoluciones';
            default: return 'Pedidos';
        }
    };

    return (
        <CssVarsProvider theme={adminTheme} defaultMode="light">
            <CssBaseline />
            <Box
                component="div"
                sx={{
                    display: 'flex',
                    minHeight: '100dvh',
                    width: '100%'
                }}
            >
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <Header />
                <Box
                    component="main"
                    className="MainContent"
                    sx={{
                        px: { xs: 2, md: 6 },
                        pt: {
                            xs: 'calc(12px + var(--Header-height))',
                            sm: 'calc(12px + var(--Header-height))',
                            md: 3,
                        },
                        pb: { xs: 2, sm: 2, md: 3 },
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                        height: '100dvh',
                        gap: 1,
                        backgroundColor: 'background.body',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Breadcrumbs
                            size="sm"
                            aria-label="breadcrumbs"
                            separator={<ChevronRightRoundedIcon fontSize="sm" />}
                            sx={{ pl: 0 }}
                        >
                            <Link
                                underline="none"
                                color="neutral"
                                href="#some-link"
                                aria-label="Home"
                            >
                                <HomeRoundedIcon />
                            </Link>
                            <Typography color="primary" fontWeight={500} fontSize={12}>
                                {getBreadcrumbText()}
                            </Typography>
                        </Breadcrumbs>
                    </Box>
                    {renderContent()}
                    {children}
                </Box>
            </Box>
        </CssVarsProvider>
    );
};

export default JoyOrderDashboardTemplate;