import { createTheme, alpha, getContrastRatio } from '@mui/material/styles';

const lightBase = '#F77707';
const lightMain = alpha(lightBase, 0.7);

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: lightMain,
      light: alpha(lightBase, 0.9),
      dark: alpha(lightBase, 0.5),
      contrastText: getContrastRatio(lightMain, '#fff') > 4.5 ? '#fff' : '#111',
    }
  },
  components: {
    MuiListItemText: {
      defaultProps: {
        primaryTypographyProps: {
          fontSize: 22,
          color: 'primary.light',
        },
        secondaryTypographyProps: {
          fontSize: 15,
          color: 'primary.dark',
        },
      },
    },
  },

});

export default theme;
