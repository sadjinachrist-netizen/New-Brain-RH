import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import './Candidatures.css';
import { ArrowLeft, Search, Eye, FileText, Mail, ChevronDown, ChevronUp, ClipboardPen } from 'lucide-react';
import EmailModal from '../components/EmailModal';
import CandidatProfilModal from '../components/CandidatProfilModal';
import NotationModal from '../components/NotationModal';

const STATUTS = ['Reçue', 'Retenue', 'Refusée'];
const API_BASE = 'http://localhost:8000';

const classeStatut = (s) => ({
  'Reçue': 'st-recue', 'Retenue': 'st-retenue', 'Refusée': 'st-refusee',
}[s] || '');

export default function Candidatures() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offre, setOffre] = useState(null);
  const [candidats, setCandidats] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('Tous');
  const [tri, setTri] = useState('date');
  const [chargement, setChargement] = useState(true);
  const [limite, setLimite] = useState(10);
  const [emailCandidat, setEmailCandidat] = useState(null);
  const [profil, setProfil] = useState(null);
  const [docsOuverts, setDocsOuverts] = useState([]);
  const [noter, setNoter] = useState(null);

  const toggleDocs = (cid) =>
    setDocsOuverts((p) => (p.includes(cid) ? p.filter((x) => x !== cid) : [...p, cid]));

  const charger = () => {
    Promise.all([api.get(`/offres/${id}`), api.get(`/offres/${id}/candidatures`)])
      .then(([o, c]) => { setOffre(o.data); setCandidats(c.data); })
      .catch(() => navigate('/offres'))
      .finally(() => setChargement(false));
  };

  useEffect(() => { charger(); }, [id]);

  const changerStatut = async (candidatId, statut) => {
    await api.patch(`/offres/${id}/candidatures/${candidatId}`, { statut });
    charger();
  };

  const compter = (s) => candidats.filter((c) => c.pivot.statut === s).length;
  const initiales = (c) => `${c.nom?.[0] ?? ''}${c.prenom?.[0] ?? ''}`.toUpperCase();
  const noteDe = (c) => (c.pivot?.note_finale != null ? Number(c.pivot.note_finale) : null);

  const filtres = candidats
    .filter((c) => `${c.nom} ${c.prenom}`.toLowerCase().includes(recherche.toLowerCase()))
    .filter((c) => filtreStatut === 'Tous' || c.pivot.statut === filtreStatut)
    .sort((a, b) => (tri === 'note'
      ? (noteDe(b) ?? -1) - (noteDe(a) ?? -1)
      : new Date(b.pivot.created_at) - new Date(a.pivot.created_at)));

  return (
    <Layout title="Recrutement" active="Candidatures">
      <button className="retour" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Retour</button>

      <div className="cand-header">
        <div>
          <h1 className="cand-title">Candidatures — {offre?.titre}</h1>
          <p className="cand-subtitle">{candidats.length} candidat(s) ont postulé à cette offre.</p>
        </div>
      </div>

      <div className="cand-stats">
        <div className="stat-card"><span className="pastille bleu" /><div><div className="stat-label">REÇUES</div><div className="stat-nb">{compter('Reçue')}</div></div></div>
        <div className="stat-card"><span className="pastille vert" /><div><div className="stat-label">RETENUES</div><div className="stat-nb">{compter('Retenue')}</div></div></div>
        <div className="stat-card"><span className="pastille rouge" /><div><div className="stat-label">REFUSÉES</div><div className="stat-nb">{compter('Refusée')}</div></div></div>
      </div>

      <div className="cand-filtres">
        <div className="cand-recherche"><Search size={18} /><input placeholder="Rechercher un candidat..." value={recherche} onChange={(e) => setRecherche(e.target.value)} /></div>
        <select value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}>
          <option value="Tous">Tous les statuts</option>
          {STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={tri} onChange={(e) => setTri(e.target.value)}>
          <option value="date">Date (récent)</option>
          <option value="note">Note (décroissant)</option>
        </select>
      </div>

      {chargement ? <p>Chargement…</p> : filtres.length === 0 ? <p style={{ color: '#6B7280' }}>Aucune candidature.</p> : (
        <>
          <div className="cand-liste">
            {filtres.slice(0, limite).map((c) => {
              const s = c.pivot.statut;
              const note = noteDe(c);
              return (
                <div key={c.id} className={`cand-card ${classeStatut(s)}`}>
                  <div className="cand-avatar">{initiales(c)}</div>

                  <div className="cand-infos">
                    <h3>{c.nom} {c.prenom}</h3>
                    <div className="cand-contact">{c.email}<br />{c.telephone}</div>
                    <div className="cand-date">Postulé le {new Date(c.pivot.created_at).toLocaleDateString('fr-FR')}</div>
                  </div>

                  <div className="cand-docs">
                    {c.medias?.length ? (
                      <>
                        <button type="button" className="cand-docs-btn" onClick={() => toggleDocs(c.id)}>
                          <FileText size={14} /> {c.medias.length} document(s)
                          {docsOuverts.includes(c.id) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        {docsOuverts.includes(c.id) && (
                          <div className="cand-docs-liste">
                            {c.medias.map((m) => (
                              <a key={m.id} className="cand-doc" href={`${API_BASE}/storage/${m.chemin_fichier}`} target="_blank" rel="noreferrer">
                                <FileText size={14} /> {m.nom}
                              </a>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="cand-docs-vide">Aucun document</span>
                    )}
                  </div>

                  <div className="cand-score">
                    {note !== null ? <span className="score-nb">{note}</span> : <span className="score-non">Non noté</span>}
                  </div>

                  <span className={`cand-badge ${classeStatut(s)}`}>{s}</span>

                  <div className="cand-actions">
                    <button title="Voir le profil" onClick={() => setProfil(c)}><Eye size={18} /></button>
                    <button title="Noter le candidat (grille)" onClick={() => setNoter(c)}><ClipboardPen size={18} /></button>
                    <button title="Envoyer un message" onClick={() => setEmailCandidat(c)}><Mail size={18} /></button>
                    <select className="statut-select" value={s} onChange={(e) => changerStatut(c.id, e.target.value)}>
                      {STATUTS.map((st) => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>

          {filtres.length > limite && (
            <div style={{ textAlign: 'center', marginTop: 18 }}>
              <button className="btn-plus" onClick={() => setLimite(limite + 10)}>
                Afficher plus de candidats ({filtres.length - limite} restant·s)
              </button>
            </div>
          )}
        </>
      )}

      {emailCandidat && (
        <EmailModal
          offreId={id}
          offreTitre={offre?.titre}
          candidat={emailCandidat}
          onClose={() => setEmailCandidat(null)}
          onSent={() => { setEmailCandidat(null); window.alert('Email envoyé ✓'); }}
        />
      )}

      {profil && <CandidatProfilModal candidat={profil} onClose={() => setProfil(null)} />}

      {noter && (
        <NotationModal
          offreId={id}
          candidat={noter}
          onClose={() => setNoter(null)}
          onSaved={() => { setNoter(null); charger(); }}
        />
      )}
    </Layout>
  );
}