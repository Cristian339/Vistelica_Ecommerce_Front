// utils/responsiveConfig.js
import { createTheme } from '@mui/material/styles';

// Configuración de breakpoints personalizados
export const customBreakpoints = {
    values: {
        xs: 0,      // Móvil pequeño
        sm: 600,    // Móvil grande / Tablet pequeño
        md: 900,    // Tablet
        lg: 1200,   // Desktop pequeño
        xl: 1536,   // Desktop grande
    },
};

// Tema personalizado con breakpoints
export const responsiveTheme = createTheme({
    breakpoints: customBreakpoints,
    components: {
        MuiContainer: {
            styleOverrides: {
                root: {
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    '@media (max-width: 599px)': {
                        paddingLeft: '8px',
                        paddingRight: '8px',
                    },
                },
            },
        },
    },
});

// Hook personalizado para breakpoints
export const useResponsiveConfig = () => {
    const isMobile = useMediaQuery('(max-width:599px)');
    const isTablet = useMediaQuery('(min-width:600px) and (max-width:899px)');
    const isDesktop = useMediaQuery('(min-width:900px)');
    const isLargeDesktop = useMediaQuery('(min-width:1200px)');

    return {
        isMobile,
        isTablet,
        isDesktop,
        isLargeDesktop,
        // Configuraciones específicas por dispositivo
        gridConfig: {
            mobile: { xs: 6, sm: 6 },      // 2 columnas
            tablet: { md: 4, lg: 4 },      // 3 columnas
            desktop: { xl: 3 },            // 4 columnas
        },
        imageConfig: {
            mobile: { height: '150px' },
            tablet: { height: '200px' },
            desktop: { height: '250px' },
        },
        spacingConfig: {
            mobile: { spacing: 1, padding: 1 },
            tablet: { spacing: 2, padding: 2 },
            desktop: { spacing: 3, padding: 3 },
        }
    };
};

// Utilidades para responsive design
export const getResponsiveValue = (config, breakpoint) => {
    if (breakpoint === 'mobile') return config.mobile;
    if (breakpoint === 'tablet') return config.tablet;
    return config.desktop;
};

// Configuraciones específicas para componentes
export const componentResponsiveConfig = {
    productCard: {
        mobile: {
            scale: 1,
            imageHeight: '150px',
            fontSize: {
                title: '0.7rem',
                price: '0.75rem',
                sizes: '0.6rem'
            },
            spacing: {
                padding: { xs: 1, sm: 1 },
                margin: { xs: 0.5, sm: 1 }
            }
        },
        tablet: {
            scale: 0.95,
            imageHeight: '200px',
            fontSize: {
                title: '0.8rem',
                price: '0.8rem',
                sizes: '0.65rem'
            },
            spacing: {
                padding: { sm: 1.5, md: 1.5 },
                margin: { sm: 1, md: 1.5 }
            }
        },
        desktop: {
            scale: 0.9,
            imageHeight: '250px',
            fontSize: {
                title: '0.8rem',
                price: '0.8rem',
                sizes: '0.65rem'
            },
            spacing: {
                padding: { md: 1.5, lg: 2 },
                margin: { md: 2, lg: 2 }
            }
        }
    },
    imageGallery: {
        mobile: {
            height: '60vh',
            maxHeight: '400px',
            thumbnailSize: { width: 40, height: 55 },
            buttonSize: { width: 35, height: 35 }
        },
        tablet: {
            height: '70vh',
            maxHeight: '500px',
            thumbnailSize: { width: 45, height: 65 },
            buttonSize: { width: 40, height: 40 }
        },
        desktop: {
            height: 'auto',
            maxHeight: '600px',
            thumbnailSize: { width: 50, height: 70 },
            buttonSize: { width: 40, height: 40 }
        }
    }
};

export default {
    customBreakpoints,
    responsiveTheme,
    useResponsiveConfig,
    getResponsiveValue,
    componentResponsiveConfig
};