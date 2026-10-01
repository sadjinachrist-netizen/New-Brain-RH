import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Link2, Users, Building2, CalendarDays, FileText } from 'lucide-react';
import api from '../api/axios';
import Layout from '../components/Layout';
import './OffreDetail.css';

export default function OffreDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offre, setOffre] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    api.get(`/offres/${id}`)
      .then((r) => setOffre(r.data))
      .catch(() => navigate('/offres'))
      .finally(() => setChargement(false));
  }, [id]);

  const copierLien = () => {
    navigator.clipboard.writeText(`${window.location.origin}/postuler/${offre.lien_postulation}`);
    window.alert('Lien de postulation copié !');
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—');

  if (chargement) return <Layout title="Recrutement"><p>Chargement…</p></Layout>;
  if (!offre) return null;

  return (
    <Layout title="Recrutement">
      <button className="retour" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Retour</button>

      <div className="det-header">
        <div>
          <div className="det-titre-row">
            <h1>{offre.titre}</h1>
            <span className={`det-statut ${offre.statut === 'Fermée' ? 'ferme' : 'ouvert'}`}>{offre.statut}</span>
          </div>
          <div className="det-meta">
            <span><Building2 size={15} /> {offre.domaine?.libelle}</span>
            <span><CalendarDays size={15} /> Publiée le {formatDate(offre.date_publication)}</span>
            <span><CalendarDays size={15} /> Limite : {formatDate(offre.date_limite)}</span>
          </div>
        </div>
        <div className="det-actions">
          <button className="det-btn-sec" onClick={copierLien}><Link2 size={16} /> Copier le lien</button>
          <button className="det-btn-pri" onClick={() => navigate(`/offres/${id}/candidatures`)}><Users size={16} /> Candidatures</button>
        </div>
      </div>

      <div className="det-grid">
        <div className="det-carte">
          <h3><FileText size={18} /> Description</h3>
         <div className="det-desc" dangerouslySetInnerHTML={{ __html: offre.description }} />
        </div>

        <div className="det-side">
          <div className="det-carte">
            <h3>Documents à fournir</h3>
            {offre.documents?.length ? (
              <ul className="det-liste">
                {offre.documents.map((d) => (
                  <li key={d.id}>
                    {d.libelle}
                    {d.pivot?.obligatoire ? <span className="det-oblig">obligatoire</span> : <span className="det-opt">optionnel</span>}
                  </li>
                ))}
              </ul>
            ) : <p className="det-vide">Aucun document requis.</p>}
          </div>

          
        </div>
      </div>
    </Layout>
  );
}