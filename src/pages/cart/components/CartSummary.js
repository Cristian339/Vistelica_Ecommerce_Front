"use client";
import { Box, Typography, Button, Divider } from '@mui/material';
import {vistelicaColors} from "@/pages/shared-theme/vistelicaColors";


export default function CartSummary() {
    return (
        <Box sx={{
            position: 'sticky',
            top: 20,
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            p: 3,
            backgroundColor: 'white',
            height: 'fit-content'
        }}>
            <Typography variant="h6" sx={{
                fontWeight: 'bold',
                mb: 3,
                fontSize: '1.2rem',
                fontFamily: "'Amethysta', serif"
            }}>
                RESUMEN DE COMPRA
            </Typography>

            <Box sx={{ mb: 2 }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 2
                }}>
                    <Typography sx={{fontFamily: "'Amethysta', serif"}}>Subtotal</Typography>
                    <Typography sx={{fontFamily: "'Amethysta', serif"}}>69.95€</Typography>
                </Box>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 2
                }}>
                    <Typography>Envío</Typography>
                    <Typography sx={{ color: 'green' }}>GRATIS</Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold',fontFamily: "'Amethysta', serif" }}>TOTAL</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: "'Amethysta', serif" }}>68.95€</Typography>
            </Box>

            <Button
                fullWidth
                variant="contained"
                sx={{
                    py: 1.5,
                    backgroundColor: vistelicaColors.primary,
                    '&:hover': { backgroundColor: vistelicaColors.primaryDark },
                    fontWeight: 'bold',
                    mb: 2,
                    fontFamily: "'Amethysta', serif",
                }}
            >
                FINALIZAR COMPRA
            </Button>

            <Typography sx={{
                textAlign: 'center',
                fontWeight: 'bold',
                color: 'green',
                fontSize: '0.9rem'
            }}>
                PÁGOS 100% SEGUROS
            </Typography>
        </Box>
    );
}