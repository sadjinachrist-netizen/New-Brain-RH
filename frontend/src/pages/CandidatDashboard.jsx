import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, LogOut, Search } from 'lucide-react';
import apiCandidat from '../api/axiosCandidat';
import './CandidatDashboard.css';

const classeStatut = (s) => ({
  'Reçue': 'st-recue', 'Retenue': 'st-retenue', 'Refusée': 'st-refusee',
}[s] || '');

export default function CandidatDashboard() {
  const navigate = useNavigate();
  const candidat = JSON.parse(localStorage.getItem('candidat') || '{}');
  const [candidatures, setCandidatures] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    apiCandidat.get('/candidat/mes-candidatures')
      .then((r) => setCandidatures(r.data))
      .catch(() => {})
      .finally(() => setChargement(false));
  }, []);

  const deconnexion = async () => {
    try { await apiCandidat.post('/candidat/logout'); } catch { /* ignore */ }
    localStorage.removeItem('candidat_token');
    localStorage.removeItem('candidat');
    navigate('/emplois');
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('fr-FR') : '—');

  return (
    <div className="cdash-page">
      <header className="cdash-topbar">
        <div className="cdash-logo" onClick={() => navigate('/emplois')}>
          New Brain Factory <span>— Espace candidat</span>
        </div>
        <div className="cdash-user">
          <span>{candidat.prenom} {candidat.nom}</span>
          <button className="cdash-logout" onClick={deconnexion}><LogOut size={16} /> Déconnexion</button>
        </div>
      </header>

      <main className="cdash-main">
        <div className="cdash-tete">
          <div>
            <h1>Bonjour {candidat.prenom}</h1>
            <p>Suivez vos candidatures et postulez à de nouvelles offres.</p>
          </div>
          <button className="cdash-btn" onClick={() => navigate('/emplois')}><Search size={16} /> Voir les offres</button>
        </div>

        <h2 className="cdash-section">Mes candidatures</h2>

        {chargement ? <p>Chargement…</p> : candidatures.length === 0 ? (
          <div className="cdash-vide">
            <Briefcase size={40} />
            <p>Vous n'avez pas encore postulé.</p>
            <button className="cdash-btn" onClick={() => navigate('/emplois')}>Parcourir les offres</button>
          </div>
        ) : (
          <div className="cdash-liste">
            {candidatures.map((c) => (
              <div key={c.id} className="cdash-carte">
                <div className="cdash-carte-info">
                  <div className="cdash-icone"><Briefcase size={18} /></div>
                  <div>
                    <h3>{c.titre}</h3>
                    <span>{c.domaine} · postulé le {formatDate(c.date)}</span>
                  </div>
                </div>
                <span className={`cdash-badge ${classeStatut(c.statut)}`}>{c.statut}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}