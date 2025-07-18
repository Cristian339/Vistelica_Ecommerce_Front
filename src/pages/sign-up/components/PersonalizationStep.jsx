import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import { styled, keyframes } from '@mui/material/styles';
import { useColorScheme } from '@mui/material/styles';
import { vistelicaColors } from '../../../components/shared/vistelicaColors';

// Animaciones para el modal
const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const shimmer = keyframes`
    0% {
        background-position: -200% 0;
    }
    100% {
        background-position: 200% 0;
    }
`;

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

// Texto de enlace estilizado
const LinkText = styled('span')(({ theme }) => ({
    color: vistelicaColors.primary,
    cursor: 'pointer',
    textDecoration: 'underline',
    fontWeight: 500,
    '&:hover': {
        color: vistelicaColors.primaryDark,
        textDecoration: 'none',
    },
    transition: 'color 0.2s ease',
}));

// Modal estilizado
const StyledDialog = styled(Dialog)(({ theme }) => {
    const { mode } = useColorScheme() || { mode: 'light' }; // Default fallback
    return {
        '& .MuiDialog-paper': {
            backgroundColor: mode === 'dark'
                ? vistelicaColors.cardBackground?.dark || '#1a1a1a'
                : vistelicaColors.cardBackground?.light || '#ffffff',
            borderRadius: '16px',
            maxWidth: '800px',
            width: '90vw',
            maxHeight: '80vh',
            position: 'relative',
            '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '5px',
                background: `linear-gradient(90deg, ${vistelicaColors.primary}, ${vistelicaColors.quaternary})`,
            },
        },
    };
});

// Logo animado para el modal
const AnimatedLogo = styled(Typography)(() => ({
    fontWeight: 700,
    fontSize: '1.5rem',
    background: `linear-gradient(90deg, ${vistelicaColors.primary}, ${vistelicaColors.quaternary}, ${vistelicaColors.tertiary}, ${vistelicaColors.quaternary}, ${vistelicaColors.primary})`,
    backgroundSize: '200% auto',
    color: 'transparent',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    animation: `${fadeIn} 1s ease-out, ${shimmer} 3s infinite linear`,
    letterSpacing: '0.05em',
    textAlign: 'center',
    textShadow: '0 2px 4px rgba(35, 42, 46, 0.1)',
}));

// Contenido scrolleable del modal
const ScrollableContent = styled(Box)(({ theme }) => {
    const { mode } = useColorScheme() || { mode: 'light' }; // Default fallback
    return {
        maxHeight: '60vh',
        overflowY: 'auto',
        padding: theme.spacing(1),
        '&::-webkit-scrollbar': {
            width: '6px',
        },
        '&::-webkit-scrollbar-track': {
            background: mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)',
            borderRadius: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
            background: vistelicaColors.primary,
            borderRadius: '6px',
        },
    };
});

// Título de sección con línea lateral
const SectionTitle = styled(Typography)(({ theme }) => {
    const { mode } = useColorScheme() || { mode: 'light' }; // Default fallback
    return {
        position: 'relative',
        paddingLeft: theme.spacing(1.5),
        fontSize: '1.1rem',
        fontWeight: 600,
        color: mode === 'dark' ? vistelicaColors.tertiary : vistelicaColors.secondary,
        marginBottom: theme.spacing(1),
        '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '4px',
            height: '70%',
            background: vistelicaColors.primary,
            borderRadius: '4px',
        },
    };
});

