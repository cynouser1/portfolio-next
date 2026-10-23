// Helpers for turning "Jan 2023" / "Present" date strings into durations like "3 yrs 10 mos".

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

// "Jan 2023" -> month index (year * 12 + month). "Present" (or empty) -> the current month.
// A bare year ("2023") is treated as January of that year.
export function parseMonth(str) {
  const now = new Date()
  if (!str || /present|now|current/i.test(str)) return now.getFullYear() * 12 + now.getMonth()
  const year = Number(str.match(/\d{4}/)?.[0])
  const m = MONTHS.indexOf(str.trim().slice(0, 3).toLowerCase())
  return year * 12 + Math.max(m, 0)
}

export const isCurrent = (end) => !end || /present|now|current/i.test(end)

// Inclusive of both the start and end month (LinkedIn style): Aug–Dec = 5 months.
export function monthsBetween(start, end) {
  return Math.max(parseMonth(end) - parseMonth(start) + 1, 1)
}

export function formatDuration(months) {
  const y = Math.floor(months / 12)
  const m = months % 12
  const parts = []
  if (y) parts.push(`${y} ${y === 1 ? 'yr' : 'yrs'}`)
  if (m || !y) parts.push(`${m} ${m === 1 ? 'mo' : 'mos'}`)
  return parts.join(' ')
}

export const jobDuration = (job) => formatDuration(monthsBetween(job.start, job.end))

// Total months across all jobs, merging overlaps so concurrent roles aren't double-counted.
export function totalMonths(jobs) {
  const ranges = jobs
    .map((j) => [parseMonth(j.start), parseMonth(j.end)])
    .sort((a, b) => a[0] - b[0])
  let total = 0
  let cur = null
  for (const [s, e] of ranges) {
    if (cur && s <= cur[1] + 1) cur[1] = Math.max(cur[1], e)
    else {
      if (cur) total += cur[1] - cur[0] + 1
      cur = [s, e]
    }
  }
  if (cur) total += cur[1] - cur[0] + 1
  return total
}
