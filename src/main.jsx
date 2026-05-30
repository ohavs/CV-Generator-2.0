import './fonts.css'
import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.jsx'

// --- PWA auto-update -------------------------------------------------------
// registerType is 'autoUpdate', so the virtual module skips waiting and
// reloads the page itself the moment a new service worker activates. Our job
// is just to make sure it *checks* often enough — an installed PWA on a phone
// stays backgrounded and would otherwise rarely look for a new version.
const updateSW = registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return;
    // Periodic check (every 30 min) while the app is open.
    setInterval(() => {
      if (!registration.installing && navigator.onLine) {
        registration.update().catch(() => {});
      }
    }, 30 * 60 * 1000);
    // And check immediately whenever the user returns to the app — the most
    // common moment a phone reopens a backgrounded PWA.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        registration.update().catch(() => {});
      }
    });
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
