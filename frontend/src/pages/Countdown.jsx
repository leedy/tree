import ChristmasCountdown from '../components/ChristmasCountdown';

function Countdown() {
  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <ChristmasCountdown />

        <div className="card" style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
            🎄 About the Season 🎄
          </h3>
          <p style={{ color: 'var(--color-text)', marginBottom: '1rem', lineHeight: '1.8' }}>
            The Tree on a Truck season runs from <strong>Black Friday</strong> (November 25)
            until <strong>Christmas Eve</strong> (December 24).
          </p>
          <p style={{ color: 'var(--color-text)', marginBottom: '1rem', lineHeight: '1.8' }}>
            Keep your eyes peeled for Christmas trees on vehicles and rack up those points!
            Every tree spotted counts towards your team's total and your individual score.
          </p>
          <p style={{ color: 'var(--color-text-light)', fontSize: '0.875rem', fontStyle: 'italic' }}>
            Remember: It's all on the honor system. Happy hunting! 🎅
          </p>
        </div>

        <div className="card" style={{
          marginTop: '2rem',
          background: 'linear-gradient(135deg, #0F7A4E20, #C41E3A20)',
          border: '2px solid var(--color-primary)'
        }}>
          <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
            🏆 Quick Stats
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                30
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                Days in Season
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                ∞
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                Trees to Spot
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                🎄
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                Holiday Cheer
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Countdown;
