'use client'; // Necesario porque usa componentes interactivos

import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import JoyOrderDashboardTemplate from './DashboardTemplate';

export default function AdminPage() {
    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <JoyOrderDashboardTemplate />
        </CssVarsProvider>
    );
}