'use client';

import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import JoyOrderDashboardTemplate from './DashboardTemplate';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/services/authService';
import { Button, Typography, Box } from '@mui/joy';
import CircularProgress from '@mui/material/CircularProgress';
import { vistelicaColors } from "@/components/shared/vistelicaColors";

export default function AdminPage() {
    const [loading, setLoading] = useState(true);
    const [hasAdminAccess, setHasAdminAccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const verifyAdmin = async () => {
            try {
                const adminStatus = await isAdmin();
                setHasAdminAccess(adminStatus);
            } catch (error) {
                console.error('Error verificando permisos:', error);
                setHasAdminAccess(false);
            } finally {
                setLoading(false);
            }
        };

        verifyAdmin();
    }, []);

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh'
                }}
            >
                <CircularProgress sx={{ color: vistelicaColors.primary }} />
            </Box>
        );
    }

    if (!hasAdminAccess) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    gap: 2,
                    textAlign: 'center',
                    p: 3
                }}
            >
                <Typography level="h1" color="danger">
                    Acceso restringido
                </Typography>
                <Typography level="body-lg">
                    No tienes permisos de administrador para acceder a esta página.
                </Typography>
                <Button
                    onClick={() => router.push('/home/Home')}
                    size="lg"
                    sx={{
                        mt: 2,
                        backgroundColor: vistelicaColors.primary,
                        '&:hover': {
                            backgroundColor: `${vistelicaColors.primary}CC`
                        }
                    }}
                >
                    Volver al inicio
                </Button>
            </Box>
        );
    }

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <JoyOrderDashboardTemplate />
        </CssVarsProvider>
    );
}