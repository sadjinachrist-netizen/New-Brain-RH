import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiEmploye from '../api/axiosEmploye';
import './CandidatAuth.css';

export default function ConnexionEmploye() {
  const navigate = useNavigate();
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
      const r = await apiEmploye.post('/employe/login', form);
      localStorage.setItem('employe_token', r.data.token);
      localStorage.setItem('employe', JSON.stringify(r.data.user));
      navigate('/espace-personnel');
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
        <h1>Connexion employé</h1>
        <p className="auth-sub">Accédez à votre espace personnel.</p>
        {erreur && <div className="auth-erreur">{erreur}</div>}
        <form onSubmit={submit}>
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={maj} required />
          <label>Mot de passe</label>
          <div className="auth-pwd">
            <input type={showPwd ? 'text' : 'password'} name="password" value={form.password} onChange={maj} required />
            <button type="button" onClick={() => setShowPwd(!showPwd)} aria-label="Afficher/masquer">{showPwd ? '🙈' : '👁'}</button>
          </div>
          <button type="submit" className="auth-btn" disabled={envoi}>{envoi ? 'Connexion…' : 'Se connecter'}</button>
        </form>
        <p className="auth-bas"><Link to="/login">← Connexion RH</Link></p>
      </div>
    </div>
  );
}