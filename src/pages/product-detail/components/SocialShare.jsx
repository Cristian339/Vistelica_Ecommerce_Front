"use client";

import React, { useState, useEffect } from 'react';
import {
    Box, Typography, IconButton, Tooltip, Dialog,
    DialogTitle, DialogContent, Fade, Grow,
    useMediaQuery, useTheme, Snackbar, Alert
} from '@mui/material';
import { motion, AnimatePresence } from "framer-motion";
import {
    Share as ShareIcon,
    Facebook, Twitter, Pinterest,
    WhatsApp, LinkedIn, ContentCopy, Close,
    Email, Telegram
} from '@mui/icons-material';
import { vistelicaColors } from '@/components/shared/vistelicaColors';
import { typography } from "@/components/shared/themePrimitives";

const SocialShareButton = ({ icon, label, color, onClick, smallScreen }) => (
    <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
        <Tooltip title={label} arrow placement="top">
            <IconButton
                onClick={onClick}
                aria-label={`Compartir en ${label}`}
                sx={{
                    bgcolor: `${color}15`,
                    color: color,
                    width: smallScreen ? 40 : 48,
                    height: smallScreen ? 40 : 48,
                    m: smallScreen ? 0.3 : 0.5,
                    transition: 'transform 0.2s, background-color 0.3s',
                    '&:hover': {
                        bgcolor: `${color}30`,
                        transform: 'translateY(-3px)',
                        boxShadow: `0 4px 8px ${color}25`
                    },
                    '&:focus': {
                        boxShadow: `0 0 0 2px ${color}50`,
                    }
                }}
            >
                {icon}
            </IconButton>
        </Tooltip>
    </motion.div>
);

