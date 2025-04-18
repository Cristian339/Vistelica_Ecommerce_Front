import React, { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const SortDropdown = ({ onSortChange }) => {
    const [value, setValue] = useState('relevancia');

    const handleChange = (event) => {
        const option = event.target.value;
        setValue(option);
        onSortChange(option);
    };

    return (
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="sort-select-label">Ordenar por</InputLabel>
            <Select
                labelId="sort-select-label"
                value={value}
                onChange={handleChange}
                label="Ordenar por"
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