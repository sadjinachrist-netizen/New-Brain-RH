import { useState } from 'react';
import apiCandidat from '../api/axiosCandidat';
import './CandidatAuth.css';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';

export default function Connexion() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next');
  const [form, setForm] = useState({ email: '', password: '' });
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const maj = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErreur('');
    setEnvoi(true);
    try {
      const r = await apiCandidat.post('/candidat/login', form);
      localStorage.setItem('candidat_token', r.data.token);
      localStorage.setItem('candidat', JSON.stringify(r.data.candidat));
      navigate(next || '/candidat/dashboard');
    } catch (err) {
      setErreur(err.response?.data?.message || 'Email ou mot de passe incorrect.');
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-carte">
        <div className="auth-logo">New Brain Factory</div>
        <h1>Connexion candidat</h1>
        <p className="auth-sub">Accédez à votre espace et à vos candidatures.</p>

        {erreur && <div className="auth-erreur">{erreur}</div>}

        <form onSubmit={submit}>
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={maj} required />

          <label>Mot de passe</label>
          <div className="auth-pwd">
            <input type={showPwd ? 'text' : 'password'} name="password" value={form.password} onChange={maj} required />
            <button type="button" onClick={() => setShowPwd(!showPwd)} aria-label="Afficher/masquer le mot de passe">
              {showPwd ? '🙈' : '👁'}
            </button>
          </div>

          <button type="submit" className="auth-btn" disabled={envoi}>{envoi ? 'Connexion…' : 'Se connecter'}</button>
        </form>

        <p className="auth-bas">Pas encore de compte ? <Link to={`/candidat/inscription${next ? `?next=${next}` : ''}`}>Créer un compte</Link></p>
        <p className="auth-bas"><Link to="/emplois">← Retour aux offres</Link></p>
      </div>
    </div>
  );
}