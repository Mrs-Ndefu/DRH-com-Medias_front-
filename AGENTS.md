# AGENTS.md

## Project overview
This repository is a Vite + React 18 application for an HR/SIRH portal. The app uses React Router, Bootstrap, React Intl, SWR, and a custom authentication context.

## Important entry points
- App shell and providers: src/App.jsx
- Route configuration and role guards: src/routes/PagesRoutes.jsx
- Auth state and login flow: src/contexts/AuthContext.jsx
- API client and token handling: src/api/client.js
- Automatic login entry page: public/autologin.html

## Working conventions
- Prefer small, focused changes that match the surrounding patterns.
- Use the existing alias-based imports from the src base URL (for example, components/, views/, contexts/, routes/).
- Keep auth-related changes consistent with the token storage keys sirh_token and sirh_user.
- Route and access-control changes should stay aligned with the role arrays in src/routes/PagesRoutes.jsx.
- When adding a new page or feature, register it in the route config and update navigation/menu data if it should be reachable from the UI.
- Preserve the existing localization approach; avoid introducing new hardcoded text where the app already uses locale files.

## Build and validation
- Install dependencies: yarn install
- Start the dev server: yarn start
- Build for production: yarn build
- Lint the codebase: yarn lint

## Notes for this repo
- The public/autologin.html page is a special entry point that logs in automatically against a local backend and redirects to /dashboard. Preserve that behavior if it is touched.
- There is no dedicated test runner configured in package.json, so validation relies on linting and build checks.
