import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/routes';
import './index.css';
import { ThemeProvider } from './pages/shared-theme/ThemeContext';
import AppTheme from './pages/shared-theme/AppTheme';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider>
            <AppTheme>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </AppTheme>
        </ThemeProvider>
    </React.StrictMode>
);