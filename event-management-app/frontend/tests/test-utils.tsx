/* eslint-disable react-refresh/only-export-components -- test utils: wrapper + re-exports */
import "../src/i18n";
import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../src/theme/theme";

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </ChakraProvider>
  );
};

const customRender = (ui: ReactElement) =>
  render(ui, { wrapper: AllTheProviders });

export * from "@testing-library/react";
export { customRender as render };

