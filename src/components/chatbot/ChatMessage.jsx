import React, { memo } from 'react';
import { Box, Typography, Avatar, CircularProgress, Zoom } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';

const ChatMessage = ({ message }) => {
    const { text, isBot, isTyping } = message;

    return (
        <Zoom in={true} style={{ transitionDelay: '100ms' }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: isBot ? 'flex-start' : 'flex-end',
                    mb: 2,
                    maxWidth: '100%',
                }}
            >
                {isBot && (
                    <Avatar
                        sx={{
                            bgcolor: vistelicaColors.primary,
                            width: 32,
                            height: 32,
                            mr: 1,
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}
                    >
                        <SmartToyIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                )}

                <Box
                    sx={{
                        maxWidth: '75%',
                        p: 1.5,
                        borderRadius: '16px',
                        bgcolor: isBot
                            ? '#fff'
                            : vistelicaColors.primary,
                        color: isBot ? 'text.primary' : '#fff',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        borderTopLeftRadius: isBot ? 0 : '16px',
                        borderTopRightRadius: isBot ? '16px' : 0,
                        wordBreak: 'break-word',
                        transition: 'all 0.3s ease',
                        animation: isBot ? 'slideInLeft 0.3s' : 'slideInRight 0.3s',
                        '@keyframes slideInLeft': {
                            from: { opacity: 0, transform: 'translateX(-20px)' },
                            to: { opacity: 1, transform: 'translateX(0)' }
                        },
                        '@keyframes slideInRight': {
                            from: { opacity: 0, transform: 'translateX(20px)' },
                            to: { opacity: 1, transform: 'translateX(0)' }
                        }
                    }}
                >
                    {isTyping ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5 }}>
                            <CircularProgress size={15} thickness={5} sx={{ color: vistelicaColors.primary }} />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                {text}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography variant="body1" sx={{ lineHeight: 1.5 }}>{text}</Typography>
                    )}
                </Box>

                {!isBot && (
                    <Avatar
                        sx={{
                            bgcolor: vistelicaColors.secondary,
                            width: 32,
                            height: 32,
                            ml: 1,
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}
                    >
                        <PersonIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                )}
            </Box>
        </Zoom>
    );
};

export default memo(ChatMessage);
