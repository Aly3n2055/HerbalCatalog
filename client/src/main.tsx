import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for PWA with enhanced error handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration.scope);

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          console.log('New service worker available');
        });
      })
      .catch((registrationError) => {
        console.error('Service Worker registration failed:', registrationError);

        // Provide more specific error information
        if (registrationError.name === 'SecurityError') {
          console.error('Service Worker registration blocked by security policy');
        } else if (registrationError.name === 'NetworkError') {
          console.error('Service Worker registration failed due to network error');
        }
      });
  });
} else {
  console.warn('Service Workers are not supported in this browser');
}