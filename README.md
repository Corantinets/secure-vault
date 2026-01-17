# 🔐 SecureVault

> **Partage sécurisé de secrets avec autodestruction après lecture unique**

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://secure-vault-client-seven.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)

## 🌟 Présentation

**SecureVault** est une application web moderne de partage sécurisé de secrets avec **chiffrement AES-256 côté client** et **autodestruction après lecture unique**. Idéale pour partager des mots de passe, tokens API ou données sensibles de manière sécurisée.

### ✨ Fonctionnalités Clés

- 🔒 **Chiffrement AES-256** côté client (zero-knowledge)
- 🔥 **Autodestruction** après une seule lecture
- 🚀 **Pas de compte requis** - anonyme et instantané
- 🔑 **Clé dans l'URL** (fragment #) jamais transmise au serveur
- ⚡ **Interface moderne** et responsive
- 🛡️ **Headers HTTP sécurisés** (Helmet.js)

## 🎥 Démo

👉 **[Essayez SecureVault en direct](https://secure-vault-client-seven.vercel.app)**

![SecureVault Demo](https://via.placeholder.com/800x450?text=Screenshot+Here)

## 🏗️ Architecture

```
┌─────────────┐         ┌──────────────┐
│   Client    │         │    Server    │
│   (React)   │         │  (Express)   │
│             │         │              │
│  1. Génère  │         │              │
│  clé AES    │         │              │
│             │         │              │
│  2. Chiffre │         │              │
│  secret     │         │              │
│             │  POST   │              │
│  3. Envoie  ├────────►│  4. Stocke   │
│  chiffré    │         │  (mémoire)   │
│             │◄────────┤              │
│  5. Reçoit  │  UUID   │              │
│  ID         │         │              │
│             │         │              │
│  6. Crée    │         │              │
│  lien avec  │         │              │
│  #clé       │         │              │
└─────────────┘         └──────────────┘

Lecture:
┌─────────────┐         ┌──────────────┐
│ Destinaire  │   GET   │    Server    │
│             ├────────►│              │
│  1. Ouvre   │  /id    │  2. Retourne │
│  lien       │◄────────┤  & DÉTRUIT   │
│             │         │              │
│  3. Extrait │         │              │
│  clé du #   │         │              │
│             │         │              │
│  4. Déchiffre         │              │
│  localement │         │              │
└─────────────┘         └──────────────┘
```

## 🚀 Installation & Lancement

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation

```bash
# Cloner le repository
git clone https://github.com/Corantinets/secure-vault.git
cd secure-vault

# Installer les dépendances du client
cd client
npm install

# Installer les dépendances du serveur
cd ../server
npm install
```

### Développement Local

**Terminal 1 - Client:**
```bash
cd client
npm run dev
# Frontend disponible sur http://localhost:5173
```

**Terminal 2 - Serveur:**
```bash
cd server
npm start
# API disponible sur http://localhost:5000
```

### Variables d'Environnement

**Client (.env)**
```env
VITE_API_URL=http://localhost:5000
```

**Serveur (.env)**
```env
PORT=5000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

## 🛠️ Stack Technique

### Frontend
- **React 19** - Framework UI moderne
- **Vite 7** - Build tool ultra-rapide
- **CryptoJS** - Chiffrement AES-256
- **CSS3** - Styling responsive

### Backend
- **Node.js** - Runtime JavaScript
- **Express 5** - Framework web
- **Helmet** - Sécurité HTTP headers
- **CORS** - Gestion des origines
- **UUID** - Génération d'identifiants uniques

### Infrastructure
- **Vercel** - Hébergement client (CDN global)
- **Railway** - Hébergement serveur API

## 🔐 Sécurité

### Principes de Sécurité

- ✅ **Zero-Knowledge**: Le serveur ne voit jamais les données en clair
- ✅ **Chiffrement Client**: AES-256-CBC avec clé générée aléatoirement
- ✅ **Clé jamais transmise**: Fragment d'URL (#) reste dans le navigateur
- ✅ **One-Time Secret**: Destruction immédiate après lecture
- ✅ **Headers sécurisés**: CSP, X-Frame-Options, etc.
- ✅ **CORS restrictif**: Origines autorisées uniquement

### Limitations Connues

⚠️ Ce projet est une **démonstration technique**. Pour un usage en production:
- Implémenter une base de données persistante (PostgreSQL/Redis)
- Ajouter une expiration temporelle (24h max)
- Implémenter du rate limiting
- Ajouter une authentification optionnelle
- Audits de sécurité réguliers

## 📊 API Reference

### `POST /api/secrets`
Crée un nouveau secret chiffré.

**Request:**
```json
{
  "encryptedData": "U2FsdGVkX1+..."
}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### `GET /api/secrets/:id`
Récupère et détruit un secret.

**Response:**
```json
{
  "encryptedData": "U2FsdGVkX1+..."
}
```

## 🎯 Cas d'Usage

- 💼 Partage de credentials temporaires
- 🔑 Transmission de tokens API
- 📧 Codes de vérification one-time
- 🔐 Partage de clés privées
- 📱 Codes 2FA de secours

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Roadmap

- [ ] Tests unitaires et E2E
- [ ] Persistance PostgreSQL
- [ ] Expiration temporelle
- [ ] Protection par mot de passe optionnel
- [ ] Notification email lors de la lecture
- [ ] Support de fichiers chiffrés
- [ ] Mode dark/light
- [ ] Statistiques d'utilisation

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👤 Auteur

**Corantin Louchard**

- Portfolio: [Votre site web]
- GitHub: [@Corantinets](https://github.com/Corantinets)
- LinkedIn: [Votre profil LinkedIn]

## 🙏 Remerciements

- Inspiré par [onetimesecret.com](https://onetimesecret.com/)
- Chiffrement fourni par [CryptoJS](https://cryptojs.gitbook.io/docs/)
- Hébergement par [Vercel](https://vercel.com) et [Railway](https://railway.app)

---

⭐ **Si vous aimez ce projet, n'hésitez pas à lui donner une étoile sur GitHub !**
