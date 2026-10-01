import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Mail, Phone, Building2, Briefcase, Wallet, CalendarDays, FileText, IdCard, Plus } from 'lucide-react';
import apiEmploye from '../api/axiosEmploye';
import DemandeAbsenceModal from '../components/DemandeAbsenceModal';
import './EspacePersonnel.css';

const API_BASE = 'http://localhost:8000';
const classeStatut = (s) => ({ 'En attente': 'att', 'Validée': 'val', 'Refusée': 'ref' }[s] || '');

export default function EspacePersonnel() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('employe') || '{}');
  const [emp, setEmp] = useState(null);
  const [demandes, setDemandes] = useState([]);
  const [erreur, setErreur] = useState('');
  const [modalDemande, setModalDemande] = useState(false);

  const chargerDemandes = () => apiEmploye.get('/espace/demandes-absence').then((r) => setDemandes(r.data)).catch(() => {});

  useEffect(() => {
    apiEmploye.get('/espace/moi').then((r) => setEmp(r.data)).catch((e) => setErreur(e.response?.data?.message || 'Erreur de chargement.'));
    chargerDemandes();
  }, []);

  const logout = async () => {
    try { await apiEmploye.post('/employe/logout'); } catch { /* ignore */ }
    localStorage.removeItem('employe_token');
    localStorage.removeItem('employe');
    navigate('/employe/connexion');
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('fr-FR') : '—');
  const formatMontant = (n) => (n != null ? Number(n).toLocaleString('fr-FR') + ' FCFA' : '—');

  const u = emp?.utilisateur || user;
  const contrat = emp?.contrat_actif;

  return (
    <div className="esp-page">
      <header className="esp-topbar">
        <div className="esp-logo">New Brain Factory <span>— Espace personnel</span></div>
        <div className="esp-user">
          <span>{u.prenom} {u.nom}</span>
          <button className="esp-logout" onClick={logout}><LogOut size={16} /> Déconnexion</button>
        </div>
      </header>

      <main className="esp-main">
        <h1>Bonjour {u.prenom}</h1>
        <p className="esp-sub">Bienvenue dans votre espace personnel.</p>

        {erreur ? <div className="esp-erreur">{erreur}</div> : !emp ? <p>Chargement…</p> : (
          <div className="esp-grid">
            <div className="esp-carte">
              <h3><IdCard size={18} /> Mes informations</h3>
              <div className="esp-ligne"><Mail size={16} /> {u.email || '—'}</div>
              <div className="esp-ligne"><Phone size={16} /> {u.telephone || '—'}</div>
              <div className="esp-ligne"><Building2 size={16} /> {emp.departement?.libelle || '—'}</div>
              <div className="esp-ligne"><Briefcase size={16} /> {contrat?.poste?.libelle || '—'}</div>
              <div className="esp-ligne"><Wallet size={16} /> {contrat ? formatMontant(contrat.salaire) : '—'}</div>
              <div className="esp-ligne"><CalendarDays size={16} /> Embauché le {formatDate(emp.date_embauche)}</div>
              <div className="esp-ligne"><span className="esp-matricule">Matricule : {emp.matricule}</span></div>
            </div>

            <div className="esp-carte">
              <h3><FileText size={18} /> Mes documents</h3>
              {emp.documents_rh?.length ? (
                <div className="esp-docs">
                  {emp.documents_rh.map((d) => (
                    <a key={d.id} className="esp-doc" href={`${API_BASE}/storage/${d.chemin_fichier}`} target="_blank" rel="noreferrer">
                      <FileText size={15} /> {d.nom}
                    </a>
                  ))}
                </div>
              ) : <p className="esp-vide">Aucun document disponible.</p>}
            </div>

            <div className="esp-carte esp-carte-full">
              <div className="esp-carte-head">
                <h3><CalendarDays size={18} /> Mes congés & permissions</h3>
                <button className="esp-add" onClick={() => setModalDemande(true)}><Plus size={15} /> Nouvelle demande</button>
              </div>
              {demandes.length === 0 ? (
                <p className="esp-vide">Aucune demande pour le moment.</p>
              ) : (
                <div className="esp-demandes">
                  {demandes.map((d) => (
                    <div key={d.id} className="esp-demande">
                      <div>
                        <div className="esp-demande-titre">{d.type_absence?.libelle} · du {formatDate(d.date_debut)} au {formatDate(d.date_fin)}</div>
                        <div className="esp-demande-motif">« {d.motif} »</div>
                        {d.statut === 'Refusée' && d.motif_refus && <div className="esp-demande-refus">Refus : {d.motif_refus}</div>}
                      </div>
                      <span className={`esp-badge ${classeStatut(d.statut)}`}>{d.statut}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {modalDemande && (
        <DemandeAbsenceModal
          onClose={() => setModalDemande(false)}
          onCreated={() => { setModalDemande(false); chargerDemandes(); }}
        />
      )}
    </div>
  );
}