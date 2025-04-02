import * as React from 'react';
import PropTypes from 'prop-types';
import { useColorScheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default function ColorModeSelect(props) {
    const { mode, setMode } = useColorScheme();

    if (!mode) {
        return null;
    }

    return (
        <Select
            value={mode}
            onChange={(event) => setMode(event.target.value)}
            SelectDisplayProps={{
                'data-screenshot': 'toggle-mode',
            }}
            {...props}
        >
            <MenuItem value="system">Sistema</MenuItem>
            <MenuItem value="light">Claro</MenuItem>
            <MenuItem value="dark">Oscuro</MenuItem>
        </Select>
    );
}

ColorModeSelect.propTypes = {
    // Propiedades de Select que podrían ser pasadas
    autoWidth: PropTypes.bool,
    defaultValue: PropTypes.any,
    displayEmpty: PropTypes.bool,
    labelId: PropTypes.string,
    MenuProps: PropTypes.object,
    multiple: PropTypes.bool,
    native: PropTypes.bool,
    onChange: PropTypes.func,
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
    open: PropTypes.bool,
    renderValue: PropTypes.func,
    SelectDisplayProps: PropTypes.object,
    size: PropTypes.oneOf(['small', 'medium']),
    variant: PropTypes.oneOf(['filled', 'outlined', 'standard']),
    sx: PropTypes.object
};