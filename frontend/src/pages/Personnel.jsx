import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, IdCard } from 'lucide-react';
import api from '../api/axios';
import Layout from '../components/Layout';
import EmployeFormModal from '../components/EmployeFormModal';
import './Personnel.css';

const classeStatut = (s) => (s === 'Parti' ? 'emp-parti' : 'emp-actif');

export default function Personnel() {
  const navigate = useNavigate();
  const [employes, setEmployes] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [chargement, setChargement] = useState(true);
  const [modal, setModal] = useState(false);

  const charger = () =>
    api.get('/employes').then((r) => setEmployes(r.data)).catch(() => {}).finally(() => setChargement(false));
  useEffect(() => { charger(); }, []);

  const initiales = (e) => `${e.utilisateur?.nom?.[0] ?? ''}${e.utilisateur?.prenom?.[0] ?? ''}`.toUpperCase();

  const filtres = employes.filter((e) =>
    `${e.utilisateur?.nom ?? ''} ${e.utilisateur?.prenom ?? ''} ${e.matricule}`.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <Layout title="Gestion du personnel" active="Personnel">
      <div className="emp-header">
        <div>
          <h1 className="emp-title">Personnel</h1>
          <p className="emp-subtitle">{employes.length} employé(s) enregistré(s).</p>
        </div>
        <button className="emp-btn-pri" onClick={() => setModal(true)}><Plus size={16} /> Nouvelle fiche</button>
      </div>

      <div className="emp-filtres">
        <div className="emp-recherche">
          <Search size={18} />
          <input placeholder="Rechercher (nom, matricule)..." value={recherche} onChange={(e) => setRecherche(e.target.value)} />
        </div>
      </div>

      {chargement ? <p>Chargement…</p> : filtres.length === 0 ? (
        <div className="emp-vide"><IdCard size={40} /><p>Aucun employé. Crée une première fiche.</p></div>
      ) : (
        <div className="emp-table">
          <div className="emp-row emp-row-head">
            <span>Employé</span><span>Matricule</span><span>Département</span><span>Embauche</span><span>Statut</span>
          </div>
          {filtres.map((e) => (
            <div key={e.id} className="emp-row" onClick={() => navigate(`/personnel/${e.id}`)}>
              <span className="emp-nom">
                <span className="emp-avatar">{initiales(e)}</span>
                {e.utilisateur?.nom} {e.utilisateur?.prenom}
              </span>
              <span>{e.matricule}</span>
              <span>{e.departement?.libelle || '—'}</span>
              <span>{e.date_embauche ? new Date(e.date_embauche).toLocaleDateString('fr-FR') : '—'}</span>
              <span><span className={`emp-badge ${classeStatut(e.statut)}`}>{e.statut}</span></span>
            </div>
          ))}
        </div>
      )}

      {modal && <EmployeFormModal onClose={() => setModal(false)} onCreated={() => { setModal(false); charger(); }} />}
    </Layout>
  );
}