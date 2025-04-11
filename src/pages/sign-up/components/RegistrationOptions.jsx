import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import { useColorScheme } from '@mui/material/styles';
import { vistelicaColors } from '../../shared-theme/vistelicaColors';
import { GoogleIcon, FacebookIcon } from './CustomIcons';

export default function RegistrationOptions({ onSelectEmailRegistration }) {
    const { mode } = useColorScheme();
    console.log("Estado del tema en RegistrationOptions:", mode);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography
                variant="h4"
                sx={{
                    textAlign: 'center',
                    mb: 1,
                    color: vistelicaColors.primary,
                    fontWeight: 400
                }}
            >
                Elige cómo quieres registrarte
            </Typography>

            <Button
                fullWidth
                variant="contained"
                onClick={onSelectEmailRegistration}
                sx={{
                    backgroundColor: vistelicaColors.primary,
                    color: vistelicaColors.tertiary,
                    fontWeight: 600,
                    '&:hover': {
                        backgroundColor: vistelicaColors.primaryDark,
                    }
                }}
            >
                Registrarse con correo electrónico
            </Button>

            <Divider sx={{
                '&::before, &::after': {
                    borderColor: `rgba(${parseInt(vistelicaColors.primary.slice(1, 3), 16)},
                        ${parseInt(vistelicaColors.primary.slice(3, 5), 16)},
                        ${parseInt(vistelicaColors.primary.slice(5, 7), 16)}, 0.3)`,
                },
            }}>
                <Typography sx={{ color: mode === 'dark' ? vistelicaColors.quaternary : 'text.secondary' }}>
                    o
                </Typography>
            </Divider>

            <Button
                fullWidth
                variant="outlined"
                onClick={() => alert('Registrarse con Google')}
                startIcon={<GoogleIcon />}
                sx={{
                    borderColor: vistelicaColors.primary,
                    color: mode === 'dark' ? '#FFFFFF' : '#000000',
                    fontWeight: 600, // Cambiado de 400 a 600 para coincidir con SignInCard
                    '&:hover': {
                        borderColor: vistelicaColors.primary,
                        backgroundColor: mode === 'dark' ?
                            'rgba(228, 176, 2, 0.15)' : 'rgba(228, 176, 2, 0.08)'
                    }
                }}
            >
                Registrarse con Google
            </Button>

            <Button
                fullWidth
                variant="outlined"
                onClick={() => alert('Registrarse con Facebook')}
                startIcon={<FacebookIcon />}
                sx={{
                    borderColor: vistelicaColors.primary,
                    color: mode === 'dark' ?
                        vistelicaColors.tertiary : // Actualizado para coincidir con SignInCard
                        vistelicaColors.secondary, // Actualizado para coincidir con SignInCard
                    fontWeight: 600, // Cambiado de 400 a 600 para coincidir con SignInCard
                    '&:hover': {
                        borderColor: vistelicaColors.primary,
                        backgroundColor: mode === 'dark' ?
                            'rgba(228, 176, 2, 0.15)' : 'rgba(228, 176, 2, 0.08)'
                    }
                }}
            >
                Registrarse con Facebook
            </Button>

            <Typography sx={{ textAlign: 'center', mt: 1 }}>
                ¿Ya tienes una cuenta?{' '}
                <Link
                    href="/"
                    variant="body2"
                    sx={{
                        alignSelf: 'center',
                        color: vistelicaColors.primary,
                        fontWeight: 600,
                        '&:hover': {
                            color: vistelicaColors.primaryDark,
                        }
                    }}
                >
                    Iniciar sesión
                </Link>
            </Typography>
        </Box>
    );
}