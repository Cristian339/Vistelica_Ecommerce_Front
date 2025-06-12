"use client";
import * as React from 'react';
import { memo, useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Button from '@mui/material/Button';
import { styled, keyframes, useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { useRouter } from 'next/navigation';
import Fade from '@mui/material/Fade';
import { vistelicaColors } from '../shared-theme/vistelicaColors';
import { typography } from '../shared-theme/themePrimitives';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import EmailIcon from '@mui/icons-material/Email';
import SubjectIcon from '@mui/icons-material/Subject';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

// Animaciones
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

const pulseAnimation = keyframes`
    0% {
        box-shadow: 0 0 0 0 rgba(228, 176, 2, 0.4);
    }
    70% {
        box-shadow: 0 0 0 10px rgba(228, 176, 2, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(228, 176, 2, 0);
    }
`;

// Componentes estilizados
const AnimatedTitle = styled(Typography)(({ theme }) => ({
    fontFamily: typography.h1.fontFamily,
    fontWeight: 700,
    fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
    background: `linear-gradient(90deg, ${vistelicaColors.primary}, ${vistelicaColors.quaternary}, ${vistelicaColors.tertiary}, ${vistelicaColors.quaternary}, ${vistelicaColors.primary})`,
    backgroundSize: '200% auto',
    color: 'transparent',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    animation: `${fadeIn} 1s ease-out, ${shimmer} 3s infinite linear`,
    marginBottom: theme.spacing(1),
    letterSpacing: '0.05em',
    position: 'relative',
    display: 'inline-block',
    textAlign: 'center',
    width: 'auto',
    textShadow: '0 2px 4px rgba(35, 42, 46, 0.1)',
}));

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(2),
    gap: theme.spacing(1.5),
    margin: 'auto',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
        width: '800px',
        padding: theme.spacing(4),
        gap: theme.spacing(2),
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '5px',
        background: `linear-gradient(90deg, ${vistelicaColors.primary}, ${vistelicaColors.quaternary})`,
    },
    ...theme.applyStyles('dark', {
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    }),
}));

const Container = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(2),
    },
    [theme.breakpoints.up('md')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(ellipse at 50% 50%, hsl(210, 15%, 10%), hsl(0, 0%, 0%))',
        }),
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: vistelicaColors.primary,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: vistelicaColors.primary,
        },
    },
    '& .MuiInputLabel-root': {
        '&.Mui-focused': {
            color: vistelicaColors.primary,
        },
    },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: vistelicaColors.primary,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: vistelicaColors.primary,
        },
    },
    '& .MuiInputLabel-root': {
        '&.Mui-focused': {
            color: vistelicaColors.primary,
        },
    },
}));

const FileInputLabel = styled('label')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    border: `1px dashed ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.23)'}`,
    cursor: 'pointer',
    transition: 'background-color 0.3s, border-color 0.3s',
    color: theme.palette.text.secondary,
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
        borderColor: vistelicaColors.primary,
    },
    '&:focus-within': {
        borderColor: vistelicaColors.primary,
        boxShadow: `0 0 0 2px ${vistelicaColors.primary}40`,
    },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(1.5),
    fontWeight: 600,
    backgroundColor: vistelicaColors.primary,
    transition: 'transform 0.3s, box-shadow 0.3s',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    '&:hover': {
        backgroundColor: vistelicaColors.primaryDark,
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    },
    '&:active': {
        transform: 'translateY(0)',
    },
    '&.Mui-disabled': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(228, 176, 2, 0.3)' : 'rgba(228, 176, 2, 0.5)',
        color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
    },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
    width: 60,
    height: 60,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
    background: `linear-gradient(135deg, ${vistelicaColors.primary}, ${vistelicaColors.quaternary})`,
    color: '#fff',
    boxShadow: '0 4px 12px rgba(228, 176, 2, 0.25)',
    animation: `${pulseAnimation} 2s infinite`,
}));

const FilePreview = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.5, 0),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
    maxWidth: '100%',
    overflow: 'hidden',
}));

