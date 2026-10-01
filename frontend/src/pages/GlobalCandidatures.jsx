import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import Layout from '../components/Layout';
import './Candidatures.css';

export default function GlobalCandidatures() {
  const [offres, setOffres] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    api.get('/candidatures').then((r) => setOffres(r.data)).finally(() => setChargement(false));
  }, []);

  const compter = (o, statut) => o.candidats.filter((c) => c.pivot.statut === statut).length;

  return (
    <Layout title="Recrutement" active="Candidatures">
      <h1 className="cand-title">Candidatures</h1>
      <p className="cand-subtitle">Toutes les candidatures, classées par offre.</p>

      {chargement ? <p>Chargement…</p> : offres.length === 0 ? (
        <p style={{ color: '#6B7280' }}>Aucune offre.</p>
      ) : (
        <div className="cand-liste-offres">
          {offres.map((o) => (
            <Link key={o.id} to={`/offres/${o.id}/candidatures`} className="clo-ligne">
              <div className="cg-icone"><Briefcase size={18} /></div>

              <div className="clo-info">
                <h3>{o.titre}</h3>
                <span>{o.candidats_count} candidat(s)</span>
              </div>

              <div className="clo-statuts">
                {compter(o, 'Reçue') > 0 && <span className="cand-badge sm st-recue">{compter(o, 'Reçue')} Reçue(s)</span>}
                {compter(o, 'Retenue') > 0 && <span className="cand-badge sm st-retenue">{compter(o, 'Retenue')} Retenue(s)</span>}
                {compter(o, 'Refusée') > 0 && <span className="cand-badge sm st-refusee">{compter(o, 'Refusée')} Refusée(s)</span>}
              </div>

              <span className="clo-gerer">Gérer <ChevronRight size={16} /></span>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
}