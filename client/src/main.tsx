import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for PWA with enhanced error handling
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered successfully:', registration.scope);

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          console.log('New service worker available');
        });
      })
      .catch((registrationError) => {
        // Only log in development, don't spam console
        if (process.env.NODE_ENV === 'development') {
          console.log('SW registration skipped in development');
        }
      });
  });
}