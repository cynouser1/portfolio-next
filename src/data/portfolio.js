// ============================================================================
//  PORTFOLIO CONTENT
//  This is the ONLY file you need to edit to update the website.
//  - Add / remove / edit entries in any array and the page updates itself.
//  - Empty an array (e.g. `projects: []`) to hide that section and its nav link.
//  - Contact details, socials, résumé and availability can also be set in `.env` / `.env.local`
//    (see .env.example) — the values below are used as fallbacks.
// ============================================================================

// Use a public NEXT_PUBLIC_* env value, falling back to the default when unset/blank.
// Next.js only inlines literal `process.env.NEXT_PUBLIC_X` references, so pass the value, not the key.
const env = (value, fallback) => value || fallback

const email = env(process.env.NEXT_PUBLIC_CONTACT_EMAIL, 'dhananjaydhiman809@gmail.com')

const portfolio = {
  // Optional sections, switched on/off from .env (NEXT_PUBLIC_SHOW_SERVICES / NEXT_PUBLIC_SHOW_LINKS)
  features: {
    services: env(process.env.NEXT_PUBLIC_SHOW_SERVICES, 'true') === 'true',
    links: env(process.env.NEXT_PUBLIC_SHOW_LINKS, 'true') === 'true',
  },

  meta: {
    name: 'Dhananjay',
    fullName: 'Dhananjay Dhiman',
    role: 'Full Stack Developer',
    // Words cycled by the typing animation in the hero
    typedRoles: [
      'Full Stack Developer',
      'MERN Stack Specialist',
      'Building for IIRS / ISRO',
      'RBAC & API Architect',
    ],
    tagline:
      'I build secure, scalable web applications — from MongoDB schemas to pixel-perfect React interfaces — currently powering nationwide government platforms used across India.',
    location: 'Dehradun, India',
    availableForWork: env(process.env.NEXT_PUBLIC_AVAILABLE_FOR_WORK, 'true') === 'true',
    availabilityText: env(process.env.NEXT_PUBLIC_AVAILABILITY_TEXT, 'Open to new opportunities'),
    resume: env(process.env.NEXT_PUBLIC_RESUME_URL, '/Resume.pdf'), // file lives in /public
    siteUrl: env(process.env.NEXT_PUBLIC_SITE_URL, ''),
    // Profile photo shown in the hero. Delete this block to hide the photo.
    // `src` is an optimized copy; `fallback` is the original file in /public.
    avatar: {
      src: '/profile.webp',
      fallback: '/Profile-img.png',
      alt: 'Dhananjay — Full Stack Developer',
      // Small floating labels around the photo (hidden on small screens)
      badges: ['MERN Stack', 'IIRS · ISRO'],
    },
    title: 'Dhananjay — Full Stack Developer',
    description:
      'Portfolio of Dhananjay, a Full Stack MERN developer building nationwide government applications for IIRS/ISRO.',
  },

  contact: {
    email,
    phone: env(process.env.NEXT_PUBLIC_CONTACT_PHONE, '+91 7055044168'),
    // Reasons offered in the contact form's dropdown
    reasons: ['Job opportunity', 'Freelance project', 'Collaboration', 'Just saying hi'],
    responseTime: 'Usually replies within 24 hours',
    heading: "Let's build something great together",
    message:
      "Whether you have a role to fill, a project in mind, or just want to say hi — my inbox is always open. I'll get back to you as soon as I can.",
  },

  // `icon` must be one of: github, linkedin, mail, phone, twitter, globe
  socials: [
    { label: 'GitHub', url: env(process.env.NEXT_PUBLIC_GITHUB_URL, 'https://github.com/Dhananjaydhiman'), icon: 'github' },
    { label: 'LinkedIn', url: env(process.env.NEXT_PUBLIC_LINKEDIN_URL, 'https://linkedin.com/in/dhananjaydhiman'), icon: 'linkedin' },
    { label: 'Email', url: `mailto:${email}`, icon: 'mail' },
  ],

  about: {
    paragraphs: [
      "I'm a Full Stack Developer at Cynoteck Technology Solutions, deputed at the Indian Institute of Remote Sensing (IIRS), ISRO. I lead end-to-end MERN development of government applications for the Ministry of Urban Affairs that are deployed across India.",
      'I enjoy the whole stack: designing data models that stay fast at scale, building secure REST APIs with JWT and role-based access control, containerising everything with Docker, and crafting clean, responsive interfaces with React and Tailwind.',
      "I work directly with stakeholders to turn requirements into production-ready software delivered on schedule — and I care about code that's easy for the next developer to pick up.",
    ],
    // `value` is a number (animated count-up). Use `since` (a year) to auto-calculate years.
    stats: [
      { label: 'Years of experience', since: 2023, suffix: '+' },
      { label: 'Major projects shipped', value: 3, suffix: '+' },
      { label: 'Nationwide gov. platforms', value: 2 },
      { label: 'Technologies used', value: 20, suffix: '+' },
    ],
    highlights: ['MERN Stack', 'RBAC & JWT', 'Geospatial dashboards', 'Docker deployments'],
  },

  // `level` (0–100) is optional — shown as a bar when present.
  // `icon` is optional — a key from src/components/ui/TechIcon.jsx (react, nodejs, mongodb, docker, …)
  skills: [
    {
      category: 'Languages',
      items: [
        { name: 'JavaScript (ES6+)', icon: 'javascript', level: 92 },
        { name: 'TypeScript', icon: 'typescript', level: 78 },
        { name: 'SQL', icon: 'sql', level: 75 },
      ],
    },
    {
      category: 'Frontend',
      items: [
        { name: 'React.js', icon: 'react', level: 92 },
        { name: 'Next.js', icon: 'nextjs', level: 78 },
        { name: 'Redux Toolkit', icon: 'redux', level: 82 },
        { name: 'Tailwind CSS', icon: 'tailwind', level: 90 },
        { name: 'Shadcn UI', icon: 'shadcn', level: 80 },
        { name: 'MUI', icon: 'mui', level: 80 },
        { name: 'Bootstrap', icon: 'bootstrap', level: 85 },
      ],
    },
    {
      category: 'Backend',
      items: [
        { name: 'Node.js', icon: 'nodejs', level: 88 },
        { name: 'Express.js', icon: 'express', level: 88 },
        { name: 'REST API Design', icon: 'api', level: 90 },
      ],
    },
    {
      category: 'Databases',
      items: [
        { name: 'MongoDB', icon: 'mongodb', level: 88 },
        { name: 'Mongoose', icon: 'mongoose', level: 86 },
        { name: 'MySQL', icon: 'mysql', level: 75 },
      ],
    },
    {
      category: 'DevOps & Tools',
      items: [
        { name: 'Docker', icon: 'docker', level: 80 },
        { name: 'Git', icon: 'git', level: 88 },
        { name: 'GitHub', icon: 'github', level: 88 },
        { name: 'Postman', icon: 'postman', level: 85 },
        { name: 'ZOHO', icon: 'zoho', level: 70 },
      ],
    },
    {
      category: 'Concepts',
      items: [
        { name: 'Role-Based Access Control', icon: 'shield' },
        { name: 'JWT Authentication', icon: 'jwt' },
        { name: 'Data Modeling', icon: 'layers' },
        { name: 'Microservices', icon: 'branch' },
      ],
    },
  ],

  // `type`: Full-time, Part-time, Internship, Freelance or Contract (shown as a badge).
  // Durations ("3 yrs 10 mos") are calculated automatically from `start` / `end`.
  // Use "Mon YYYY" for dates, and 'Present' for your current role.
  experience: [
    {
      role: 'Full Stack Developer',
      company: 'Cynoteck Technology Solutions',
      note: 'Deputed at IIRS / ISRO',
      type: 'Full-time',
      location: 'Dehradun, India',
      start: 'Jan 2023',
      end: 'Present',
      points: [
        "Leading end-to-end MERN stack development of nationwide government applications for the Ministry of Urban Affairs, deployed across India under ISRO's Indian Institute of Remote Sensing (IIRS).",
        'Architected and built a role-based access control (RBAC) system managing multiple user roles with scoped permissions across project, user, and geospatial survey workflows.',
        'Designed and optimized MongoDB schemas and queries for large-scale spatial and project datasets, improving query performance for high-volume administrative data.',
        'Built and deployed RESTful APIs with Node.js/Express.js using secure JWT authentication, and containerized applications with Docker from development to production.',
        'Collaborated directly with government stakeholders to define requirements, iterate on features, and deliver production-ready solutions on schedule.',
      ],
      tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Docker', 'JWT'],
    },
    {
      role: 'Web Development Intern',
      company: 'CodeJi InfoTech Pvt Ltd',
      type: 'Internship',
      location: 'Dehradun, India',
      start: 'Aug 2021',
      end: 'Dec 2021',
      points: [
        'Built a reusable React.js component library and contributed to frontend architecture for production web applications.',
        'Developed a fully responsive e-commerce platform with product browsing, cart management, and checkout flow using React.js and REST APIs.',
      ],
      tech: ['React', 'REST APIs', 'CSS'],
    },
  ],

  // `featured: true` shows the project as a large card under "Featured"; the rest go under "Other projects".
  // `image` is optional (a file in /public, e.g. '/projects/amrut.webp') — shown on featured cards.
  // `links` is optional: { live: 'https://…', github: 'https://…' }
  projects: [
    {
      title: 'Amrut Sankalan',
      org: 'IIRS / ISRO',
      featured: true,
      summary:
        'A nationwide, role-based project & survey-grid management dashboard for the Ministry of Urban Affairs.',
      points: [
        'Led full-stack development of a nationwide role-based project and survey grid management dashboard.',
        'Built interactive geospatial map visualization enabling admins to view, filter, and assign geographic grids across Indian cities.',
        'Implemented JWT authentication, RBAC, and secret-key plugin integrations; designed scalable REST APIs and optimized MongoDB aggregation pipelines.',
        'Containerized and deployed the full application stack using Docker in production.',
      ],
      tech: ['MERN', 'React.js', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Docker'],
      links: {},
    },
    {
      title: 'Survey Management System',
      org: 'IIRS / ISRO',
      featured: false,
      summary:
        'A fully customizable dynamic survey platform with a multi-step form builder and analytics.',
      points: [
        'Multi-step form builder with real-time preview and access-controlled publishing workflow.',
        'Flexible MongoDB schemas supporting dynamic form structures — questions, validations, and response types stored as configurable documents.',
        'Analytics dashboards with Chart.js visualizations and CSV data export.',
        'Scalable backend services deployed with Docker, secure data handling and RBAC.',
      ],
      tech: ['MERN', 'React.js', 'MongoDB', 'Chart.js', 'Docker'],
      links: {},
    },
    {
      title: 'Cliff Climbers',
      org: 'Cynoteck',
      featured: false,
      summary:
        'A responsive e-commerce experience — listing, details, cart, checkout and order tracking.',
      points: [
        'Responsive React.js interfaces for product listing, details, cart, checkout and order tracking, integrated with REST APIs.',
        'Reusable components with filtering, sorting and pagination for large catalogs.',
        'Contributed to backend features (Node.js/MySQL) including inventory, offers and payment workflows.',
      ],
      tech: ['React.js', 'Node.js', 'MySQL', 'REST APIs'],
      links: {},
    },
  ],

  // Shown in the Experience section's side column. `short` is an optional abbreviation for the snapshot chip.
  education: [
    {
      degree: 'Master of Computer Applications (MCA)',
      short: 'MCA',
      school: 'Graphic Era University',
      location: 'Dehradun, India',
      start: '2022',
      end: '2024',
    },
    {
      degree: 'Bachelor of Science – Information Technology',
      short: 'B.Sc. IT',
      school: 'D.A.V. PG College',
      location: 'Dehradun, India',
      start: '2018',
      end: '2021',
    },
  ],

  // Services you offer. Shown when NEXT_PUBLIC_SHOW_SERVICES=true.
  // `icon` is one of: code, layout, smartphone, cpu, server, cloud, pen, tool (see src/components/ui/Icon.jsx)
  services: [
    {
      title: 'Website Development',
      icon: 'layout',
      description: 'Fast, responsive and SEO-friendly websites for businesses, portfolios and landing pages.',
      features: ['Responsive on every device', 'SEO & performance optimized', 'CMS or static setup'],
    },
    {
      title: 'Custom Web Applications',
      icon: 'code',
      description: 'Full-stack MERN applications built around your workflow — dashboards, portals and SaaS tools.',
      features: ['React + Node.js + MongoDB', 'Role-based access (RBAC)', 'Scalable architecture'],
    },
    {
      title: 'App Development',
      icon: 'smartphone',
      description: 'Cross-platform mobile and progressive web apps that feel native and work offline.',
      features: ['React Native / PWA', 'Push notifications', 'Shared code with web'],
    },
    {
      title: 'AI Integration',
      icon: 'cpu',
      description: 'Bring AI into your product — chatbots, smart search, document Q&A and workflow automation.',
      features: ['LLM chatbots & assistants', 'RAG over your data', 'Automation pipelines'],
    },
    {
      title: 'API & Backend Development',
      icon: 'server',
      description: 'Secure, well-documented REST APIs and backend services that scale with your users.',
      features: ['JWT authentication', 'MongoDB / MySQL design', 'Third-party integrations'],
    },
    {
      title: 'Deployment & DevOps',
      icon: 'cloud',
      description: 'From local to production — containerized, automated and monitored deployments.',
      features: ['Docker & CI/CD', 'Netlify, Vercel, VPS', 'Domains, SSL & monitoring'],
    },
    {
      title: 'UI/UX Implementation',
      icon: 'pen',
      description: 'Pixel-perfect interfaces from Figma designs, with smooth animations and accessibility built in.',
      features: ['Figma to React', 'Tailwind / MUI / Shadcn', 'Accessible & animated'],
    },
    {
      title: 'Maintenance & Support',
      icon: 'tool',
      description: 'Keep your app healthy — bug fixes, upgrades, performance tuning and new features.',
      features: ['Bug fixes & upgrades', 'Performance audits', 'Ongoing feature work'],
    },
  ],

  // Other links: websites you built, demos, company pages, articles… Shown when NEXT_PUBLIC_SHOW_LINKS=true.
  // `category` is free text — filter tabs are created from the categories you use.
  // Replace the examples below with your own links.
  links: [
    {
      title: 'Cynoteck Technology Solutions',
      url: 'https://www.cynoteck.com',
      category: 'Company',
      description: 'The company I work with as a Full Stack Developer, deputed at IIRS / ISRO.',
    },
    {
      title: 'IIRS — Indian Institute of Remote Sensing',
      url: 'https://www.iirs.gov.in',
      category: 'Company',
      description: "ISRO's institute where the government platforms I build are deployed.",
    },
    {
      title: 'GitHub profile',
      url: 'https://github.com/Dhananjaydhiman',
      category: 'Demo',
      description: 'Source code, experiments and demo projects.',
    },
    {
      title: 'Your website here',
      url: 'https://example.com',
      category: 'Website',
      description: 'Replace with a website you designed or developed for a client.',
    },
    {
      title: 'Your article here',
      url: 'https://medium.com',
      category: 'Article',
      description: 'Replace with a blog post or article you have written.',
    },
  ],

  // Navigation. `id` must match a section key above (about, skills, services, experience, projects, links, contact).
  // Education is shown inside the Experience section.
  // Remove a line to hide it from the menu; sections with empty data are hidden automatically.
  nav: [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'services', label: 'Services' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'links', label: 'Links' },
    { id: 'contact', label: 'Contact' },
  ],

  footer: {
    blurb:
      'Full Stack Developer building secure, scalable web apps — from MongoDB schemas to polished React interfaces.',
    text: '',
  },
}

export default portfolio
