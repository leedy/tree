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
        <h1 className="header-title">🎄 Tree on a Truck</h1>
        <nav className="nav">
          <NavLink to="/dashboard" className="nav-link">
            Dashboard
          </NavLink>
          <NavLink to="/leaderboards" className="nav-link">
            Leaderboards
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
