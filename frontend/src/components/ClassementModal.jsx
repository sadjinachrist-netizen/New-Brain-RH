import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';
import './OffreFormModal.css';

export default function ClassementModal({ offreId, onClose, onChanged }) {
  const [rows, setRows] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [justif, setJustif] = useState({});

  useEffect(() => {
    api.get(`/offres/${offreId}/classement`)
      .then((r) => setRows(r.data))
      .finally(() => setChargement(false));
  }, [offreId]);

  const decider = async (candidatId, statut) => {
    await api.patch(`/offres/${offreId}/candidatures/${candidatId}`, {
      statut,
      justification: justif[candidatId] || null,
    });
    onChanged();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Classement des candidats</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        {chargement ? (
          <p>Chargement…</p>
        ) : rows.length === 0 ? (
          <p className="q-vide">Aucun candidat évalué pour l'instant.</p>
        ) : (
          <div className="classement">
            {rows.map((e, i) => (
              <div key={e.id} className={`clst-ligne ${i === 0 ? 'premier' : ''}`}>
                <div className="clst-rang">#{i + 1}</div>
                <div className="clst-nom">
                  {e.candidat?.nom} {e.candidat?.prenom}
                  <span className="clst-note">{e.note_globale} pts</span>
                </div>
                <input
                  className="clst-justif"
                  placeholder="Justification (optionnel)…"
                  value={justif[e.candidat?.id] ?? ''}
                  onChange={(ev) => setJustif((p) => ({ ...p, [e.candidat.id]: ev.target.value }))}
                />
                <button className="clst-retenir" onClick={() => decider(e.candidat.id, 'Retenue')}>Retenir</button>
                <button className="clst-refuser" onClick={() => decider(e.candidat.id, 'Refusée')}>Refuser</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}