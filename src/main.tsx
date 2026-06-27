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

// Register service worker only in production to avoid MIME / dev-server issues
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Service worker registration failed:', err);
    });
  });
}
