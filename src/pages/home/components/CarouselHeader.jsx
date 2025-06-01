const CarouselHeader = React.memo(({ title, subtitle, onSeeAllClick }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                mb: 3,
                gap: { xs: 2, sm: 0 }
            }}
        >
            <Box>
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 0.5
                    }}
                >
                    <LocalFireDepartmentIcon
                        sx={{
                            color: '#ff6b6b',
                            fontSize: { xs: '1.8rem', md: '2rem' },
                            animation: 'pulseIcon 2s infinite',
                            '@keyframes pulseIcon': {
                                '0%': { transform: 'scale(1)' },
                                '50%': { transform: 'scale(1.1)' },
                                '100%': { transform: 'scale(1)' }
                            }
                        }}
                    />
                    <Typography
                        variant="h6"
                        sx={{
                            fontFamily: typography.fontFamily,
                            fontWeight: 700,
                            color: '#FFCC00',
                            fontSize: { xs: '1.1rem', md: '1.3rem' },
                            textShadow: '0px 1px 2px rgba(0,0,0,0.3)'
                        }}
                    >
                        ¡Aprovecha!
                    </Typography>
                </Box>

                {title && (
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                            fontFamily: typography.fontFamily,
                            fontWeight: 700,
                            color: '#ff6b6b',
                            fontSize: { xs: '1.5rem', md: '2rem' },
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -8,
                                left: 0,
                                width: '40%',
                                height: '3px',
                                background: 'linear-gradient(90deg, #ff6b6b, transparent)'
                            }
                        }}
                    >
                        {title}
                    </Typography>
                )}

                {subtitle && (
                    <Typography
                        variant="body1"
                        sx={{
                            mt: 1,
                            color: 'text.secondary',
                            maxWidth: '650px',
                            fontSize: { xs: '0.9rem', md: '1rem' }
                        }}
                    >
                        {subtitle}
                    </Typography>
                )}
            </Box>

            <Button
                onClick={onSeeAllClick}
                endIcon={<KeyboardArrowRightIcon />}
                component={motion.button}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.97 }}
                variant="outlined"
                aria-label="Ver todos los productos con stock limitado"
                sx={{
                    borderRadius: '30px',
                    borderColor: 'rgba(255, 107, 107, 0.6)',
                    color: '#ff6b6b',
                    fontSize: '0.9rem',
                    py: 1,
                    px: 2.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                        borderColor: '#ff6b6b',
                        backgroundColor: 'rgba(255, 107, 107, 0.04)'
                    }
                }}
            >
                Ver todos
            </Button>
        </Box>
    );
});

CarouselHeader.displayName = 'CarouselHeader';