import * as React from 'react';
import IconButton from '@mui/joy/IconButton';

export default function ColorSchemeToggle() {
    return (
        <IconButton
            size="sm"
            variant="outlined"
            color="neutral"
            sx={{
                '&:first-of-type': {
                    display: 'none',
                    '@media (min-width: 900px)': {
                        display: 'none',
                    },
                },
            }}
            disabled
        />
    );
}