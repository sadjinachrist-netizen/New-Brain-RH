import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import './Parametres.css';
import '../components/OffreFormModal.css';
import { Plus, Trash2, X } from 'lucide-react';

const SECTIONS = [
   { cle: 'utilisateurs', titre: 'Utilisateurs', custom: true },
  { cle: 'domaines', titre: 'Domaines', endpoint: '/domaines',
    champs: [{ name: 'libelle', type: 'text', label: 'Libellé' }, { name: 'description', type: 'text', label: 'Description (optionnel)' }], principal: 'libelle' },
  { cle: 'documents', titre: 'Documents à fournir', endpoint: '/documents',
    champs: [{ name: 'libelle', type: 'text', label: 'Libellé' }, { name: 'description', type: 'text', label: 'Description (optionnel)' }], principal: 'libelle' },   
  { cle: 'types-medias', titre: 'Types de média', endpoint: '/types-medias',
    champs: [{ name: 'libelle', type: 'text', label: 'Libellé' }, { name: 'description', type: 'text', label: 'Description (optionnel)' }], principal: 'libelle' },
  { cle: 'types-notifications', titre: 'Types de notification', endpoint: '/types-notifications',
    champs: [{ name: 'libelle', type: 'text', label: 'Libellé' }, { name: 'description', type: 'text', label: 'Description (optionnel)' }], principal: 'libelle' },
  
  { cle: 'departements', titre: 'Départements', endpoint: '/departements',
    champs: [{ name: 'libelle', type: 'text', label: 'Libellé' }, { name: 'description', type: 'text', label: 'Description (optionnel)' }], principal: 'libelle' },
  { cle: 'postes', titre: 'Postes', endpoint: '/postes',
    champs: [{ name: 'libelle', type: 'text', label: 'Intitulé du poste' }, { name: 'description', type: 'text', label: 'Description (optionnel)' }], principal: 'libelle' },
  { cle: 'type-contrats', titre: 'Types de contrat', endpoint: '/type-contrats',
    champs: [{ name: 'libelle', type: 'text', label: 'Libellé (CDI, CDD…)' }, { name: 'description', type: 'text', label: 'Description (optionnel)' }], principal: 'libelle' },
  { cle: 'type-documents-rh', titre: 'Types de document RH', endpoint: '/type-documents-rh',
    champs: [{ name: 'libelle', type: 'text', label: 'Libellé (Contrat, Attestation…)' }, { name: 'description', type: 'text', label: 'Description (optionnel)' }], principal: 'libelle' },

  { cle: 'questions', titre: "Questions d'entretien", endpoint: '/questions',
    champs: [{ name: 'intitule', type: 'text', label: 'Intitulé de la question' }, { name: 'bareme', type: 'number', label: 'Barème' }], principal: 'intitule', secondaire: 'bareme', prefixe: '/' },

  { cle: 'type-absences', titre: "Types d'absence", endpoint: '/type-absences',
  champs: [{ name: 'libelle', type: 'text', label: 'Libellé (Congé, Permission…)' }, { name: 'description', type: 'text', label: 'Description (optionnel)' }], principal: 'libelle' },
];

