import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          background: '#f7f6f1',
          color: '#0e1116',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          margin: 0,
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <p style={{ fontSize: '0.6875rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#6b6f78', margin: 0 }}>
            404
          </p>
          <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0 1rem', fontWeight: 400 }}>
            That page doesn't exist.
          </h1>
          <p style={{ color: '#6b6f78', lineHeight: 1.6 }}>
            The link may have moved, expired, or never existed.
          </p>
          <Link
            href="/en"
            style={{
              display: 'inline-block',
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              background: '#0e1116',
              color: '#f7f6f1',
              textDecoration: 'none',
              fontSize: '0.875rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Back to home
          </Link>
        </div>
      </body>
    </html>
  );
}
