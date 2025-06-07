import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import {
    Box,
    Fab,
    Paper,
    Typography,
    IconButton,
    Badge,
    Divider,
    Avatar,
    Chip,
    Zoom,
    Fade,
    Button,
    Card,
    Grid
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import ChatMessage from './ChatMessage';
import { getResponse, getChatCategories } from '@/services/chatbotService';

// Mapeo de iconos para cada categoría
const categoryIcons = {
    "Pedidos y envíos": <LocalShippingIcon />,
    "Devoluciones y cambios": <AssignmentReturnIcon />,
    "Pagos": <PaymentIcon />,
    "Mi cuenta": <PersonIcon />
};

const ChatbotComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: '¡Hola! Soy el asistente virtual de Vistelica. ¿Cómo puedo ayudarte hoy?', isBot: true }
    ]);
    const [unreadCount, setUnreadCount] = useState(1);
    const [categories, setCategories] = useState({});
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [animateCategory, setAnimateCategory] = useState(false);

    // Obtener categorías de preguntas al iniciar el componente
    useEffect(() => {
        const fetchCategories = async () => {
            const fetchedCategories = await getChatCategories();
            setCategories(fetchedCategories);
        };
        fetchCategories();
    }, []);

    // Auto-scroll al último mensaje
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Resetear contador de mensajes no leídos al abrir el chat
    useEffect(() => {
        if (isOpen) {
            setUnreadCount(0);
        }
    }, [isOpen]);

    const handleToggleChat = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const handleCategorySelect = (category) => {
        setAnimateCategory(true);
        setTimeout(() => {
            setSelectedCategory(category);
            setAnimateCategory(false);
        }, 300);
    };

    const handleSendMessage = useCallback(async (text) => {
        if (!text.trim()) return;

        // Agregar mensaje del usuario
        const userMessage = {
            id: Date.now(),
            text: text,
            isBot: false
        };
        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        // Mostrar indicador de "escribiendo..."
        const typingIndicator = {
            id: 'typing',
            text: 'Escribiendo...',
            isBot: true,
            isTyping: true
        };
        setMessages(prev => [...prev, typingIndicator]);

        // Obtener respuesta (con pequeño delay para mejor UX)
        setTimeout(async () => {
            try {
                const response = await getResponse(text);

                // Eliminar el indicador de escribiendo
                setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
                setIsTyping(false);

                // Agregar respuesta del bot
                const botMessage = {
                    id: Date.now() + 1,
                    text: response,
                    isBot: true
                };
                setMessages(prev => [...prev, botMessage]);
                
                // Recordatorio de que puede seguir explorando opciones
                const reminderMessage = {
                    id: Date.now() + 2,
                    text: "¿Hay algo más en lo que pueda ayudarte?",
                    isBot: true
                };
                setMessages(prev => [...prev, reminderMessage]);
                
                // Volver a mostrar las categorías con animación
                setAnimateCategory(true);
                setTimeout(() => {
                    setSelectedCategory(null);
                    setAnimateCategory(false);
                }, 300);
                
            } catch (error) {
                console.error('Error getting chatbot response:', error);
                setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
                setIsTyping(false);

                // Mensaje de error
                const errorMessage = {
                    id: Date.now() + 1,
                    text: 'Lo siento, ha ocurrido un error. Por favor, intenta seleccionando otra opción.',
                    isBot: true
                };
                setMessages(prev => [...prev, errorMessage]);
            }
        }, 600);
    }, []);

    return (
        <Box sx={{ 
            position: 'fixed', 
            bottom: { xs: 80, md: 100 }, 
            right: { xs: 10, md: 20 }, 
            zIndex: 1200,
            transition: 'all 0.3s ease-in-out'
        }}>
            <Fade in={isOpen}>
                <Paper
                    elevation={6}
                    sx={{
                        position: 'absolute',
                        bottom: 70,
                        right: 0,
                        width: { xs: '90vw', sm: 350, md: 380 },
                        maxWidth: { xs: 350, sm: 'none' },
                        height: { xs: 450, md: 500 },
                        borderRadius: '16px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        animation: 'fadeIn 0.3s ease-in-out',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                        '@keyframes fadeIn': {
                            from: { opacity: 0, transform: 'translateY(20px)' },
                            to: { opacity: 1, transform: 'translateY(0)' }
                        }
                    }}
                >
                    {/* Header */}
                    <Box sx={{
                        bgcolor: vistelicaColors.primary,
                        p: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: '#fff' }}>
                                <ChatIcon sx={{ color: vistelicaColors.primary }} />
                            </Avatar>
                            <Typography variant="h6" sx={{ color: '#fff', ml: 1.5, fontWeight: 500 }}>
                                Asistente Vistelica
                            </Typography>
                        </Box>
                        <IconButton 
                            onClick={handleToggleChat} 
                            sx={{ 
                                color: '#fff',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.1)'
                                }
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Messages Area */}
                    <Box sx={{
                        flexGrow: 1,
                        p: 2,
                        overflowY: 'auto',
                        bgcolor: '#f7f7f9',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {messages.map(message => (
                            <ChatMessage key={message.id} message={message} />
                        ))}
                        <div ref={messagesEndRef} />
                    </Box>

                    <Divider />

                    {/* Options Area - Con animación de fade */}
                    <Box 
                        sx={{
                            p: 1.5,
                            bgcolor: '#fff',
                            minHeight: '140px',
                            maxHeight: '180px',
                            overflowY: 'auto',
                            transition: 'opacity 0.3s ease-in-out',
                            opacity: animateCategory ? 0 : 1
                        }}
                    >
                        {!selectedCategory && Object.keys(categories).length > 0 && (
                            <Box>
                                <Typography 
                                    variant="subtitle2" 
                                    sx={{
                                        color: 'text.secondary',
                                        mb: 1.5,
                                        textAlign: 'center',
                                        fontWeight: 500
                                    }}
                                >
                                    ¿En qué puedo ayudarte?
                                </Typography>

                                <Grid container spacing={2} justifyContent="center">
                                    {Object.keys(categories).map((category) => (
                                        <Grid item xs={6} sm={6} md={6} lg={6} key={category} sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <Card
                                                onClick={() => handleCategorySelect(category)}
                                                sx={{
                                                    p: 1.5,
                                                    height: 130, // Altura fija para todas las tarjetas
                                                    width: 150,  // Ancho fijo para todas las tarjetas
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease-in-out',
                                                    borderRadius: '12px',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                                    border: '1px solid #f0f0f0',
                                                    m: 1,
                                                    '&:hover': {
                                                        transform: 'translateY(-3px)',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                        borderColor: vistelicaColors.primary
                                                    }
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        bgcolor: `${vistelicaColors.primary}20`,
                                                        color: vistelicaColors.primary,
                                                        mb: 1,
                                                        width: 36,
                                                        height: 36,
                                                        '& .MuiSvgIcon-root': {
                                                            fontSize: '1.2rem'
                                                        }
                                                    }}
                                                >
                                                    {categoryIcons[category]}
                                                </Avatar>
                                                <Typography 
                                                    variant="body2"
                                                    align="center"
                                                    sx={{
                                                        fontWeight: 500,
                                                        color: 'text.primary',
                                                        lineHeight: 1.2,
                                                        fontSize: '0.825rem',
                                                        wordBreak: 'break-word',
                                                        textAlign: 'center',
                                                        mt: 0.5
                                                    }}
                                                >
                                                    {category}
                                                </Typography>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}

                        {selectedCategory && (
                            <Box>
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    mb: 1.5,
                                    pb: 1,
                                    borderBottom: '1px solid #f0f0f0'
                                }}>
                                    <Button 
                                        size="small" 
                                        onClick={() => {
                                            setAnimateCategory(true);
                                            setTimeout(() => {
                                                setSelectedCategory(null);
                                                setAnimateCategory(false);
                                            }, 300);
                                        }}
                                        startIcon={<ArrowBackIcon />}
                                        sx={{
                                            minWidth: 'auto',
                                            p: 0.5,
                                            mr: 1,
                                            color: vistelicaColors.primary,
                                            '&:hover': {
                                                bgcolor: 'transparent',
                                                opacity: 0.8
                                            }
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            Volver
                                        </Typography>
                                    </Button>
                                    
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                    }}>
                                        <Avatar
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                mr: 1,
                                                bgcolor: `${vistelicaColors.primary}20`,
                                                color: vistelicaColors.primary
                                            }}
                                        >
                                            {categoryIcons[selectedCategory]}
                                        </Avatar>
                                        <Typography 
                                            variant="subtitle2" 
                                            sx={{ 
                                                fontWeight: 500,
                                                color: 'text.primary'
                                            }}
                                        >
                                            {selectedCategory}
                                        </Typography>
                                    </Box>
                                </Box>
                                
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    gap: 1
                                }}>
                                    {categories[selectedCategory] && 
                                    categories[selectedCategory].map((question, idx) => (
                                        <Zoom key={idx} in={true} style={{ transitionDelay: `${idx * 50}ms` }}>
                                            <Button 
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleSendMessage(question)}
                                                sx={{ 
                                                    justifyContent: 'flex-start',
                                                    textTransform: 'none',
                                                    borderRadius: '8px',
                                                    py: 1,
                                                    px: 1.5,
                                                    borderColor: '#e0e0e0',
                                                    bgcolor: '#fafafa',
                                                    color: 'text.primary',
                                                    fontWeight: 400,
                                                    lineHeight: 1.3,
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        borderColor: vistelicaColors.primary,
                                                        bgcolor: `${vistelicaColors.primary}10`,
                                                        transform: 'translateX(3px)'
                                                    }
                                                }}
                                            >
                                                {question}
                                            </Button>
                                        </Zoom>
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Fade>

            <Zoom in={true}>
                <Badge 
                    badgeContent={unreadCount} 
                    color="error" 
                    sx={{
                        '& .MuiBadge-badge': {
                            right: 3,
                            top: 3
                        }
                    }}
                >
                    <Fab
                        aria-label="chatbot"
                        color="primary"
                        onClick={handleToggleChat}
                        sx={{
                            bgcolor: isOpen ? '#f5f5f5' : vistelicaColors.primary,
                            color: isOpen ? vistelicaColors.primary : '#fff',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                bgcolor: isOpen ? '#e0e0e0' : vistelicaColors.secondary,
                                transform: 'scale(1.05)'
                            },
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            zIndex: 1200,
                        }}
                    >
                        <ChatIcon />
                    </Fab>
                </Badge>
            </Zoom>
        </Box>
    );
};

export default memo(ChatbotComponent);