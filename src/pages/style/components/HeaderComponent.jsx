import React from 'react';
import {
    Box,
    Typography,
    Container,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

const HeaderComponent = ({ title, subtitle, articleCount, wishlistCount }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

    return (
        <Box sx={{
            width: '100%',
            borderBottom: '1px solid',
            borderColor: vistelicaColors.divider,
            py: { xs: 1.5, md: 2 },
            mb: { xs: 2, md: 4 },
            backgroundColor: vistelicaColors.backgroundLight,
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
                            maxWidth: { xs: '100%', sm: '40%' },
                            fontFamily: typography.fontFamily,
                            color: vistelicaColors.primary,
                        }}
                    >
                        {title}
                    </Typography>

                    {/* Subtítulo - solo en desktop */}
                    {!isMobile && (
                        <Typography
                            variant="h6"
                            color={vistelicaColors.textSecondary}
                            sx={{
                                fontSize: { sm: '1rem', md: '1.2rem' },
                                textAlign: { xs: 'left', sm: 'center' },
                                maxWidth: { sm: '35%', md: '40%' },
                                display: { xs: 'none', sm: 'block' },
                                fontFamily: typography.fontFamily,
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
                        alignSelf: { xs: 'flex-end', sm: 'center' },
                        px: 1.5,
                        py: 0.75,
                        borderRadius: 1.5,
                        backgroundColor: `${vistelicaColors.backgroundAccent}30`,
                    }}>
                        <Typography
                            variant="body2"
                            sx={{
                                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                fontWeight: 500,
                                fontFamily: typography.fontFamily,
                                color: vistelicaColors.secondary,
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
                        color={vistelicaColors.textSecondary}
                        sx={{
                            mt: 1,
                            fontSize: '0.9rem',
                            lineHeight: 1.4,
                            fontFamily: typography.fontFamily,
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
