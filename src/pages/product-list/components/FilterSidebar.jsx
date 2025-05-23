import React, {useState} from 'react';
import {
    Box, Typography, Checkbox, FormControlLabel, Divider, TextField, Button,
    Rating, FormGroup, List, ListItem, ListItemText, Accordion, AccordionSummary,
    AccordionDetails, IconButton, useMediaQuery, useTheme, GlobalStyles,
    CircularProgress, Fade, Slide, Zoom, Tooltip, Badge, InputAdornment
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FilterListIcon from '@mui/icons-material/FilterList';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined';
import EuroOutlinedIcon from '@mui/icons-material/EuroOutlined';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import {motion} from "framer-motion";
import Link from 'next/link';
import {COLORS, } from '../constants/filterOptions';
import {alpha} from '@mui/material/styles';
// Importamos los colores del tema global en lugar de definirlos localmente
import {vistelicaColors} from "@/pages/shared-theme/vistelicaColors";



// Lista de tallas comunes
const SIZES = [
    {id: 'xs', label: 'XS'},
    {id: 's', label: 'S'},
    {id: 'm', label: 'M'},
    {id: 'l', label: 'L'},
    {id: 'xl', label: 'XL'},
    {id: 'xxl', label: 'XXL'},
    {id: '36', label: '36'},
    {id: '38', label: '38'},
    {id: '40', label: '40'},
    {id: '42', label: '42'},
    {id: '44', label: '44'}
];

// Función auxiliar para cerrar el sidebar (en móvil)
const closeSidebar = () => {
    document.documentElement.style.setProperty('--SideNavigation-slideIn', '0');
};

const FilterSidebar = ({
                           filters,
                           setFilters,
                           hasDiscount = false,
                           lowStock= false,
                           categories = [],
                           subcategories = [],
                           loadingSubcategories = false,
                           selectedCategory,
                           selectedGender,
                           showFilters,
                           setShowFilters,
                           onSubcategorySelect
                       }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [expandedAccordion, setExpandedAccordion] = useState('sizes');

    // Función para manejar cambios en los accordions
    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpandedAccordion(isExpanded ? panel : false);
    };

    // Función para manejar checkboxes
    const handleCheckbox = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: prev[key].includes(value)
                ? prev[key].filter(item => item !== value)
                : [...prev[key], value]
        }));
    };

    // Función para manejar tallas checkbox
    const handleSizeCheckbox = (sizeId) => {
        handleCheckbox('sizes', sizeId);
    };

    // Función para manejar cambios de precio
    const handlePriceChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Contar filtros activos por sección
    const getActiveFiltersCount = (type) => {
        switch (type) {
            case 'subcategories':
                return filters.subcategories.length;
            case 'brands':
                return filters.brands.length;
            case 'colors':
                return filters.colors.length;
            case 'ratings':
                return filters.ratings.length;
            case 'sizes':
                return filters.sizes ? filters.sizes.length : 0;
            case 'price':
                return (filters.priceMin !== '' || filters.priceMax !== '') ? 1 : 0;
            default:
                return 0;
        }
    };

    return (
        <>
            <GlobalStyles
                styles={(theme) => ({
                    ':root': {
                        '--Sidebar-width': '320px',
                        '--SideNavigation-slideIn': '0',
                    },
                    '@keyframes fadeIn': {
                        '0%': {
                            opacity: 0,
                            transform: 'translateY(10px)'
                        },
                        '100%': {
                            opacity: 1,
                            transform: 'translateY(0)'
                        }
                    },
                    '.filter-item': {
                        animation: 'fadeIn 0.3s ease-out',
                        animationFillMode: 'backwards'
                    },
                    '.MuiAccordion-root': {
                        borderRadius: '8px !important',
                        overflow: 'hidden',
                        boxShadow: 'none',
                        '&:before': {
                            display: 'none'
                        },
                        marginBottom: '16px',
                        backgroundColor: vistelicaColors.light
                    },
                    '.MuiAccordionSummary-root': {
                        borderRadius: '8px',
                        transition: 'all 0.2s',
                        '&:hover': {
                            backgroundColor: alpha(vistelicaColors.secondary, 0.05)
                        },
                        '&.Mui-expanded': {
                            backgroundColor: alpha(vistelicaColors.secondary, 0.08),
                            minHeight: '48px',
                            '& .MuiAccordionSummary-content': {
                                margin: '12px 0'
                            }
                        }
                    },
                    '.MuiAccordionDetails-root': {
                        padding: '0px 16px 16px',
                        borderTop: '1px solid rgba(0,0,0,0.1)'
                    },
                    '.MuiCheckbox-root': {
                        color: vistelicaColors.secondary,
                        '&.Mui-checked': {
                            color: vistelicaColors.secondary
                        }
                    },
                    '.MuiFormControlLabel-root': {
                        transition: 'all 0.15s ease',
                        borderRadius: '4px',
                        margin: '4px 0',
                        width: '100%',
                        '&:hover': {
                            backgroundColor: alpha(vistelicaColors.secondary, 0.05)
                        }
                    },
                    '.color-circle': {
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                            transform: 'scale(1.2)',
                            boxShadow: '0 0 0 2px white, 0 0 0 4px ' + vistelicaColors.secondary
                        }
                    },
                    // Ocultar scrollbar en todos los navegadores
                    '.FilterSidebar': {
                        '-ms-overflow-style': 'none',
                        'scrollbar-width': 'none',
                        '&::-webkit-scrollbar': {
                            display: 'none'
                        }
                    }
                })}
            />

            {/* Overlay para cerrar el sidebar en móvil */}
            <Fade in={showFilters && isMobile}>
                <Box
                    className="Sidebar-overlay"
                    sx={{
                        position: 'fixed',
                        zIndex: 1199,
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(4px)',
                        transition: 'all 0.3s',
                        display: {xs: 'block', md: 'none'},
                        visibility: showFilters && isMobile ? 'visible' : 'hidden',
                    }}
                    onClick={() => {
                        closeSidebar();
                        if (setShowFilters) setShowFilters(false);
                    }}
                />
            </Fade>

            {/* Contenedor principal del sidebar */}
            <Slide direction="right" in={showFilters || !isMobile} mountOnEnter unmountOnExit>
                <Box
                    className="FilterSidebar"
                    sx={{
                        position: {xs: 'fixed', md: 'sticky'},
                        top: {xs: 0, md: '80px'},
                        left: 0,
                        height: {xs: '100vh', md: 'calc(100vh - 80px)'},
                        width: 'var(--Sidebar-width)',
                        maxWidth: '100%',
                        zIndex: 1200,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        bgcolor: 'background.paper',
                        p: {xs: 2, md: 2.5},
                        borderRight: '1px solid',
                        borderColor: vistelicaColors.border,
                        boxShadow: {
                            xs: '0 0 20px rgba(0,0,0,0.15)',
                            md: '0 4px 12px rgba(0,0,0,0.05)'
                        },
                        WebkitOverflowScrolling: 'touch',
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': {
                            display: 'none',
                            width: '0px'
                        }
                    }}
                >
                    {/* Cabecera del sidebar */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 3,
                            pb: 2,
                            borderBottom: `1px solid ${vistelicaColors.border}`
                        }}
                    >
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <FilterListIcon
                                sx={{
                                    color: vistelicaColors.secondary,
                                    mr: 1,
                                    fontSize: '28px'
                                }}
                            />
                            <Typography
                                variant="h5"
                                fontWeight="600"
                                sx={{
                                    color: vistelicaColors.primary,
                                    letterSpacing: '-0.5px'
                                }}
                            >
                                Filtros
                            </Typography>
                        </Box>

                        {isMobile && (
                            <IconButton
                                onClick={() => {
                                    closeSidebar();
                                    if (setShowFilters) setShowFilters(false);
                                }}
                                sx={{
                                    bgcolor: vistelicaColors.light,
                                    '&:hover': {
                                        bgcolor: alpha(vistelicaColors.secondary, 0.1),
                                    }
                                }}
                            >
                                <CloseIcon/>
                            </IconButton>
                        )}
                    </Box>

                    {/* SECCIÓN: Tallas */}
                    <Accordion
                        expanded={expandedAccordion === 'sizes'}
                        onChange={handleAccordionChange('sizes')}
                        disableGutters
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{color: vistelicaColors.primary}}/>}
                            sx={{px: 2}}
                        >
                            <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
                                <StraightenOutlinedIcon
                                    sx={{
                                        mr: 1.5,
                                        color: vistelicaColors.primary
                                    }}
                                />
                                <Typography
                                    fontWeight="600"
                                    sx={{flexGrow: 1, color: "#000000"}}
                                >
                                    Tallas
                                </Typography>

                                {getActiveFiltersCount('sizes') > 0 && (
                                    <Zoom in={true}>
                                        <Badge
                                            badgeContent={getActiveFiltersCount('sizes')}
                                            color="secondary"
                                            sx={{ml: 1}}
                                        />
                                    </Zoom>
                                )}
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1, pt: 1}}>
                                {SIZES.map((size, index) => (
                                    <Box
                                        component={motion.div}
                                        key={size.id}
                                        initial={{opacity: 0, scale: 0.8}}
                                        animate={{opacity: 1, scale: 1}}
                                        transition={{delay: index * 0.05}}
                                        onClick={() => handleSizeCheckbox(size.id)}
                                        sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: '6px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '1px solid',
                                            borderColor: filters.sizes?.includes(size.id)
                                                ? vistelicaColors.secondary
                                                : 'rgba(0,0,0,0.1)',
                                            bgcolor: filters.sizes?.includes(size.id)
                                                ? alpha(vistelicaColors.secondary, 0.1)
                                                : 'transparent',
                                            color: filters.sizes?.includes(size.id)
                                                ? vistelicaColors.secondary
                                                : vistelicaColors.textDark,
                                            fontWeight: filters.sizes?.includes(size.id) ? 600 : 400,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                borderColor: vistelicaColors.secondary,
                                                bgcolor: alpha(vistelicaColors.secondary, 0.05)
                                            }
                                        }}
                                    >
                                        {size.label}
                                    </Box>
                                ))}
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    <Divider sx={{my: 2, opacity: 0.6, bgcolor: vistelicaColors.border}}/>

                    {/* Stock y descuentos */}
                    <Accordion
                        expanded={expandedAccordion === 'stockDiscounts'}
                        onChange={handleAccordionChange('stockDiscounts')}
                        disableGutters
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{ color: vistelicaColors.primary }} />}
                            sx={{ px: 2 }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <LocalOfferIcon sx={{ mr: 1.5, color: vistelicaColors.primary }} />
                                <Typography fontWeight="600" sx={{ flexGrow: 1, color: '#000000' }}>
                                    Stock y Descuentos
                                </Typography>

                                {(filters.hasDiscount || filters.lowStock) && (
                                    <Zoom in={true}>
                                        <Badge
                                            badgeContent={(filters.hasDiscount ? 1 : 0) + (filters.lowStock ? 1 : 0)}
                                            color="secondary"
                                            sx={{ ml: 1 }}
                                        />
                                    </Zoom>
                                )}
                            </Box>
                        </AccordionSummary>

                        <AccordionDetails>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={filters.lowStock}
                                            onChange={() =>
                                                setFilters(prev => ({ ...prev, lowStock: !prev.lowStock }))
                                            }
                                            sx={{ color: vistelicaColors.secondary }}
                                        />
                                    }
                                    label={<Typography variant="body2" sx={{ color: vistelicaColors.textDark }}>Poco stock</Typography>}
                                    sx={{ p: 0.5, borderRadius: '4px' }}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={filters.hasDiscount}
                                            onChange={() =>
                                                setFilters(prev => ({ ...prev, hasDiscount: !prev.hasDiscount }))
                                            }
                                            sx={{ color: vistelicaColors.secondary }}
                                        />
                                    }
                                    label={<Typography variant="body2" sx={{ color: vistelicaColors.textDark }}>Con descuento</Typography>}
                                    sx={{ p: 0.5, borderRadius: '4px' }}
                                />
                            </FormGroup>
                        </AccordionDetails>
                    </Accordion>
                    {/* Colores */}
                    <Accordion
                        expanded={expandedAccordion === 'colors'}
                        onChange={handleAccordionChange('colors')}
                        disableGutters
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{color: vistelicaColors.primary}}/>}
                            sx={{px: 2}}
                        >
                            <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
                                <StyleOutlinedIcon
                                    sx={{
                                        mr: 1.5,
                                        color: vistelicaColors.primary
                                    }}
                                />
                                <Typography
                                    fontWeight="600"
                                    sx={{flexGrow: 1, color: "#000000"}}
                                >
                                    Colores
                                </Typography>

                                {getActiveFiltersCount('colors') > 0 && (
                                    <Zoom in={true}>
                                        <Badge
                                            badgeContent={getActiveFiltersCount('colors')}
                                            color="secondary"
                                            sx={{ml: 1}}
                                        />
                                    </Zoom>
                                )}
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1, pt: 1}}>
                                {COLORS.map((color, index) => (
                                    <Tooltip key={color.id} title={color.label} arrow>
                                        <Box
                                            component={motion.div}
                                            initial={{opacity: 0, scale: 0.8}}
                                            animate={{opacity: 1, scale: 1}}
                                            transition={{delay: index * 0.03}}
                                            onClick={() => handleCheckbox('colors', color.id)}
                                            className="color-circle"
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: '50%',
                                                bgcolor: color.hex || color.color || '#CCCCCC',
                                                border: '2px solid white',
                                                boxShadow: filters.colors.includes(color.id)
                                                    ? `0 0 0 2px ${vistelicaColors.secondary}`
                                                    : '0 0 0 1px rgba(0,0,0,0.1)',
                                                cursor: 'pointer',
                                                position: 'relative',
                                                '&:after': filters.colors.includes(color.id) ? {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    width: '14px',
                                                    height: '14px',
                                                    borderRadius: '50%',
                                                    bgcolor: 'rgba(255,255,255,0.8)',
                                                    transform: 'translate(-50%, -50%)'
                                                } : {}
                                            }}
                                        />
                                    </Tooltip>
                                ))}
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    <Divider sx={{my: 2, opacity: 0.6, bgcolor: vistelicaColors.border}}/>

                    {/* Precio */}
                    <Accordion
                        expanded={expandedAccordion === 'price'}
                        onChange={handleAccordionChange('price')}
                        disableGutters
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{color: vistelicaColors.primary}}/>}
                            sx={{px: 2}}
                        >
                            <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
                                <EuroOutlinedIcon
                                    sx={{
                                        mr: 1.5,
                                        color: vistelicaColors.primary
                                    }}
                                />
                                <Typography
                                    fontWeight="600"
                                    sx={{flexGrow: 1, color: "#000000"}}
                                >
                                    Precio
                                </Typography>

                                {getActiveFiltersCount('price') > 0 && (
                                    <Zoom in={true}>
                                        <Badge
                                            badgeContent={getActiveFiltersCount('price')}
                                            color="secondary"
                                            sx={{ml: 1}}
                                        />
                                    </Zoom>
                                )}
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 2, mt: 1, mb: 2}}>
                                <TextField
                                    label="Mínimo"
                                    type="number"
                                    size="small"
                                    fullWidth
                                    value={filters.priceMin}
                                    onChange={(e) => handlePriceChange('priceMin', e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">€</InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '8px',
                                            borderColor: vistelicaColors.border,
                                            '&:hover fieldset': {
                                                borderColor: vistelicaColors.secondary,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: vistelicaColors.secondary,
                                            }
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: vistelicaColors.secondary
                                        }
                                    }}
                                />
                                <Typography sx={{color: vistelicaColors.textDark}}>-</Typography>
                                <TextField
                                    label="Máximo"
                                    type="number"
                                    size="small"
                                    fullWidth
                                    value={filters.priceMax}
                                    onChange={(e) => handlePriceChange('priceMax', e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">€</InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '8px',
                                            borderColor: vistelicaColors.border,
                                            '&:hover fieldset': {
                                                borderColor: vistelicaColors.secondary,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: vistelicaColors.secondary,
                                            }
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: vistelicaColors.secondary
                                        }
                                    }}
                                />
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    <Divider sx={{my: 2, opacity: 0.6, bgcolor: vistelicaColors.border}}/>

                    {/* Rating */}
                    <Accordion
                        expanded={expandedAccordion === 'ratings'}
                        onChange={handleAccordionChange('ratings')}
                        disableGutters
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{color: vistelicaColors.primary}}/>}
                            sx={{px: 2}}
                        >
                            <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
                                <StarOutlineIcon
                                    sx={{
                                        mr: 1.5,
                                        color: vistelicaColors.primary
                                    }}
                                />
                                <Typography
                                    fontWeight="600"
                                    sx={{flexGrow: 1, color: "#000000"}}
                                >
                                    Valoración
                                </Typography>

                                {getActiveFiltersCount('ratings') > 0 && (
                                    <Zoom in={true}>
                                        <Badge
                                            badgeContent={getActiveFiltersCount('ratings')}
                                            color="secondary"
                                            sx={{ml: 1}}
                                        />
                                    </Zoom>
                                )}
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List disablePadding>
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <motion.div
                                        key={rating}
                                        initial={{opacity: 0, y: 5}}
                                        animate={{opacity: 1, y: 0}}
                                        transition={{delay: (5 - rating) * 0.1}}
                                    >
                                        <ListItem
                                            disablePadding
                                            sx={{
                                                borderRadius: '8px',
                                                mb: 0.5,
                                                transition: 'all 0.2s',
                                                bgcolor: filters.ratings.includes(rating)
                                                    ? 'rgba(0,0,0,0.05)'
                                                    : 'transparent',
                                                '&:hover': {
                                                    bgcolor: 'rgba(0,0,0,0.02)'
                                                }
                                            }}
                                            onClick={() => handleCheckbox('ratings', rating)}
                                            button
                                        >
                                            <ListItemText
                                                primary={
                                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                        <Rating
                                                            value={rating}
                                                            max={5}
                                                            readOnly
                                                            size="small"
                                                            sx={{
                                                                color: vistelicaColors.primary,
                                                                mr: 1
                                                            }}
                                                        />
                                                        <Typography variant="body2"
                                                                    sx={{color: vistelicaColors.textDark}}>
                                                            {rating === 5 ? 'y más' : 'o más'}
                                                        </Typography>
                                                    </Box>
                                                }
                                                sx={{py: 0.5}}
                                            />
                                        </ListItem>
                                    </motion.div>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>

                    {/* Botones de acción */}
                    <Box sx={{mt: 3, display: 'flex', flexDirection: 'column', gap: 2}}>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                py: 1.2,
                                bgcolor: vistelicaColors.secondary,
                                color: 'white',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    bgcolor: vistelicaColors.secondary,
                                    opacity: 0.9,
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
                                }
                            }}
                            onClick={() => {
                                if (isMobile) {
                                    closeSidebar();
                                    if (setShowFilters) setShowFilters(false);
                                }
                            }}
                        >
                            Aplicar filtros
                        </Button>

                        <Button
                            variant="outlined"
                            fullWidth
                            sx={{
                                py: 1.2,
                                borderColor: vistelicaColors.border,
                                color: vistelicaColors.textDark,
                                borderRadius: '8px',
                                '&:hover': {
                                    borderColor: vistelicaColors.secondary,
                                    bgcolor: 'rgba(0,0,0,0.02)'
                                }
                            }}
                            onClick={() => {
                                setFilters({
                                    subcategories: [],
                                    brands: [],
                                    colors: [],
                                    sizes: [],
                                    ratings: [],
                                    priceMin: '',
                                    priceMax: ''
                                });
                            }}
                        >
                            Limpiar filtros
                        </Button>
                    </Box>
                </Box>
            </Slide>
        </>
    );
};

export default FilterSidebar;