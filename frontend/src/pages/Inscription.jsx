import { useState } from 'react';
import apiCandidat from '../api/axiosCandidat';
import './CandidatAuth.css';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';

export default function Inscription() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next');
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', telephone: '', password: '', password_confirmation: '' });
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const maj = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErreur('');
    if (form.password !== form.password_confirmation) {
      setErreur('Les mots de passe ne correspondent pas.');
      return;
    }
    setEnvoi(true);
    try {
      const r = await apiCandidat.post('/candidat/register', form);
      localStorage.setItem('candidat_token', r.data.token);
      localStorage.setItem('candidat', JSON.stringify(r.data.candidat));
      navigate(next || '/candidat/dashboard');
    } catch (err) {
      const errs = err.response?.data?.errors;
      setErreur(errs ? Object.values(errs)[0][0] : (err.response?.data?.message || "Erreur lors de l'inscription."));
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-carte">
        <div className="auth-logo">New Brain Factory</div>
        <h1>Créer un compte candidat</h1>
        <p className="auth-sub">Postulez à nos offres en quelques clics.</p>

        {erreur && <div className="auth-erreur">{erreur}</div>}

        <form onSubmit={submit}>
          <div className="auth-row">
            <div><label>Nom</label><input name="nom" value={form.nom} onChange={maj} required /></div>
            <div><label>Prénom</label><input name="prenom" value={form.prenom} onChange={maj} required /></div>
          </div>
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={maj} required />
          <label>Téléphone</label>
          <input name="telephone" value={form.telephone} onChange={maj} />
          <div className="auth-row">
            <div>
              <label>Mot de passe</label>
              <div className="auth-pwd">
                <input type={showPwd ? 'text' : 'password'} name="password" value={form.password} onChange={maj} required />
                <button type="button" onClick={() => setShowPwd(!showPwd)} aria-label="Afficher/masquer le mot de passe">
                  {showPwd ? '🙈' : '👁'}
                </button>
              </div>
            </div>
            <div>
              <label>Confirmer</label>
              <input type={showPwd ? 'text' : 'password'} name="password_confirmation" value={form.password_confirmation} onChange={maj} required />
            </div>
          </div>
          <button type="submit" className="auth-btn" disabled={envoi}>{envoi ? 'Création…' : 'Créer mon compte'}</button>
        </form>

        <p className="auth-bas">Déjà un compte ? <Link to={`/candidat/connexion${next ? `?next=${next}` : ''}`}>Se connecter</Link></p>
        <p className="auth-bas"><Link to="/emplois">← Retour aux offres</Link></p>
      </div>
    </div>
  );
}