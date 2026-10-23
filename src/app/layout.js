import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { preload } from 'react-dom'
import portfolio from '@/data/portfolio'
import './globals.css'

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-inter', display: 'swap' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-space-grotesk', display: 'swap' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jetbrains-mono', display: 'swap' })

const { meta } = portfolio

function siteUrl() {
  try {
    return new URL(meta.siteUrl || 'http://localhost:3000')
  } catch {
    return new URL('http://localhost:3000')
  }
}

export const metadata = {
  metadataBase: siteUrl(),
  title: meta.title,
  description: meta.description,
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: meta.title,
    description: meta.description,
    type: 'website',
    images: meta.avatar ? [meta.avatar.src] : [],
  },
  twitter: { card: 'summary_large_image', title: meta.title, description: meta.description },
}

// Runs before first paint: apply the saved theme (or the OS preference) so there's no flash.
// Keep the key in sync with THEME_KEY in src/hooks/useTheme.js.
const themeScript = `(function(){try{var t=localStorage.getItem('portfolio-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})()`

export default function RootLayout({ children }) {
  if (meta.avatar) preload(meta.avatar.src, { as: 'image', type: 'image/webp', fetchPriority: 'high' })

  return (
    // suppressHydrationWarning: the theme script changes the class before React hydrates
    <html lang="en" className={`dark ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
