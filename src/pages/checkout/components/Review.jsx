"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';


const addresses = ['1 MUI Drive', 'Reactville', 'Anytown', '99999', 'USA'];
const cardPayments = [
    { name: 'Tipo de tarjeta:', detail: 'Visa' },
    { name: 'Titular:', detail: 'Sr. John Smith' },
    { name: 'Número de tarjeta:', detail: 'xxxx-xxxx-xxxx-1234' },
    { name: 'Fecha de expiración:', detail: '04/2024' },
];

export default function Review({ paymentData }) {
    const renderPaymentDetails = () => {
        if (paymentData && paymentData.type === 'paypal') {
            return (
                <Grid container>
                    <Stack direction="column" spacing={1} sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                Método de pago:
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                PayPal
                            </Typography>
                        </Box>

                        {paymentData.details && paymentData.details.email && (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                    Email:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    {paymentData.details.email}
                                </Typography>
                            </Box>
                        )}

                        {paymentData.details && paymentData.details.id && (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                    ID de transacción:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    {paymentData.details.id}
                                </Typography>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                Estado:
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                Completado
                            </Typography>
                        </Box>
                    </Stack>
                </Grid>
            );
        } else if (paymentData && paymentData.type === 'bankTransfer') {
            return (
                <Grid container>
                    <React.Fragment>
                        <Stack direction="column" spacing={1} sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                    Método de pago:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    Transferencia bancaria
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                    Banco:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    Mastercredit
                                </Typography>
                            </Box>
                        </Stack>
                    </React.Fragment>
                </Grid>
            );
        } else {
            // Default: creditCard o sin datos de pago
            return (
                <Grid container>
                    {cardPayments.map((payment) => (
                        <React.Fragment key={payment.name}>
                            <Stack
                                direction="row"
                                spacing={1}
                                useFlexGap
                                sx={{ width: '100%', mb: 1 }}
                            >
                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                    {payment.name}
                                </Typography>
                                <Typography variant="body2">{payment.detail}</Typography>
                            </Stack>
                        </React.Fragment>
                    ))}
                </Grid>
            );
        }
    };

    return (
        <Stack spacing={2}>
            <List disablePadding>
                <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Productos" secondary="4 seleccionados" />
                    <Typography variant="body2">$134.98</Typography>
                </ListItem>
                <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Envío" secondary="Más impuestos" />
                    <Typography variant="body2">$9.99</Typography>
                </ListItem>
                <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Total" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        $144.97
                    </Typography>
                </ListItem>
            </List>
            <Divider />
            <Stack
                direction="column"
                divider={<Divider flexItem />}
                spacing={2}
                sx={{ my: 2 }}
            >
                <div>
                    <Typography variant="subtitle2" gutterBottom>
                        Detalles de envío
                    </Typography>
                    <Typography gutterBottom>John Smith</Typography>
                    <Typography gutterBottom sx={{ color: 'text.secondary' }}>
                        {addresses.join(', ')}
                    </Typography>
                </div>
                <div>
                    <Typography variant="subtitle2" gutterBottom>
                        Detalles de pago
                    </Typography>
                    {renderPaymentDetails()}
                </div>
            </Stack>
        </Stack>
    );
}