import { useSyncExternalStore } from 'react'

// Must match the key used by the inline script in src/app/layout.js
export const THEME_KEY = 'portfolio-theme'

// The <html> class is the source of truth: the inline script in layout.js sets it before first paint.
function subscribe(callback) {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}

const getSnapshot = () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')

// Unknown on the server — consumers render theme-dependent bits only once this is non-null
const getServerSnapshot = () => null

export default function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggle = () => {
    const next = getSnapshot() === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      // storage unavailable — the choice just won't persist
    }
  }

  return { theme, toggle }
}
