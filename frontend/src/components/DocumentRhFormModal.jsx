import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';
import './OffreFormModal.css';

export default function DocumentRhFormModal({ employeId, onClose, onCreated }) {
  const [types, setTypes] = useState([]);
  const [typeId, setTypeId] = useState('');
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => { api.get('/type-documents-rh').then((r) => setTypes(r.data)).catch(() => {}); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErreur('');
    setEnvoi(true);
    try {
      await api.post(`/employes/${employeId}/documents-rh`, { type_document_rh_id: typeId });
      onCreated();
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors de la génération.');
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Générer un document RH</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        {erreur && <div className="modal-erreur">{erreur}</div>}
        <form onSubmit={submit}>
          <label>Type de document</label>
          <select value={typeId} onChange={(e) => setTypeId(e.target.value)} required>
            <option value="">— Choisir —</option>
            {types.map((t) => <option key={t.id} value={t.id}>{t.libelle}</option>)}
          </select>
          <p style={{ fontSize: 13, color: '#6B7280', marginTop: 10 }}>
            Le PDF sera généré avec l'en-tête New Brain Factory à partir des infos de l'employé.
          </p>
          <div className="modal-actions">
            <button type="button" className="btn-annuler" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-publier" disabled={envoi}>{envoi ? 'Génération…' : 'Générer le PDF'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}