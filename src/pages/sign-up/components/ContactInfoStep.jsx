import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { GoogleIcon, FacebookIcon } from './CustomIcons';

export default function ContactInfoStep({ formData, onChange, onBack }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
                <FormLabel htmlFor="address">Dirección</FormLabel>
                <TextField
                    name="address"
                    required
                    fullWidth
                    id="address"
                    placeholder="Av. Principal 123, Ciudad"
                    value={formData.address}
                    onChange={onChange}
                />
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="phone">Teléfono</FormLabel>
                <TextField
                    name="phone"
                    required
                    fullWidth
                    id="phone"
                    placeholder="555-123-4567"
                    value={formData.phone}
                    onChange={onChange}
                />
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="avatar">URL de avatar (opcional)</FormLabel>
                <TextField
                    name="avatar"
                    fullWidth
                    id="avatar"
                    placeholder="https://example.com/mi-avatar.jpg"
                    value={formData.avatar}
                    onChange={onChange}
                />
            </FormControl>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button type="button" fullWidth variant="outlined" onClick={onBack}>
                    Atrás
                </Button>
                <Button type="submit" fullWidth variant="contained">
                    Completar registro
                </Button>
            </Stack>

            <Divider>
                <Typography sx={{ color: 'text.secondary' }}>o</Typography>
            </Divider>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => alert('Registrarse con Google')}
                    startIcon={<GoogleIcon />}
                >
                    Registrarse con Google
                </Button>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => alert('Registrarse con Facebook')}
                    startIcon={<FacebookIcon />}
                >
                    Registrarse con Facebook
                </Button>
                <Typography sx={{ textAlign: 'center' }}>
                    ¿Ya tienes una cuenta?{' '}
                    <Link
                        href="/"
                        variant="body2"
                        sx={{ alignSelf: 'center' }}
                    >
                        Iniciar sesión
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
}