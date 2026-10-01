import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, Award, UserCheck } from 'lucide-react';
import api from '../api/axios';
import Layout from '../components/Layout';
import './TableauDeBord.css';

const STATUT_COULEUR = {
  'Reçue': '#2563EB', 'Retenue': '#16A34A', 'Refusée': '#DC2626',
};

export default function TableauDeBord() {
  const [stats, setStats] = useState(null);
  const [offres, setOffres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/dashboard/recrutement').then((r) => setStats(r.data)).catch(() => {});
    api.get('/offres').then((r) => setOffres(r.data.slice(0, 5))).catch(() => {});
  }, []);

  if (!stats) return <Layout title="Tableau de bord" active="Tableau de bord"><p>Chargement…</p></Layout>;

  const maxStatut = Math.max(1, ...Object.values(stats.par_statut));

  const kpis = [
    { label: 'Offres ouvertes', valeur: stats.offres_ouvertes, sous: `${stats.offres_total} au total`, icon: Briefcase, couleur: '#2563EB' },
    { label: 'Candidatures reçues', valeur: stats.candidatures_total, sous: 'toutes offres', icon: Users, couleur: '#4F46E5' },
    { label: 'Candidats retenus', valeur: stats.par_statut.Retenue, sous: 'embauches potentielles', icon: Award, couleur: '#16A34A' },
    { label: 'Total employés', valeur: stats.employes_total, sous: `${stats.employes_actifs} actif(s)`, icon: UserCheck, couleur: '#0891B2' },
  ];

  return (
    <Layout title="Tableau de bord" active="Tableau de bord">
      <h1 className="tdb-title">Tableau de bord</h1>
      <p className="tdb-subtitle">Vue d'ensemble de l'activité de recrutement.</p>

      <div className="tdb-kpis">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="tdb-kpi">
              <div className="tdb-kpi-icone" style={{ background: `${k.couleur}18`, color: k.couleur }}><Icon size={22} /></div>
              <div>
                <div className="tdb-kpi-valeur">{k.valeur}</div>
                <div className="tdb-kpi-label">{k.label}</div>
                <div className="tdb-kpi-sous">{k.sous}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="tdb-grid">
        <div className="tdb-carte">
          <h3>Candidatures par statut</h3>
          <div className="tdb-barres">
            {Object.entries(stats.par_statut).map(([statut, nb]) => (
              <div key={statut} className="tdb-barre-ligne">
                <span className="tdb-barre-label">{statut}</span>
                <div className="tdb-barre-track">
                  <div className="tdb-barre-fill" style={{ width: `${(nb / maxStatut) * 100}%`, background: STATUT_COULEUR[statut] }} />
                </div>
                <span className="tdb-barre-nb">{nb}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="tdb-carte">
          <h3>Dernières offres</h3>
          <div className="tdb-offres">
            {offres.length === 0 ? <p className="tdb-vide">Aucune offre.</p> : offres.map((o) => (
              <div key={o.id} className="tdb-offre" onClick={() => navigate(`/offres/${o.id}`)}>
                <div className="tdb-offre-nom">{o.titre}</div>
                <div className="tdb-offre-meta">
                  <span className={`offre-statut-mini ${o.statut === 'Fermée' ? 'ferme' : 'ouvert'}`}>{o.statut}</span>
                  <span>{o.candidats_count} candidat(s)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}