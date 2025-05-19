"use client";

import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import MuiCard from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CreditCard from '../paymentMethods/CreaditCard';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import SimCardRoundedIcon from '@mui/icons-material/SimCardRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import GoogleIcon from '@mui/icons-material/Google';

const Card = styled(MuiCard)(({ theme, selected }) => ({
    border: '1px solid',
    borderColor: (theme.vars || theme).palette.divider,
    width: '100%',
    '&:hover': {
        background:
            'linear-gradient(to bottom right, hsla(210, 100%, 97%, 0.5) 25%, hsla(210, 100%, 90%, 0.3) 100%)',
        borderColor: 'primary.light',
        boxShadow: '0px 2px 8px hsla(0, 0%, 0%, 0.1)',
        ...theme.applyStyles('dark', {
            background:
                'linear-gradient(to right bottom, hsla(210, 100%, 12%, 0.2) 25%, hsla(210, 100%, 16%, 0.2) 100%)',
            borderColor: 'primary.dark',
            boxShadow: '0px 1px 8px hsla(210, 100%, 25%, 0.5) ',
        }),
    },
    [theme.breakpoints.up('md')]: {
        flexGrow: 1,
        maxWidth: `calc(50% - ${theme.spacing(1)})`,
    },
    ...(selected && {
        borderColor: (theme.vars || theme).palette.primary.light,
        ...theme.applyStyles('dark', {
            borderColor: (theme.vars || theme).palette.primary.dark,
        }),
    }),
}));

const PaymentContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    height: 375,
    padding: theme.spacing(3),
    borderRadius: `calc(${theme.shape.borderRadius}px + 4px)`,
    border: '1px solid ',
    borderColor: (theme.vars || theme).palette.divider,
    background:
        'linear-gradient(to bottom right, hsla(220, 35%, 97%, 0.3) 25%, hsla(220, 20%, 88%, 0.3) 100%)',
    boxShadow: '0px 4px 8px hsla(210, 0%, 0%, 0.05)',
    [theme.breakpoints.up('xs')]: {
        height: 300,
    },
    [theme.breakpoints.up('sm')]: {
        height: 350,
    },
    ...theme.applyStyles('dark', {
        background:
            'linear-gradient(to right bottom, hsla(220, 30%, 6%, 0.2) 25%, hsla(220, 20%, 25%, 0.2) 100%)',
        boxShadow: '0px 4px 8px hsl(220, 35%, 0%)',
    }),
}));

const GooglePayButton = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ddd',
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#f5f5f5',
    },
    ...theme.applyStyles('dark', {
        backgroundColor: '#424242',
        borderColor: '#555',
        '&:hover': {
            backgroundColor: '#333',
        },
    }),
}));

const FormGrid = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
}));

