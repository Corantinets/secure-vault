require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de sécurité
app.use(helmet());

// Configuration CORS - accepte CORS_ORIGIN (Railway) ou CLIENT_URL
const corsOrigins = process.env.CORS_ORIGIN || process.env.CLIENT_URL || '*';
const allowedOrigins = corsOrigins.split(',').map(origin => origin.trim());

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Stockage temporaire en mémoire
const secretsStore = {}; 

// Créer un secret
app.post('/api/secrets', (req, res) => {
  const { encryptedData } = req.body;

  if (!encryptedData) {
    return res.status(400).json({ error: "Aucune donnée fournie" });
  }

  const id = uuidv4();
  secretsStore[id] = { data: encryptedData, createdAt: Date.now() };

  res.json({ id });
});

// Lire un secret (et le détruire)
app.get('/api/secrets/:id', (req, res) => {
  const { id } = req.params;

  if (!secretsStore[id]) {
    return res.status(404).json({ error: "Secret introuvable ou déjà détruit." });
  }

  const secret = secretsStore[id];
  delete secretsStore[id];

  res.json({ encryptedData: secret.data });
});

app.listen(PORT, () => {
  console.log(`Serveur SecureVault API lancé sur http://localhost:${PORT}`);
});