function UtilisateursManager() {
  const vide = { nom: '', prenom: '', email: '', login: '', telephone: '', role: 'RH', password: '' };
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(vide);
  const [erreur, setErreur] = useState('');
  const [modalOuvert, setModalOuvert] = useState(false);
  const [envoi, setEnvoi] = useState(false);

  const charger = () => api.get('/utilisateurs').then((r) => setUsers(r.data)).catch(() => {});
  useEffect(() => { charger(); }, []);

  const ouvrir = () => { setForm(vide); setErreur(''); setModalOuvert(true); };
  const fermer = () => setModalOuvert(false);

  const ajouter = async (e) => {
    e.preventDefault();
    setErreur('');
    setEnvoi(true);
    try {
      await api.post('/utilisateurs', form);
      setForm(vide);
      setModalOuvert(false);
      charger();
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur : email ou identifiant déjà utilisé, ou champ manquant.');
    } finally {
      setEnvoi(false);
    }
  };

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try { await api.delete(`/utilisateurs/${id}`); charger(); }
    catch { window.alert('Impossible : cet utilisateur est lié à des offres/entretiens.'); }
  };

  return (
    <div>
      <div className="param-tete">
        <button className="param-add" onClick={ouvrir}><Plus size={16} /> Créer le compte</button>
      </div>

      <div className="param-liste">
        {users.length === 0 ? <p className="param-vide">Aucun utilisateur.</p> : users.map((u) => (
          <div key={u.id} className="param-item">
            <span className="param-item-nom">
              {u.nom} {u.prenom}
              <span className="param-item-sec"> · {u.login} · {u.role} · {u.email}</span>
            </span>
            <button className="param-del" onClick={() => supprimer(u.id)}><Trash2 size={16} /></button>
          </div>
        ))}
      </div>

      {modalOuvert && (
        <div className="modal-overlay" onClick={fermer}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nouveau compte utilisateur</h2>
              <button className="modal-close" onClick={fermer}><X size={20} /></button>
            </div>

            {erreur && <div className="modal-erreur">{erreur}</div>}

            <form onSubmit={ajouter}>
              <div className="form-row2">
                <div>
                  <label>Nom</label>
                  <input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} required />
                </div>
                <div>
                  <label>Prénom</label>
                  <input value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} required />
                </div>
              </div>

              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />

              <div className="form-row2">
                <div>
                  <label>Identifiant (login)</label>
                  <input value={form.login} onChange={(e) => setForm({ ...form, login: e.target.value })} required />
                </div>
                <div>
                  <label>Téléphone</label>
                  <input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
                </div>
              </div>

              <label>Rôle</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="RH">RH</option>
                <option value="DG">DG</option>
                <option value="Administrateur">Administrateur</option>
              </select>

              <label>Mot de passe</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />

              <div className="modal-actions">
                <button type="button" className="btn-annuler" onClick={fermer}>Annuler</button>
                <button type="submit" className="btn-publier" disabled={envoi}>
                  {envoi ? 'Création…' : 'Créer le compte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


function RefManager({ section }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [erreur, setErreur] = useState('');

  const charger = () => api.get(section.endpoint).then((r) => setItems(r.data)).catch(() => {});

  useEffect(() => { charger(); setForm({}); setErreur(''); }, [section.cle]);

  const ajouter = async (e) => {
    e.preventDefault();
    setErreur('');
    try {
      await api.post(section.endpoint, form);
      setForm({});
      charger();
    } catch {
      setErreur('Vérifie les champs (le champ principal est requis).');
    }
  };

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer cet élément ?')) return;
    try {
      await api.delete(`${section.endpoint}/${id}`);
      charger();
    } catch {
      window.alert('Impossible de supprimer : cet élément est peut-être utilisé ailleurs.');
    }
  };

  return (
    <div>
      <form className="param-form" onSubmit={ajouter}>
        {section.champs.map((c) => (
          <input
            key={c.name}
            type={c.type}
            placeholder={c.label}
            value={form[c.name] ?? ''}
            onChange={(e) => setForm({ ...form, [c.name]: e.target.value })}
            required={c.name === section.principal}
            style={c.type === 'number' ? { maxWidth: 120, flex: 'none' } : {}}
          />
        ))}
        <button type="submit" className="param-add"><Plus size={16} /> Ajouter</button>
      </form>

      {erreur && <div className="param-erreur">{erreur}</div>}

      <div className="param-liste">
        {items.length === 0 ? <p className="param-vide">Aucun élément.</p> : items.map((it) => (
          <div key={it.id} className="param-item">
            <span className="param-item-nom">
              {it[section.principal]}
              {section.secondaire && <span className="param-item-sec"> {section.prefixe}{it[section.secondaire]}</span>}
            </span>
            <button className="param-del" onClick={() => supprimer(it.id)}><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Parametres() {
  const [active, setActive] = useState(SECTIONS[0].cle);
  const section = SECTIONS.find((s) => s.cle === active);

  return (
    <Layout title="Paramètres" active="Paramètres">
      <h1 className="param-title">Paramètres</h1>
      <p className="param-subtitle">Gérez les données de référence de la plateforme.</p>

      <div className="param-tabs">
        {SECTIONS.map((s) => (
          <button key={s.cle} className={`param-tab ${active === s.cle ? 'actif' : ''}`} onClick={() => setActive(s.cle)}>
            {s.titre}
          </button>
        ))}
      </div>

      <div className="param-panneau">
        <h2>{section.titre}</h2>
        {section.custom ? <UtilisateursManager /> : <RefManager section={section} />}
      </div>
    </Layout>
  );
}