# DESIGN.md — Bloodlink UI Guide

Simple, trustworthy, fast. A user in an emergency must find what they need in under 3 taps.

## 1. Principles
- **Clarity first**: one primary action per screen.
- **Premium light**: airy, warm off-white, soft shadows, refined red and gold. Looks expensive, feels calm.
- **Calm, not alarming**: red is an accent, not the whole page.
- **Mobile first**: design for 360px width, then scale up.
- **Accessible**: readable text, clear focus states, labels on every input.
- **Consistent**: reuse components; never style the same thing two ways.

## 2. Premium Light Theme
Overall feel: **clean, airy, premium light**. Warm off-white backgrounds, generous whitespace, soft layered shadows, deep blood-red as the hero color and a restrained gold accent. Never dark mode, never flat or cluttered.

Define once as CSS variables in `src/styles/variables.css`. Never hardcode colors in components.

```css
:root {
  /* Brand */
  --color-primary: #B3122B;          /* deep blood red */
  --color-primary-dark: #8A0D20;     /* hover / active */
  --color-primary-light: #FBEAEC;    /* soft red tint backgrounds */
  --color-accent: #C9A24B;           /* refined gold, used sparingly */
  --color-accent-light: #F7F0DC;

  /* Surfaces (light) */
  --color-bg: #FBF9F7;               /* warm off-white page background */
  --color-bg-alt: #F4F1EE;           /* alternate sections */
  --color-surface: #FFFFFF;          /* cards */
  --color-surface-glass: rgba(255, 255, 255, 0.72); /* navbar / floating panels */

  /* Text */
  --color-text: #1B1B1F;
  --color-text-muted: #6B6B76;

  /* Status */
  --color-success: #2E7D32;
  --color-warning: #E08A00;
  --color-danger: #D32F2F;
  --color-border: #ECE7E2;

  /* Shape and depth */
  --radius-sm: 10px;
  --radius: 16px;
  --radius-lg: 24px;
  --shadow-sm: 0 1px 2px rgba(27, 27, 31, 0.05);
  --shadow: 0 6px 24px rgba(27, 27, 31, 0.07);
  --shadow-lg: 0 18px 48px rgba(179, 18, 43, 0.12);  /* soft red-tinted glow */
  --gradient-primary: linear-gradient(135deg, #C8102E 0%, #8A0D20 100%);
  --gradient-hero: radial-gradient(1200px 500px at 80% -10%, #FBEAEC 0%, transparent 60%);
}
```

### Premium Look Rules
- **Whitespace**: sections have `80–120px` vertical padding on desktop, `48px` on mobile.
- **Cards**: white, `--radius`, `--shadow`, 1px `--color-border`; lift slightly on hover (`translateY(-4px)` + `--shadow-lg`).
- **Glass navbar**: `--color-surface-glass` with `backdrop-filter: blur(12px)` and a thin bottom border.
- **Buttons**: primary uses `--gradient-primary`, fully rounded or `--radius-sm`, soft shadow, subtle hover lift. Gold accent only for small highlights (badges, underline, stat numbers).
- **Hero**: soft `--gradient-hero` background, large headline, 3D red blood drop on the right (landing page).
- **Imagery and icons**: clean line icons from `bootstrap-icons` only. Never `lucide-react`.
- **Motion**: smooth, subtle, premium (Lenis scroll, Framer Motion fade-up). No bouncy or flashy effects.
- **Contrast**: red used for actions and key data; do not paint large areas solid red.
- Use at most **one** accent (gold) alongside the primary red.

## 3. Typography
- Font: `Inter` for body/UI; optional `Playfair Display` or `DM Serif Display` for large hero headings only (premium feel). Fallback `system-ui, sans-serif`.
- Sizes: body `16px`, small `14px`, h1 `28px`, h2 `22px`, h3 `18px`.
- Line height `1.5`. Never go below `14px` for readable text.

## 4. Spacing & Layout
- Use an 8px scale: `4, 8, 16, 24, 32, 48`.
- Max content width: `1140px`, centered.
- Cards: white surface, `--radius`, `--shadow`, `24px` padding.
- Use Bootstrap grid; do not write custom grid CSS.

## 5. Components
| Component | Rule |
|---|---|
| Primary button | Filled `--color-primary`, white text, one per screen |
| Secondary button | Outline, primary color |
| Danger button | Only for delete/cancel actions, always ask confirmation |
| Input | Visible label, helper text, inline error under field |
| Card | Donor / request / hospital info blocks |
| Badge | Blood group (A+, O-, etc.), status (Pending, Approved, Fulfilled) |
| Modal | Confirmations only, not for long forms |
| Toast | Success / error feedback, auto-hide after 4s |
| Loader | Show on every async action; never leave a blank screen |

## 6. Blood Group Badge
Always show as a rounded badge, bold, primary-light background, primary text. Same style everywhere.

## 7. Required UI States
Every page/list must handle:
1. **Loading** (spinner/skeleton)
2. **Empty** (friendly message + next action)
3. **Error** (clear message + retry button)
4. **Success** (toast or inline confirmation)

## 8. Forms
- Validate on blur and on submit.
- Show errors in plain language ("Enter a valid 10-digit phone number").
- Disable submit while loading to prevent double submit.
- Frontend validation is for UX only. The backend validates again.

## 9. Pages (core)
- Home / landing
- Login / Register
- Donor dashboard (profile, availability, history)
- Patient/requester dashboard (create request, track status)
- Search donors (filter by blood group, city)
- Admin panel (approve, manage users, reports)

## 10. Accessibility Checklist
- Color contrast ratio at least 4.5:1.
- Every input has a `<label>`.
- Buttons have text or `aria-label`.
- Keyboard navigable, visible focus outline.
- Do not rely on color alone to show status; add text or icon.

## 11. Responsive Breakpoints
- Mobile: `< 576px`
- Tablet: `576–992px`
- Desktop: `> 992px`

## 12. Don'ts
- No `lucide-react`; icons only from `bootstrap-icons`.
- No dark theme, no neon, no harsh black shadows.
- No more than 2 fonts, no more than 1 primary color.
- No heavy animations; keep transitions at `150–250ms`.
- No text on busy images.
- No inline styles except for dynamic values.