import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';
import './OffreFormModal.css';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function OffreFormModal({ onClose, onCreated }) {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [domaineId, setDomaineId] = useState('');
  const [dateLimite, setDateLimite] = useState('');
  const [domaines, setDomaines] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [docsChoisis, setDocsChoisis] = useState([]);
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    api.get('/domaines').then((r) => setDomaines(r.data)).catch(() => {});
    api.get('/documents').then((r) => setDocuments(r.data)).catch(() => {});
  }, []);

  // Ajouter / retirer un document (optionnel par défaut)
  const toggleDoc = (id) => {
    setDocsChoisis((prev) =>
      prev.find((d) => d.id === id)
        ? prev.filter((d) => d.id !== id)
        : [...prev, { id, obligatoire: false }]
    );
  };

  // Cocher / décocher « obligatoire »
  const toggleObligatoire = (id) => {
    setDocsChoisis((prev) =>
      prev.map((d) => (d.id === id ? { ...d, obligatoire: !d.obligatoire } : d))
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    setErreur('');
    setEnvoi(true);
    try {
      // La description vient d'un éditeur riche (HTML) → on vérifie qu'elle n'est pas vide
      const descTexte = description.replace(/<[^>]+>/g, '').trim();
      if (!descTexte) {
        setErreur('La description est obligatoire.');
        setEnvoi(false);
        return;
      }

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await api.post('/offres', {
        titre,
        description,
        domaine_id: domaineId,
        date_limite: dateLimite || null,
        utilisateur_id: user.id,
        documents: docsChoisis,
      });
      onCreated();
    } catch {
      setErreur('Erreur lors de la création. Vérifie les champs.');
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Publier une nouvelle offre</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        {erreur && <div className="modal-erreur">{erreur}</div>}

        <form onSubmit={submit}>
          <label>Intitulé du poste</label>
          <input value={titre} onChange={(e) => setTitre(e.target.value)} required />

          <label>Domaine</label>
          <select value={domaineId} onChange={(e) => setDomaineId(e.target.value)} required>
            <option value="">— Choisir —</option>
            {domaines.map((d) => <option key={d.id} value={d.id}>{d.libelle}</option>)}
          </select>

          <label>Date limite de candidature</label>
          <input type="date" value={dateLimite} onChange={(e) => setDateLimite(e.target.value)} />

          <label>Description</label>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link'],
                ['clean'],
              ],
            }}
          />

          <label>Documents à fournir</label>
          <select
            className="doc-select"
            value=""
            onChange={(e) => { if (e.target.value) toggleDoc(Number(e.target.value)); }}
          >
            <option value="">+ Ajouter un document…</option>
            {documents
              .filter((doc) => !docsChoisis.find((d) => d.id === doc.id))
              .map((doc) => <option key={doc.id} value={doc.id}>{doc.libelle}</option>)}
          </select>

          {docsChoisis.length > 0 && (
            <div className="doc-choisis">
              {docsChoisis.map((d) => {
                const doc = documents.find((x) => x.id === d.id);
                return (
                  <div key={d.id} className="doc-ligne">
                    <span className="doc-nom">{doc?.libelle}</span>
                    <div className="doc-droite">
                      <label className="doc-oblig">
                        <input
                          type="checkbox"
                          checked={d.obligatoire}
                          onChange={() => toggleObligatoire(d.id)}
                        />
                        <span>obligatoire</span>
                      </label>
                      <button type="button" className="doc-retirer" onClick={() => toggleDoc(d.id)}>
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          

          <div className="modal-actions">
            <button type="button" className="btn-annuler" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-publier" disabled={envoi}>{envoi ? 'Publication…' : "Publier l'offre"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}