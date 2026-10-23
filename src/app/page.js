import Portfolio from '@/components/Portfolio'

// The page is pre-rendered at build time. Rebuild it daily so date-based text stays current:
// the footer year, the "years of experience" stat and "Present" job durations.
export const revalidate = 86400

export default function Page() {
  return <Portfolio />
}
