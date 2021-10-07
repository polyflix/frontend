import { PropsWithChildren, useMemo } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import {
  createTheme,
  ThemeOptions,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";

export const ThemeConfig = ({ children }: PropsWithChildren<{}>) => {
  const themeOptions = useMemo<ThemeOptions>(() => ({}), []);

  const theme = createTheme(themeOptions);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
