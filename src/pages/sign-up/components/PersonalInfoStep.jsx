import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

export default function PersonalInfoStep({ formData, onChange, nameError, nameErrorMessage, onBack }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
                <FormLabel htmlFor="name">Nombre</FormLabel>
                <TextField
                    autoComplete="name"
                    name="name"
                    required
                    fullWidth
                    id="name"
                    placeholder="Jon"
                    value={formData.name}
                    onChange={onChange}
                    error={nameError}
                    helperText={nameErrorMessage}
                />
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="lastName">Apellidos</FormLabel>
                <TextField
                    autoComplete="family-name"
                    name="lastName"
                    required
                    fullWidth
                    id="lastName"
                    placeholder="Snow"
                    value={formData.lastName}
                    onChange={onChange}
                />
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="born_date">Fecha de nacimiento</FormLabel>
                <TextField
                    name="born_date"
                    type="date"
                    required
                    fullWidth
                    id="born_date"
                    value={formData.born_date}
                    onChange={onChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </FormControl>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button type="button" fullWidth variant="outlined" onClick={onBack}>
                    Atrás
                </Button>
                <Button type="submit" fullWidth variant="contained">
                    Continuar
                </Button>
            </Stack>
        </Box>
    );
}