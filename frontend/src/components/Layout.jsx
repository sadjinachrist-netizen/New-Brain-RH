import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid, UserPlus, Users, IdCard, CalendarDays,
  Bell, Settings, LogOut, Search, HelpCircle,
} from 'lucide-react';
import './Layout.css';

export default function Layout({ title, active = 'Recrutement', children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { label: 'Tableau de bord', icon: LayoutGrid, path: '/tableau-de-bord' },
    { label: 'Recrutement', icon: UserPlus, path: '/offres' },
    { label: 'Candidatures', icon: Users, path: '/candidatures' },
    { label: 'Personnel', icon: IdCard, path: '/personnel' },
    { label: 'Congés & Permissions', icon: CalendarDays, path: '/conges' },
    { label: 'Notifications', icon: Bell },
    { label: 'Paramètres', icon: Settings, path: '/parametres' },
  ];

  const clic = (item) => {
    if (item.path) navigate(item.path);
    else window.alert(`« ${item.label} » : module à venir.`);
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-badge">NBF</div>
          <div>
            <div className="sidebar-logo-title">NBF RH</div>
            <div className="sidebar-logo-sub">MANAGEMENT RH</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`sidebar-item ${active === item.label ? 'active' : ''}`}
                onClick={() => clic(item)}
              >
                <Icon size={20} />
                {item.label}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-logout" onClick={logout}>
          <LogOut size={20} /> Déconnexion
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <h1 className="topbar-title">{title}</h1>
          <div className="topbar-search">
            <Search size={18} />
            <input placeholder="Rechercher une offre, un candidat..." />
          </div>
          <div className="topbar-right">
            <Bell size={20} className="topbar-icon" />
            <HelpCircle size={20} className="topbar-icon" />
            <div className="topbar-user">
              <div className="topbar-user-name">{user.prenom} {user.nom}</div>
              <div className="topbar-user-role">{user.role}</div>
            </div>
          </div>
        </header>

        <main className="content">{children}</main>
      </div>
    </div>
  );
}