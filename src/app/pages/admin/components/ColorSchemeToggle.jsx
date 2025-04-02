import * as React from 'react';
import { useColorScheme } from '@mui/joy/styles';
import IconButton from '@mui/joy/IconButton';

import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';

export default function ColorSchemeToggle() {
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <IconButton
                size="sm"
                variant="outlined"
                color="neutral"
                sx={{
                    '&:first-of-type': {  // Cambiado de :first-child a :first-of-type
                        display: 'none',
                        '@media (min-width: 900px)': {
                            display: 'inline-flex',
                        },
                    },
                }}
            />
        );
    }

    return (
        <IconButton
            id="toggle-mode"
            size="sm"
            variant="outlined"
            color="neutral"
            onClick={() => {
                setMode(mode === 'light' ? 'dark' : 'light');
            }}
        >
            {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
        </IconButton>
    );
}