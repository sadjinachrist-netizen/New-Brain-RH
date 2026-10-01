import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Building2, CalendarDays, LogOut, FileText, Award, FileSignature, Plus, Trash2, Briefcase, Wallet, KeyRound } from 'lucide-react';
import api from '../api/axios';
import Layout from '../components/Layout';
import ContratFormModal from '../components/ContratFormModal';
import EvaluationFormModal from '../components/EvaluationFormModal';
import DocumentRhFormModal from '../components/DocumentRhFormModal';
import AccesModal from '../components/AccesModal';
import './Personnel.css';

const API_BASE = 'http://localhost:8000';

export default function EmployeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emp, setEmp] = useState(null);
  const [modalContrat, setModalContrat] = useState(false);
  const [modalEval, setModalEval] = useState(false);
  const [modalDoc, setModalDoc] = useState(false);
  const [modalAcces, setModalAcces] = useState(false);

  const charger = () => api.get(`/employes/${id}`).then((r) => setEmp(r.data)).catch(() => navigate('/personnel'));
  useEffect(() => { charger(); }, [id]);

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('fr-FR') : '—');
  const formatMontant = (n) => (n != null ? Number(n).toLocaleString('fr-FR') + ' FCFA' : '—');

  const marquerParti = async () => {
    if (!window.confirm('Marquer cet employé comme « Parti » ?')) return;
    await api.patch(`/employes/${id}/depart`, {});
    charger();
  };

  const supprimerContrat = async (cid) => {
    if (!window.confirm('Supprimer ce contrat ?')) return;
    await api.delete(`/contrats/${cid}`);
    charger();
  };

  const supprimerEvaluation = async (eid) => {
    if (!window.confirm('Supprimer cette évaluation ?')) return;
    await api.delete(`/evaluations/${eid}`);
    charger();
  };

  const supprimerDocument = async (did) => {
    if (!window.confirm('Supprimer ce document ?')) return;
    await api.delete(`/documents-rh/${did}`);
    charger();
  };

  if (!emp) return <Layout title="Gestion du personnel" active="Personnel"><p>Chargement…</p></Layout>;

  const u = emp.utilisateur || {};
  const initiales = `${u.nom?.[0] ?? ''}${u.prenom?.[0] ?? ''}`.toUpperCase();
  const contratActif = emp.contrats?.find((c) => c.statut === 'Actif');

  return (
    <Layout title="Gestion du personnel" active="Personnel">
      <button className="retour" onClick={() => navigate('/personnel')}><ArrowLeft size={16} /> Retour</button>

      <div className="empd-tete">
        <div className="empd-avatar">{initiales}</div>
        <div className="empd-ident">
          <h1>{u.nom} {u.prenom}</h1>
          <span className={`emp-badge ${emp.statut === 'Parti' ? 'emp-parti' : 'emp-actif'}`}>{emp.statut}</span>
          <div className="empd-matricule">Matricule : {emp.matricule}</div>
        </div>
        {emp.statut !== 'Parti' && (
          <button className="empd-depart" onClick={marquerParti}><LogOut size={16} /> Marquer comme parti</button>
        )}
      </div>

      <div className="empd-grid">
        <div className="empd-carte">
          <h3>Informations</h3>
          <div className="empd-ligne"><Mail size={16} /> {u.email || '—'}</div>
          <div className="empd-ligne"><Phone size={16} /> {u.telephone || '—'}</div>
          <div className="empd-ligne"><Building2 size={16} /> {emp.departement?.libelle || '—'}</div>
          <div className="empd-ligne"><Briefcase size={16} /> {contratActif?.poste?.libelle || 'Aucun poste (pas de contrat actif)'}</div>
          <div className="empd-ligne"><Wallet size={16} /> {contratActif ? formatMontant(contratActif.salaire) : '—'}</div>
          <div className="empd-ligne"><CalendarDays size={16} /> Embauché le {formatDate(emp.date_embauche)}</div>
          {emp.statut === 'Parti' && <div className="empd-ligne"><CalendarDays size={16} /> Parti le {formatDate(emp.date_depart)}</div>}

          <div className="empd-acces">
            <span className={`emp-badge ${emp.acces_actif ? 'emp-actif' : 'emp-parti'}`}>
              {emp.acces_actif ? 'Accès activé' : 'Accès non activé'}
            </span>
            <button className="empd-acces-btn" onClick={() => setModalAcces(true)}>
              <KeyRound size={15} /> {emp.acces_actif ? 'Réinitialiser le mot de passe' : "Activer l'accès"}
            </button>
          </div>
        </div>

        <div className="empd-carte">
          <div className="empd-carte-head">
            <h3><FileSignature size={18} /> Contrats</h3>
            {emp.statut !== 'Parti' && (
              <button className="empd-add" onClick={() => setModalContrat(true)}><Plus size={15} /> Nouveau</button>
            )}
          </div>
          {emp.contrats?.length ? (
            <div className="empd-contrats">
              {emp.contrats.map((c) => (
                <div key={c.id} className={`empd-contrat ${c.statut === 'Actif' ? 'actif' : ''}`}>
                  <div className="empd-contrat-info">
                    <div className="empd-contrat-titre">
                      {c.type_contrat?.libelle} — {c.poste?.libelle}
                      <span className={`emp-badge ${c.statut === 'Actif' ? 'emp-actif' : 'emp-parti'}`}>{c.statut}</span>
                    </div>
                    <div className="empd-contrat-meta">
                      {formatMontant(c.salaire)} · du {formatDate(c.date_debut)} au {c.date_fin ? formatDate(c.date_fin) : '…'}
                    </div>
                  </div>
                  <button className="empd-del" onClick={() => supprimerContrat(c.id)}><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
          ) : <p className="empd-vide">Aucun contrat.</p>}
        </div>

        <div className="empd-carte">
          <div className="empd-carte-head">
            <h3><Award size={18} /> Évaluations</h3>
            <button className="empd-add" onClick={() => setModalEval(true)}><Plus size={15} /> Nouvelle</button>
          </div>
          {emp.evaluations?.length ? (
            <div className="empd-evals">
              {emp.evaluations.map((ev) => (
                <div key={ev.id} className="empd-eval">
                  <div className="empd-eval-info">
                    <div className="empd-eval-titre">
                      <span className={`eval-type eval-${ev.type?.toLowerCase()}`}>{ev.type}</span>
                      <span className="empd-eval-date">{formatDate(ev.date_evaluation)}</span>
                      {ev.note != null && <span className="empd-eval-note">Note : {ev.note}</span>}
                    </div>
                    <div className="empd-eval-contenu">{ev.contenu}</div>
                  </div>
                  <button className="empd-del" onClick={() => supprimerEvaluation(ev.id)}><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
          ) : <p className="empd-vide">Aucune évaluation.</p>}
        </div>

        <div className="empd-carte">
          <div className="empd-carte-head">
            <h3><FileText size={18} /> Documents RH</h3>
            <button className="empd-add" onClick={() => setModalDoc(true)}><Plus size={15} /> Générer</button>
          </div>
          {emp.documents_rh?.length ? (
            <div className="empd-docs">
              {emp.documents_rh.map((d) => (
                <div key={d.id} className="empd-doc">
                  <a className="empd-doc-lien" href={`${API_BASE}/storage/${d.chemin_fichier}`} target="_blank" rel="noreferrer">
                    <FileText size={15} /> {d.nom}
                  </a>
                  <div className="empd-doc-actions">
                    <span className="empd-doc-date">{formatDate(d.date_generation)}</span>
                    <button className="empd-del" onClick={() => supprimerDocument(d.id)}><Trash2 size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="empd-vide">Aucun document généré.</p>}
        </div>
      </div>

      {modalContrat && (
        <ContratFormModal
          employeId={id}
          onClose={() => setModalContrat(false)}
          onCreated={() => { setModalContrat(false); charger(); }}
        />
      )}

      {modalEval && (
        <EvaluationFormModal
          employeId={id}
          onClose={() => setModalEval(false)}
          onCreated={() => { setModalEval(false); charger(); }}
        />
      )}

      {modalDoc && (
        <DocumentRhFormModal
          employeId={id}
          onClose={() => setModalDoc(false)}
          onCreated={() => { setModalDoc(false); charger(); }}
        />
      )}

      {modalAcces && (
        <AccesModal
          employeId={id}
          email={u.email}
          onClose={() => setModalAcces(false)}
          onSaved={() => { setModalAcces(false); charger(); }}
        />
      )}
    </Layout>
  );
}