import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import apiEmploye from '../api/axiosEmploye';
import './OffreFormModal.css';

export default function DemandeAbsenceModal({ onClose, onCreated }) {
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({ type_absence_id: '', date_debut: '', date_fin: '', motif: '' });
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    apiEmploye.get('/espace/type-absences').then((r) => setTypes(r.data)).catch(() => {});
  }, []);

  const maj = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErreur('');
    setEnvoi(true);
    try {
      await apiEmploye.post('/espace/demandes-absence', form);
      onCreated();
    } catch (err) {
      const errs = err.response?.data?.errors;
      setErreur(errs ? Object.values(errs)[0][0] : (err.response?.data?.message || 'Erreur lors de la soumission.'));
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nouvelle demande d'absence</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        {erreur && <div className="modal-erreur">{erreur}</div>}
        <form onSubmit={submit}>
          <label>Type</label>
          <select name="type_absence_id" value={form.type_absence_id} onChange={maj} required>
            <option value="">— Choisir —</option>
            {types.map((t) => <option key={t.id} value={t.id}>{t.libelle}</option>)}
          </select>
          <div className="form-row2">
            <div><label>Du</label><input type="date" name="date_debut" value={form.date_debut} onChange={maj} required /></div>
            <div><label>Au</label><input type="date" name="date_fin" value={form.date_fin} onChange={maj} required /></div>
          </div>
          <label>Motif</label>
          <textarea name="motif" rows={3} value={form.motif} onChange={maj} required />
          <div className="modal-actions">
            <button type="button" className="btn-annuler" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-publier" disabled={envoi}>{envoi ? 'Envoi…' : 'Soumettre'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}