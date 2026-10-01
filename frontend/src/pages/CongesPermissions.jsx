import { useEffect, useState } from 'react';
import { CalendarDays, Check, X as XIcon } from 'lucide-react';
import api from '../api/axios';
import Layout from '../components/Layout';
import './Conges.css';

const classeStatut = (s) => ({ 'En attente': 'ca-attente', 'Validée': 'ca-validee', 'Refusée': 'ca-refusee' }[s] || '');

export default function CongesPermissions() {
  const [demandes, setDemandes] = useState([]);
  const [filtre, setFiltre] = useState('Tous');
  const [chargement, setChargement] = useState(true);

  const charger = () => api.get('/demandes-absence').then((r) => setDemandes(r.data)).catch(() => {}).finally(() => setChargement(false));
  useEffect(() => { charger(); }, []);

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('fr-FR') : '—');

  const valider = async (id) => { await api.patch(`/demandes-absence/${id}`, { statut: 'Validée' }); charger(); };
  const refuser = async (id) => {
    const motif = window.prompt('Motif du refus :');
    if (motif == null) return;
    if (!motif.trim()) { window.alert('Le motif est requis.'); return; }
    await api.patch(`/demandes-absence/${id}`, { statut: 'Refusée', motif_refus: motif });
    charger();
  };

  const compter = (s) => demandes.filter((d) => d.statut === s).length;
  const filtres = demandes.filter((d) => filtre === 'Tous' || d.statut === filtre);

  return (
    <Layout title="Congés & Permissions" active="Congés & Permissions">
      <h1 className="ca-title">Congés & Permissions</h1>
      <p className="ca-subtitle">Traitez les demandes d'absence des employés.</p>

      <div className="ca-stats">
        <div className="ca-stat"><span className="ca-pastille attente" /><div><div className="ca-stat-label">EN ATTENTE</div><div className="ca-stat-nb">{compter('En attente')}</div></div></div>
        <div className="ca-stat"><span className="ca-pastille validee" /><div><div className="ca-stat-label">VALIDÉES</div><div className="ca-stat-nb">{compter('Validée')}</div></div></div>
        <div className="ca-stat"><span className="ca-pastille refusee" /><div><div className="ca-stat-label">REFUSÉES</div><div className="ca-stat-nb">{compter('Refusée')}</div></div></div>
      </div>

      <div className="ca-filtres">
        <select value={filtre} onChange={(e) => setFiltre(e.target.value)}>
          <option value="Tous">Toutes</option>
          <option value="En attente">En attente</option>
          <option value="Validée">Validées</option>
          <option value="Refusée">Refusées</option>
        </select>
      </div>

      {chargement ? <p>Chargement…</p> : filtres.length === 0 ? <p style={{ color: '#6B7280' }}>Aucune demande.</p> : (
        <div className="ca-liste">
          {filtres.map((d) => (
            <div key={d.id} className="ca-carte">
              <div className="ca-carte-info">
                <div className="ca-emp">{d.employe?.utilisateur?.nom} {d.employe?.utilisateur?.prenom}</div>
                <div className="ca-meta">
                  <span className="ca-type">{d.type_absence?.libelle}</span>
                  <span><CalendarDays size={14} /> du {formatDate(d.date_debut)} au {formatDate(d.date_fin)}</span>
                </div>
                <div className="ca-motif">« {d.motif} »</div>
                {d.statut === 'Refusée' && d.motif_refus && <div className="ca-refus">Motif du refus : {d.motif_refus}</div>}
              </div>
              <div className="ca-droite">
                <span className={`ca-badge ${classeStatut(d.statut)}`}>{d.statut}</span>
                {d.statut === 'En attente' && (
                  <div className="ca-actions">
                    <button className="ca-btn-valider" onClick={() => valider(d.id)}><Check size={15} /> Valider</button>
                    <button className="ca-btn-refuser" onClick={() => refuser(d.id)}><XIcon size={15} /> Refuser</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}