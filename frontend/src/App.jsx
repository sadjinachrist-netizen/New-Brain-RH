import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Offres from './pages/Offres';
import Postuler from './pages/Postuler';
import Candidatures from './pages/Candidatures';
import GlobalCandidatures from './pages/GlobalCandidatures';
import OffreDetail from './pages/OffreDetail';
import Parametres from './pages/Parametres';
import TableauDeBord from './pages/TableauDeBord';
import OffresPubliques from './pages/OffresPubliques';
import Inscription from './pages/Inscription';
import Connexion from './pages/Connexion';
import CandidatDashboard from './pages/CandidatDashboard';
import OffreDetailPublique from './pages/OffreDetailPublique';
import Personnel from './pages/Personnel';
import EmployeDetail from './pages/EmployeDetail';
import ConnexionEmploye from './pages/ConnexionEmploye';
import EspacePersonnel from './pages/EspacePersonnel';
import CongesPermissions from './pages/CongesPermissions';

function RouteProtegee({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function RouteProtegeeCandidat({ children }) {
  const token = localStorage.getItem('candidat_token');
  return token ? children : <Navigate to="/candidat/connexion" />;
}

function RouteEmploye({ children }) {
  const token = localStorage.getItem('employe_token');
  return token ? children : <Navigate to="/employe/connexion" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Espace RH */}
        <Route path="/offres" element={<RouteProtegee><Offres /></RouteProtegee>} />
        <Route path="/offres/:id/candidatures" element={<RouteProtegee><Candidatures /></RouteProtegee>} />
        <Route path="/candidatures" element={<RouteProtegee><GlobalCandidatures /></RouteProtegee>} />
        <Route path="/offres/:id" element={<RouteProtegee><OffreDetail /></RouteProtegee>} />
        <Route path="/parametres" element={<RouteProtegee><Parametres /></RouteProtegee>} />
        <Route path="/tableau-de-bord" element={<RouteProtegee><TableauDeBord /></RouteProtegee>} />
        <Route path="/personnel" element={<RouteProtegee><Personnel /></RouteProtegee>} />
        <Route path="/personnel/:id" element={<RouteProtegee><EmployeDetail /></RouteProtegee>} />
        <Route path="/conges" element={<RouteProtegee><CongesPermissions /></RouteProtegee>} />

        {/* Espace employé */}
        <Route path="/employe/connexion" element={<ConnexionEmploye />} />
        <Route path="/espace-personnel" element={<RouteEmploye><EspacePersonnel /></RouteEmploye>} />

        {/* Espace candidat / public */}
        <Route path="/emplois" element={<OffresPubliques />} />
        <Route path="/offre/:lien" element={<OffreDetailPublique />} />
        <Route path="/candidat/inscription" element={<Inscription />} />
        <Route path="/candidat/connexion" element={<Connexion />} />
        <Route path="/candidat/dashboard" element={<RouteProtegeeCandidat><CandidatDashboard /></RouteProtegeeCandidat>} />
        <Route path="/postuler/:lien" element={<RouteProtegeeCandidat><Postuler /></RouteProtegeeCandidat>} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}