export default function PersonalizationStep({
                                                formData = {},
                                                onChange = () => {},
                                                onBack = () => {},
                                                required = {}
                                            }) {
    const { mode } = useColorScheme() || { mode: 'light' }; // Default fallback
    const [modalOpen, setModalOpen] = React.useState(false);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    // Safely access formData.avatar with fallback
    const avatarValue = formData?.avatar || '';

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                    value={avatarValue}
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

            {/* Texto de términos y condiciones */}
            <Typography
                variant="body2"
                sx={{
                    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                    fontSize: '0.75rem',
                    lineHeight: 1.4,
                    mt: 1,
                    textAlign: 'center'
                }}
            >
                Al hacer clic en completar Registro, aceptas nuestras Condiciones. Obtén más información sobre cómo recogemos, usamos y compartimos tu información en los{' '}
                <LinkText onClick={handleOpenModal}>
                    Términos y Condiciones de Vistélica
                </LinkText>
                , así como el uso que hacemos de las cookies y tecnologías similares en nuestra Política de cookies.
            </Typography>

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

            {/* Modal de Términos y Condiciones */}
            <StyledDialog
                open={modalOpen}
                onClose={handleCloseModal}
                scroll="paper"
                aria-labelledby="terms-dialog-title"
            >
                <DialogTitle id="terms-dialog-title" sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <AnimatedLogo variant="h6">Vistélica</AnimatedLogo>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Términos y Condiciones
                            </Typography>
                        </Box>
                        <IconButton onClick={handleCloseModal} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Typography variant="subtitle2" sx={{
                        color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                        fontStyle: 'italic',
                        mt: 1
                    }}>
                        Última actualización: {new Date().toLocaleDateString()}
                    </Typography>
                </DialogTitle>

                <DialogContent dividers>
                    <ScrollableContent>
                        <SectionTitle variant="h6">
                            1. Aceptación de las Condiciones
                        </SectionTitle>
                        <Typography paragraph sx={{ fontSize: '0.9rem' }}>
                            Al acceder y utilizar el sitio web www.vistelica.com (en adelante, "el Sitio Web"), propiedad de Vistélica, usted acepta estar legalmente obligado por estos Términos y Condiciones de Uso, que constituyen un acuerdo legal entre usted y Vistélica.
                        </Typography>
                        <Typography paragraph sx={{ fontSize: '0.9rem' }}>
                            Si no está de acuerdo con estos términos, no debe utilizar el Sitio Web. Vistélica se reserva el derecho de modificar estos términos en cualquier momento, siendo su responsabilidad revisarlos periódicamente.
                        </Typography>

                        <Divider sx={{ my: 2, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                        <SectionTitle variant="h6">
                            2. Registro y Cuenta de Usuario
                        </SectionTitle>
                        <Typography paragraph sx={{ fontSize: '0.9rem' }}>
                            Para realizar compras en Vistélica, deberá registrarse creando una cuenta de usuario. Usted se compromete a:
                        </Typography>
                        <Box component="ul" sx={{ pl: 2, '& li': { mb: 0.5 } }}>
                            <li>
                                <Typography sx={{ fontSize: '0.9rem' }}>
                                    Proporcionar información veraz, exacta y completa sobre su identidad
                                </Typography>
                            </li>
                            <li>
                                <Typography sx={{ fontSize: '0.9rem' }}>
                                    Mantener y actualizar sus datos de registro para mantenerlos actualizados
                                </Typography>
                            </li>
                            <li>
                                <Typography sx={{ fontSize: '0.9rem' }}>
                                    Ser responsable de la confidencialidad de su contraseña y de todas las actividades que ocurran bajo su cuenta
                                </Typography>
                            </li>
                            <li>
                                <Typography sx={{ fontSize: '0.9rem' }}>
                                    Notificar inmediatamente a Vistélica cualquier uso no autorizado de su cuenta
                                </Typography>
                            </li>
                        </Box>

                        <Divider sx={{ my: 2, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                        <SectionTitle variant="h6">
                            3. Proceso de Compra
                        </SectionTitle>
                        <Typography paragraph sx={{ fontSize: '0.9rem' }}>
                            Al realizar una compra en Vistélica, usted acepta:
                        </Typography>
                        <Box component="ul" sx={{ pl: 2, '& li': { mb: 0.5 } }}>
                            <li>
                                <Typography sx={{ fontSize: '0.9rem' }}>
                                    Que es mayor de 18 años o tiene el consentimiento de sus padres/tutores
                                </Typography>
                            </li>
                            <li>
                                <Typography sx={{ fontSize: '0.9rem' }}>
                                    Que los precios mostrados incluyen IVA pero no incluyen gastos de envío (a menos que se indique lo contrario)
                                </Typography>
                            </li>
                            <li>
                                <Typography sx={{ fontSize: '0.9rem' }}>
                                    Que Vistélica puede rechazar o cancelar pedidos por errores en los precios, disponibilidad de productos o sospecha de fraude
                                </Typography>
                            </li>
                            <li>
                                <Typography sx={{ fontSize: '0.9rem' }}>
                                    Que es responsable de proporcionar una dirección de envío correcta y completa
                                </Typography>
                            </li>
                        </Box>

                        <Divider sx={{ my: 2, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                        <SectionTitle variant="h6">
                            4. Propiedad Intelectual
                        </SectionTitle>
                        <Typography paragraph sx={{ fontSize: '0.9rem' }}>
                            Todo el contenido del Sitio Web (textos, imágenes, logotipos, diseños, software, etc.) es propiedad exclusiva de Vistélica o de sus licenciantes y está protegido por leyes de propiedad intelectual.
                        </Typography>
                        <Typography paragraph sx={{ fontSize: '0.9rem' }}>
                            Queda prohibida cualquier reproducción, distribución, modificación o uso comercial del contenido sin autorización expresa por escrito de Vistélica.
                        </Typography>

                        <Divider sx={{ my: 2, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                        <SectionTitle variant="h6">
                            5. Conducta del Usuario
                        </SectionTitle>
                        <Typography paragraph sx={{ fontSize: '0.9rem' }}>
                            Al utilizar el Sitio Web, usted se compromete a:
                        </Typography>
                        <Box component="ul" sx={{ pl: 2, '& li': { mb: 0.5 } }}>
                            <li>
                                <Typography sx={{ fontSize: '0.9rem' }}>
                                    No realizar actividades ilegales, fraudulentas o que infrinjan derechos de terceros
                                </Typography>
                            </li>
                            <li>
                                <Typography sx={{ fontSize: '0.9rem' }}>
                                    No utilizar el Sitio Web para fines comerciales no autorizados
                                </Typography>
                            </li>
                            <li>
                                <Typography sx={{ fontSize: '0.9rem' }}>
                                    No interferir con la seguridad o el funcionamiento del Sitio Web
                                </Typography>
                            </li>
                            <li>
                                <Typography sx={{ fontSize: '0.9rem' }}>
                                    No publicar comentarios falsos, difamatorios o inapropiados
                                </Typography>
                            </li>
                        </Box>

                        <Divider sx={{ my: 2, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                        <SectionTitle variant="h6">
                            6. Limitación de Responsabilidad
                        </SectionTitle>
                        <Typography paragraph sx={{ fontSize: '0.9rem' }}>
                            Vistélica no será responsable por:
                        </Typography>
                        <Box component="ul" sx={{ pl: 2, '& li': { mb: 0.5 } }}>
                            <li>
                                <Typography sx={{ fontSize: '0.9rem' }}>
                                    Daños indirectos, incidentales o consecuentes resultantes del uso del Sitio Web
                                </Typography>
                            </li>
                            <li>
                                <Typography sx={{ fontSize: '0.9rem' }}>
                                    Errores tipográficos o inexactitudes en la información del producto
                                </Typography>
                            </li>
                            <li>
                                <Typography sx={{ fontSize: '0.9rem' }}>
                                    Retrasos en la entrega causados por factores ajenos a Vistélica
                                </Typography>
                            </li>
                            <li>
                                <Typography sx={{ fontSize: '0.9rem' }}>
                                    Daños a los productos durante el transporte
                                </Typography>
                            </li>
                        </Box>

                        <Divider sx={{ my: 2, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                        <SectionTitle variant="h6">
                            7. Contacto
                        </SectionTitle>
                        <Typography paragraph sx={{ fontSize: '0.9rem' }}>
                            Para cualquier pregunta sobre estas Condiciones de Uso, puede contactarnos en:
                        </Typography>
                        <Typography paragraph sx={{ fontSize: '0.9rem' }}>
                            Email: vistelica.company@gmail.com
                        </Typography>
                    </ScrollableContent>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={handleCloseModal}
                        sx={{
                            backgroundColor: vistelicaColors.primary,
                            color: vistelicaColors.tertiary,
                            '&:hover': {
                                backgroundColor: vistelicaColors.primaryDark,
                            }
                        }}
                        variant="contained"
                    >
                        Entendido
                    </Button>
                </DialogActions>
            </StyledDialog>
        </Box>
    );
}