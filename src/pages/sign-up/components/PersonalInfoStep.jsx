import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { vistelicaColors } from '../../shared-theme/vistelicaColors';
import { useColorScheme } from '@mui/material/styles';

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

export default function PersonalInfoStep({ formData, onChange, nameError, nameErrorMessage, lastNameError, lastNameErrorMessage, born_dateError, born_dateErrorMessage, onBack, required }) {
    const { mode } = useColorScheme();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
                <FormLabel htmlFor="name" sx={{
                    color: mode === 'dark' ? vistelicaColors.tertiary : vistelicaColors.secondary,
                    fontWeight: 500
                }}>
                    Nombre{required ? ' *' : ''}
                </FormLabel>
                <TextField
                    autoComplete="name"
                    name="name"
                    required={required}
                    fullWidth
                    id="name"
                    placeholder="Jon"
                    value={formData.name}
                    onChange={onChange}
                    error={nameError}
                    helperText={nameErrorMessage}
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
                    Apellidos{required ? ' *' : ''}
                </FormLabel>
                <TextField
                    autoComplete="family-name"
                    name="lastName"
                    required={required}
                    fullWidth
                    id="lastName"
                    placeholder="Snow"
                    value={formData.lastName}
                    onChange={onChange}
                    error={lastNameError}
                    helperText={lastNameErrorMessage}
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
                    Fecha de nacimiento{required ? ' *' : ''}
                </FormLabel>
                <TextField
                    name="born_date"
                    type="date"
                    required={required}
                    fullWidth
                    id="born_date"
                    value={formData.born_date}
                    onChange={onChange}
                    error={born_dateError}
                    helperText={born_dateErrorMessage}
                    InputLabelProps={{
                        shrink: true,
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
                <PrimaryButton type="submit" fullWidth variant="contained">
                    Continuar
                </PrimaryButton>
            </Stack>
        </Box>
    );
}