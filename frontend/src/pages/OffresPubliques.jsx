import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, CalendarDays, Search, LogIn, UserPlus, Send, LayoutDashboard } from 'lucide-react';
import api from '../api/axios';
import './OffresPubliques.css';

export default function OffresPubliques() {
  const navigate = useNavigate();
  const token = localStorage.getItem('candidat_token');
  const candidat = JSON.parse(localStorage.getItem('candidat') || '{}');
  const [offres, setOffres] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    api.get('/offres-publiques').then((r) => setOffres(r.data)).catch(() => {}).finally(() => setChargement(false));
  }, []);

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

  const filtres = offres.filter((o) =>
    `${o.titre} ${o.domaine?.libelle}`.toLowerCase().includes(recherche.toLowerCase())
  );

  const postuler = (lien) => {
    if (token) navigate(`/postuler/${lien}`);
    else navigate(`/candidat/inscription?next=/postuler/${lien}`);
  };

  return (
    <div className="pub-page">
      <header className="pub-topbar">
        <div className="pub-logo">New Brain Factory <span>— Emplois</span></div>
        <div className="pub-auth">
          {token ? (
            <button className="pub-btn-plein" onClick={() => navigate('/candidat/dashboard')}>
              <LayoutDashboard size={16} /> Mon espace ({candidat.prenom})
            </button>
          ) : (
            <>
              <button className="pub-btn-ghost" onClick={() => navigate('/candidat/connexion')}>
                <LogIn size={16} /> Se connecter
              </button>
              <button className="pub-btn-plein" onClick={() => navigate('/candidat/inscription')}>
                <UserPlus size={16} /> Créer un compte
              </button>
            </>
          )}
        </div>
      </header>

      <section className="pub-hero">
        <h1>Nos offres d'emploi</h1>
        <p>Rejoignez New Brain Factory. Créez votre compte et postulez en quelques clics.</p>
        <div className="pub-recherche">
          <Search size={18} />
          <input placeholder="Rechercher un poste, un domaine..." value={recherche} onChange={(e) => setRecherche(e.target.value)} />
        </div>
      </section>

      <div className="pub-liste">
        {chargement ? (
          <p className="pub-etat">Chargement…</p>
        ) : filtres.length === 0 ? (
          <p className="pub-etat">Aucune offre disponible pour le moment.</p>
        ) : (
          filtres.map((o) => (
            <div key={o.id} className="pub-ligne">
                <div className="pub-ligne-titre" onClick={() => navigate(`/offre/${o.lien_postulation}`)}>
                <h3>{o.titre}</h3>
                <div className="pub-ligne-meta">
                  {o.domaine && <span className="pub-domaine"><Building2 size={13} /> {o.domaine.libelle}</span>}
                  <span className="pub-date"><CalendarDays size={13} /> Limite : {formatDate(o.date_limite)}</span>
                </div>
              </div>
              <button className="pub-postuler" onClick={() => postuler(o.lien_postulation)}>
                Postuler <Send size={15} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}