import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import SideBar from "./components/layout/SideBar";
import { ToastContainer } from "react-toastify";
import { createTheme, ThemeProvider } from "@mui/material";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { BrowserRouter, withRouter } from "react-router-dom";
import Browser from "./Router";

import "./App.scss";

// Create rtl cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [rtlPlugin],
});

function RTL(props) {
  return <CacheProvider value={cacheRtl}>{props.children}</CacheProvider>;
}

function App(props) {
  const theme = createTheme({
    palette: {
      type: "light",
      primary: {
        main: "#3A6351",
      },
      secondary: {
        main: "#F2EDD7",
      },
      background: {
        default: "#F2EDD7",
      },
    },
    typography: {
      fontSize: 30,
      fontFamily: "Cairo",
      fontWeightLight: 1000,
      fontWeightBold: 1000,
      fontWeightMedium: 1000,
      htmlFontSize: 20,
      fontWeightRegular: 1000,
    },
  });
  
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <RTL>
          <CssBaseline />
          <SideBar theme={theme} {...props}>
            <Browser {...props} />
          </SideBar>
        </RTL>
        <ToastContainer />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default withRouter(App);
