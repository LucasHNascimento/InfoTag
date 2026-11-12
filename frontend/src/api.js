// Na hospedagem, interface e API compartilham a mesma origem.
// VITE_API_URL permite usar um backend HTTPS separado, se necessário.
export const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
