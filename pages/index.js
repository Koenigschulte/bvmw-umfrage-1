import { useState, useEffect } from 'react';

export default function Survey() {
  const [selected, setSelected] = useState('');
  const [votes, setVotes] = useState({ A: 0, B: 0, C: 0 });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchVotes();
    const interval = setInterval(fetchVotes, 1000);
    return () => clearInterval(interval);
  }, []);

  async function fetchVotes() {
    const res = await fetch('/api/votes');
    const data = await res.json();
    setVotes(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selected) return;

    await fetch('/api/votes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ option: selected })
    });

    setSubmitted(true);
    setSelected('');
    setTimeout(() => setSubmitted(false), 1500);
    fetchVotes();
  }

  const total = votes.A + votes.B + votes.C;
  const pct = (opt) => total ? Math.round((votes[opt] / total) * 100) : 0;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.logos}>
          <div style={styles.logo}>AgiSolutions</div>
          <div style={styles.title}>
            <h1>BVMW Webinar</h1>
            <p>KI-Erfolg messbar machen</p>
          </div>
          <div style={styles.logo}>einfachKI</div>
        </div>

        <div style={styles.question}>
          <h2>Wie ist Ihre aktuelle KI-Situation?</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            {['A', 'B', 'C'].map(opt => (
              <label key={opt} style={styles.option}>
                <input type="radio" name="q" value={opt} checked={selected === opt} onChange={(e) => setSelected(e.target.value)} />
                <span>{opt === 'A' ? 'Noch keine Initiative' : opt === 'B' ? 'KI läuft — aber ungeplant' : 'KI mit Zielen — braucht Nachweis'}</span>
              </label>
            ))}
            <button type="submit" disabled={!selected} style={{...styles.button, opacity: selected ? 1 : 0.5}}>
              {submitted ? '✓ Abstimmung eingegangen' : 'Abstimmung abgeben'}
            </button>
          </form>
        </div>

        <div style={styles.results}>
          <h2>Live-Ergebnisse</h2>
          {['A', 'B', 'C'].map(opt => (
            <div key={opt} style={styles.resultItem}>
              <div style={styles.resultLabel}>{opt} — {opt === 'A' ? 'Noch keine Initiative' : opt === 'B' ? 'KI läuft — aber ungeplant' : 'KI mit Zielen — braucht Nachweis'}</div>
              <div style={styles.bar}>
                <div style={{...styles.fill, width: pct(opt) + '%'}} />
              </div>
              <div style={styles.stat}>{votes[opt]} Stimmen ({pct(opt)}%)</div>
            </div>
          ))}
          <div style={styles.total}>Gesamt: {total} Abstimmungen</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { background: 'linear-gradient(135deg, #006B7A 0%, #004A56 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' },
  container: { background: 'white', borderRadius: '12px', maxWidth: '800px', width: '100%', padding: '60px 40px 40px' },
  logos: { display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '40px', gap: '20px' },
  logo: { height: '60px', fontSize: '14px', color: '#006B7A', fontWeight: 'bold' },
  title: { textAlign: 'center' },
  question: { marginBottom: '50px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  option: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#f9f9f9', borderRadius: '6px', cursor: 'pointer' },
  button: { padding: '12px', background: '#006B7A', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  results: { background: '#f5f5f5', padding: '30px', borderRadius: '8px' },
  resultItem: { marginBottom: '20px' },
  resultLabel: { fontSize: '14px', fontWeight: 'bold', marginBottom: '6px' },
  bar: { height: '25px', background: '#ddd', borderRadius: '6px', overflow: 'hidden' },
  fill: { height: '100%', background: '#006B7A', transition: 'width 0.3s' },
  stat: { fontSize: '12px', color: '#666', marginTop: '4px' },
  total: { marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #ddd', textAlign: 'center', fontWeight: 'bold' }
};
