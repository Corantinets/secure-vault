import { useEffect, useState } from 'react';
import { generateKey, encryptSecret, decryptSecret } from './crypto';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App({ mode = 'create', secretId }) {
  const [secret, setSecret] = useState('');
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode !== 'view' || !secretId) return;

    let cancelled = false;

    const fetchAndDecrypt = async () => {
      const hash = window.location.hash || '';
      const key = hash.replace('#', '');

      if (!key) {
        setError("Clé de déchiffrement manquante dans l'URL.");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/secrets/${secretId}`);
        const data = await res.json();

        if (cancelled) return;

        if (!res.ok) {
          setError(data.error || "Erreur lors de la récupération du secret.");
          return;
        }

        const decrypted = decryptSecret(data.encryptedData, key);

        if (!decrypted) {
          setError("Impossible de déchiffrer le secret (clé invalide ?).");
          return;
        }

        setSecret(decrypted);
      } catch (e) {
        if (!cancelled) {
          setError("Erreur de connexion au serveur.");
        }
      }
    };

    fetchAndDecrypt();

    return () => { cancelled = true; };
  }, [mode, secretId]);

  const handleCreate = async () => {
    if (!secret) return;
    setLoading(true);
    setError('');

    const key = generateKey();
    const encryptedData = encryptSecret(secret, key);

    try {
      const response = await fetch(`${API_URL}/api/secrets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encryptedData }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erreur lors de la création du secret.");
      } else {
        const secureLink = `${window.location.origin}/view/${data.id}#${key}`;
        setLink(secureLink);
      }
    } catch (error) {
      setError("Erreur de connexion au serveur.");
    }

    setLoading(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      alert('✅ Lien copié dans le presse-papier !');
    } catch (err) {
      alert('❌ Erreur lors de la copie');
    }
  };

  if (mode === 'view') {
    return (
      <div className="container">
        <h1>🔒 SecureVault</h1>
        <p className="subtitle">Lecture d'un secret sécurisé</p>

        {loading && (
          <div className="card">
            <div className="loading"></div>
            <span>Déchiffrement en cours...</span>
          </div>
        )}
        
        {error && (
          <div className="card">
            <p className="error">❌ {error}</p>
            <button onClick={() => window.location.href = '/'}>
              Créer un nouveau secret
            </button>
          </div>
        )}

        {!loading && !error && secret && (
          <div className="card">
            <div className="success">
              ✅ Secret déchiffré avec succès !
            </div>
            <div className="warning-badge">
              🔥 Ce secret a été détruit et ne peut plus être consulté
            </div>
            <pre className="secret-box">{secret}</pre>
            <button onClick={() => window.location.href = '/'}>
              Créer un nouveau secret
            </button>
          </div>
        )}
      </div>
    );
  }

  // Mode création
  return (
    <div className="container">
      <h1>🔒 SecureVault</h1>
      <p className="subtitle">Partagez des secrets qui s'autodétruisent après lecture</p>

      {error && <p className="error">❌ {error}</p>}

      {!link ? (
        <div className="card">
          <div className="info">
            ℹ️ Votre secret sera chiffré côté client avec AES-256
          </div>
          <textarea
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Écrivez votre secret ici... (mot de passe, token, code)"
            rows={6}
          />
          <button onClick={handleCreate} disabled={loading || !secret.trim()}>
            {loading ? (
              <>
                <span className="loading"></span>
                Chiffrement en cours...
              </>
            ) : (
              '🔐 Sécuriser & Générer le lien'
            )}
          </button>
          <div className="warning-badge" style={{ marginTop: '1rem' }}>
            ⚠️ Le secret s'autodétruira après la première lecture
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="success">
            ✅ Lien sécurisé créé avec succès !
          </div>
          <div className="link-container">
            <p>📤 Partagez ce lien (une seule utilisation) :</p>
            <div className="secure-link">{link}</div>
            <button onClick={copyToClipboard}>
              📋 Copier le lien
            </button>
          </div>
          <button 
            onClick={() => { setLink(''); setSecret(''); }} 
            className="secondary"
          >
            ➕ Créer un nouveau secret
          </button>
          <div className="warning-badge" style={{ marginTop: '1rem' }}>
            🔥 Ce lien ne fonctionnera qu'une seule fois
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
