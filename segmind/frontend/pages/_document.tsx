import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html style={{ backgroundColor: '#f9fafb' }}>
      <Head>
        {/* Theme script to prevent FOUC (Flash of Unstyled Content) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme')
                  var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

                  // Set background color immediately on html element
                  var html = document.documentElement
                  if (theme === 'dark' || (!theme && systemPrefersDark)) {
                    html.classList.add('dark')
                    html.style.backgroundColor = '#111827'
                    document.body.style.backgroundColor = '#111827'
                  } else {
                    html.classList.remove('dark')
                    html.style.backgroundColor = '#f9fafb'
                    document.body.style.backgroundColor = '#f9fafb'
                  }
                } catch (e) {
                  console.warn('Theme script error:', e)
                }
              })()
            `,
          }}
        />
        {/* Preload critical styles */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html { background-color: #f9fafb !important; }
              html.dark { background-color: #111827 !important; }
              body { background-color: inherit !important; margin: 0; padding: 0; }
              #__next { min-height: 100vh; background-color: inherit; }
            `,
          }}
        />
      </Head>
      <body style={{ backgroundColor: 'inherit', margin: 0, padding: 0 }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}