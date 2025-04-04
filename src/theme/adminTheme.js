import { extendTheme } from '@mui/joy/styles';

const customTheme = extendTheme({
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    50: '#FFF8E1',
                    100: '#FFECB3',
                    200: '#FFE082',
                    300: '#FFD54F',
                    400: '#FFCA28',
                    500: '#E4B002',  // Color primario
                    600: '#FFB300',
                    700: '#FFA000',
                    800: '#FF8F00',
                    900: '#FF6F00',
                    solidBg: '#E4B002',
                    solidHoverBg: '#D4A002',
                    solidActiveBg: '#C49002',
                },
                neutral: {
                    50: '#F5F7FA',
                    100: '#E4E7EB',
                    200: '#CBD2D9',
                    300: '#9AA5B1',
                    400: '#7B8794',
                    500: '#616E7C',
                    600: '#52606D',
                    700: '#3E4C59',
                    800: '#323F4B',
                    900: '#1F2933',
                },
                background: {
                    body: '#FFFFFF',  // Color terciario como fondo
                    surface: '#FFFFFF',
                },
                text: {
                    primary: '#232A2E',  // Color secundario como texto principal
                    secondary: '#5C6B73',
                },
                divider: '#EAD8B1',  // Color cuarto como divisor
            },
        },
    },
    components: {
        JoyButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    fontWeight: 600,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                    },
                },
            },
            variants: [
                {
                    props: { variant: 'solid' },
                    style: {
                        backgroundColor: '#E4B002',
                        color: '#232A2E',
                        '&:hover': {
                            backgroundColor: '#D4A002',
                        },
                    },
                },
                {
                    props: { variant: 'outlined' },
                    style: {
                        borderColor: '#E4B002',
                        color: '#E4B002',
                        '&:hover': {
                            backgroundColor: 'rgba(228, 176, 2, 0.08)',
                        },
                    },
                },
            ],
        },
        JoyCard: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                    },
                },
            },
        },
    },
    fontFamily: {
        display: '"Inter", sans-serif',
        body: '"Inter", sans-serif',
    },
});

export default customTheme;