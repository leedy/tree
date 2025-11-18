import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendContactMessage } from '../services/api';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (message.length < 10) {
      setError('Message must be at least 10 characters');
      return;
    }

    if (message.length > 2000) {
      setError('Message must be less than 2000 characters');
      return;
    }

    setLoading(true);

    try {
      await sendContactMessage(name, email, message);
      setSuccess(true);
      // Clear form
      setName('');
      setEmail('');
      setMessage('');
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
            Contact Us
          </h1>
          <p style={{ color: 'var(--color-text-light)', fontSize: '1.125rem' }}>
            Have a question or problem? Send us a message!
          </p>
        </div>

        {success && (
          <div
            style={{
              backgroundColor: 'var(--color-success)',
              color: 'white',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}
          >
            <strong>Success!</strong> Your message has been sent. We'll get back to you soon!
          </div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                className="input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind..."
                rows="6"
                required
                disabled={loading}
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              />
              <small style={{ color: 'var(--color-text-light)', marginTop: '0.5rem', display: 'block' }}>
                {message.length}/2000 characters
              </small>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className={`btn btn-primary btn-full ${loading ? 'btn-disabled' : ''}`}
              disabled={loading}
              style={{ marginTop: '1rem' }}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Link
              to="/"
              style={{ color: 'var(--color-primary)', fontWeight: 600 }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
