'use client';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { vistelicaColors } from '../../components/shared/vistelicaColors';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const StyledButton = styled(Button)(() => ({
    backgroundColor: vistelicaColors.primary,
    color: vistelicaColors.tertiary,
    fontWeight: 600,
    '&:hover': {
        backgroundColor: vistelicaColors.primaryDark,
    },
    '&:disabled': {
        backgroundColor: 'rgba(228, 176, 2, 0.5)',
    },
}));

const TermsContent = styled(Box)(({ theme }) => ({
    overflowY: 'auto',
    padding: theme.spacing(2),
    borderRadius: '8px',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
        maxHeight: '60vh',
    },
    [theme.breakpoints.down('md')]: {
        maxHeight: '55vh',
        padding: theme.spacing(2, 1),
    },
    [theme.breakpoints.down('sm')]: {
        maxHeight: '65vh',
        padding: theme.spacing(1),
    },
    '@media (max-height: 600px)': {
        maxHeight: '50vh',
    },
    '@media (max-height: 700px) and (orientation: landscape)': {
        maxHeight: '45vh',
    },
}));

export default function TermsAndConditions({ open, handleClose, handleAccept }) {
    const [accepted, setAccepted] = React.useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isLandscape = useMediaQuery('(orientation: landscape) and (max-height: 500px)');

    const handleChange = (event) => {
        setAccepted(event.target.checked);
    };

    const handleContinue = () => {
        handleAccept();
        handleClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            fullScreen={isMobile}
            PaperProps={{
                sx: {
                    borderRadius: isMobile ? 0 : '16px',
                    m: isMobile ? 0 : 2,
                    maxHeight: isMobile ? '100%' : '90vh',
                    position: 'relative',
                    height: isMobile && isLandscape ? '100vh' : 'auto'
                }
            }}
        >
            {isMobile && (
                <IconButton
                    aria-label="cerrar"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: vistelicaColors.primary
                    }}
                >
                    <CloseIcon />
                </IconButton>
            )}

            <DialogTitle sx={{
                color: vistelicaColors.primary,
                fontWeight: 600,
                textAlign: 'center',
                fontSize: isMobile ? '1.1rem' : '1.5rem',
                py: isMobile ? 1.5 : 2,
                pt: isMobile ? 2.5 : 2,
                pb: isMobile ? 1 : 2
            }}>
                Términos y Condiciones de Vistelica
            </DialogTitle>

            <DialogContent sx={{
                px: isMobile ? 1.5 : 3,
                py: isMobile ? 0.5 : 2,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <TermsContent>
                    <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 600, mb: 1 }}>
                        TÉRMINOS Y CONDICIONES DE USO
                    </Typography>

                    <Typography variant={isMobile ? "body2" : "body1"} paragraph sx={{ mb: isMobile ? 1 : 2 }}>
                        Bienvenido a Vistelica, tu destino de moda para toda la familia. Al acceder y utilizar nuestros servicios, aceptas cumplir con los siguientes términos y condiciones.
                    </Typography>

                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: isMobile ? 1 : 2 }}>
                        1. INFORMACIÓN GENERAL
                    </Typography>
                    <Typography variant={isMobile ? "body2" : "body1"} paragraph sx={{ mb: isMobile ? 1 : 2 }}>
                        Vistelica es una plataforma de venta de ropa y accesorios para hombres, mujeres y niños. Nuestro sitio web está diseñado para ofrecerte una experiencia de compra segura y satisfactoria.
                    </Typography>

                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: isMobile ? 1 : 2 }}>
                        2. REGISTRO Y CUENTA DE USUARIO
                    </Typography>
                    <Typography variant={isMobile ? "body2" : "body1"} paragraph sx={{ mb: isMobile ? 1 : 2 }}>
                        Para realizar compras en nuestra plataforma, es necesario que te registres proporcionando información precisa y completa. Eres responsable de mantener la confidencialidad de tu cuenta y contraseña, así como de todas las actividades realizadas con ella.
                    </Typography>

                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: isMobile ? 1 : 2 }}>
                        3. POLÍTICA DE PRIVACIDAD
                    </Typography>
                    <Typography variant={isMobile ? "body2" : "body1"} paragraph sx={{ mb: isMobile ? 1 : 2 }}>
                        Tu privacidad es importante para nosotros. Recopilamos y utilizamos tu información personal de acuerdo con nuestra Política de Privacidad, que forma parte integral de estos términos y condiciones.
                    </Typography>

                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: isMobile ? 1 : 2 }}>
                        4. COMPRAS Y ENVÍOS
                    </Typography>
                    <Typography variant={isMobile ? "body2" : "body1"} paragraph sx={{ mb: isMobile ? 1 : 2 }}>
                        Al realizar una compra, aceptas pagar el precio indicado más los gastos de envío correspondientes. Los plazos de entrega son estimados y pueden variar según la ubicación geográfica y disponibilidad de los productos.
                    </Typography>

                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: isMobile ? 1 : 2 }}>
                        5. POLÍTICA DE DEVOLUCIONES Y CAMBIOS
                    </Typography>
                    <Typography variant={isMobile ? "body2" : "body1"} paragraph sx={{ mb: isMobile ? 1 : 2 }}>
                        Tienes derecho a devolver o cambiar un producto dentro de los 30 días posteriores a la recepción, siempre que se encuentre en perfecto estado, con etiquetas originales y sin haber sido usado. Los costos de envío asociados a las devoluciones correrán por cuenta del cliente, excepto en casos de productos defectuosos.
                    </Typography>

                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: isMobile ? 1 : 2 }}>
                        6. PROPIEDAD INTELECTUAL
                    </Typography>
                    <Typography variant={isMobile ? "body2" : "body1"} paragraph sx={{ mb: isMobile ? 1 : 2 }}>
                        Todos los contenidos del sitio web (imágenes, textos, logotipos, diseños, etc.) son propiedad exclusiva de Vistelica y están protegidos por las leyes de propiedad intelectual. Queda prohibida su reproducción total o parcial sin autorización expresa.
                    </Typography>

                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: isMobile ? 1 : 2 }}>
                        7. LIMITACIÓN DE RESPONSABILIDAD
                    </Typography>
                    <Typography variant={isMobile ? "body2" : "body1"} paragraph sx={{ mb: isMobile ? 1 : 2 }}>
                        Vistelica no será responsable por daños indirectos, incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de usar nuestros servicios o productos.
                    </Typography>

                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: isMobile ? 1 : 2 }}>
                        8. MODIFICACIONES DE LOS TÉRMINOS
                    </Typography>
                    <Typography variant={isMobile ? "body2" : "body1"} paragraph sx={{ mb: isMobile ? 1 : 2 }}>
                        Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio web.
                    </Typography>

                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: isMobile ? 1 : 2 }}>
                        9. LEY APLICABLE
                    </Typography>
                    <Typography variant={isMobile ? "body2" : "body1"} paragraph sx={{ mb: isMobile ? 1 : 2 }}>
                        Estos términos y condiciones se regirán e interpretarán de acuerdo con las leyes del país de operación de Vistelica, sin tener en cuenta las disposiciones sobre conflictos de leyes.
                    </Typography>

                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: isMobile ? 1 : 2 }}>
                        10. CONTACTO
                    </Typography>
                    <Typography variant={isMobile ? "body2" : "body1"} paragraph sx={{ mb: isMobile ? 1 : 2 }}>
                        Para cualquier consulta relacionada con estos términos y condiciones, ponte en contacto con nuestro servicio de atención al cliente a través del correo electrónico: contacto@vistelica.com
                    </Typography>
                </TermsContent>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={accepted}
                            onChange={handleChange}
                            sx={{
                                color: vistelicaColors.primary,
                                '&.Mui-checked': {
                                    color: vistelicaColors.primary,
                                },
                                padding: isMobile ? '4px' : '9px',
                            }}
                        />
                    }
                    label={
                        <Typography variant={isMobile ? "body2" : "body1"} sx={{ lineHeight: isMobile ? 1.2 : 1.5 }}>
                            He leído y acepto los términos y condiciones
                        </Typography>
                    }
                    sx={{
                        marginTop: isMobile ? 0.5 : 2,
                        ml: -0.5
                    }}
                />
            </DialogContent>
            <DialogActions sx={{
                p: isMobile ? 1.5 : 3,
                pt: isMobile ? 1 : 3,
                pb: isMobile ? 2 : 3,
                justifyContent: 'space-between',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 1 : 0
            }}>
                {!isMobile && (
                    <Button
                        onClick={handleClose}
                        sx={{
                            color: vistelicaColors.primary,
                            width: isMobile ? '100%' : 'auto'
                        }}
                    >
                        Cancelar
                    </Button>
                )}
                <StyledButton
                    onClick={handleContinue}
                    disabled={!accepted}
                    sx={{
                        width: isMobile ? '100%' : 'auto',
                        py: isMobile ? 1 : 0.75,
                        fontSize: isMobile ? '0.95rem' : 'inherit',
                        minHeight: isMobile ? 48 : 36
                    }}
                >
                    {isMobile ? 'Aceptar y continuar' : 'Continuar'}
                </StyledButton>
            </DialogActions>
        </Dialog>
    );
}