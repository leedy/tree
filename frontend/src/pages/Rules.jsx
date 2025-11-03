function Rules() {
  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card">
          <h2 style={{ color: 'var(--color-primary)', marginBottom: '1rem', textAlign: 'center' }}>
            🎄 Tree on a Truck Rules 🎄
          </h2>
          <p style={{
            textAlign: 'center',
            color: 'var(--color-text-light)',
            fontSize: '1.125rem',
            marginBottom: '1.5rem',
            fontStyle: 'italic'
          }}>
            Honor System. This is just for fun.
          </p>
        </div>

        {/* Game Period */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, #0F7A4E20, #C41E3A20)',
          border: '2px solid var(--color-primary)'
        }}>
          <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
            📅 Game Period
          </h3>
          <p style={{ fontSize: '1rem', lineHeight: '1.8' }}>
            Game starts <strong>Black Friday</strong> and ends <strong>Christmas morning</strong>.
          </p>
        </div>

        {/* Core Rules */}
        <div className="card">
          <h3 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
            📋 Core Rules
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--color-bg)',
              borderRadius: '8px',
              borderLeft: '4px solid var(--color-primary)'
            }}>
              <strong>Calling Trees:</strong> You <strong>MUST</strong> call the tree by shouting <strong>"TREE!"</strong> to claim it.
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--color-bg)',
              borderRadius: '8px',
              borderLeft: '4px solid var(--color-primary)'
            }}>
              <strong>Vehicle Requirement:</strong> Tree must be inside, on top of, or otherwise touching a vehicle.
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--color-bg)',
              borderRadius: '8px',
              borderLeft: '4px solid var(--color-primary)'
            }}>
              <strong>Scoring:</strong> 1 point given per tree called.
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--color-bg)',
              borderRadius: '8px',
              borderLeft: '4px solid var(--color-secondary)'
            }}>
              <strong>Group Outings:</strong> Only 1 person in a group can call the same tree during an outing.
              <br />
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', fontStyle: 'italic' }}>
                Exception: If it's a TRUE tie, each person who called it can count the tree.
              </span>
            </div>
          </div>
        </div>

        {/* Multiple Trees */}
        <div className="card" style={{ backgroundColor: '#DBEAFE' }}>
          <h3 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
            🎄🎄 Multiple Trees on One Vehicle
          </h3>
          <ul style={{
            marginLeft: '1.5rem',
            lineHeight: '1.8',
            color: 'var(--color-text)'
          }}>
            <li>Each tree <strong>MUST</strong> be called individually to get the point</li>
            <li>If a vehicle has more than 5 trees and the number cannot be determined, the caller can get a maximum of <strong>5 points</strong> for that vehicle</li>
          </ul>
        </div>

        {/* What Counts */}
        <div className="card">
          <h3 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
            ✅ What Counts
          </h3>
          <ul style={{
            marginLeft: '1.5rem',
            lineHeight: '1.8',
            color: 'var(--color-text)'
          }}>
            <li><strong>Christmas Trees only</strong> - No landscaping trees</li>
            <li>Artificial trees in boxes are allowed</li>
            <li>Do not call false trees - Don't see that kayak in the distance and call it as a tree "just in case"</li>
          </ul>
        </div>

        {/* Fun Stuff (No Points) */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, #FFD70020, #C41E3A20)',
          border: '2px solid var(--color-accent)'
        }}>
          <h3 style={{ color: 'var(--color-secondary)', marginBottom: '1rem' }}>
            🎅 Fun Stuff (No Points)
          </h3>
          <p style={{ fontSize: '1rem', lineHeight: '1.8' }}>
            You can call antlers, Rudolph noses, or wreaths, but they <strong>do not count for scoring</strong>.
          </p>
        </div>

        {/* Safety Warning */}
        <div className="card" style={{
          backgroundColor: '#FEE2E2',
          border: '2px solid var(--color-secondary)'
        }}>
          <h3 style={{ color: 'var(--color-secondary)', marginBottom: '0.75rem' }}>
            ⚠️ Safety First!
          </h3>
          <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--color-secondary)' }}>
            Drivers: Do NOT crash while looking for trees.
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center', backgroundColor: 'var(--color-bg)' }}>
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--color-primary)',
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>
            Remember: It's all about having fun! 🎄
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
            Happy hunting and may the best team win!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Rules;
