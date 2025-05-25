"use client";

import React, { useState } from 'react';
import {
    Box, Typography, IconButton, Tooltip, Dialog,
    DialogTitle, DialogContent, Fade, Grow
} from '@mui/material';
import { motion } from "framer-motion";
import {
    Share as ShareIcon,
    Facebook, Twitter, Pinterest,
    WhatsApp, LinkedIn, ContentCopy, Close
} from '@mui/icons-material';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

const SocialShareButton = ({ icon, label, color, onClick }) => (
    <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
    >
        <Tooltip title={label}>
            <IconButton
                onClick={onClick}
                sx={{
                    bgcolor: `${color}15`,
                    color: color,
                    width: 48,
                    height: 48,
                    m: 0.5,
                    '&:hover': {
                        bgcolor: `${color}30`,
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

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = product?.product_name || 'Producto increíble en Vistelica';
    const shareImage = product?.images_url?.[0] || '';

    const handleShare = (platform) => {
        const urls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
            pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(shareImage)}&description=${encodeURIComponent(shareTitle)}`,
            whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        };

        if (platform === 'copy') {
            navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            return;
        }

        window.open(urls[platform], '_blank', 'width=600,height=400');
    };

    return (
        <>
            <motion.div whileTap={{ scale: 0.95 }}>
                <Tooltip title="Compartir">
                    <IconButton
                        onClick={handleOpen}
                        sx={{
                            color: vistelicaColors.secondary,
                            '&:hover': {
                                color: vistelicaColors.primary
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
                TransitionProps={{ timeout: 500 }}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        overflow: 'hidden'
                    }
                }}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{
                    fontFamily: typography.fontFamily,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: vistelicaColors.primaryLight,
                    color: vistelicaColors.secondary,
                    py: 2
                }}>
                    Compartir este producto
                    <IconButton onClick={handleClose} sx={{ color: vistelicaColors.secondary }}>
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ py: 3 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            mb: 3,
                            textAlign: 'center',
                            fontFamily: typography.fontFamily
                        }}
                    >
                        {copied ?
                            "¡Enlace copiado al portapapeles!" :
                            "Comparte este increíble producto con tus amigos:"}
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        <Grow in={true} timeout={500}>
                            <Box>
                                <SocialShareButton
                                    icon={<Facebook />}
                                    label="Facebook"
                                    color="#4267B2"
                                    onClick={() => handleShare('facebook')}
                                />
                            </Box>
                        </Grow>

                        <Grow in={true} timeout={600}>
                            <Box>
                                <SocialShareButton
                                    icon={<Twitter />}
                                    label="Twitter"
                                    color="#1DA1F2"
                                    onClick={() => handleShare('twitter')}
                                />
                            </Box>
                        </Grow>

                        <Grow in={true} timeout={700}>
                            <Box>
                                <SocialShareButton
                                    icon={<WhatsApp />}
                                    label="WhatsApp"
                                    color="#25D366"
                                    onClick={() => handleShare('whatsapp')}
                                />
                            </Box>
                        </Grow>

                        <Grow in={true} timeout={800}>
                            <Box>
                                <SocialShareButton
                                    icon={<Pinterest />}
                                    label="Pinterest"
                                    color="#E60023"
                                    onClick={() => handleShare('pinterest')}
                                />
                            </Box>
                        </Grow>

                        <Grow in={true} timeout={900}>
                            <Box>
                                <SocialShareButton
                                    icon={<LinkedIn />}
                                    label="LinkedIn"
                                    color="#0A66C2"
                                    onClick={() => handleShare('linkedin')}
                                />
                            </Box>
                        </Grow>

                        <Grow in={true} timeout={1000}>
                            <Box>
                                <SocialShareButton
                                    icon={<ContentCopy />}
                                    label="Copiar enlace"
                                    color={vistelicaColors.secondary}
                                    onClick={() => handleShare('copy')}
                                />
                            </Box>
                        </Grow>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default SocialShare;