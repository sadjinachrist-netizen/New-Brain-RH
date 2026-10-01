import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';
import './OffreFormModal.css';

export default function EmailModal({ offreId, offreTitre, candidat, onClose, onSent }) {
  const [modeles, setModeles] = useState([]);
  const [modeleId, setModeleId] = useState('');
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    api.get('/notifications').then((r) => setModeles(r.data)).catch(() => {});
  }, []);

  const modele = modeles.find((m) => m.id === Number(modeleId));
  const apercu = modele
    ? modele.contenu
        .replaceAll('{nom}', `${candidat.nom} ${candidat.prenom}`)
        .replaceAll('{offre}', offreTitre || '')
    : '';

  const envoyer = async (e) => {
    e.preventDefault();
    setErreur('');
    setEnvoi(true);
    try {
      await api.post(`/offres/${offreId}/candidatures/${candidat.id}/email`, { notification_id: modeleId });
      onSent();
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de l'envoi.");
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Envoyer un message — {candidat.nom} {candidat.prenom}</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        {erreur && <div className="modal-erreur">{erreur}</div>}

        <form onSubmit={envoyer}>
          <label>Destinataire</label>
          <input value={candidat.email} disabled />

          <label>Modèle de message</label>
          <select value={modeleId} onChange={(e) => setModeleId(e.target.value)} required>
            <option value="">— Choisir un modèle —</option>
            {modeles.map((m) => (
              <option key={m.id} value={m.id}>{m.type_notification?.libelle}</option>
            ))}
          </select>

          {modele && (
            <>
              <label>Aperçu du message</label>
              <textarea rows={8} value={apercu} readOnly />
            </>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-annuler" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-publier" disabled={envoi || !modeleId}>
              {envoi ? 'Envoi…' : 'Envoyer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}