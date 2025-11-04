import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Landing() {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();

      // Black Friday: Fourth Friday of November (day after Thanksgiving)
      // For 2025: November 28
      // Note: Month is 0-indexed, so 10 = November
      let blackFriday = new Date(currentYear, 10, 28, 0, 0, 0);
      let targetYear = currentYear;

      // If Black Friday has passed this year, show next year
      if (now > blackFriday) {
        blackFriday = new Date(currentYear + 1, 10, 28, 0, 0, 0);
        targetYear = currentYear + 1;
      }

      const difference = blackFriday - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds, total: difference, started: false, year: targetYear };
      }

      // Check if we're in season (Black Friday to Christmas Eve)
      const christmasEve = new Date(currentYear, 11, 24, 23, 59, 59);
      if (now >= blackFriday && now <= christmasEve) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, started: true, year: targetYear };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, started: false, year: targetYear };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return null;
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src="/images/logo.png"
            alt="Tree on a Truck"
            style={{ maxWidth: '400px', width: '100%', height: 'auto', marginBottom: '1.5rem' }}
          />

          <h1 style={{
            fontSize: '2.5rem',
            color: 'var(--color-primary)',
            marginBottom: '1rem',
            lineHeight: 1.2
          }}>
            The Ultimate Christmas Tree Spotting Competition!
          </h1>

          <p style={{
            fontSize: '1.25rem',
            color: 'var(--color-text)',
            marginBottom: '2rem',
            lineHeight: 1.6
          }}>
            Compete with friends and family to spot the most Christmas trees on vehicles this holiday season.
          </p>
        </div>

        {/* Countdown or Season Active */}
        {timeLeft.started ? (
          <div className="card" style={{
            background: 'linear-gradient(135deg, #0F7A4E 0%, #C41E3A 100%)',
            color: 'white',
            textAlign: 'center',
            border: '3px solid var(--color-accent)',
            marginBottom: '2rem'
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              🎄 THE SEASON IS ON! 🎄
            </h2>
            <p style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
              Get out there and start spotting trees!
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary" style={{
                backgroundColor: 'white',
                color: 'var(--color-primary)',
                fontSize: '1.125rem',
                padding: '0.75rem 2rem'
              }}>
                Join the Game
              </Link>
              <Link to="/login" className="btn btn-outline" style={{
                borderColor: 'white',
                color: 'white',
                fontSize: '1.125rem',
                padding: '0.75rem 2rem'
              }}>
                Team Login
              </Link>
            </div>
          </div>
        ) : (
          <div className="card" style={{
            background: 'linear-gradient(135deg, #C41E3A 0%, #0F7A4E 100%)',
            color: 'white',
            textAlign: 'center',
            border: '3px solid var(--color-accent)',
            marginBottom: '2rem'
          }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>
              ⏰ Season Starts in... ⏰
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem',
              maxWidth: '500px',
              margin: '0 auto 1.5rem'
            }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '1rem 0.5rem',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: '1' }}>
                  {timeLeft.days}
                </div>
                <div style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.9 }}>
                  {timeLeft.days === 1 ? 'Day' : 'Days'}
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '1rem 0.5rem',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: '1' }}>
                  {timeLeft.hours}
                </div>
                <div style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.9 }}>
                  {timeLeft.hours === 1 ? 'Hour' : 'Hours'}
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '1rem 0.5rem',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: '1' }}>
                  {timeLeft.minutes}
                </div>
                <div style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.9 }}>
                  Mins
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '1rem 0.5rem',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: '1' }}>
                  {timeLeft.seconds}
                </div>
                <div style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.9 }}>
                  Secs
                </div>
              </div>
            </div>

            <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem', opacity: 0.95 }}>
              Black Friday - November 28, {timeLeft.year}
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary" style={{
                backgroundColor: 'white',
                color: 'var(--color-primary)',
                fontSize: '1.125rem',
                padding: '0.75rem 2rem'
              }}>
                Create Your Team
              </Link>
              <Link to="/login" className="btn btn-outline" style={{
                borderColor: 'white',
                color: 'white',
                fontSize: '1.125rem',
                padding: '0.75rem 2rem'
              }}>
                Team Login
              </Link>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--color-primary)', marginBottom: '1.5rem', textAlign: 'center' }}>
            🎄 How It Works
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '0.5rem'
              }}>
                1️⃣
              </div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                Form Your Team
              </h3>
              <p style={{ color: 'var(--color-text)', lineHeight: 1.6 }}>
                Create a team account and add your family or friends as players.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '0.5rem'
              }}>
                2️⃣
              </div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                Spot Trees
              </h3>
              <p style={{ color: 'var(--color-text)', lineHeight: 1.6 }}>
                See a Christmas tree on a vehicle? Shout "TREE!" and tap the + button!
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '0.5rem'
              }}>
                3️⃣
              </div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                Compete & Win
              </h3>
              <p style={{ color: 'var(--color-text)', lineHeight: 1.6 }}>
                Track your progress and compete on the leaderboards. Bragging rights guaranteed!
              </p>
            </div>
          </div>
        </div>

        {/* Season Info */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, #0F7A4E20, #C41E3A20)',
          border: '2px solid var(--color-primary)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: 'var(--color-primary)', marginBottom: '1rem', textAlign: 'center' }}>
            📅 Season Information
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏁</div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Season Start</div>
              <div style={{ color: 'var(--color-text-light)' }}>Black Friday</div>
              <div style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>November 28</div>
            </div>

            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎁</div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Season End</div>
              <div style={{ color: 'var(--color-text-light)' }}>Christmas Eve</div>
              <div style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>December 24</div>
            </div>

            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📏</div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Game Rules</div>
              <div style={{ color: 'var(--color-text-light)' }}>Honor System</div>
              <div style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>Just for fun!</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="card">
          <h2 style={{ color: 'var(--color-primary)', marginBottom: '1.5rem', textAlign: 'center' }}>
            ✨ Features
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--color-bg)',
              borderRadius: '8px',
              borderLeft: '4px solid var(--color-primary)'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏆</div>
              <strong>Live Leaderboards</strong>
              <p style={{ margin: '0.5rem 0 0', color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
                Track team and individual rankings in real-time
              </p>
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--color-bg)',
              borderRadius: '8px',
              borderLeft: '4px solid var(--color-secondary)'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📱</div>
              <strong>Mobile Friendly</strong>
              <p style={{ margin: '0.5rem 0 0', color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
                Perfect for on-the-go tree spotting
              </p>
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--color-bg)',
              borderRadius: '8px',
              borderLeft: '4px solid var(--color-accent)'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏱️</div>
              <strong>Live Countdown</strong>
              <p style={{ margin: '0.5rem 0 0', color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
                Count down to Christmas Eve together
              </p>
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--color-bg)',
              borderRadius: '8px',
              borderLeft: '4px solid var(--color-primary)'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👥</div>
              <strong>Team Management</strong>
              <p style={{ margin: '0.5rem 0 0', color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
                Easy player management and score tracking
              </p>
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--color-bg)',
              borderRadius: '8px',
              borderLeft: '4px solid var(--color-secondary)'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📜</div>
              <strong>Official Rules</strong>
              <p style={{ margin: '0.5rem 0 0', color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
                Clear game rules for fair play
              </p>
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--color-bg)',
              borderRadius: '8px',
              borderLeft: '4px solid var(--color-accent)'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔒</div>
              <strong>Private Teams</strong>
              <p style={{ margin: '0.5rem 0 0', color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
                Secure team accounts with password protection
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          padding: '2rem',
          background: 'linear-gradient(135deg, #0F7A4E10, #C41E3A10)',
          borderRadius: '12px'
        }}>
          <h2 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
            Ready to Start Spotting?
          </h2>
          <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem', color: 'var(--color-text)' }}>
            Join the fun and create your team today!
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary" style={{
              fontSize: '1.125rem',
              padding: '0.75rem 2rem'
            }}>
              Create Team
            </Link>
            <Link to="/login" className="btn btn-outline" style={{
              fontSize: '1.125rem',
              padding: '0.75rem 2rem'
            }}>
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
