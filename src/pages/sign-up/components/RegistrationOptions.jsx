import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import { GoogleIcon, FacebookIcon } from './CustomIcons';

export default function RegistrationOptions({ onSelectEmailRegistration }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ textAlign: 'center', mb: 1 }}>
                Elige cómo quieres registrarte
            </Typography>

            <Button
                fullWidth
                variant="contained"
                onClick={onSelectEmailRegistration}
            >
                Registrarse con correo electrónico
            </Button>

            <Divider>
                <Typography sx={{ color: 'text.secondary' }}>o</Typography>
            </Divider>

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

            <Typography sx={{ textAlign: 'center', mt: 1 }}>
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
    );
}