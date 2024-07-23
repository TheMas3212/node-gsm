import { createTheme, alpha, getContrastRatio } from '@mui/material/styles';

const lightBase = '#F77707';
const lightMain = alpha(lightBase, 0.7);

const theme = createTheme({
  palette: {
    primary: {
      main: lightMain,
      light: alpha(lightBase, 0.5),
      dark: alpha(lightBase, 0.9),
      contrastText: getContrastRatio(lightMain, '#fff') > 4.5 ? '#fff' : '#111',
    },
  },
});

export default theme;
