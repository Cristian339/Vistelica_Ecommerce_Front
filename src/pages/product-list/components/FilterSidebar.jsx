import React from 'react';
import {
    Box,
    Typography,
    Checkbox,
    FormControlLabel,
    Divider,
    TextField,
    Button,
    Rating,
    FormGroup,
    List,
    ListItem,
    ListItemText,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Link from 'next/link';
import { COLORS, BRANDS } from '../constants/filterOptions';

const FilterSidebar = ({ filters, setFilters, categories, selectedGender }) => {
    // Función para manejar checkboxes
    const handleCheckbox = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: prev[key].includes(value)
                ? prev[key].filter(item => item !== value)
                : [...prev[key], value]
        }));
    };

    // Función para manejar cambios de precio
    const handlePriceChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Función para aplicar filtro de precio
    const applyPriceFilter = () => {
        // Ya se aplica automáticamente en el useEffect del componente padre
    };

    return (
        <Box>
            {/* Categorías */}
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight="bold">Categorías</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List disablePadding dense>
                        {categories
                            .filter(cat => !selectedGender || cat.gender === selectedGender || cat.gender === 'unisex')
                            .map(category => (
                                <Box key={category._id}>
                                    <ListItem disablePadding>
                                        <Link href={`/product-list?gender=${selectedGender}&category=${category.slug}`} passHref style={{textDecoration: 'none', color: 'inherit', width: '100%'}}>
                                            <ListItemText primary={category.name} />
                                        </Link>
                                    </ListItem>

                                    {category.subcategories?.length > 0 && (
                                        <List disablePadding dense sx={{ pl: 2 }}>
                                            {category.subcategories.map(subcat => (
                                                <ListItem disablePadding key={subcat._id}>
                                                    <Link href={`/product-list?gender=${selectedGender}&category=${subcat.slug}`} passHref style={{textDecoration: 'none', color: 'inherit', width: '100%'}}>
                                                        <ListItemText primary={subcat.name} />
                                                    </Link>
                                                </ListItem>
                                            ))}
                                        </List>
                                    )}
                                </Box>
                            ))}
                    </List>
                </AccordionDetails>
            </Accordion>

            <Divider sx={{ my: 2 }} />

            {/* Marcas */}
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight="bold">Marcas</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        {BRANDS.map(brand => (
                            <FormControlLabel
                                key={brand.id}
                                control={
                                    <Checkbox
                                        checked={filters.brands.includes(brand.id)}
                                        onChange={() => handleCheckbox('brands', brand.id)}
                                        size="small"
                                    />
                                }
                                label={brand.label}
                            />
                        ))}
                    </FormGroup>
                </AccordionDetails>
            </Accordion>

            <Divider sx={{ my: 2 }} />

            {/* Colores */}
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight="bold">Colores</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        {COLORS.map(color => (
                            <FormControlLabel
                                key={color.id}
                                control={
                                    <Checkbox
                                        checked={filters.colors.includes(color.id)}
                                        onChange={() => handleCheckbox('colors', color.id)}
                                        size="small"
                                    />
                                }
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box
                                            sx={{
                                                width: 16,
                                                height: 16,
                                                borderRadius: '50%',
                                                backgroundColor: color.cssColor || color.id,
                                                border: '1px solid #ddd',
                                                mr: 1
                                            }}
                                        />
                                        {color.label}
                                    </Box>
                                }
                            />
                        ))}
                    </FormGroup>
                </AccordionDetails>
            </Accordion>

            <Divider sx={{ my: 2 }} />

            {/* Precio */}
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight="bold">Precio</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <TextField
                            label="Mínimo"
                            type="number"
                            size="small"
                            fullWidth
                            InputProps={{ inputProps: { min: 0 } }}
                            value={filters.priceMin}
                            onChange={(e) => handlePriceChange('priceMin', e.target.value)}
                        />
                        <TextField
                            label="Máximo"
                            type="number"
                            size="small"
                            fullWidth
                            InputProps={{ inputProps: { min: 0 } }}
                            value={filters.priceMax}
                            onChange={(e) => handlePriceChange('priceMax', e.target.value)}
                        />
                    </Box>
                    <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        onClick={applyPriceFilter}
                    >
                        Aplicar
                    </Button>
                </AccordionDetails>
            </Accordion>

            <Divider sx={{ my: 2 }} />

            {/* Rating */}
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight="bold">Valoración</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        {[5, 4, 3].map((rating) => (
                            <FormControlLabel
                                key={rating}
                                control={
                                    <Checkbox
                                        checked={filters.ratings.includes(rating)}
                                        onChange={() => handleCheckbox('ratings', rating)}
                                        size="small"
                                    />
                                }
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Rating value={rating} readOnly size="small" />
                                        <Typography variant="body2" sx={{ ml: 1 }}>
                                            o más
                                        </Typography>
                                    </Box>
                                }
                            />
                        ))}
                    </FormGroup>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default FilterSidebar;