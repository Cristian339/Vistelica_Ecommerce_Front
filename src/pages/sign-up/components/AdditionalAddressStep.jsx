import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useColorScheme } from '@mui/material/styles';
import { vistelicaColors } from '../../../components/shared/vistelicaColors';

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

export default function AdditionalAddressStep({
                                                  formData = {}, // Default empty object
                                                  onChange,
                                                  onCheckboxChange,
                                                  errors = {},
                                                  onBack,
                                                  isLastStep = false
                                              }) {
    const { mode } = useColorScheme();

    const handleCheckboxChange = (event) => {
        onCheckboxChange('includeAdditionalAddress', event.target.checked);
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            maxHeight: '70vh', // Limitar altura máxima
            overflowY: 'auto', // Permitir scroll si es necesario
            paddingRight: 1 // Espacio para el scrollbar
        }}>
            <Typography variant="h6" sx={{
                color: mode === 'dark' ? vistelicaColors.tertiary : vistelicaColors.secondary,
                mb: 1,
                fontSize: '1.1rem',
                fontWeight: 500
            }}>
                Dirección Adicional
            </Typography>

            <FormControlLabel
                control={
                    <Checkbox
                        checked={formData.includeAdditionalAddress || false}
                        onChange={handleCheckboxChange}
                        sx={{
                            color: vistelicaColors.primary,
                            '&.Mui-checked': {
                                color: vistelicaColors.primary,
                            }
                        }}
                    />
                }
                label={
                    <Typography sx={{
                        color: mode === 'dark' ? vistelicaColors.tertiary : vistelicaColors.secondary,
                        fontSize: '0.95rem'
                    }}>
                        Agregar dirección adicional (opcional)
                    </Typography>
                }
            />

            {formData.includeAdditionalAddress && (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mt: 1,
                    width: '100%'
                }}>
                    {/* Calle - Campo completo */}
                    <FormControl fullWidth>
                        <FormLabel htmlFor="additional_street" sx={{
                            color: mode === 'dark' ? vistelicaColors.tertiary : vistelicaColors.secondary,
                            fontWeight: 500,
                            fontSize: '0.9rem',
                            mb: 0.5
                        }}>
                            Calle *
                        </FormLabel>
                        <TextField
                            name="additional_street"
                            fullWidth
                            id="additional_street"
                            placeholder="Av. Secundaria 456"
                            value={formData.additional_street || ''}
                            onChange={onChange}
                            error={!!errors.additional_street}
                            helperText={errors.additional_street}
                            size="small"
                            FormHelperTextProps={{
                                sx: { fontWeight: 700, fontSize: '0.75rem' }
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

                    {/* Ciudad y Estado/Provincia */}
                    <Stack direction="row" spacing={2}>
                        <FormControl sx={{ flex: 1 }}>
                            <FormLabel htmlFor="additional_city" sx={{
                                color: mode === 'dark' ? vistelicaColors.tertiary : vistelicaColors.secondary,
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                mb: 0.5
                            }}>
                                Ciudad *
                            </FormLabel>
                            <TextField
                                name="additional_city"
                                fullWidth
                                id="additional_city"
                                placeholder="Ciudad"
                                value={formData.additional_city || ''}
                                onChange={onChange}
                                error={!!errors.additional_city}
                                helperText={errors.additional_city}
                                size="small"
                                FormHelperTextProps={{
                                    sx: { fontWeight: 700, fontSize: '0.75rem' }
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

                        <FormControl sx={{ flex: 1 }}>
                            <FormLabel htmlFor="additional_state" sx={{
                                color: mode === 'dark' ? vistelicaColors.tertiary : vistelicaColors.secondary,
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                mb: 0.5
                            }}>
                                Estado/Provincia *
                            </FormLabel>
                            <TextField
                                name="additional_state"
                                fullWidth
                                id="additional_state"
                                placeholder="Estado"
                                value={formData.additional_state || ''}
                                onChange={onChange}
                                error={!!errors.additional_state}
                                helperText={errors.additional_state}
                                size="small"
                                FormHelperTextProps={{
                                    sx: { fontWeight: 700, fontSize: '0.75rem' }
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
                    </Stack>

                    {/* Código Postal y País */}
                    <Stack direction="row" spacing={2}>
                        <FormControl sx={{ flex: 1 }}>
                            <FormLabel htmlFor="additional_postal_code" sx={{
                                color: mode === 'dark' ? vistelicaColors.tertiary : vistelicaColors.secondary,
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                mb: 0.5
                            }}>
                                Código Postal *
                            </FormLabel>
                            <TextField
                                name="additional_postal_code"
                                fullWidth
                                id="additional_postal_code"
                                placeholder="12345"
                                value={formData.additional_postal_code || ''}
                                onChange={onChange}
                                error={!!errors.additional_postal_code}
                                helperText={errors.additional_postal_code}
                                size="small"
                                FormHelperTextProps={{
                                    sx: { fontWeight: 700, fontSize: '0.75rem' }
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

                        <FormControl sx={{ flex: 1 }}>
                            <FormLabel htmlFor="additional_country" sx={{
                                color: mode === 'dark' ? vistelicaColors.tertiary : vistelicaColors.secondary,
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                mb: 0.5
                            }}>
                                País *
                            </FormLabel>
                            <TextField
                                name="additional_country"
                                fullWidth
                                id="additional_country"
                                placeholder="México"
                                value={formData.additional_country || ''}
                                onChange={onChange}
                                error={!!errors.additional_country}
                                helperText={errors.additional_country}
                                size="small"
                                FormHelperTextProps={{
                                    sx: { fontWeight: 700, fontSize: '0.75rem' }
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
                    </Stack>

                    {/* Bloque, Piso y Puerta */}
                    <Stack direction="row" spacing={2}>
                        <FormControl sx={{ flex: 1 }}>
                            <FormLabel htmlFor="additional_block" sx={{
                                color: mode === 'dark' ? vistelicaColors.tertiary : vistelicaColors.secondary,
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                mb: 0.5
                            }}>
                                Bloque (opcional)
                            </FormLabel>
                            <TextField
                                name="additional_block"
                                fullWidth
                                id="additional_block"
                                placeholder="A, B, C..."
                                value={formData.additional_block || ''}
                                onChange={onChange}
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused fieldset': {
                                            borderColor: vistelicaColors.primary,
                                        }
                                    }
                                }}
                            />
                        </FormControl>

                        <FormControl sx={{ flex: 1 }}>
                            <FormLabel htmlFor="additional_floor" sx={{
                                color: mode === 'dark' ? vistelicaColors.tertiary : vistelicaColors.secondary,
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                mb: 0.5
                            }}>
                                Piso
                            </FormLabel>
                            <TextField
                                name="additional_floor"
                                fullWidth
                                id="additional_floor"
                                placeholder="1, 2, 3..."
                                value={formData.additional_floor || ''}
                                onChange={onChange}
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused fieldset': {
                                            borderColor: vistelicaColors.primary,
                                        }
                                    }
                                }}
                            />
                        </FormControl>

                        <FormControl sx={{ flex: 1 }}>
                            <FormLabel htmlFor="additional_door" sx={{
                                color: mode === 'dark' ? vistelicaColors.tertiary : vistelicaColors.secondary,
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                mb: 0.5
                            }}>
                                Puerta
                            </FormLabel>
                            <TextField
                                name="additional_door"
                                fullWidth
                                id="additional_door"
                                placeholder="A, 101, 202..."
                                value={formData.additional_door || ''}
                                onChange={onChange}
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused fieldset': {
                                            borderColor: vistelicaColors.primary,
                                        }
                                    }
                                }}
                            />
                        </FormControl>
                    </Stack>

                    {/* Etiqueta */}
                    <FormControl>
                        <FormLabel htmlFor="additional_label" sx={{
                            color: mode === 'dark' ? vistelicaColors.tertiary : vistelicaColors.secondary,
                            fontWeight: 500,
                            fontSize: '0.9rem',
                            mb: 0.5
                        }}>
                            Etiqueta
                        </FormLabel>
                        <TextField
                            name="additional_label"
                            fullWidth
                            id="additional_label"
                            placeholder="Casa, Oficina, Trabajo..."
                            value={formData.additional_label || ''}
                            onChange={onChange}
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: vistelicaColors.primary,
                                    }
                                }
                            }}
                        />
                    </FormControl>

                    {/* Checkbox para dirección por defecto */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="additional_is_default"
                                checked={formData.additional_is_default || false}
                                onChange={(e) => onCheckboxChange('additional_is_default', e.target.checked)}
                                sx={{
                                    color: vistelicaColors.primary,
                                    '&.Mui-checked': {
                                        color: vistelicaColors.primary,
                                    }
                                }}
                            />
                        }
                        label={
                            <Typography sx={{
                                color: mode === 'dark' ? vistelicaColors.tertiary : vistelicaColors.secondary,
                                fontSize: '0.95rem'
                            }}>
                                Establecer como dirección por defecto
                            </Typography>
                        }
                    />
                </Box>
            )}

            {/* Botones de navegación */}
            <Stack direction="row" spacing={2} sx={{ mt: 3, pt: 2 }}>
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
                    {isLastStep ? 'Siguiente' : 'Siguiente'}
                </PrimaryButton>
            </Stack>
        </Box>
    );
}