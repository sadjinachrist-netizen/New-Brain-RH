import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, SlidersHorizontal, Eye, Link2, Archive, Trash2, Briefcase, Building2, CalendarDays,
} from 'lucide-react';
import api from '../api/axios';
import Layout from '../components/Layout';
import './Offres.css';
import OffreFormModal from '../components/OffreFormModal';

export default function Offres() {
  const [offres, setOffres] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('Toutes');
  const [chargement, setChargement] = useState(true);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const charger = () => {
    api.get('/offres')
      .then((res) => setOffres(res.data))
      .catch(() => navigate('/login'))
      .finally(() => setChargement(false));
  };

  useEffect(() => { charger(); }, []);

  const copierLien = (offre) => {
    const url = `${window.location.origin}/postuler/${offre.lien_postulation}`;
    navigator.clipboard.writeText(url);
    window.alert('Lien de postulation copié !');
  };

  const fermerOffre = async (offre) => {
    await api.put(`/offres/${offre.id}`, { statut: 'Fermée' });
    charger();
  };

  const supprimerOffre = async (offre) => {
    if (!window.confirm(`Supprimer l'offre "${offre.titre}" ?`)) return;
    await api.delete(`/offres/${offre.id}`);
    charger();
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

  const estExpiree = (offre) => offre.date_limite && new Date(offre.date_limite) < new Date();

  const offresFiltrees = offres.filter((o) => {
    const matchTexte = o.titre.toLowerCase().includes(recherche.toLowerCase());
    const matchStatut = filtreStatut === 'Toutes' || o.statut === filtreStatut;
    return matchTexte && matchStatut;
  });

  return (
    <Layout title="Recrutement">
      <div className="offres-header">
        <div>
          <h1 className="offres-title">Offres d'emploi</h1>
          <p className="offres-subtitle">Gérez vos publications et suivez les recrutements en cours.</p>
        </div>
        <button className="btn-nouvelle" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Nouvelle offre
        </button>
      </div>

      <div className="offres-filtres">
        <div className="filtre-recherche">
          <Search size={18} />
          <input placeholder="Rechercher par titre..." value={recherche} onChange={(e) => setRecherche(e.target.value)} />
        </div>
        <select value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}>
          <option value="Toutes">Toutes</option>
          <option value="Ouverte">Ouvertes</option>
          <option value="Fermée">Fermées</option>
        </select>
        <button className="filtre-icone"><SlidersHorizontal size={18} /></button>
      </div>

      {chargement ? (
        <p>Chargement…</p>
      ) : offresFiltrees.length === 0 ? (
        <p style={{ color: '#6B7280' }}>Aucune offre.</p>
      ) : (
        <div className="offres-liste">
          {offresFiltrees.map((o) => {
            const expiree = estExpiree(o);
            const fermee = o.statut === 'Fermée';
            const inactive = fermee || expiree;
            return (
              <div key={o.id} className={`offre-card ${fermee ? 'fermee' : ''}`}>
                <div className="offre-icone"><Briefcase size={22} /></div>

                <div className="offre-infos">
                   <h3 onClick={() => navigate(`/offres/${o.id}`)}>{o.titre}</h3>
                  <div className="offre-meta">
                    {o.domaine && <span><Building2 size={14} /> {o.domaine.libelle}</span>}
                    {o.date_limite && (
                      <span className={expiree ? 'expire-rouge' : ''}>
                        <CalendarDays size={14} /> {expiree ? 'Offre expirée' : `Expire le ${formatDate(o.date_limite)}`}
                      </span>
                    )}
                  </div>
                </div>

                <div className="offre-candidats">
                  <div className="offre-candidats-nb">{o.candidats_count ?? 0}</div>
                  <div className="offre-candidats-label">CANDIDATS</div>
                </div>

                <span className={`offre-statut ${inactive ? 'ferme' : 'ouvert'}`}>{inactive ? 'Fermée' : 'Ouverte'}</span>

                <div className="offre-actions">
                  <button title="Voir" onClick={() => navigate(`/offres/${o.id}/candidatures`)}><Eye size={18} /></button>
                  <button title="Copier le lien" onClick={() => copierLien(o)}><Link2 size={18} /></button>
                  {fermee ? (
                    <button title="Supprimer" onClick={() => supprimerOffre(o)}><Trash2 size={18} /></button>
                  ) : (
                    <button title="Fermer l'offre" onClick={() => fermerOffre(o)}><Archive size={18} /></button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

            {showModal && (
        <OffreFormModal
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); charger(); }}
        />
      )}


    </Layout>
  );
}