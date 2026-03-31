import Link from 'next/link';

export default function RootNotFound() {
    return (
        <html lang="en">
            <body style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                background: '#F8F6F0',
                color: '#13242E',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
            }}>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <h1 style={{ fontSize: '8rem', fontWeight: 200, color: '#D5D0C8', margin: 0, lineHeight: 1 }}>
                        404
                    </h1>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '1rem' }}>
                        Page Not Found
                    </h2>
                    <p style={{ color: '#8A8478', marginBottom: '2rem' }}>
                        The page you&apos;re looking for doesn&apos;t exist.
                    </p>
                    <Link
                        href="/en"
                        style={{
                            display: 'inline-block',
                            padding: '12px 32px',
                            background: '#447d9c',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '999px',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            fontWeight: 700,
                        }}
                    >
                        Back to Home
                    </Link>
                </div>
            </body>
        </html>
    );
}
