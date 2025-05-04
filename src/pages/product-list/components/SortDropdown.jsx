import React, { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import {vistelicaColors} from "@/pages/shared-theme/vistelicaColors";

const SortDropdown = ({ onSortChange }) => {
    const [value, setValue] = useState('relevancia');

    const handleChange = (event) => {
        const option = event.target.value;
        setValue(option);
        onSortChange(option);
    };

    return (
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="sort-select-label" sx={{ color: vistelicaColors.primary }}>
                Ordenar por
            </InputLabel>
            <Select
                labelId="sort-select-label"
                value={value}
                onChange={handleChange}
                label="Ordenar por"
                sx={{
                    '& .MuiSelect-select': {
                        color: vistelicaColors.secondary
                    },
                    '& .MuiSvgIcon-root': { // Flecha del dropdown
                        color: vistelicaColors.primary
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: vistelicaColors.primary
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: vistelicaColors.primary
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: vistelicaColors.primary
                    },
                    '&.Mui-focused': {
                        color: vistelicaColors.primary
                    },
                    '&.MuiInputBase-root.Mui-focused': {
                        color: vistelicaColors.primary
                    }
                }}
                MenuProps={{
                    PaperProps: {
                        sx: {
                            '& .MuiMenuItem-root.Mui-selected': {
                                backgroundColor: `${vistelicaColors.secondary}20`
                            }
                        }
                    }
                }}
            >
                <MenuItem value="relevancia">Relevancia</MenuItem>
                <MenuItem value="precio-asc">Precio: Bajo a Alto</MenuItem>
                <MenuItem value="precio-desc">Precio: Alto a Bajo</MenuItem>
                <MenuItem value="nuevo">Más Recientes</MenuItem>
                <MenuItem value="antiguo">Más Antiguos</MenuItem>
            </Select>
        </FormControl>
    );
};

export default SortDropdown;