# SECURITY.md — Bloodlink Security Rules

Bloodlink handles personal and health-related data. Security is mandatory, not optional.

## 1. JWT Secrets (Hard Keys)
- Secrets must be **random, at least 64 characters**. Never words, names, or dates.
- Use **two different secrets**: one for access tokens, one for refresh tokens.
- Generate with:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
- Store only in backend `.env` or the hosting platform's secret manager (Render/AWS). Never in code, frontend, Git, chat, or screenshots.
- Rotate secrets immediately if they are ever exposed.
- Algorithm: `HS256` minimum, explicitly set on sign **and** verify. Reject `alg: none`.

```env
# backend/.env  (never commit)
JWT_ACCESS_SECRET=<64+ byte random hex>
JWT_REFRESH_SECRET=<different 64+ byte random hex>
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
MONGO_URI=<atlas connection string>
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain
```

## 2. Token Handling
- Access token: 15 minutes. Refresh token: 7 days, rotated on each use.
- Send tokens in **httpOnly + Secure + SameSite=Strict (or Lax)** cookies.
- Never put tokens in `localStorage`, `sessionStorage`, URLs, or logs.
- JWT payload holds only `id` and `role`. No email, phone, password, or medical data.
- Verify token and signature on every protected request.

## 3. Passwords
- Hash with `bcrypt` (cost 12+).
- Minimum 8 characters, require letters and numbers.
- Never log, return, or email passwords.
- Use `select: false` on the password field in the schema.
- Generic login error: "Invalid email or password" (do not reveal which is wrong).

## 4. Authorization
- Default is **deny**. Every route requires auth unless explicitly public.
- Role-based access (`donor`, `patient`, `admin`) checked in backend middleware.
- Users can only access **their own** records (check `req.user.id` against the resource owner). This prevents IDOR attacks.
- Admin actions are logged (who, what, when).

## 5. Input Validation and Injection
- Validate all input on the backend (`zod`, `joi`, or `express-validator`): type, length, format.
- Block NoSQL injection: use `express-mongo-sanitize`; never pass raw `req.body` into queries.
- Never build queries from strings.
- Whitelist updatable fields. Block mass assignment (e.g. user setting `role: "admin"`).

## 6. Required Backend Middleware
```js
app.use(helmet());                       // secure headers
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));  // no "*"
app.use(express.json({ limit: '10kb' })); // limit body size
app.use(mongoSanitize());                // NoSQL injection
app.use(cookieParser());
app.use('/api/auth', authRateLimiter);   // e.g. 5-10 attempts / 15 min
app.use('/api', generalRateLimiter);     // e.g. 100 / 15 min
```
- Also use `hpp` to prevent parameter pollution.
- HTTPS only in production.

## 7. Data Exposure (Privacy)
- Donor phone/email/address is **hidden by default**. Reveal only to authorized users with a legitimate request (approved, logged in, role-checked).
- API returns only whitelisted fields (DTO / `select`). Never return the full user document.
- Do not put personal data in URLs or query strings.
- Do not log personal data or tokens.
- Production errors return a generic message; stack traces stay in server logs only.

## 8. Frontend Security Rules
- No secrets, keys, or private URLs in frontend code or `.env`.
- Never use `dangerouslySetInnerHTML` with user content.
- Frontend role checks are UX only; the backend decides.
- Remove `console.log` and source maps in production builds.
- Never call third-party services with private keys from the browser; proxy through backend.

## 9. Dependencies and Repo
- `.env` and secrets in `.gitignore`.
- Run `npm audit` regularly; update vulnerable packages.
- Commit only lockfiles from trusted installs; avoid unknown packages.
- Use separate secrets for development and production.

## 10. Quick Security Checklist
- [ ] JWT secrets are 64+ random chars, in env only
- [ ] Tokens in httpOnly cookies, short expiry
- [ ] Passwords hashed with bcrypt
- [ ] Every protected route has auth + role + ownership checks
- [ ] Input validated and sanitized on the backend
- [ ] Rate limiting on login/register/OTP routes
- [ ] CORS limited to the real frontend origin
- [ ] No sensitive field in API responses, UI, or logs
- [ ] `.env` not in Git; `.env.example` has fake values
- [ ] HTTPS enabled in production

## 11. If a Secret Leaks
1. Rotate the secret immediately.
2. Invalidate all existing tokens (forces re-login).
3. Remove it from Git history (`git filter-repo`/BFG), not just the latest commit.
4. Review logs for suspicious access.
