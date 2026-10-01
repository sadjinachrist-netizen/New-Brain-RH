import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, CheckCircle2, Send, ArrowLeft } from 'lucide-react';
import apiCandidat from '../api/axiosCandidat';
import './Postuler.css';

export default function Postuler() {
  const { lien } = useParams();
  const navigate = useNavigate();
  const candidat = JSON.parse(localStorage.getItem('candidat') || '{}');
  const [offre, setOffre] = useState(null);
  const [erreurChargement, setErreurChargement] = useState('');
  const [form, setForm] = useState({ adresse: candidat.adresse || '', date_naissance: candidat.date_naissance || '' });
  const [fichiers, setFichiers] = useState({});
  const [envoi, setEnvoi] = useState(false);
  const [succes, setSucces] = useState(false);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    apiCandidat.get(`/postuler/${lien}`)
      .then((res) => setOffre(res.data))
      .catch((err) => setErreurChargement(err.response?.data?.message || 'Offre introuvable.'));
  }, [lien]);

  const majForm = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const setFichier = (docId, file) => setFichiers((prev) => ({ ...prev, [docId]: file }));

  const envoyer = async (e) => {
    e.preventDefault();
    setErreur('');

    const manquant = (offre.documents || []).find((d) => d.pivot?.obligatoire && !fichiers[d.id]);
    if (manquant) { setErreur(`Le document « ${manquant.libelle} » est obligatoire.`); return; }

    setEnvoi(true);
    try {
      const data = new FormData();
      data.append('adresse', form.adresse);
      data.append('date_naissance', form.date_naissance);
      Object.entries(fichiers).forEach(([docId, file]) => { if (file) data.append(`documents[${docId}]`, file); });
      await apiCandidat.post(`/candidat/postuler/${lien}`, data);
      setSucces(true);
    } catch (err) {
      if (err.response?.status === 401) { navigate('/candidat/connexion'); return; }
      setErreur(err.response?.data?.message || "Erreur lors de l'envoi.");
    } finally {
      setEnvoi(false);
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

  if (erreurChargement) return <div className="postuler-etat">{erreurChargement}</div>;
  if (!offre) return <div className="postuler-etat">Chargement…</div>;
  if (succes) {
    return (
      <div className="postuler-etat succes">
        <CheckCircle2 size={56} color="#16A34A" />
        <h2>Candidature envoyée !</h2>
        <p>Merci {candidat.prenom}. Vous pouvez suivre son statut dans votre espace.</p>
        <button className="btn-envoyer" style={{ maxWidth: 260, marginTop: 16 }} onClick={() => navigate('/candidat/dashboard')}>
          Aller à mon espace
        </button>
      </div>
    );
  }

  return (
    <div className="postuler-page">
      <header className="postuler-topbar">
        <div className="postuler-logo">New Brain Factory RH</div>
        <button className="postuler-retour" onClick={() => navigate('/emplois')}>
          <ArrowLeft size={16} /> Retour aux offres
        </button>
      </header>

      <div className="postuler-fildariane">
        Offres d'emploi <span>›</span> {offre.domaine?.libelle} <span>›</span> <strong>Postuler</strong>
      </div>

      <div className="postuler-grid">
        {/* Gauche : détails de l'offre */}
        <div className="postuler-offre">
          <div className="postuler-banniere">
            <h1>{offre.titre}</h1>
            <div className="postuler-tags">{offre.domaine && <span>{offre.domaine.libelle}</span>}</div>
          </div>

          <div className="postuler-corps">
            <h3>Détails de l'offre</h3>
            <div className="postuler-details">
              <div className="detail-case"><span>Poste</span><strong>{offre.titre}</strong></div>
              <div className="detail-case"><span>Département</span><strong>{offre.domaine?.libelle || '—'}</strong></div>
              <div className="detail-case"><span>Date limite</span><strong className="rouge">{formatDate(offre.date_limite)}</strong></div>
            </div>

            <div className="postuler-description" dangerouslySetInnerHTML={{ __html: offre.description }} />

            {offre.documents?.length > 0 && (
              <>
                <h3 className="postuler-docs-titre"><FileText size={18} /> Documents à fournir</h3>
                <div className="postuler-docs">
                  {offre.documents.map((d) => (
                    <div key={d.id} className="postuler-doc">{d.libelle}{d.pivot?.obligatoire ? ' *' : ''}</div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Droite : formulaire candidature */}
        <div className="postuler-form">
          <h2>Votre candidature</h2>
          <div className="postuler-compte">
            Connecté en tant que <strong>{candidat.prenom} {candidat.nom}</strong> — {candidat.email}
          </div>
          {erreur && <div className="postuler-erreur">{erreur}</div>}

          <form onSubmit={envoyer}>
            <label>Date de naissance</label>
            <input type="date" name="date_naissance" value={form.date_naissance} onChange={majForm} />

            <label>Adresse</label>
            <input name="adresse" value={form.adresse} onChange={majForm} />

            <label>Documents</label>
            {offre.documents?.length ? (
              <div className="postuler-champs-docs">
                {offre.documents.map((d) => (
                  <div key={d.id} className="doc-champ">
                    <div className="doc-champ-tete">
                      <span className="doc-champ-nom">{d.libelle}</span>
                      {d.pivot?.obligatoire
                        ? <span className="doc-champ-oblig">obligatoire</span>
                        : <span className="doc-champ-opt">optionnel</span>}
                    </div>
                    <input type="file" onChange={(e) => setFichier(d.id, e.target.files[0] || null)} />
                    {fichiers[d.id] && (
                      <div className="doc-champ-fichier">
                        <FileText size={14} /> {fichiers[d.id].name} ({(fichiers[d.id].size / 1024).toFixed(0)} Ko)
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="postuler-vide">Aucun document requis pour cette offre.</p>
            )}

            <button type="submit" className="btn-envoyer" disabled={envoi}>
              {envoi ? 'Envoi…' : <>Envoyer ma candidature <Send size={16} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}