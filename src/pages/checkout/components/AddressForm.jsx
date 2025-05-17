"use client";

import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';

const FormGrid = styled(Grid)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
}));

export default function AddressForm() {
    return (
        <Grid container spacing={3}>
            <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="first-name" required>
                    Nombre
                </FormLabel>
                <OutlinedInput
                    id="first-name"
                    name="first-name"
                    type="text"
                    placeholder="Juan"
                    autoComplete="given-name"
                    required
                    size="small"
                />
            </FormGrid>
            <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="last-name" required>
                    Apellido
                </FormLabel>
                <OutlinedInput
                    id="last-name"
                    name="last-name"
                    type="text"
                    placeholder="Pérez"
                    autoComplete="family-name"
                    required
                    size="small"
                />
            </FormGrid>
            <FormGrid item xs={12}>
                <FormLabel htmlFor="address1" required>
                    Dirección línea 1
                </FormLabel>
                <OutlinedInput
                    id="address1"
                    name="address1"
                    type="text"
                    placeholder="Nombre de calle y número"
                    autoComplete="shipping address-line1"
                    required
                    size="small"
                />
            </FormGrid>
            <FormGrid item xs={12}>
                <FormLabel htmlFor="address2">Dirección línea 2</FormLabel>
                <OutlinedInput
                    id="address2"
                    name="address2"
                    type="text"
                    placeholder="Apartamento, suite, unidad, etc. (opcional)"
                    autoComplete="shipping address-line2"
                    size="small"
                />
            </FormGrid>
            <FormGrid item xs={6}>
                <FormLabel htmlFor="city" required>
                    Ciudad
                </FormLabel>
                <OutlinedInput
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Madrid"
                    autoComplete="shipping address-level2"
                    required
                    size="small"
                />
            </FormGrid>
            <FormGrid item xs={6}>
                <FormLabel htmlFor="state" required>
                    Provincia
                </FormLabel>
                <OutlinedInput
                    id="state"
                    name="state"
                    type="text"
                    placeholder="Madrid"
                    autoComplete="shipping address-level1"
                    required
                    size="small"
                />
            </FormGrid>
            <FormGrid item xs={6}>
                <FormLabel htmlFor="zip" required>
                    Código Postal
                </FormLabel>
                <OutlinedInput
                    id="zip"
                    name="zip"
                    type="text"
                    placeholder="28001"
                    autoComplete="shipping postal-code"
                    required
                    size="small"
                />
            </FormGrid>
            <FormGrid item xs={6}>
                <FormLabel htmlFor="country" required>
                    País
                </FormLabel>
                <OutlinedInput
                    id="country"
                    name="country"
                    type="text"
                    placeholder="España"
                    autoComplete="shipping country"
                    required
                    size="small"
                />
            </FormGrid>
            <FormGrid item xs={12}>
                <FormControlLabel
                    control={<Checkbox name="saveAddress" value="yes" />}
                    label="Usar esta dirección para los detalles de pago"
                />
            </FormGrid>
        </Grid>
    );
}