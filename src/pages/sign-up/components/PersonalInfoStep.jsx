import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
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

export default function PersonalInfoStep({
                                             formData,
                                             onChange,
                                             nameError,
                                             nameErrorMessage,
                                             lastNameError,
                                             lastNameErrorMessage,
                                             born_dateError,
                                             born_dateErrorMessage,
                                             phoneError,
                                             phoneErrorMessage,
                                             onBack,
                                             required = {}
                                         }) {
    const { mode } = useColorScheme();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
                <FormLabel htmlFor="name" sx={{
                    color: mode === 'dark' ? vistelicaColors.tertiary : vistelicaColors.secondary,
                    fontWeight: 500
                }}>
                    Nombre{required.name ? ' *' : ''}
                </FormLabel>
                <TextField
                    name="name"
                    required={required.name}
                    fullWidth
                    id="name"
                    placeholder="Juan"
                    value={formData.name}
                    onChange={onChange}
                    error={nameError}
                    helperText={nameErrorMessage}
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
                <FormLabel htmlFor="lastName" sx={{
                    color: mode === 'dark' ? vistelicaColors.tertiary : vistelicaColors.secondary,
                    fontWeight: 500
                }}>
                    Apellido{required.lastName ? ' *' : ''}
                </FormLabel>
                <TextField
                    name="lastName"
                    required={required.lastName}
                    fullWidth
                    id="lastName"
                    placeholder="Pérez"
                    value={formData.lastName}
                    onChange={onChange}
                    error={lastNameError}
                    helperText={lastNameErrorMessage}
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
                <FormLabel htmlFor="born_date" sx={{
                    color: mode === 'dark' ? vistelicaColors.tertiary : vistelicaColors.secondary,
                    fontWeight: 500
                }}>
                    Fecha de nacimiento{required.born_date ? ' *' : ''}
                </FormLabel>
                <TextField
                    name="born_date"
                    required={required.born_date}
                    fullWidth
                    id="born_date"
                    type="date"
                    value={formData.born_date}
                    onChange={onChange}
                    error={born_dateError}
                    helperText={born_dateErrorMessage}
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
                    placeholder="611778899"
                    value={formData.phone}
                    onChange={onChange}
                    error={phoneError}
                    helperText={phoneErrorMessage}
                    type="tel"
                    inputProps={{
                        pattern: "[0-9]*",
                        inputMode: "numeric"
                    }}
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
                    Continuar
                </PrimaryButton>
            </Stack>
        </Box>
    );
}