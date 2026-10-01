import { useState } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';
import './OffreFormModal.css';

export default function NoteFinaleModal({ offreId, candidat, onClose, onSaved }) {
  const [note, setNote] = useState(candidat.pivot?.note_finale ?? '');
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErreur('');
    setEnvoi(true);
    try {
      await api.patch(`/offres/${offreId}/candidatures/${candidat.id}`, { note_finale: note === '' ? null : note });
      onSaved();
    } catch {
      setErreur("Erreur lors de l'enregistrement.");
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Note finale — {candidat.nom} {candidat.prenom}</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        {erreur && <div className="modal-erreur">{erreur}</div>}
        <form onSubmit={submit}>
          <label>Note finale (total des entretiens)</label>
          <input type="number" step="0.5" min="0" value={note} onChange={(e) => setNote(e.target.value)} autoFocus />
          <p style={{ fontSize: 13, color: '#6B7280', marginTop: 8 }}>
            Reporte ici le total des notes attribuées par le jury lors des entretiens.
          </p>
          <div className="modal-actions">
            <button type="button" className="btn-annuler" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-publier" disabled={envoi}>{envoi ? 'Enregistrement…' : 'Enregistrer'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}