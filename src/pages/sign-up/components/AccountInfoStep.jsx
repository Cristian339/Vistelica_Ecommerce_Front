import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function AccountInfoStep({
                                            formData = { email: '', password: '' },
                                            onChange = () => {},
                                            emailError = false,
                                            emailErrorMessage = '',
                                            passwordError = false,
                                            passwordErrorMessage = ''
                                        }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
                <FormLabel htmlFor="email">Correo electrónico</FormLabel>
                <TextField
                    required
                    fullWidth
                    id="email"
                    placeholder="tu@correo.com"
                    name="email"
                    value={formData.email || ''}
                    onChange={onChange}
                    autoComplete="email"
                    variant="outlined"
                    error={emailError}
                    helperText={emailErrorMessage}
                />
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="password">Contraseña</FormLabel>
                <TextField
                    required
                    fullWidth
                    name="password"
                    placeholder="••••••"
                    type="password"
                    id="password"
                    value={formData.password || ''}
                    onChange={onChange}
                    autoComplete="new-password"
                    variant="outlined"
                    error={passwordError}
                    helperText={passwordErrorMessage}
                />
            </FormControl>
            <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="Quiero recibir ofertas por correo electrónico."
            />
            <Button type="submit" fullWidth variant="contained">
                Continuar
            </Button>
        </Box>
    );
}