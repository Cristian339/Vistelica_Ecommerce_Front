"use client";
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const EmptyWishlist = () => {
    const router = useRouter();

    return (
        <>
            <Navbar />
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="70vh"
                textAlign="center"
                p={4}
            >
                <FavoriteBorderIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                    Tu lista de deseos está vacía
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Guarda tus productos favoritos aquí para no perderlos de vista
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push('/products')}
                    sx={{ mt: 2 }}
                >
                    Explorar productos
                </Button>
            </Box>
        </>
    );
};

export default EmptyWishlist;