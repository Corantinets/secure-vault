import { useEffect, useState } from 'react';
import { generateKey, encryptSecret, decryptSecret } from './crypto';
import './App.css';

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
        const res = await fetch(`http://localhost:5000/api/secrets/${secretId}`);
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
      const response = await fetch('http://localhost:5000/api/secrets', {
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

  if (mode === 'view') {
    return (
      <div className="container">
        <h1>SecureVault 🔒</h1>
        <p>Lecture d'un secret sécurisé.</p>

        {loading && <p>Chargement...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && secret && (
          <div className="card">
            <p>Voici le secret (il a été détruit côté serveur après cette lecture) :</p>
            <pre className="secret-box">{secret}</pre>
          </div>
        )}
      </div>
    );
  }

  //Création
  return (
    <div className="container">
      <h1>SecureVault 🔒</h1>
      <p>Partagez des secrets qui s'autodétruisent.</p>

      {error && <p className="error">{error}</p>}

      {!link ? (
        <div className="card">
          <textarea
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Écrivez votre secret ici..."
            rows={4}
          />
          <button onClick={handleCreate} disabled={loading}>
            {loading ? 'Chiffrement...' : 'Sécuriser & Générer le lien'}
          </button>
        </div>
      ) : (
        <div className="result">
          <p>Voici votre lien sécurisé (Copiez-le vite !) :</p>
          <div className="link-box">
            <input type="text" readOnly value={link} />
            <button onClick={() => navigator.clipboard.writeText(link)}>Copier</button>
          </div>
          <button onClick={() => { setLink(''); setSecret(''); }} className="reset">
            Nouveau secret
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
