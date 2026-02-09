import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import './i18n';
import './index.css';
import { App } from './App';
import { BaseLayout } from './layout/BaseLayout';
import theme from './theme/theme';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <BaseLayout>
          <App />
        </BaseLayout>
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>,
);

