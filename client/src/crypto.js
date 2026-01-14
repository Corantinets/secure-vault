import CryptoJS from 'crypto-js';

// Génère une clé aléatoire forte pour chaque secret
export const generateKey = () => {
  return CryptoJS.lib.WordArray.random(32).toString(); // 256 bits
};

// Chiffre le texte avant l'envoi au serveur
// Retourne le texte chiffré (ciphertext)
export const encryptSecret = (message, key) => {
  return CryptoJS.AES.encrypt(message, key).toString();
};

// Déchiffre le texte après récupération
export const decryptSecret = (ciphertext, key) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};
