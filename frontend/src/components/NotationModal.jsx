import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';
import './OffreFormModal.css';

export default function NotationModal({ offreId, candidat, onClose, onSaved }) {
  const [questions, setQuestions] = useState([]);
  const [notes, setNotes] = useState({}); // { questionId: note }
  const [justification, setJustification] = useState(candidat.pivot?.justification ?? '');
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    api.get('/questions').then((r) => setQuestions(r.data)).catch(() => {});
  }, []);

  const setNote = (qid, val) => setNotes((p) => ({ ...p, [qid]: val }));

  const total = questions.reduce((s, q) => s + (parseFloat(notes[q.id]) || 0), 0);

  const submit = async (e) => {
    e.preventDefault();
    setErreur('');
    setEnvoi(true);
    try {
      await api.patch(`/offres/${offreId}/candidatures/${candidat.id}`, {
        note_finale: total,
        justification: justification || null,
      });
      onSaved();
    } catch {
      setErreur("Erreur lors de l'enregistrement.");
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Notation — {candidat.nom} {candidat.prenom}</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        {erreur && <div className="modal-erreur">{erreur}</div>}
        <form onSubmit={submit}>
          <label>Grille de notation</label>
          {questions.length === 0 ? (
            <p className="q-vide">Aucune question. Ajoutes-en dans Paramètres → Questions.</p>
          ) : (
            <div className="grille">
              {questions.map((q) => (
                <div key={q.id} className="grille-ligne">
                  <span className="grille-q">{q.intitule}</span>
                  <div className="grille-note">
                    <input
                      type="number" min="0" max={q.bareme} step="0.5"
                      value={notes[q.id] ?? ''}
                      onChange={(e) => setNote(q.id, e.target.value)}
                    />
                    <span className="grille-bareme">/ {q.bareme}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grille-total">Note globale : <strong>{total}</strong></div>

          <label>Justification</label>
          <textarea rows={3} value={justification} onChange={(e) => setJustification(e.target.value)} placeholder="Justification de la décision / du choix…" />

          <div className="modal-actions">
            <button type="button" className="btn-annuler" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-publier" disabled={envoi}>{envoi ? 'Enregistrement…' : 'Enregistrer'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}