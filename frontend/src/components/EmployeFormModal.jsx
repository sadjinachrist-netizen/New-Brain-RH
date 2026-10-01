import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';
import './OffreFormModal.css';

export default function EmployeFormModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', telephone: '', matricule: '', date_embauche: '', departement_id: '' });
  const [departements, setDepartements] = useState([]);
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => { api.get('/departements').then((r) => setDepartements(r.data)).catch(() => {}); }, []);

  const maj = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErreur('');
    setEnvoi(true);
    try {
      await api.post('/employes', form);
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
          <h2>Nouvelle fiche employé</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        {erreur && <div className="modal-erreur">{erreur}</div>}
        <form onSubmit={submit}>
          <div className="form-row2">
            <div><label>Nom</label><input name="nom" value={form.nom} onChange={maj} required /></div>
            <div><label>Prénom</label><input name="prenom" value={form.prenom} onChange={maj} required /></div>
          </div>
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={maj} required />
          <label>Téléphone</label>
          <input name="telephone" value={form.telephone} onChange={maj} />
          <div className="form-row2">
            <div><label>Matricule</label><input name="matricule" value={form.matricule} onChange={maj} required /></div>
            <div><label>Date d'embauche</label><input type="date" name="date_embauche" value={form.date_embauche} onChange={maj} required /></div>
          </div>
          <label>Département</label>
          <select name="departement_id" value={form.departement_id} onChange={maj} required>
            <option value="">— Choisir —</option>
            {departements.map((d) => <option key={d.id} value={d.id}>{d.libelle}</option>)}
          </select>
          <div className="modal-actions">
            <button type="button" className="btn-annuler" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-publier" disabled={envoi}>{envoi ? 'Création…' : 'Créer la fiche'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}