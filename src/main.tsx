import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/700.css";
/**
 * Main application entry point.
 * Bootstraps the React application by mounting the root App component
 * to the DOM inside React.StrictMode for catching potential bugs during development.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

