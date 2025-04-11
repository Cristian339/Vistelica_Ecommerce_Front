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
import { styled } from '@mui/material/styles';
import { useColorScheme } from '@mui/material/styles';
import { vistelicaColors } from '../../shared-theme/vistelicaColors';

// Botón primario con hover amarillo
const PrimaryButton = styled(Button)(() => ({
    backgroundColor: vistelicaColors.primary,
    color: vistelicaColors.tertiary,
    fontWeight: 600,
    padding: '10px 0',
    '&:hover': {
        backgroundColor: vistelicaColors.primaryDark,
        boxShadow: '0 4px 12px rgba(228, 176, 2, 0.25)',
    },
    '&:disabled': {
        backgroundColor: 'rgba(228, 176, 2, 0.5)',
    },
    transition: 'all 0.3s ease',
}));

// StyledLink con los colores de Vistélica
const StyledLink = styled(Link)(() => ({
    color: vistelicaColors.primary,
    '&:hover': {
        color: vistelicaColors.primaryDark,
    },
}));

export default function ContactInfoStep({ formData, onChange, addressError, addressErrorMessage, phoneError, phoneErrorMessage, onBack, required = {} }) {
    const { mode } = useColorScheme();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
                <FormLabel htmlFor="address" sx={{
                    color: mode === 'dark' ? vistelicaColors.tertiary : vistelicaColors.secondary,
                    fontWeight: 500
                }}>
                    Dirección{required.address ? ' *' : ''}
                </FormLabel>
                <TextField
                    name="address"
                    required={required.address}
                    fullWidth
                    id="address"
                    placeholder="Av. Principal 123, Ciudad"
                    value={formData.address}
                    onChange={onChange}
                    error={addressError}
                    helperText={addressErrorMessage}
                    FormHelperTextProps={{
                        sx: { fontWeight: 700 }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                                borderColor: vistelicaColors.primary,
                            }
                        }
                    }}
                />
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="phone" sx={{
                    color: mode === 'dark' ? vistelicaColors.tertiary : vistelicaColors.secondary,
                    fontWeight: 500
                }}>
                    Teléfono{required.phone ? ' *' : ''}
                </FormLabel>
                <TextField
                    name="phone"
                    required={required.phone}
                    fullWidth
                    id="phone"
                    placeholder="555-123-4567"
                    value={formData.phone}
                    onChange={onChange}
                    error={phoneError}
                    helperText={phoneErrorMessage}
                    FormHelperTextProps={{
                        sx: { fontWeight: 700 }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                                borderColor: vistelicaColors.primary,
                            }
                        }
                    }}
                />
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="avatar" sx={{
                    color: mode === 'dark' ? vistelicaColors.tertiary : vistelicaColors.secondary,
                    fontWeight: 500
                }}>
                    URL de avatar (opcional)
                </FormLabel>
                <TextField
                    name="avatar"
                    fullWidth
                    id="avatar"
                    placeholder="https://example.com/mi-avatar.jpg"
                    value={formData.avatar}
                    onChange={onChange}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                                borderColor: vistelicaColors.primary,
                            }
                        }
                    }}
                />
            </FormControl>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                    type="button"
                    fullWidth
                    variant="outlined"
                    onClick={onBack}
                    sx={{
                        borderColor: vistelicaColors.primary,
                        color: mode === 'dark' ? vistelicaColors.tertiary : vistelicaColors.secondary,
                        fontWeight: 600,
                        '&:hover': {
                            borderColor: vistelicaColors.primary,
                            backgroundColor: mode === 'dark' ?
                                'rgba(228, 176, 2, 0.15)' : 'rgba(228, 176, 2, 0.08)'
                        }
                    }}
                >
                    Atrás
                </Button>
                <PrimaryButton
                    type="submit"
                    fullWidth
                    variant="contained"
                >
                    Completar registro
                </PrimaryButton>
            </Stack>
        </Box>
    );
}