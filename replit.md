# Portfolio — mn.dev

A personal portfolio website with GSAP animations, dark theme, and rotating hero text, built for Md. Nuruzzaman.

## Run & Operate

- `pnpm --filter @workspace/portfolio run dev` — run portfolio (port auto-assigned via `PORT` env)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- No database or backend required — portfolio is frontend-only

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS v4, GSAP (with ScrollTrigger)
- Icons: react-icons (FaGithub, FaLinkedin etc.), lucide-react
- Routing: wouter
- API: Express 5 (api-server, not used by portfolio)

## Where things live

- `artifacts/portfolio/src/data/portfolio.json` — ALL content data (text, links, projects, tech stack, etc.)
- `artifacts/portfolio/src/components/` — individual section components
- `artifacts/portfolio/src/pages/Home.tsx` — main page composition
- `artifacts/portfolio/src/index.css` — dark theme CSS variables + utility classes

## Architecture decisions

- All text/data lives in `portfolio.json` — never hardcoded in components
- GSAP animations use `gsap.context()` for proper React cleanup
- ScrollTrigger registered at component level (`gsap.registerPlugin(ScrollTrigger)`)
- Hero adjective cycles with GSAP fade-in/out; gradient on "Frontend Developer" changes per phrase
- Blob backgrounds use inline `style` radial-gradient for cross-browser compatibility

## Product

- Single-page dark portfolio with animated hero (cycling phrases via GSAP)
- Sections: Home (hero), About Me, Tech Stack, Projects, Contact Me
- Smooth scroll navigation, animated section entrances on scroll
- Contact form with success state

## User preferences

- Data stored in JSON files, not hardcoded in TSX
- GSAP for all animations
- Design matches screenshots: dark bg (#0a0a12), teal blob bottom-left, purple blob bottom-right
- Adjective text is gray; "Frontend Developer" has changing gradient per phrase

## Gotchas

- GSAP `fromTo` overrides JSX opacity — use `from` for elements that should start visible
- `ScrollTrigger` must be registered before use in each component
- Google Fonts `@import url()` must be the very first line in index.css

## Pointers

- See `pnpm-workspace` skill for workspace structure
- GSAP docs: https://gsap.com/docs/v3/
