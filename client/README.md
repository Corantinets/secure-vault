## SecureVault
Partage de secrets one-time avec chiffrement client-side

### Stack
- Frontend: React + Vite + CryptoJS (AES-256)
- Backend: Node.js/Express + Helmet (sécurité)

### Fonctionnalités
- Chiffrement côté client (clé jamais envoyée au serveur)
- Autodestruction après 1ère lecture
- Headers HTTP sécurisés