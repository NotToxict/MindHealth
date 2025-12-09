// Guard de autenticación para páginas protegidas (status-dashboard, history, etc.)
import { auth, waitForAuthReady } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';

export async function requireAuth(onReady) {
  await waitForAuthReady();
  const unsub = onAuthStateChanged(auth, (user) => {
    unsub();
    if (!user) {
      // Redirige a login con parámetro ?from=<ruta actual>
      const from = encodeURIComponent(location.pathname.replace(/^\//, '') || 'status-dashboard.html');
      window.location.replace(`login.html?from=${from}`);
      return;
    }
    onReady(user);
  });

}