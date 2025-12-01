import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { removeToken } from '../services/api';

function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    removeToken();
    window.location.href = '/';
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
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

        {/* Hamburger Button - Only visible on mobile */}
        <button
          className="hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.75rem',
            cursor: 'pointer',
            padding: '0.5rem',
            lineHeight: 1
          }}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>

        {/* Desktop Navigation */}
        <nav className="nav nav-desktop" style={{
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
          <NavLink to="/calendar" className="nav-link" style={{ padding: '0.4rem 0.6rem', fontSize: '0.875rem' }}>
            Calendar
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

        {/* Mobile Navigation Menu */}
        <nav
          className={`nav nav-mobile ${isMenuOpen ? 'open' : ''}`}
          style={{
            display: 'none',
            position: 'fixed',
            top: '60px',
            left: 0,
            right: 0,
            backgroundColor: '#165a32',
            flexDirection: 'column',
            padding: '1rem',
            gap: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            maxHeight: isMenuOpen ? '500px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease-in-out'
          }}
        >
          <NavLink
            to="/dashboard"
            className="nav-link"
            onClick={closeMenu}
            style={{
              padding: '0.75rem 1rem',
              fontSize: '1rem',
              textAlign: 'left',
              width: '100%'
            }}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/leaderboards"
            className="nav-link"
            onClick={closeMenu}
            style={{
              padding: '0.75rem 1rem',
              fontSize: '1rem',
              textAlign: 'left',
              width: '100%'
            }}
          >
            Standings
          </NavLink>
          <NavLink
            to="/calendar"
            className="nav-link"
            onClick={closeMenu}
            style={{
              padding: '0.75rem 1rem',
              fontSize: '1rem',
              textAlign: 'left',
              width: '100%'
            }}
          >
            Calendar
          </NavLink>
          <NavLink
            to="/countdown"
            className="nav-link"
            onClick={closeMenu}
            style={{
              padding: '0.75rem 1rem',
              fontSize: '1rem',
              textAlign: 'left',
              width: '100%'
            }}
          >
            Countdown
          </NavLink>
          <NavLink
            to="/rules"
            className="nav-link"
            onClick={closeMenu}
            style={{
              padding: '0.75rem 1rem',
              fontSize: '1rem',
              textAlign: 'left',
              width: '100%'
            }}
          >
            Rules
          </NavLink>
          <NavLink
            to="/contact"
            className="nav-link"
            onClick={closeMenu}
            style={{
              padding: '0.75rem 1rem',
              fontSize: '1rem',
              textAlign: 'left',
              width: '100%'
            }}
          >
            Contact
          </NavLink>
          <NavLink
            to="/profile"
            className="nav-link"
            onClick={closeMenu}
            style={{
              padding: '0.75rem 1rem',
              fontSize: '1rem',
              textAlign: 'left',
              width: '100%'
            }}
          >
            Profile
          </NavLink>
          <button
            onClick={() => {
              closeMenu();
              handleLogout();
            }}
            className="nav-link"
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 500,
              padding: '0.75rem 1rem',
              textAlign: 'left',
              width: '100%'
            }}
          >
            Logout
          </button>
        </nav>
      </div>

      {/* CSS for responsive behavior */}
      <style>{`
        @media (max-width: 768px) {
          .hamburger {
            display: block !important;
          }

          .nav-desktop {
            display: none !important;
          }

          .nav-mobile {
            display: flex !important;
          }

          .nav-mobile.open {
            max-height: 500px;
          }
        }
      `}</style>
    </header>
  );
}

export default Header;
