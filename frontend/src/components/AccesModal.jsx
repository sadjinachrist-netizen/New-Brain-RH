import { useState } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';
import './OffreFormModal.css';

export default function AccesModal({ employeId, email, onClose, onSaved }) {
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErreur('');
    setEnvoi(true);
    try {
      await api.patch(`/employes/${employeId}/acces`, { password });
      onSaved();
    } catch (err) {
      setErreur(err.response?.data?.errors?.password?.[0] || "Erreur lors de l'activation.");
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Accès de l'employé</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        {erreur && <div className="modal-erreur">{erreur}</div>}
        <form onSubmit={submit}>
          <label>Identifiant (email)</label>
          <input value={email || ''} disabled />
          <label>Mot de passe</label>
          <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required autoFocus />
          <p style={{ fontSize: 13, color: '#6B7280', marginTop: 8 }}>
            Communique ces identifiants à l'employé : il pourra se connecter et accéder à son espace personnel.
          </p>
          <div className="modal-actions">
            <button type="button" className="btn-annuler" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-publier" disabled={envoi}>{envoi ? 'Activation…' : "Activer l'accès"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}