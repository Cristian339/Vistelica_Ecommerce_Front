import React from 'react';
import { Box, Typography, Paper, Button, Tooltip } from '@mui/material';
import { motion } from "framer-motion";
import { Palette } from '@mui/icons-material';
import { vistelicaColors } from '@/components/shared/vistelicaColors';
import { typography } from "@/components/shared/themePrimitives";

// Mapeo estructurado de colores en inglés a español
const COLOR_TRANSLATIONS = {
    // Colores básicos
    'white': 'blanco',
    'black': 'negro',
    'red': 'rojo',
    'blue': 'azul',
    'green': 'verde',
    'yellow': 'amarillo',
    'orange': 'naranja',
    'purple': 'morado',
    'pink': 'rosa',
    'grey': 'gris',
    'gray': 'gris',
    'brown': 'marrón',
    'turquoise': 'turquesa',
    'gold': 'dorado',
    'silver': 'plateado',

    // Tonos específicos
    'light blue': 'azul claro',
    'dark blue': 'azul oscuro',
    'navy blue': 'azul marino',
    'navy': 'azul marino',
    'light red': 'rojo claro',
    'dark red': 'rojo oscuro',
    'light green': 'verde claro',
    'dark green': 'verde oscuro',
    'light yellow': 'amarillo claro',
    'light grey': 'gris claro',
    'light gray': 'gris claro',
    'dark grey': 'gris oscuro',
    'dark gray': 'gris oscuro',
    'light pink': 'rosa claro',
    'hot pink': 'rosa fuerte',

    // Colores adicionales
    'khaki': 'caqui',
    'cream': 'crema',
    'fuchsia': 'fucsia',
    'lavender': 'lavanda',
    'lilac': 'lila',
    'mint': 'menta',
    'ochre': 'ocre',
    'salmon': 'salmón',
    'terracotta': 'terracota',
    'wine': 'vino',
    'violet': 'violeta',
    'burgundy': 'bordó',
    'teal': 'verde azulado',
    'aqua': 'agua',
    'cyan': 'cian',
    'olive': 'oliva',
    'charcoal': 'carbón',
    'ivory': 'marfil',
    'tan': 'bronceado',
    'chocolate': 'chocolate',
    'indigo': 'índigo'
};

// Catálogo estructurado de colores con sus códigos hexadecimales
const COLOR_CATALOG = [
    { id: 'negro', label: 'Negro', cssColor: '#000000' },
    { id: 'blanco', label: 'Blanco', cssColor: '#FFFFFF' },
    { id: 'gris', label: 'Gris', cssColor: '#808080' },
    { id: 'azul', label: 'Azul', cssColor: '#0000FF' },
    { id: 'rojo', label: 'Rojo', cssColor: '#FF0000' },
    { id: 'verde', label: 'Verde', cssColor: '#008000' },
    { id: 'amarillo', label: 'Amarillo', cssColor: '#FFFF00' },
    { id: 'rosa', label: 'Rosa', cssColor: '#FFC0CB' },
    { id: 'morado', label: 'Morado', cssColor: '#800080' },
    { id: 'naranja', label: 'Naranja', cssColor: '#FFA500' },
    { id: 'marrón', label: 'Marrón', cssColor: '#A52A2A' },
    { id: 'turquesa', label: 'Turquesa', cssColor: '#40E0D0' },
    { id: 'dorado', label: 'Dorado', cssColor: '#FFD700' },
    { id: 'plateado', label: 'Plateado', cssColor: '#C0C0C0' },
    { id: 'púrpura', label: 'Púrpura', cssColor: '#800080' },
    { id: 'azul claro', label: 'Azul claro', cssColor: '#ADD8E6' },
    { id: 'azul oscuro', label: 'Azul oscuro', cssColor: '#00008B' },
    { id: 'azul marino', label: 'Azul marino', cssColor: '#000080' },
    { id: 'rojo claro', label: 'Rojo claro', cssColor: '#FF6666' },
    { id: 'rojo oscuro', label: 'Rojo oscuro', cssColor: '#8B0000' },
    { id: 'verde claro', label: 'Verde claro', cssColor: '#90EE90' },
    { id: 'verde oscuro', label: 'Verde oscuro', cssColor: '#006400' },
    { id: 'caqui', label: 'Caqui', cssColor: '#F0E68C' },
    { id: 'crema', label: 'Crema', cssColor: '#FFFDD0' },
    { id: 'fucsia', label: 'Fucsia', cssColor: '#FF00FF' },
    { id: 'lavanda', label: 'Lavanda', cssColor: '#E6E6FA' },
    { id: 'lila', label: 'Lila', cssColor: '#C8A2C8' },
    { id: 'vino', label: 'Vino', cssColor: '#722F37' },
    { id: 'violeta', label: 'Violeta', cssColor: '#8A2BE2' },
    { id: 'bordó', label: 'Bordó', cssColor: '#800020' }
];

