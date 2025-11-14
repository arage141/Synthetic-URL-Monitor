import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: [
      "Barlow",
      "Ubuntu",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "sans-serif",
    ].join(","),
    h1: {
      fontFamily: "Barlow",
      fontWeight: 700,
    },
    h2: {
      fontFamily: "Barlow",
      fontWeight: 700,
    },
    h3: {
      fontFamily: "Barlow",
      fontWeight: 600,
    },
    h4: {
      fontFamily: "Barlow",
      fontWeight: 600,
    },
    h5: {
      fontFamily: "Barlow",
      fontWeight: 500,
    },
    h6: {
      fontFamily: "Barlow",
      fontWeight: 500,
    },
    body1: {
      fontFamily: "Barlow",
      fontWeight: 400,
    },
    body2: {
      fontFamily: "Barlow",
      fontWeight: 400,
    },
    button: {
      fontFamily: "Barlow",
      fontWeight: 500,
      textTransform: "none",
    },
    caption: {
      fontFamily: "Ubuntu",
      fontWeight: 400,
    },
    overline: {
      fontFamily: "Barlow",
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        code: {
          fontFamily: "Ubuntu Mono",
        },
        pre: {
          fontFamily: "Ubuntu Mono",
        },
      },
    },
  },
});

export default theme;
