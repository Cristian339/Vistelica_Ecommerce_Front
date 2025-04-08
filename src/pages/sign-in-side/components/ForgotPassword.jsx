import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useTheme } from '@mui/material/styles';
import { vistelicaColors } from '../../shared-theme/vistelicaColors';

export default function ForgotPassword({ open, handleClose }) {
    const theme = useTheme();

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            slotProps={{
                paper: {
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        handleClose();
                    },
                    sx: {
                        backgroundImage: 'none',
                        borderRadius: 2,
                        borderLeft: `4px solid ${vistelicaColors.primary}`,
                    },
                },
            }}
        >
            <DialogTitle sx={{
                color: vistelicaColors.primary,
                fontWeight: 600
            }}>
                Restablecer contraseña
            </DialogTitle>
            <DialogContent
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
            >
                <DialogContentText sx={{
                    color: theme.palette.mode === 'dark' ?
                        vistelicaColors.quaternary :
                        vistelicaColors.tertiary,
                }}>
                    Introduce la dirección de correo electrónico de tu cuenta y te enviaremos un enlace para
                    restablecer tu contraseña.
                </DialogContentText>
                <OutlinedInput
                    autoFocus
                    required
                    margin="dense"
                    id="email"
                    name="email"
                    placeholder="Correo electrónico"
                    type="email"
                    fullWidth
                    sx={{
                        '&.Mui-focused': {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: vistelicaColors.primary,
                                borderWidth: '2px'
                            }
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: vistelicaColors.primaryLight
                        }
                    }}
                />
            </DialogContent>
            <DialogActions sx={{ pb: 3, px: 3 }}>
                <Button
                    onClick={handleClose}
                    sx={{
                        color: vistelicaColors.secondary,
                        fontWeight: 500,
                        '&:hover': {
                            backgroundColor: `${vistelicaColors.quaternary}40`
                        }
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    type="submit"
                    sx={{
                        backgroundColor: vistelicaColors.primary,
                        color: theme.palette.mode === 'dark' ?
                            vistelicaColors.secondary :
                            vistelicaColors.tertiary,
                        fontWeight: 600,
                        '&:hover': {
                            backgroundColor: vistelicaColors.primaryDark
                        }
                    }}
                >
                    Continuar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ForgotPassword.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
};