import { X, FileText, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import './OffreFormModal.css';

const API_BASE = 'http://localhost:8000';

export default function CandidatProfilModal({ candidat, onClose }) {
  const initiales = `${candidat.nom?.[0] ?? ''}${candidat.prenom?.[0] ?? ''}`.toUpperCase();
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('fr-FR') : '—');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Profil du candidat</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="profil-tete">
          <div className="profil-avatar">{initiales}</div>
          <div>
            <h3 className="profil-nom">{candidat.nom} {candidat.prenom}</h3>
            <span className="profil-statut">Statut : {candidat.pivot?.statut}</span>
          </div>
        </div>

        <div className="profil-infos">
          <div className="profil-ligne"><Mail size={16} /> {candidat.email}</div>
          <div className="profil-ligne"><Phone size={16} /> {candidat.telephone || '—'}</div>
          <div className="profil-ligne"><MapPin size={16} /> {candidat.adresse || '—'}</div>
          <div className="profil-ligne"><Calendar size={16} /> Né(e) le {formatDate(candidat.date_naissance)}</div>
          <div className="profil-ligne"><Calendar size={16} /> Postulé le {formatDate(candidat.pivot?.created_at)}</div>
        </div>

        <h4 className="profil-sous-titre">Documents déposés</h4>
        {candidat.medias?.length ? (
          <div className="profil-docs">
            {candidat.medias.map((m) => (
              <a key={m.id} className="cand-doc" href={`${API_BASE}/storage/${m.chemin_fichier}`} target="_blank" rel="noreferrer">
                <FileText size={14} /> {m.nom}
              </a>
            ))}
          </div>
        ) : <p className="profil-vide">Aucun document.</p>}

        : <p className="profil-vide">Candidat pas encore évalué.</p>

        {candidat.pivot?.justification && (
          <>
            <h4 className="profil-sous-titre">Justification de la décision</h4>
            <p className="profil-bloc" style={{ whiteSpace: 'pre-line' }}>{candidat.pivot.justification}</p>
          </>
        )}

        <div className="modal-actions">
          <button type="button" className="btn-annuler" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}