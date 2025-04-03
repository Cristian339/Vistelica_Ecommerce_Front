'use client';

import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';

export default function AdminLayout({ children }) {
    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            {children}
        </CssVarsProvider>
    );
}