<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# LeanForesight

LeanForesight is a Vite + React application for running scenario sprints and validating strategy trajectories. The codebase is **JavaScript/JSX only** (no TypeScript).

## Quick Start

**Prerequisites:** Node.js 18+.

1. Install dependencies:
   `npm install`
2. Create a local environment file:
   `.env.local`
3. Add your OpenRouter key:
   `VITE_OPENROUTER_API_KEY=your_key_here`
4. Run the app:
   `npm run dev`

## Environment Variables

- `VITE_OPENROUTER_API_KEY` — required for scenario and strategy generation.

## Scripts

- `npm run dev` — start local dev server
- `npm run build` — production build
- `npm run preview` — preview build output

## Project Structure

```
components/        UI components (JSX)
components/dashboard/  Dashboard step components
hooks/             Custom hooks (JS)
pages/             Route-level pages (JSX)
services/          API + storage services (JS)
```

## Notes

- This repo is configured for JavaScript/JSX only.
- If you add new files, use `.js` or `.jsx` extensions.
