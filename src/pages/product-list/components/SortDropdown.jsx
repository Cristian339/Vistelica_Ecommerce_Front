import React, { useState, useCallback, memo } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import { typography } from "@/pages/shared-theme/themePrimitives";

// Iconos para las opciones
import SortIcon from '@mui/icons-material/Sort';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import HistoryIcon from '@mui/icons-material/History';

const SortDropdown = memo(({ onSortChange }) => {
    const [value, setValue] = useState('relevancia');

    const handleChange = useCallback((event) => {
        const option = event.target.value;
        setValue(option);
        onSortChange(option);
    }, [onSortChange]);

    return (
        <FormControl
            variant="outlined"
            size="small"
            sx={{
                minWidth: { xs: 180, sm: 200, md: 220 },
                '& .MuiInputLabel-root': {
                    fontFamily: typography?.fontFamily
                }
            }}
        >
            <InputLabel
                id="sort-select-label"
                sx={{
                    color: vistelicaColors?.primary || '#E4B002',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
            >
                Ordenar por
            </InputLabel>

            <Select
                labelId="sort-select-label"
                value={value}
                onChange={handleChange}
                label="Ordenar por"
                sx={{
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                    '& .MuiSelect-select': {
                        color: vistelicaColors?.secondary || '#333',
                        fontFamily: typography?.fontFamily,
                        fontWeight: 500,
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        py: { xs: 1, sm: 1.2 },
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    },
                    '& .MuiSvgIcon-root': {
                        color: vistelicaColors?.primary || '#E4B002',
                        transition: 'transform 0.3s ease'
                    },
                    '&.Mui-focused .MuiSvgIcon-root': {
                        transform: 'rotate(180deg)'
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: vistelicaColors?.primary || '#E4B002',
                        borderWidth: '1px',
                        transition: 'border-width 0.2s ease'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: vistelicaColors?.primary || '#E4B002',
                        borderWidth: '1.5px'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: vistelicaColors?.primary || '#E4B002',
                        borderWidth: '1.5px',
                        boxShadow: `0 0 0 3px ${vistelicaColors?.primary || '#E4B002'}15`
                    },
                    '&.Mui-focused': {
                        color: vistelicaColors?.primary || '#E4B002'
                    },
                    '&.MuiInputBase-root.Mui-focused': {
                        color: vistelicaColors?.primary || '#E4B002'
                    }
                }}
                MenuProps={{
                    PaperProps: {
                        elevation: 3,
                        sx: {
                            borderRadius: '8px',
                            mt: 0.5,
                            maxHeight: '300px',
                            '& .MuiMenuItem-root': {
                                fontFamily: typography?.fontFamily,
                                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                py: 1,
                                transition: 'background-color 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                '&:hover': {
                                    backgroundColor: `${vistelicaColors?.primary || '#E4B002'}10`
                                }
                            },
                            '& .MuiMenuItem-root.Mui-selected': {
                                backgroundColor: `${vistelicaColors?.secondary || '#333'}15`,
                                fontWeight: 500,
                                '&:hover': {
                                    backgroundColor: `${vistelicaColors?.secondary || '#333'}20`
                                }
                            },
                            '& .menu-icon': {
                                color: vistelicaColors?.primary || '#E4B002',
                                fontSize: '1.2rem'
                            }
                        }
                    },
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'center',
                    },
                    transformOrigin: {
                        vertical: 'top',
                        horizontal: 'center',
                    }
                }}
            >
                <MenuItem value="relevancia">
                    <SortIcon className="menu-icon" />
                    <span>Relevancia</span>
                </MenuItem>
                <MenuItem value="precio-asc">
                    <TrendingUpIcon className="menu-icon" />
                    <span>Precio: Bajo a Alto</span>
                </MenuItem>
                <MenuItem value="precio-desc">
                    <TrendingDownIcon className="menu-icon" />
                    <span>Precio: Alto a Bajo</span>
                </MenuItem>
                <MenuItem value="nuevo">
                    <NewReleasesIcon className="menu-icon" />
                    <span>Más Recientes</span>
                </MenuItem>
                <MenuItem value="antiguo">
                    <HistoryIcon className="menu-icon" />
                    <span>Más Antiguos</span>
                </MenuItem>
            </Select>
        </FormControl>
    );
});

SortDropdown.displayName = 'SortDropdown';

export default SortDropdown;