// Componente principal
const Contact = memo(function Contact(props) {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Estados para el formulario
    const [formData, setFormData] = useState({
        email: '',
        subject: '',
        topic: '',
        description: '',
        attachments: []
    });

    // Estados para validación de formularios
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error'
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [agreePolicies, setAgreePolicies] = useState(false);

    const topics = [
        'General Inquiry',
        'Product Information',
        'Order Status',
        'Returns & Exchanges',
        'Payment Issues',
        'Website Issues',
        'Feedback & Suggestions',
        'Partnerships & Collaboration',
        'Employment',
        'Other'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Limpiar error al editar
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const maxSize = 5 * 1024 * 1024; // 5MB

        let fileErrors = '';
        const validFiles = files.filter(file => {
            if (file.size > maxSize) {
                fileErrors = `File ${file.name} is too large. Maximum size is 5MB.`;
                return false;
            }
            return true;
        });

        if (fileErrors) {
            setErrors(prev => ({ ...prev, attachments: fileErrors }));
        } else {
            setErrors(prev => ({ ...prev, attachments: '' }));
        }

        setFormData(prev => ({
            ...prev,
            attachments: [...validFiles]
        }));
    };

    const handleRemoveFile = (index) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Validación de email
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid';
        }

        // Validación de otros campos
        if (!formData.subject) newErrors.subject = 'Subject is required';
        if (!formData.topic) newErrors.topic = 'Please select a topic';
        if (!formData.description) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length < 10) {
            newErrors.description = 'Description is too short (minimum 10 characters)';
        }

        if (!agreePolicies) {
            newErrors.agreePolicies = 'You must agree to our policies';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        // Simular envío de formulario
        // En una aplicación real, aquí se enviaría el formulario a través de una API
        try {
            // Simulación de envío exitoso
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Éxito
            setSubmissionStatus('success');
            setOpenSnackbar(true);

            // Resetear el formulario
            setFormData({
                email: '',
                subject: '',
                topic: '',
                description: '',
                attachments: []
            });
            setAgreePolicies(false);
        } catch (error) {
            // Error
            setSubmissionStatus('error');
            setOpenSnackbar(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <ColorModeSelect
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 1,
                }}
                aria-label="Change color theme"
            />
            <Container
                direction="column"
                justifyContent="space-between"
                component="main"
                role="main"
                aria-labelledby="contact-title"
            >
                <Fade in={true} timeout={800}>
                    <Card variant="outlined" component="form" onSubmit={handleSubmit} noValidate>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 1, sm: 2 } }}>
                            <AnimatedTitle variant="h1" id="contact-title">Contact Us</AnimatedTitle>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: { xs: 2, sm: 3 } }}>
                            <IconWrapper>
                                <ContactMailIcon fontSize="large" />
                            </IconWrapper>

                            <Typography
                                variant="subtitle1"
                                sx={{
                                    textAlign: 'center',
                                    color: theme.palette.text.secondary,
                                    maxWidth: '80%',
                                    mb: 1
                                }}
                            >
                                Send us a message and we will get back to you as soon as possible.
                            </Typography>

                            <Typography variant="caption" sx={{ color: vistelicaColors.primary }}>
                                Fields marked with an asterisk (*) are required
                            </Typography>
                        </Box>

                        <Stack spacing={3}>
                            <StyledTextField
                                required
                                fullWidth
                                id="email"
                                name="email"
                                label="Email Address"
                                variant="outlined"
                                value={formData.email}
                                onChange={handleInputChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon color={errors.email ? "error" : "action"} />
                                        </InputAdornment>
                                    ),
                                }}
                                inputProps={{
                                    'aria-label': 'Email Address',
                                    'aria-required': 'true',
                                    'aria-invalid': !!errors.email,
                                    'aria-errormessage': errors.email ? `email-error` : undefined
                                }}
                            />

                            <StyledTextField
                                required
                                fullWidth
                                id="subject"
                                name="subject"
                                label="Subject"
                                variant="outlined"
                                value={formData.subject}
                                onChange={handleInputChange}
                                error={!!errors.subject}
                                helperText={errors.subject}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SubjectIcon color={errors.subject ? "error" : "action"} />
                                        </InputAdornment>
                                    ),
                                }}
                                inputProps={{
                                    'aria-label': 'Subject',
                                    'aria-required': 'true',
                                    'aria-invalid': !!errors.subject,
                                    'aria-errormessage': errors.subject ? `subject-error` : undefined
                                }}
                            />

                            <StyledFormControl
                                required
                                fullWidth
                                error={!!errors.topic}
                            >
                                <InputLabel id="topic-select-label">Select Topic</InputLabel>
                                <Select
                                    labelId="topic-select-label"
                                    id="topic"
                                    name="topic"
                                    value={formData.topic}
                                    label="Select Topic"
                                    onChange={handleInputChange}
                                    inputProps={{
                                        'aria-label': 'Select Topic',
                                        'aria-required': 'true',
                                        'aria-invalid': !!errors.topic,
                                        'aria-errormessage': errors.topic ? `topic-error` : undefined
                                    }}
                                >
                                    {topics.map((topic) => (
                                        <MenuItem key={topic} value={topic}>
                                            {topic}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.topic && <FormHelperText>{errors.topic}</FormHelperText>}
                            </StyledFormControl>

                            <StyledTextField
                                required
                                fullWidth
                                id="description"
                                name="description"
                                label="Description"
                                multiline
                                rows={4}
                                variant="outlined"
                                value={formData.description}
                                onChange={handleInputChange}
                                error={!!errors.description}
                                helperText={errors.description || "Enter the details of your request. Our support staff will respond shortly."}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                                            <DescriptionIcon color={errors.description ? "error" : "action"} />
                                        </InputAdornment>
                                    ),
                                }}
                                inputProps={{
                                    'aria-label': 'Description',
                                    'aria-required': 'true',
                                    'aria-invalid': !!errors.description,
                                    'aria-errormessage': errors.description ? `description-error` : undefined
                                }}
                            />

                            <Box>
                                <Typography variant="subtitle2" gutterBottom sx={{ ml: 1 }}>
                                    Attachments
                                </Typography>

                                <FileInputLabel htmlFor="file-input" tabIndex="0">
                                    <AttachFileIcon sx={{ mr: 1 }} />
                                    {formData.attachments.length === 0
                                        ? "Add files (5MB max per file)"
                                        : `${formData.attachments.length} file(s) selected`}
                                    <input
                                        type="file"
                                        id="file-input"
                                        name="attachments"
                                        multiple
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                        aria-label="Upload attachments"
                                    />
                                </FileInputLabel>

                                {errors.attachments && (
                                    <FormHelperText error>{errors.attachments}</FormHelperText>
                                )}

                                {formData.attachments.length > 0 && (
                                    <Box sx={{ mt: 1 }}>
                                        {formData.attachments.map((file, index) => (
                                            <FilePreview key={index}>
                                                <Typography variant="body2" sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleRemoveFile(index)}
                                                    aria-label={`Remove ${file.name}`}
                                                >
                                                    ✕
                                                </IconButton>
                                            </FilePreview>
                                        ))}
                                    </Box>
                                )}
                            </Box>

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={agreePolicies}
                                        onChange={(e) => setAgreePolicies(e.target.checked)}
                                        sx={{
                                            color: vistelicaColors.primary,
                                            '&.Mui-checked': {
                                                color: vistelicaColors.primary,
                                            },
                                        }}
                                    />
                                }
                                label={
                                    <Typography variant="body2">
                                        I agree to the processing of my personal data according to the privacy policy
                                    </Typography>
                                }
                                sx={{
                                    alignItems: 'flex-start',
                                    '& .MuiFormControlLabel-label': {
                                        mt: 0.25
                                    }
                                }}
                            />

                            {errors.agreePolicies && (
                                <FormHelperText error>{errors.agreePolicies}</FormHelperText>
                            )}

                            <SubmitButton
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={isSubmitting}
                                aria-label="Submit form"
                                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </SubmitButton>
                        </Stack>
                    </Card>
                </Fade>

                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={submissionStatus === 'success' ? 'success' : 'error'}
                        sx={{ width: '100%', alignItems: 'center' }}
                        icon={submissionStatus === 'success' ? <CheckCircleIcon /> : undefined}
                    >
                        {submissionStatus === 'success'
                            ? 'Your message has been sent successfully! We will contact you soon.'
                            : 'There was an error sending your message. Please try again.'}
                    </Alert>
                </Snackbar>
            </Container>
        </AppTheme>
    );
});

Contact.displayName = 'Contact';

export default Contact;