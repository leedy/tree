import { NavLink, useNavigate } from 'react-router-dom';
import { removeToken } from '../services/api';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    window.location.href = '/';
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img
            src="/images/logo.png"
            alt="Tree on a Truck"
            style={{ height: '40px', width: 'auto' }}
          />
          <span style={{
            fontSize: '1rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            Tree on a Truck
          </span>
        </div>
        <nav className="nav" style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          justifyContent: 'flex-end'
        }}>
          <NavLink to="/dashboard" className="nav-link" style={{ padding: '0.4rem 0.6rem', fontSize: '0.875rem' }}>
            Dashboard
          </NavLink>
          <NavLink to="/leaderboards" className="nav-link" style={{ padding: '0.4rem 0.6rem', fontSize: '0.875rem' }}>
            Standings
          </NavLink>
          <NavLink to="/countdown" className="nav-link" style={{ padding: '0.4rem 0.6rem', fontSize: '0.875rem' }}>
            Countdown
          </NavLink>
          <NavLink to="/rules" className="nav-link" style={{ padding: '0.4rem 0.6rem', fontSize: '0.875rem' }}>
            Rules
          </NavLink>
          <NavLink to="/contact" className="nav-link" style={{ padding: '0.4rem 0.6rem', fontSize: '0.875rem' }}>
            Contact
          </NavLink>
          <NavLink to="/profile" className="nav-link" style={{ padding: '0.4rem 0.6rem', fontSize: '0.875rem' }}>
            Profile
          </NavLink>
          <button
            onClick={handleLogout}
            className="nav-link"
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
              padding: '0.4rem 0.6rem'
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
