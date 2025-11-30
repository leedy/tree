import { useState, useEffect } from 'react';

function ChristmasCountdown() {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();

      // Christmas Eve is December 24 at 9:00 PM (season end time)
      const christmasEve = new Date(currentYear, 11, 24, 21, 0, 0);

      // If Christmas Eve has passed this year, use next year
      if (now > christmasEve) {
        christmasEve.setFullYear(currentYear + 1);
      }

      const difference = christmasEve - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds, total: difference };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
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

  if (timeLeft.total === 0) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #C41E3A 0%, #0F7A4E 100%)',
        color: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        textAlign: 'center',
        border: '3px solid #FFD700'
      }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          🎄 Merry Christmas! 🎅
        </h3>
        <p style={{ fontSize: '1rem', opacity: 0.9 }}>
          The season has ended. See you next year!
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #C41E3A 0%, #0F7A4E 100%)',
      color: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      textAlign: 'center',
      border: '3px solid #FFD700',
      boxShadow: 'var(--shadow-festive)'
    }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 'bold' }}>
        ⏰ Season Ends Christmas Eve 9PM ⏰
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          padding: '1rem 0.5rem',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', lineHeight: '1' }}>
            {timeLeft.days}
          </div>
          <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.9 }}>
            {timeLeft.days === 1 ? 'Day' : 'Days'}
          </div>
        </div>

        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          padding: '1rem 0.5rem',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', lineHeight: '1' }}>
            {timeLeft.hours}
          </div>
          <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.9 }}>
            {timeLeft.hours === 1 ? 'Hour' : 'Hours'}
          </div>
        </div>

        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          padding: '1rem 0.5rem',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', lineHeight: '1' }}>
            {timeLeft.minutes}
          </div>
          <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.9 }}>
            {timeLeft.minutes === 1 ? 'Min' : 'Mins'}
          </div>
        </div>

        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          padding: '1rem 0.5rem',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', lineHeight: '1' }}>
            {timeLeft.seconds}
          </div>
          <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.9 }}>
            {timeLeft.seconds === 1 ? 'Sec' : 'Secs'}
          </div>
        </div>
      </div>

      <p style={{
        marginTop: '1rem',
        fontSize: '0.875rem',
        opacity: 0.9
      }}>
        🎄 Keep spotting those trees! 🎁
      </p>
    </div>
  );
}

export default ChristmasCountdown;
