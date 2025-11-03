import { NavLink, useNavigate } from 'react-router-dom';
import { removeToken } from '../services/api';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    window.location.href = '/login';
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img
            src="/images/logo.png"
            alt="Tree on a Truck"
            style={{ height: '50px', width: 'auto' }}
          />
          <span>Tree on a Truck</span>
        </div>
        <nav className="nav">
          <NavLink to="/dashboard" className="nav-link">
            Dashboard
          </NavLink>
          <NavLink to="/leaderboards" className="nav-link">
            Leaderboards
          </NavLink>
          <NavLink to="/countdown" className="nav-link">
            Countdown
          </NavLink>
          <NavLink to="/rules" className="nav-link">
            Rules
          </NavLink>
          <button
            onClick={handleLogout}
            className="nav-link"
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: 'inherit',
              fontWeight: 500
            }}
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
