import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

import Sidebar from '@/app/pages/admin/components/Sidebar';
import OrderTable from '@/app/pages/admin/components/OrderTable';
import OrderList from '@/app/pages/admin/components/OrderList';
import CustomerTable from '@/app/pages/admin/components/CustomerTable';
import CustomerList from '@/app/pages/admin/components/CustomerList';
import SupplierTable from "@/app/pages/admin/components/SupplierTable";
import SupplierList from "@/app/pages/admin/components/SupplierList";
import ProductTable from "@/app/pages/admin/components/ProductTable";
import ProductList from "@/app/pages/admin/components/ProductList";
import Header from '@/app/pages/admin/components/Header';


const JoyOrderDashboardTemplate = () => {
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
            default: return 'Pedidos';
        }
    };

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
                <Header />
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
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
                            <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
                                {getBreadcrumbText()}
                            </Typography>
                        </Breadcrumbs>
                    </Box>
                    {renderContent()}
                </Box>
            </Box>
        </CssVarsProvider>
    );
};

export default JoyOrderDashboardTemplate;
