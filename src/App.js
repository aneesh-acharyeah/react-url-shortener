import React, { useState, useEffect } from 'react'

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [urls, setUrls] = useState(() => {
    const saved = localStorage.getItem('shortenedUrls');
    return saved ? JSON.parse(saved) : [];
  });
  const [error, setError] = useState('')
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem('shortenedUrls', JSON.stringify(urls));
  }, [urls]);

  const generateShortUrl = () => {
    return 'short.ly/' + Math.random().toString(36).substring(2, 8);
  }

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  const handleShorten = () => {
    setError('');
    if (!longUrl.trim()) {
      setError('please enter a url.')
      return;
    }
    if (!isValidUrl(longUrl)) {
      setError('please enter a valid url (including http:// or https://).')
      return;
    }

    const newShortUrl = generateShortUrl();
    const newEntry = { longUrl: longUrl.trim(), shortUrl: newShortUrl };
    setUrls([newEntry, ...urls])
    setLongUrl('')
  }
  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🔗 URL Shortener</h1>

      <div style={styles.inputWrapper}>
        <input
          type="url"
          placeholder="Enter a long URL (include https://)"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          style={styles.input}
          aria-label="Long URL input"
        />
        <button onClick={handleShorten} style={styles.button}>
          Shorten
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <div style={{ marginTop: 30 }}>
        {urls.length === 0 ? (
          <p style={{ color: '#666' }}>No URLs shortened yet.</p>
        ) : (
          <ul style={styles.urlList}>
            {urls.map(({ longUrl, shortUrl }, idx) => (
              <li key={idx} style={styles.urlItem}>
                <div style={styles.longUrl} title={longUrl}>
                  <a href={longUrl} target="_blank" rel="noopener noreferrer">
                    {longUrl.length > 60 ? longUrl.slice(0, 57) + '...' : longUrl}
                  </a>
                </div>
                <div style={styles.shortUrlWrapper}>
                  <a
                    href={`https://${shortUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.shortUrl}
                  >
                    {shortUrl}
                  </a>
                  <button
                    onClick={() => copyToClipboard(shortUrl, idx)}
                    style={styles.copyButton}
                    aria-label={`Copy short URL ${shortUrl}`}
                  >
                    {copiedIndex === idx ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Styles (CSS-in-JS)
const styles = {
  container: {
    maxWidth: 650,
    margin: '40px auto',
    padding: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: '#f9f9f9',
    borderRadius: 8,
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#333',
  },
  inputWrapper: {
    display: 'flex',
    gap: 10,
    marginTop: 20,
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    fontSize: 16,
    borderRadius: 5,
    border: '1.5px solid #ddd',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  button: {
    padding: '12px 24px',
    fontSize: 16,
    backgroundColor: '#4f46e5', // Indigo-600
    color: 'white',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  error: {
    marginTop: 10,
    color: '#e53e3e', // Red-600
  },
  urlList: {
    listStyle: 'none',
    paddingLeft: 0,
    marginTop: 10,
  },
  urlItem: {
    backgroundColor: 'white',
    padding: '14px 20px',
    borderRadius: 6,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    marginBottom: 12,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  longUrl: {
    maxWidth: '60%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  shortUrlWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  shortUrl: {
    color: '#4f46e5',
    fontWeight: '600',
    textDecoration: 'none',
  },
  copyButton: {
    padding: '6px 12px',
    fontSize: 14,
    borderRadius: 5,
    border: '1.5px solid #4f46e5',
    backgroundColor: 'white',
    color: '#4f46e5',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

export default App;