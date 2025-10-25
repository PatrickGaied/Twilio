import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Theme script to prevent FOUC (Flash of Unstyled Content) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme')
                  var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

                  // Set background color immediately to prevent white flash
                  if (theme === 'dark' || (!theme && systemPrefersDark)) {
                    document.documentElement.classList.add('dark')
                    document.documentElement.style.backgroundColor = '#111827'
                  } else {
                    document.documentElement.classList.remove('dark')
                    document.documentElement.style.backgroundColor = '#f9fafb'
                  }
                } catch (e) {
                  console.warn('Theme script error:', e)
                }
              })()
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}