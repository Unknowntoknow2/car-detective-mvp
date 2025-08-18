import React, { useState } from 'react';

export function JokeGenerator() {
  const [joke, setJoke] = useState<{setup: string, punchline: string} | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchJoke() {
    setLoading(true);
    setJoke(null);
    try {
      const res = await fetch('/api/joke');
      const data = await res.json();
      setJoke({ setup: data.setup, punchline: data.punchline });
    } catch {
      setJoke({ setup: 'Error', punchline: 'Could not fetch joke.' });
    }
    setLoading(false);
  }

  return (
    <div>
      <button onClick={fetchJoke} disabled={loading}>
        {loading ? 'Loading...' : 'Get Random Joke'}
      </button>
      {joke && (
        <div style={{ marginTop: 20 }}>
          <div><strong>{joke.setup}</strong></div>
          <div>{joke.punchline}</div>
        </div>
      )}
    </div>
  );
}