import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, CalendarDays, FileText, Send, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';
import api from '../api/axios';
import './OffreDetailPublique.css';

export default function OffreDetailPublique() {
  const { lien } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('candidat_token');
  const candidat = JSON.parse(localStorage.getItem('candidat') || '{}');
  const [offre, setOffre] = useState(null);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    api.get(`/postuler/${lien}`)
      .then((r) => setOffre(r.data))
      .catch((e) => setErreur(e.response?.data?.message || 'Offre introuvable.'));
  }, [lien]);

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

  const postuler = () => {
    if (token) navigate(`/postuler/${lien}`);
    else navigate(`/candidat/inscription?next=/postuler/${lien}`);
  };

  return (
    <div className="pub-page">
      <header className="pub-topbar">
        <div className="pub-logo" onClick={() => navigate('/emplois')} style={{ cursor: 'pointer' }}>
          New Brain Factory <span>— Emplois</span>
        </div>
        <div className="pub-auth">
          {token ? (
            <button className="pub-btn-plein" onClick={() => navigate('/candidat/dashboard')}>
              <LayoutDashboard size={16} /> Mon espace ({candidat.prenom})
            </button>
          ) : (
            <>
              <button className="pub-btn-ghost" onClick={() => navigate('/candidat/connexion')}><LogIn size={16} /> Se connecter</button>
              <button className="pub-btn-plein" onClick={() => navigate('/candidat/inscription')}><UserPlus size={16} /> Créer un compte</button>
            </>
          )}
        </div>
      </header>

      {erreur ? (
        <div className="odp-etat">{erreur}</div>
      ) : !offre ? (
        <div className="odp-etat">Chargement…</div>
      ) : (
        <div className="odp-wrap">
          <button className="odp-retour" onClick={() => navigate('/emplois')}><ArrowLeft size={16} /> Retour aux offres</button>

          <div className="odp-banniere">
            <h1>{offre.titre}</h1>
            <div className="odp-meta">
              {offre.domaine && <span><Building2 size={15} /> {offre.domaine.libelle}</span>}
              <span><CalendarDays size={15} /> Date limite : {formatDate(offre.date_limite)}</span>
            </div>
          </div>

          <div className="odp-grid">
            <div className="odp-main">
              <h3>Description du poste</h3>
              <div className="odp-desc" dangerouslySetInnerHTML={{ __html: offre.description }} />

              {offre.documents?.length > 0 && (
                <>
                  <h3><FileText size={18} /> Documents à fournir</h3>
                  <ul className="odp-docs">
                    {offre.documents.map((d) => (
                      <li key={d.id}>
                        {d.libelle}
                        {d.pivot?.obligatoire
                          ? <span className="odp-oblig">obligatoire</span>
                          : <span className="odp-opt">optionnel</span>}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <aside className="odp-side">
              <div className="odp-side-carte">
                <h4>En bref</h4>
                <div className="odp-side-ligne"><Building2 size={16} /> {offre.domaine?.libelle || '—'}</div>
                <div className="odp-side-ligne"><CalendarDays size={16} /> Limite : {formatDate(offre.date_limite)}</div>
                <div className="odp-side-ligne"><FileText size={16} /> {offre.documents?.length || 0} document(s) à fournir</div>
                <button className="odp-postuler" onClick={postuler}>Postuler <Send size={16} /></button>
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}