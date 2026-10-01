import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';
import './OffreFormModal.css';

export default function ContratFormModal({ employeId, onClose, onCreated }) {
  const [form, setForm] = useState({ type_contrat_id: '', poste_id: '', date_debut: '', date_fin: '', salaire: '' });
  const [types, setTypes] = useState([]);
  const [postes, setPostes] = useState([]);
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    api.get('/type-contrats').then((r) => setTypes(r.data)).catch(() => {});
    api.get('/postes').then((r) => setPostes(r.data)).catch(() => {});
  }, []);

  const maj = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErreur('');
    setEnvoi(true);
    try {
      await api.post(`/employes/${employeId}/contrats`, { ...form, date_fin: form.date_fin || null });
      onCreated();
    } catch (err) {
      const errs = err.response?.data?.errors;
      setErreur(errs ? Object.values(errs)[0][0] : 'Erreur lors de la création.');
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nouveau contrat</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        {erreur && <div className="modal-erreur">{erreur}</div>}
        <form onSubmit={submit}>
          <label>Type de contrat</label>
          <select name="type_contrat_id" value={form.type_contrat_id} onChange={maj} required>
            <option value="">— Choisir —</option>
            {types.map((t) => <option key={t.id} value={t.id}>{t.libelle}</option>)}
          </select>

          <label>Poste</label>
          <select name="poste_id" value={form.poste_id} onChange={maj} required>
            <option value="">— Choisir —</option>
            {postes.map((p) => <option key={p.id} value={p.id}>{p.libelle}</option>)}
          </select>

          <div className="form-row2">
            <div><label>Date de début</label><input type="date" name="date_debut" value={form.date_debut} onChange={maj} required /></div>
            <div><label>Date de fin (optionnel)</label><input type="date" name="date_fin" value={form.date_fin} onChange={maj} /></div>
          </div>

          <label>Salaire mensuel (FCFA)</label>
          <input type="number" name="salaire" value={form.salaire} onChange={maj} required min="0" />

          <div className="modal-actions">
            <button type="button" className="btn-annuler" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-publier" disabled={envoi}>{envoi ? 'Enregistrement…' : 'Créer le contrat'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}