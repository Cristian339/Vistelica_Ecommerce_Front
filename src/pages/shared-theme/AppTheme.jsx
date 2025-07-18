import * as React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { inputsCustomizations } from '../../components/shared/inputs';
import { dataDisplayCustomizations } from '../../components/shared/dataDisplay';
import { feedbackCustomizations } from '../../components/shared/feedback';
import { navigationCustomizations } from '../../components/shared/navigation';
import { surfacesCustomizations } from '../../components/shared/surfaces';
import { colorSchemes, typography, shadows, shape } from '../../components/shared/themePrimitives';
import { vistelicaColors } from '../../components/shared/vistelicaColors';

export default function AppTheme(props) {
    const { children, disableCustomTheme, themeComponents } = props;
    const theme = React.useMemo(() => {
        return disableCustomTheme
            ? {}
            : createTheme({
                // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
                cssVariables: {
                    colorSchemeSelector: 'data-mui-color-scheme',
                    cssVarPrefix: 'template',
                },
                colorSchemes: {
                    ...colorSchemes,
                    light: {
                        ...colorSchemes.light,
                        palette: {
                            ...colorSchemes.light.palette,
                            primary: {
                                main: vistelicaColors.primary,
                                light: vistelicaColors.primaryLight,
                                dark: vistelicaColors.primaryDark,
                                contrastText: vistelicaColors.tertiary,
                            },
                            secondary: {
                                main: vistelicaColors.secondary,
                                contrastText: vistelicaColors.tertiary,
                            },
                            vistelica: {
                                ...vistelicaColors
                            }
                        }
                    },
                    dark: {
                        ...colorSchemes.dark,
                        palette: {
                            ...colorSchemes.dark.palette,
                            primary: {
                                main: vistelicaColors.primary,
                                light: vistelicaColors.primaryLight,
                                dark: vistelicaColors.primaryDark,
                                contrastText: vistelicaColors.tertiary,
                            },
                            secondary: {
                                main: vistelicaColors.secondary,
                                contrastText: vistelicaColors.tertiary,
                            },
                            vistelica: {
                                ...vistelicaColors
                            }
                        }
                    }
                },
                typography,
                shadows,
                shape,
                components: {
                    ...inputsCustomizations,
                    ...dataDisplayCustomizations,
                    ...feedbackCustomizations,
                    ...navigationCustomizations,
                    ...surfacesCustomizations,
                    ...themeComponents,
                },
            });
    }, [disableCustomTheme, themeComponents]);

    if (disableCustomTheme) {
        return <React.Fragment>{children}</React.Fragment>;
    }

    return (
        <ThemeProvider theme={theme} disableTransitionOnChange>
            {children}
        </ThemeProvider>
    );
}

AppTheme.propTypes = {
    children: PropTypes.node.isRequired,
    disableCustomTheme: PropTypes.bool,
    themeComponents: PropTypes.object
};