import React from 'react';
import {
    Box,
    Typography,
    Container,
    useTheme,
    useMediaQuery
} from '@mui/material';

const HeaderComponent = ({ title, subtitle, articleCount, wishlistCount }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

    return (
        <Box sx={{
            width: '100%',
            borderBottom: '1px solid',
            borderColor: 'divider',
            py: { xs: 1.5, md: 2 },
            mb: { xs: 2, md: 4 }
        }}>
            <Container maxWidth="lg">
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: { xs: 1, sm: 2 }
                }}>
                    {/* Título principal */}
                    <Typography
                        variant={isMobile ? "h6" : "h5"}
                        fontWeight="bold"
                        sx={{
                            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                            lineHeight: 1.2,
                            maxWidth: { xs: '100%', sm: '40%' }
                        }}
                    >
                        {title}
                    </Typography>

                    {/* Subtítulo - solo en desktop */}
                    {!isMobile && (
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{
                                fontSize: { sm: '1rem', md: '1.2rem' },
                                textAlign: { xs: 'left', sm: 'center' },
                                maxWidth: { sm: '35%', md: '40%' },
                                display: { xs: 'none', sm: 'block' }
                            }}
                        >
                            {subtitle}
                        </Typography>
                    )}

                    {/* Contador de artículos */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        alignSelf: { xs: 'flex-end', sm: 'center' }
                    }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                fontWeight: 500
                            }}
                        >
                            {articleCount}
                        </Typography>
                    </Box>
                </Box>

                {/* Subtítulo para móvil */}
                {isMobile && subtitle && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 1,
                            fontSize: '0.9rem',
                            lineHeight: 1.4
                        }}
                    >
                        {subtitle}
                    </Typography>
                )}
            </Container>
        </Box>
    );
};

export default HeaderComponent;