const SocialShare = ({ product }) => {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = product?.product_name || 'Producto increíble en Vistelica';
    const shareImage = product?.images_url?.[0] || '';
    const shareDescription = product?.description?.slice(0, 100) || 'Descubre este increíble producto';

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    const handleShare = (platform) => {
        const urls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
            pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(shareImage)}&description=${encodeURIComponent(shareTitle)}`,
            whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            email: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareDescription}\n\nMira este producto: ${shareUrl}`)}`,
            telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`
        };

        if (platform === 'copy') {
            try {
                navigator.clipboard.writeText(shareUrl)
                    .then(() => {
                        setCopied(true);
                        setAlertOpen(true);
                        setTimeout(() => setAlertOpen(false), 2000);
                    })
                    .catch(err => {
                        console.error('Error al copiar con clipboard API: ', err);
                        // Método alternativo por si falla clipboard API
                        const textarea = document.createElement('textarea');
                        textarea.value = shareUrl;
                        textarea.style.position = 'fixed';
                        document.body.appendChild(textarea);
                        textarea.focus();
                        textarea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textarea);
                        setCopied(true);
                        setAlertOpen(true);
                        setTimeout(() => setAlertOpen(false), 2000);
                    });
            } catch (error) {
                console.error('Error al copiar: ', error);
            }
            return;
        }

        // Verificamos si es móvil para ajustar el comportamiento
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobileDevice && (platform === 'whatsapp' || platform === 'telegram')) {
            window.location.href = urls[platform];
        } else {
            window.open(urls[platform], '_blank', 'width=600,height=400,scrollbars=yes');
        }

        handleClose();
    };

    return (
        <>
            <motion.div
                whileTap={{ scale: 0.92 }}
                whileHover={{
                    scale: 1.1,
                    rotate: [0, -10, 10, -5, 0],
                    transition: { duration: 0.5 }
                }}
            >
                <Tooltip title="Compartir" arrow>
                    <IconButton
                        onClick={handleOpen}
                        aria-label="Compartir producto"
                        sx={{
                            color: vistelicaColors.secondary,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                color: vistelicaColors.primary,
                                transform: 'rotate(15deg)'
                            },
                            '&:focus': {
                                boxShadow: `0 0 0 2px ${vistelicaColors.primary}40`,
                            }
                        }}
                    >
                        <ShareIcon />
                    </IconButton>
                </Tooltip>
            </motion.div>

            <Dialog
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 400 }}
                fullScreen={isMobile}
                PaperProps={{
                    sx: {
                        borderRadius: isMobile ? 0 : 3,
                        overflow: 'hidden',
                        backgroundImage: `radial-gradient(circle at top right, ${vistelicaColors.primary}10, transparent 70%)`,
                        maxWidth: isMobile ? '100%' : 'sm',
                        margin: isMobile ? 0 : 2
                    }
                }}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle
                    component={motion.div}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    sx={{
                        fontFamily: typography.fontFamily,
                        fontSize: { xs: '1.1rem', sm: '1.25rem' },
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: `1px solid ${vistelicaColors.primary}30`,
                        bgcolor: vistelicaColors.primaryLight,
                        color: vistelicaColors.secondary,
                        py: 2
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ShareIcon fontSize={isMobile ? 'small' : 'medium'} />
                        Compartir este producto
                    </Box>
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            color: vistelicaColors.secondary,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                color: 'error.main',
                                transform: 'rotate(90deg)'
                            }
                        }}
                        aria-label="Cerrar diálogo"
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent
                    sx={{
                        py: 3,
                        px: { xs: 2, sm: 3 },
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <AnimatePresence>
                        <motion.div
                            key={copied ? 'copied' : 'share'}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    mb: 3,
                                    textAlign: 'center',
                                    fontFamily: typography.fontFamily,
                                    fontWeight: copied ? 600 : 400,
                                    color: copied ? vistelicaColors.primary : 'inherit',
                                    padding: '1rem',
                                    fontSize: { xs: '0.9rem', sm: '1rem' }
                                }}
                            >
                                {copied ?
                                    "¡Enlace copiado al portapapeles!" :
                                    "Comparte este increíble producto con tus amigos:"}
                            </Typography>
                        </motion.div>
                    </AnimatePresence>


                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: { xs: 0.5, sm: 1 }
                    }}>
                        <Grow in={true} timeout={500}>
                            <Box>
                                <SocialShareButton
                                    icon={<Facebook fontSize={isMobile ? 'small' : 'medium'} />}
                                    label="Facebook"
                                    color="#4267B2"
                                    onClick={() => handleShare('facebook')}
                                    smallScreen={isMobile}
                                />
                            </Box>
                        </Grow>

                        <Grow in={true} timeout={550}>
                            <Box>
                                <SocialShareButton
                                    icon={<Twitter fontSize={isMobile ? 'small' : 'medium'} />}
                                    label="Twitter"
                                    color="#1DA1F2"
                                    onClick={() => handleShare('twitter')}
                                    smallScreen={isMobile}
                                />
                            </Box>
                        </Grow>

                        <Grow in={true} timeout={600}>
                            <Box>
                                <SocialShareButton
                                    icon={<WhatsApp fontSize={isMobile ? 'small' : 'medium'} />}
                                    label="WhatsApp"
                                    color="#25D366"
                                    onClick={() => handleShare('whatsapp')}
                                    smallScreen={isMobile}
                                />
                            </Box>
                        </Grow>

                        <Grow in={true} timeout={650}>
                            <Box>
                                <SocialShareButton
                                    icon={<Pinterest fontSize={isMobile ? 'small' : 'medium'} />}
                                    label="Pinterest"
                                    color="#E60023"
                                    onClick={() => handleShare('pinterest')}
                                    smallScreen={isMobile}
                                />
                            </Box>
                        </Grow>

                        <Grow in={true} timeout={700}>
                            <Box>
                                <SocialShareButton
                                    icon={<LinkedIn fontSize={isMobile ? 'small' : 'medium'} />}
                                    label="LinkedIn"
                                    color="#0A66C2"
                                    onClick={() => handleShare('linkedin')}
                                    smallScreen={isMobile}
                                />
                            </Box>
                        </Grow>

                        <Grow in={true} timeout={750}>
                            <Box>
                                <SocialShareButton
                                    icon={<Email fontSize={isMobile ? 'small' : 'medium'} />}
                                    label="Email"
                                    color="#EA4335"
                                    onClick={() => handleShare('email')}
                                    smallScreen={isMobile}
                                />
                            </Box>
                        </Grow>

                        <Grow in={true} timeout={800}>
                            <Box>
                                <SocialShareButton
                                    icon={<Telegram fontSize={isMobile ? 'small' : 'medium'} />}
                                    label="Telegram"
                                    color="#0088cc"
                                    onClick={() => handleShare('telegram')}
                                    smallScreen={isMobile}
                                />
                            </Box>
                        </Grow>

                        <Grow in={true} timeout={850}>
                            <Box>
                                <SocialShareButton
                                    icon={<ContentCopy fontSize={isMobile ? 'small' : 'medium'} />}
                                    label="Copiar enlace"
                                    color={vistelicaColors.secondary}
                                    onClick={() => handleShare('copy')}
                                    smallScreen={isMobile}
                                />
                            </Box>
                        </Grow>
                    </Box>

                    {/* Elementos decorativos */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: -30,
                            right: -30,
                            width: '150px',
                            height: '150px',
                            background: `radial-gradient(circle, ${vistelicaColors.primary}10 10%, transparent 70%)`,
                            opacity: 0.6,
                            zIndex: 0,
                            display: { xs: 'none', sm: 'block' }
                        }}
                    />
                </DialogContent>
            </Dialog>

            <Snackbar
                open={alertOpen}
                autoHideDuration={2000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                onClose={() => setAlertOpen(false)}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    sx={{
                        fontFamily: typography.fontFamily,
                        alignItems: 'center'
                    }}
                >
                    ¡Enlace copiado correctamente!
                </Alert>
            </Snackbar>
        </>
    );
};

export default SocialShare;