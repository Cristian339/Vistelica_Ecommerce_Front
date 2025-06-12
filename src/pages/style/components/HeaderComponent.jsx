'use client';
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Typography,
    Container,
    useTheme,
    useMediaQuery,
    Chip
} from '@mui/material';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";
import { TrendingUp } from 'lucide-react';

const HeaderComponent = memo(({
                                  title = '',
                                  subtitle = '',
                                  articleCount = 0,
                                  wishlistCount = 0
                              }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

    // Text for screen readers
    const articleCountText = `${articleCount} ${articleCount === 1 ? 'artículo para el estilo' : 'para el estilo'}`;

    return (
        <Box
            component="header"
            role="banner"
            sx={{
                width: '100%',
                background: `linear-gradient(135deg, ${vistelicaColors.backgroundLight} 0%, ${vistelicaColors.white} 50%, ${vistelicaColors.backgroundLight} 100%)`,
                borderBottom: '1px solid',
                borderImage: `linear-gradient(to right, transparent, ${vistelicaColors.primary}80, transparent) 1`,
                py: { xs: 3, md: 4 },
                mb: { xs: 3, md: 5 },
                boxShadow: `0 8px 25px ${vistelicaColors.shadow}20`,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `radial-gradient(circle at 10% 10%, ${vistelicaColors.primary}05 10%, transparent 60%)`,
                    zIndex: 0,
                }
            }}
        >
            <Container maxWidth="lg">
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: { xs: 2, sm: 3 },
                    position: 'relative',
                    zIndex: 1,
                }}>
                    {/* Título principal mejorado */}
                    <Typography
                        variant={isMobile ? "h2" : "h1"}
                        component="h1"
                        id="page-title"
                        fontWeight="bold"
                        sx={{
                            fontSize: { xs: '1.4rem', sm: '1.7rem', md: '2.1rem' },
                            lineHeight: 1.15,
                            maxWidth: { xs: '100%', sm: '50%' },
                            fontFamily: typography.fontFamily,
                            background: `linear-gradient(135deg, ${vistelicaColors.primary} 20%, ${vistelicaColors.secondary} 80%)`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: vistelicaColors.primary,
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.02em',
                            position: 'relative',
                            pl: 1.5,
                            textShadow: `0 1px 1px ${vistelicaColors.shadow}30`,
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                left: 0,
                                top: '5%',
                                height: '90%',
                                width: '5px',
                                backgroundImage: `linear-gradient(to bottom, ${vistelicaColors.primary}, ${vistelicaColors.secondary})`,
                                borderRadius: '5px',
                                boxShadow: `0 0 8px ${vistelicaColors.primary}80`,
                            }
                        }}
                    >
                        {title}
                    </Typography>

                    {/* Subtítulo - solo en desktop */}
                    {!isMobile && subtitle && (
                        <Typography
                            variant="subtitle1"
                            component="p"
                            id="page-subtitle-desktop"
                            sx={{
                                fontSize: { sm: '1.05rem', md: '1.2rem' },
                                textAlign: { xs: 'left', sm: 'center' },
                                maxWidth: { sm: '38%', md: '40%' },
                                display: { xs: 'none', sm: 'block' },
                                fontFamily: typography.fontFamily,
                                color: vistelicaColors.textSecondary,
                                fontStyle: 'italic',
                                letterSpacing: '0.01em',
                                fontWeight: 400,
                                borderLeft: `1px solid ${vistelicaColors.divider}`,
                                borderRight: `1px solid ${vistelicaColors.divider}`,
                                px: 3,
                                py: 0.5,
                            }}
                        >
                            {subtitle}
                        </Typography>
                    )}

                    {/* Contador de artículos mejorado */}
                    <Chip
                        icon={<TrendingUp size={16} />}
                        label={articleCountText}
                        role="status"
                        aria-label="Contador de artículos"
                        sx={{
                            px: 1,
                            py: 2.5,
                            height: 'auto',
                            borderRadius: '18px',
                            background: `linear-gradient(135deg, ${vistelicaColors.primary}20, ${vistelicaColors.secondary}40)`,
                            border: `1px solid ${vistelicaColors.primary}40`,
                            boxShadow: `0 5px 15px ${vistelicaColors.primary}20`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: `0 8px 20px ${vistelicaColors.primary}30`,
                            },
                            '& .MuiChip-label': {
                                px: 1,
                                fontWeight: 600,
                                fontSize: { xs: '0.9rem', md: '0.95rem' },
                                color: vistelicaColors.primary,
                            },
                            '& .MuiChip-icon': {
                                color: vistelicaColors.primary,
                            }
                        }}
                    />
                </Box>

                {/* Subtítulo para móvil mejorado */}
                {isMobile && subtitle && (
                    <Typography
                        variant="body2"
                        component="p"
                        id="page-subtitle-mobile"
                        sx={{
                            mt: 2,
                            mb: 0.5,
                            fontSize: '0.95rem',
                            lineHeight: 1.5,
                            fontFamily: typography.fontFamily,
                            color: vistelicaColors.textSecondary,
                            fontStyle: 'italic',
                            px: 0.5,
                            py: 1,
                            borderRadius: '8px',
                            borderLeft: `3px solid ${vistelicaColors.secondary}70`,
                            paddingLeft: 2,
                            background: `linear-gradient(to right, ${vistelicaColors.backgroundAccent}30 0%, transparent 100%)`,
                        }}
                    >
                        {subtitle}
                    </Typography>
                )}

                {/* Elementos decorativos mejorados */}
                <Box
                    aria-hidden="true"
                    role="presentation"
                    sx={{
                        position: 'absolute',
                        bottom: '-3px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        height: '6px',
                        width: '120px',
                        background: `linear-gradient(to right, transparent, ${vistelicaColors.primary}, ${vistelicaColors.secondary}, transparent)`,
                        borderRadius: '3px',
                        boxShadow: `0 0 10px ${vistelicaColors.primary}70`,
                    }}
                />

                <Box
                    aria-hidden="true"
                    role="presentation"
                    sx={{
                        position: 'absolute',
                        top: 15,
                        right: '5%',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${vistelicaColors.secondary}20 0%, transparent 70%)`,
                        filter: 'blur(20px)',
                    }}
                />
            </Container>
        </Box>
    );
});

HeaderComponent.displayName = 'HeaderComponent';

HeaderComponent.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    articleCount: PropTypes.number,
    wishlistCount: PropTypes.number
};

export default HeaderComponent;