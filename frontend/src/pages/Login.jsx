import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Login.css';
import illustration from '../assets/illustration-rh.png';

export default function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);
    try {
      const res = await api.post('/login', { login, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/tableau-de-bord');
    } catch {
      setErreur('Identifiants incorrects.');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="login-container">
      {/* ---- Panneau promo (gauche) ---- */}
            <aside className="login-promo">
        <div className="login-logo">NBF</div>

        <div className="login-promo-bottom">
          <div className="login-promo-text">
            <h1>Gérez vos recrutements et votre personnel en toute simplicité</h1>
            <p>La solution RH intelligente pour optimiser votre capital humain et propulser votre croissance.</p>
          </div>

          <div className="login-illu">
            <img src={illustration} alt="Illustration RH" />
          </div>
        </div>
      </aside>

      
      {/* ---- Panneau formulaire (droite) ---- */}
      <main className="login-form-panel">
        <div className="login-form">
          <h2>Connexion</h2>
          <p className="login-sub">Ravie de vous revoir sur votre portail RH.</p>

          {erreur && <div className="login-error">{erreur}</div>}

          <form onSubmit={handleSubmit}>
            <label>Identifiant ou email</label>
            <input type="text" placeholder="nom@entreprise.com" value={login} onChange={(e) => setLogin(e.target.value)} required />

            <div className="login-label-row">
              <label>Mot de passe</label>
              <a href="#" className="login-link">Mot de passe oublié ?</a>
            </div>
            <div className="login-pwd">
              <input type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPwd(!showPwd)} aria-label="Afficher/masquer le mot de passe">
                {showPwd ? '🙈' : '👁'}
              </button>
            </div>

            <label className="login-remember">
              <input type="checkbox" /> Se souvenir de moi
            </label>

            <button type="submit" className="login-submit" disabled={chargement}>
              {chargement ? 'Connexion…' : 'Se connecter →'}
            </button>
          </form>

          <div className="login-divider"><span>OU</span></div>

          <p className="login-candidat">
            Vous êtes candidat ? <a href="#" className="login-link-bold">Créer un compte</a>
          </p>

          <div className="login-footer">
            <a href="#">Besoin d'aide ?</a>
            <a href="#">Conditions d'utilisation</a>
            <a href="#">Confidentialité</a>
          </div>
        </div>
      </main>
    </div>
  );
}