export default function PaymentForm() {
    const [paymentType, setPaymentType] = React.useState('creditCard');
    const [cardNumber, setCardNumber] = React.useState('');
    const [cvv, setCvv] = React.useState('');
    const [expirationDate, setExpirationDate] = React.useState('');

    const handlePaymentTypeChange = (event) => {
        setPaymentType(event.target.value);
    };

    const handleCardNumberChange = (event) => {
        const value = event.target.value.replace(/\D/g, '');
        const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        if (value.length <= 16) {
            setCardNumber(formattedValue);
        }
    };

    const handleCvvChange = (event) => {
        const value = event.target.value.replace(/\D/g, '');
        if (value.length <= 3) {
            setCvv(value);
        }
    };

    const handleExpirationDateChange = (event) => {
        const value = event.target.value.replace(/\D/g, '');
        const formattedValue = value.replace(/(\d{2})(?=\d{2})/, '$1/');
        if (value.length <= 4) {
            setExpirationDate(formattedValue);
        }
    };

    return (
        <Stack spacing={{ xs: 3, sm: 6 }} useFlexGap>
            <FormControl component="fieldset" fullWidth>
                <RadioGroup
                    aria-label="Payment options"
                    name="paymentType"
                    value={paymentType}
                    onChange={handlePaymentTypeChange}
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                    }}
                >
                    <Card selected={paymentType === 'creditCard'}>
                        <CardActionArea
                            onClick={() => setPaymentType('creditCard')}
                            sx={{
                                '.MuiCardActionArea-focusHighlight': {
                                    backgroundColor: 'transparent',
                                },
                                '&:focus-visible': {
                                    backgroundColor: 'action.hover',
                                },
                            }}
                        >
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CreditCardRoundedIcon
                                    fontSize="small"
                                    sx={[
                                        (theme) => ({
                                            color: 'grey.400',
                                            ...theme.applyStyles('dark', {
                                                color: 'grey.600',
                                            }),
                                        }),
                                        paymentType === 'creditCard' && {
                                            color: 'primary.main',
                                        },
                                    ]}
                                />
                                <Typography sx={{ fontWeight: 'medium' }}>Card</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    <Card selected={paymentType === 'bankTransfer'}>
                        <CardActionArea
                            onClick={() => setPaymentType('bankTransfer')}
                            sx={{
                                '.MuiCardActionArea-focusHighlight': {
                                    backgroundColor: 'transparent',
                                },
                                '&:focus-visible': {
                                    backgroundColor: 'action.hover',
                                },
                            }}
                        >
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AccountBalanceRoundedIcon
                                    fontSize="small"
                                    sx={[
                                        (theme) => ({
                                            color: 'grey.400',
                                            ...theme.applyStyles('dark', {
                                                color: 'grey.600',
                                            }),
                                        }),
                                        paymentType === 'bankTransfer' && {
                                            color: 'primary.main',
                                        },
                                    ]}
                                />
                                <Typography sx={{ fontWeight: 'medium' }}>Bank account</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    <Card selected={paymentType === 'googlePay'}>
                        <CardActionArea
                            onClick={() => setPaymentType('googlePay')}
                            sx={{
                                '.MuiCardActionArea-focusHighlight': {
                                    backgroundColor: 'transparent',
                                },
                                '&:focus-visible': {
                                    backgroundColor: 'action.hover',
                                },
                            }}
                        >
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <GoogleIcon
                                    fontSize="small"
                                    sx={[
                                        (theme) => ({
                                            color: 'grey.400',
                                            ...theme.applyStyles('dark', {
                                                color: 'grey.600',
                                            }),
                                        }),
                                        paymentType === 'googlePay' && {
                                            color: '#4285F4',
                                        },
                                    ]}
                                />
                                <Typography sx={{ fontWeight: 'medium' }}>Google Pay</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </RadioGroup>
            </FormControl>
            {paymentType === 'creditCard' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <CreditCard
                        cardNumber={cardNumber}
                        cvv={cvv}
                        expirationDate={expirationDate}
                        onCardNumberChange={handleCardNumberChange}
                        onCvvChange={handleCvvChange}
                        onExpirationDateChange={handleExpirationDateChange}
                    />
                    <FormControlLabel
                        control={<Checkbox name="saveCard" />}
                        label="Remember credit card details for next time"
                    />
                </Box>
            )}
            {paymentType === 'bankTransfer' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Alert severity="warning" icon={<WarningRoundedIcon />}>
                        Your order will be processed once we receive the funds.
                    </Alert>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                        Bank account
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Please transfer the payment to the bank account details shown below.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                            Bank:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            Mastercredit
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                            Account number:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            123456789
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                            Routing number:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            987654321
                        </Typography>
                    </Box>
                </Box>
            )}
            {paymentType === 'googlePay' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="body1" gutterBottom>
                        Pay securely with your Google account.
                    </Typography>
                    <GooglePayButton onClick={() => console.log('Google Pay clicked')}>
                        <img
                            src="https://www.gstatic.com/instantbuy/svg/googlepay_dark.svg"
                            alt="Google Pay"
                            style={{ height: '40px' }}
                        />
                    </GooglePayButton>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        You'll be redirected to Google Pay to complete your purchase.
                    </Typography>
                </Box>
            )}
        </Stack>
    );
}