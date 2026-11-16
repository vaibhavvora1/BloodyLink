# RULES.md — Bloodlink Project Rules

Follow these rules for every change, whether written by a human or AI.

## 1. Keep Code Small and Simple
- Write the **minimum code** that solves the problem. No extra features, no "just in case" code.
- One component = one job. Max about **150 lines** per file. Split if bigger.
- One function = one task. Max about **30 lines**.
- No duplicate code. Reuse components, hooks, and utils.
- No commented-out code, no unused imports, no `console.log` left behind.
- Prefer clear names over comments. Comment only the "why", never the "what".

## 1A. Libraries and Icons
- **Never use `lucide-react`.** Do not install or import it anywhere.
- Icons come only from `bootstrap-icons` (one icon library for the whole project).
- Do not add a new library unless it is really needed and approved. Prefer what is already installed.
- Approved UI/animation stack: Bootstrap / react-bootstrap, Framer Motion, Lenis, React Bits components, Three.js (`@react-three/fiber`, `drei`) for the landing 3D drop, React Toastify, TanStack Table.
- Lazy-load heavy items (Three.js, large React Bits components). Respect `prefers-reduced-motion`.

## 2. Frontend Is Only for UI
The frontend **never** decides who can do what. It only displays and collects input.

- All business logic, permissions, validation, and data filtering live in the **backend**.
- Hiding a button in the UI is **not** security. The backend must reject unauthorized requests anyway.
- Never trust anything from the client: body, query, headers, localStorage, role flags.
- Frontend must still work correctly if a user edits the DOM, JS, or network requests. The backend is the final authority.

## 3. API Rules
- Frontend calls **only your own backend**. Never call third-party APIs (SMS, email, maps with secret keys, payment, AI) directly from the browser.
- No API keys, secrets, DB URLs, or tokens hardcoded in frontend code.
- Keep all API calls in one place: `src/services/api.js` (single axios instance with base URL from env). Components never call `axios`/`fetch` directly.
- Only `VITE_` / `REACT_APP_` variables that are **public by nature** (e.g. backend URL) may be in the frontend `.env`.
- Every response uses one format:
```json
{ "success": true, "message": "Done", "data": {} }
```
- Never return raw database errors or stack traces to the client.

## 4. Never Show Sensitive Data in Frontend
Never send, store, log, or render:
- Passwords or password hashes
- JWT secrets, API keys, DB strings
- Full phone numbers / emails of donors unless the donor has agreed and the viewer is authorized
- Other users' private fields (address, DOB, medical notes, internal IDs, role tables)
- Internal error details or stack traces

Backend must use **field whitelisting** (return only what UI needs), never `res.json(user)` with the full document.

## 5. Authentication Rules
- Passwords hashed with **bcrypt** (cost 12+). Never store plain text.
- Use JWT with **short-lived access token (15 min)** + **refresh token (7 days)**.
- Store tokens in **httpOnly, Secure, SameSite cookies**. Do **not** store tokens in `localStorage`.
- Every protected route uses an `auth` middleware. Admin routes also use a `role` middleware.
- Role check is done on the **backend** from the verified token, never from a request body.
- Logout clears the cookie and invalidates the refresh token.
- Lock or slow down after repeated failed logins (rate limit).

## 6. Folder Structure (frontend `src/`)
```
src/
  assets/        images, icons
  components/    reusable UI (Button, Card, Badge, Loader)
  pages/         one file per page/route
  services/      api.js and API wrapper functions
  hooks/         custom hooks
  context/       auth / app state
  utils/         small helpers
  styles/        variables.css, global.css
```
- No business logic inside `pages/`. Pages compose components.
- Route guards in the frontend are for **UX only**; the backend enforces access.

## 7. Git and Files
- `.env` is always in `.gitignore`. Commit a `.env.example` with fake values only.
- Never commit secrets. If one leaks, **rotate it immediately**.
- Small commits with clear messages: `feat: add donor search`, `fix: login error message`.

## 8. Before Finishing Any Task (Checklist)
- [ ] Works with the backend, not only in the UI
- [ ] No secret or sensitive field visible in code, network tab, or UI
- [ ] Loading, empty, and error states handled
- [ ] No unused code or console logs
- [ ] File sizes within limits
- [ ] No `lucide-react`; icons only from `bootstrap-icons`
- [ ] Backend validated input and checked permission