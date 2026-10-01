import { useState } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';
import './OffreFormModal.css';

export default function EvaluationFormModal({ employeId, onClose, onCreated }) {
  const [form, setForm] = useState({ date_evaluation: '', type: 'Performance', note: '', contenu: '' });
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);

  const maj = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErreur('');
    setEnvoi(true);
    try {
      await api.post(`/employes/${employeId}/evaluations`, { ...form, note: form.note === '' ? null : form.note });
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
          <h2>Nouvelle évaluation</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        {erreur && <div className="modal-erreur">{erreur}</div>}
        <form onSubmit={submit}>
          <div className="form-row2">
            <div><label>Date</label><input type="date" name="date_evaluation" value={form.date_evaluation} onChange={maj} required /></div>
            <div>
              <label>Type</label>
              <select name="type" value={form.type} onChange={maj}>
                <option value="Performance">Performance</option>
                <option value="Avertissement">Avertissement</option>
                <option value="Remarque">Remarque</option>
              </select>
            </div>
          </div>
          <label>Note (optionnel)</label>
          <input type="number" name="note" value={form.note} onChange={maj} min="0" step="0.5" />
          <label>Contenu</label>
          <textarea name="contenu" rows={4} value={form.contenu} onChange={maj} required />
          <div className="modal-actions">
            <button type="button" className="btn-annuler" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-publier" disabled={envoi}>{envoi ? 'Enregistrement…' : 'Enregistrer'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}