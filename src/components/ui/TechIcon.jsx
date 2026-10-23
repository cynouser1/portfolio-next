import { FiCode, FiDatabase, FiGitBranch, FiKey, FiLayers, FiShield } from 'react-icons/fi'
import {
  SiBootstrap,
  SiChartdotjs,
  SiDocker,
  SiExpress,
  SiGit,
  SiGithub,
  SiJavascript,
  SiJsonwebtokens,
  SiMongodb,
  SiMongoose,
  SiMui,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPostman,
  SiReact,
  SiRedux,
  SiShadcnui,
  SiTailwindcss,
  SiTypescript,
  SiZoho,
} from 'react-icons/si'

// Keys usable as `icon` on a skill in src/data/portfolio.js.
// `color` is the brand colour shown on hover (null = use the accent colour).
const techIcons = {
  javascript: { Icon: SiJavascript, color: '#F7DF1E' },
  typescript: { Icon: SiTypescript, color: '#3178C6' },
  sql: { Icon: FiDatabase, color: null },
  react: { Icon: SiReact, color: '#61DAFB' },
  nextjs: { Icon: SiNextdotjs, color: null },
  redux: { Icon: SiRedux, color: '#764ABC' },
  tailwind: { Icon: SiTailwindcss, color: '#38BDF8' },
  shadcn: { Icon: SiShadcnui, color: null },
  mui: { Icon: SiMui, color: '#007FFF' },
  bootstrap: { Icon: SiBootstrap, color: '#7952B3' },
  nodejs: { Icon: SiNodedotjs, color: '#5FA04E' },
  express: { Icon: SiExpress, color: null },
  api: { Icon: FiCode, color: null },
  mongodb: { Icon: SiMongodb, color: '#47A248' },
  mongoose: { Icon: SiMongoose, color: '#B5303A' },
  mysql: { Icon: SiMysql, color: '#4479A1' },
  docker: { Icon: SiDocker, color: '#2496ED' },
  git: { Icon: SiGit, color: '#F05032' },
  github: { Icon: SiGithub, color: null },
  postman: { Icon: SiPostman, color: '#FF6C37' },
  zoho: { Icon: SiZoho, color: '#E42527' },
  jwt: { Icon: SiJsonwebtokens, color: '#D63AFF' },
  chartjs: { Icon: SiChartdotjs, color: '#FF6384' },
  shield: { Icon: FiShield, color: null },
  key: { Icon: FiKey, color: null },
  layers: { Icon: FiLayers, color: null },
  branch: { Icon: FiGitBranch, color: null },
}

export default function TechIcon({ name, className = 'h-5 w-5' }) {
  const entry = techIcons[name]
  if (!entry) return null
  const { Icon, color } = entry
  return (
    <Icon
      className={`${className} transition-colors duration-300 group-hover:text-[var(--brand)]`}
      style={{ '--brand': color ?? 'var(--c-accent)' }}
      aria-hidden="true"
    />
  )
}