const ColorSelector = ({
                           availableColors = [], // ✅ Valor por defecto agregado
                           selectedColor,
                           onColorChange,
                           highlightedSection,
                           pulseAnimation
                       }) => {
    // ✅ Validación early return para evitar errores de SSR
    if (!availableColors || !Array.isArray(availableColors) || availableColors.length === 0) {
        return (
            <Box sx={{ mb: 3 }}>
                <Paper
                    elevation={2}
                    sx={{
                        p: 2,
                        borderRadius: '12px',
                        background: 'linear-gradient(145deg, #ffffff, #f8f8f8)',
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontFamily: typography.fontFamily,
                            fontWeight: 600,
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            color: vistelicaColors.secondary
                        }}
                    >
                        <Palette sx={{ mr: 1, color: vistelicaColors.primary }} />
                        Color: No disponible
                    </Typography>
                </Paper>
            </Box>
        );
    }

    // Función para capitalizar la primera letra de cada palabra
    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Función para traducir un color del inglés al español
    const translateColorName = (colorName) => {
        if (!colorName) return '';

        // Normalizar nombre (minúsculas, sin acentos)
        const normalizedName = colorName.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .trim();

        // Buscar en el catálogo para obtener el nombre con formato correcto
        const catalogEntry = COLOR_CATALOG.find(color =>
            color.id === normalizedName ||
            color.label.toLowerCase() === normalizedName
        );

        if (catalogEntry) {
            return catalogEntry.label; // Devuelve el label que ya tiene mayúscula inicial
        }

        // Si no está en el catálogo español, buscar traducción
        const spanishName = COLOR_TRANSLATIONS[normalizedName];
        if (spanishName) {
            // Buscar en el catálogo para obtener el label formateado correctamente
            const translatedEntry = COLOR_CATALOG.find(c =>
                c.id === spanishName ||
                c.label.toLowerCase() === spanishName.toLowerCase()
            );

            if (translatedEntry) {
                return translatedEntry.label;
            }

            // Si no está en el catálogo, capitalizar manualmente
            return capitalizeFirstLetter(spanishName);
        }

        // Si no hay traducción, capitalizar el original
        return capitalizeFirstLetter(colorName);
    };

    return (
        <Box sx={{ mb: 3 }}>
            <Paper
                elevation={2}
                sx={{
                    p: 2,
                    borderRadius: '12px',
                    background: 'linear-gradient(145deg, #ffffff, #f8f8f8)',
                    ...(highlightedSection && {
                        animation: pulseAnimation
                    })
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: typography.fontFamily,
                        fontWeight: 600,
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        color: vistelicaColors.secondary
                    }}
                >
                    <Palette sx={{ mr: 1, color: vistelicaColors.primary }} />
                    Color: {selectedColor && (
                    <span style={{ marginLeft: '4px', fontWeight: 400 }}>
                            {translateColorName(selectedColor)}
                        </span>
                )}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1.5,
                        justifyContent: 'flex-start'
                    }}
                >
                    {availableColors.map((color, index) => {
                        // ✅ Validación adicional para cada color
                        if (!color) return null;

                        const colorCode = getColorCode(color);
                        const isBrightColor = isLightColor(colorCode);
                        const translatedColor = translateColorName(color);

                        return (
                            <motion.div
                                key={`${color}-${index}`} // ✅ Key más segura
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Tooltip title={translatedColor} arrow>
                                    <Button
                                        variant="contained"
                                        onClick={() => onColorChange && onColorChange(color)} // ✅ Validación de función
                                        sx={{
                                            minWidth: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            backgroundColor: colorCode,
                                            border: selectedColor === color ? '3px solid' : '1px solid',
                                            borderColor: selectedColor === color ? vistelicaColors.primary : isBrightColor ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)',
                                            boxShadow: selectedColor === color ? `0 0 0 2px white, 0 0 0 4px ${vistelicaColors.primary}` : 'none',
                                            p: 0,
                                            '&:hover': {
                                                backgroundColor: colorCode,
                                                opacity: 0.9
                                            }
                                        }}
                                    />
                                </Tooltip>
                            </motion.div>
                        );
                    })}
                </Box>
            </Paper>
        </Box>
    );
};

// Determinar si un color es claro para ajustar el borde
const isLightColor = (hexColor) => {
    if (!hexColor || hexColor === '#CCCCCC') return true;

    // Convertir el color hex a RGB
    let r = 0, g = 0, b = 0;

    // Formato #RGB o #RRGGBB
    if (hexColor.length === 4) {
        r = parseInt(hexColor[1] + hexColor[1], 16);
        g = parseInt(hexColor[2] + hexColor[2], 16);
        b = parseInt(hexColor[3] + hexColor[3], 16);
    } else if (hexColor.length === 7) {
        r = parseInt(hexColor.substring(1, 3), 16);
        g = parseInt(hexColor.substring(3, 5), 16);
        b = parseInt(hexColor.substring(5, 7), 16);
    }

    // Calcular luminosidad
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186;
};

// Función para obtener el código de color a partir del nombre
const getColorCode = (colorName) => {
    if (!colorName) return '#CCCCCC';

    // Si ya es un código hexadecimal, devolverlo directamente
    if (colorName.startsWith('#') && (colorName.length === 4 || colorName.length === 7)) {
        return colorName;
    }

    // Normalizar nombre (minúsculas, sin acentos)
    const normalizedName = colorName.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .trim();

    // Buscar en el catálogo de colores
    const colorEntry = COLOR_CATALOG.find(c =>
        c.id === normalizedName ||
        c.label.toLowerCase() === normalizedName
    );

    if (colorEntry) {
        return colorEntry.cssColor;
    }

    // Si no está en el catálogo español, buscar traducción y luego en el catálogo
    const spanishName = COLOR_TRANSLATIONS[normalizedName];
    if (spanishName) {
        const translatedEntry = COLOR_CATALOG.find(c =>
            c.id === spanishName ||
            c.label.toLowerCase() === spanishName
        );
        if (translatedEntry) {
            return translatedEntry.cssColor;
        }
    }

    console.log(`Color no encontrado: "${colorName}" (normalizado: "${normalizedName}")`);
    return '#CCCCCC'; // Color por defecto gris claro si no se encuentra
};

export default ColorSelector;