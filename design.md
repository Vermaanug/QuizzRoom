# Quiz Room Design System

Use this document as the source of truth when creating or changing frontend UI in `client/src`. New components should look and behave as though they were part of the original product.

## Product character

Quiz Room is bold, competitive, energetic, and minimal. The interface uses a near-black canvas, high-contrast off-white text, and electric lime as its signature color. Headings and actions feel like game-show signage; supporting text and forms stay calm and readable.

Keep the interface:

- dark by default;
- flat and geometric rather than soft or decorative;
- high contrast and easy to scan;
- concise, with one obvious primary action per section;
- responsive from a 320px-wide viewport upward.

Do not introduce gradients, glass effects, pastel palettes, heavy illustrations, or arbitrary colors and shadows.

## Technology and file conventions

- Build components with React and TypeScript (`.tsx`).
- Style with Tailwind utility classes. Do not add CSS modules, styled-components, or inline style objects for ordinary styling.
- Use the theme tokens from `client/tailwind.config.js`; do not repeat token hex values in components.
- Shared UI belongs in `client/src/component/<ComponentName>/<ComponentName>.tsx` or an existing appropriate shared folder such as `component/Form`.
- Page-specific composition belongs in `client/src/Pages/<Feature>`.
- Use the `#src/` import alias for imports from `client/src`.
- Define and export typed props. Extend native element attributes when the component wraps a native control.
- Prefer small, composable components over copying long class strings between pages.

## Design tokens

These Tailwind names are canonical:

| Purpose | Token | Value |
| --- | --- | --- |
| App background | `canvas` | `#080909` |
| Raised input/panel | `surface` | `#1e1e1e` |
| Primary text | `ink` | `#f2f2f0` |
| Secondary text | `muted` | `#747474` |
| Borders/dividers | `line` / default `border` | `#292929` |
| Brand/action | `primary-500` | `#c6ff00` |
| Brand hover | `primary-100` | `#ecff9c` |
| Brand subdued | `primary-600`, `primary-700` | dark lime |
| Error | `danger` | `#dc2626` |
| Success | `success` | `#16a34a` |

The global base style already makes all borders use `line`, and sets `body` to `bg-canvas font-sans text-ink`. Do not restate these classes on every child unless a component needs to be self-contained.

Use `shadow-button` only for prominent lime actions and `shadow-card` only for a genuinely raised card. Most surfaces should have no shadow.

## Typography

- Body and supporting copy: `font-sans` (Inter), usually `text-sm` or `text-base`.
- Display headings, labels, navigation, and important buttons: `font-display` (Anton), uppercase.
- Display text should use tight line height and, for large hero text, slightly negative tracking.
- Labels and actions generally use `uppercase tracking-[0.1em]` to `tracking-[0.12em]`.
- Secondary copy uses `text-muted`; primary content uses `text-ink`; interactive accents use `text-primary-500` or `text-primary-600`.
- Avoid long all-caps body copy. Uppercase is for short labels, actions, and display text.

Typical scale:

- Hero: `text-[70px] leading-[0.91] sm:text-[100px]`.
- Page title: `text-3xl leading-none sm:text-4xl`.
- Section title: `text-2xl` to `text-3xl`.
- Body: `text-base leading-7`.
- Supporting text: `text-sm` or `text-xs`.

## Layout and spacing

- Start mobile-first, then add `sm:` and `md:` changes only where the layout needs them.
- Page gutters are normally `px-5`, increasing to `sm:px-10` on broad full-width layouts.
- Center focused forms in `w-full max-w-[540px]`.
- Center marketing content around `max-w-3xl`.
- Use an 8-ish pixel spacing rhythm: common gaps are `gap-2`, `gap-3`, `gap-4`, `gap-5`, and `gap-10`; common section spacing is `mt-7`, `mt-8`, `mt-10`, or `mt-14`.
- Stack controls on mobile and move to rows/grids at `sm` or `md` only when space allows.
- Use borders to define regions: `border`, `border-b`, or `border-y`. Avoid enclosing every piece of content in a card.
- Controls are normally 48px or 56px tall (`h-12` or `h-14`).
- Default geometry is square-edged. Reserve `rounded-full` for circular controls/status marks. Do not add rounded cards or buttons without a specific reason.

## Component rules

### Buttons and action links

Use `client/src/component/Button/Button.tsx` for full-width form submission. Extend it with an explicit variant prop if another reusable button style is needed.

Primary action:

```tsx
className="flex h-14 items-center justify-center bg-primary-500 px-5 font-display uppercase tracking-[0.12em] text-black shadow-button transition hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
```

Secondary action:

```tsx
className="inline-flex h-14 items-center justify-center border px-7 font-display uppercase tracking-[0.1em] text-ink transition hover:border-muted focus:outline-none focus:ring-2 focus:ring-primary-700"
```

- Use a real `<button>` for actions and a React Router `<Link>` for navigation.
- Every interactive state needs a visible hover and keyboard focus treatment.
- Disabled and loading states must prevent repeat submission and remain understandable.
- Keep button text short and action-led: “Create account”, “Join room”, “Start hosting”.

### Inputs and forms

- Reuse `component/Form/TextInput.tsx` for standard text, email, and password fields.
- Standard input: `h-14 w-full border bg-surface px-5 text-ink outline-none`.
- Focus changes the border to `primary-700`; errors change it to `danger`.
- Put uppercase display labels above fields with `mb-2`.
- Put validation messages immediately below the affected field in `text-xs font-medium text-danger`.
- Use React Hook Form with Zod schemas for non-trivial forms.
- Set `noValidate` when application validation supplies the errors.
- Add accurate `type`, `autoComplete`, `aria-invalid`, and `aria-describedby` values.
- Server-level feedback uses `FormAlert`; field-specific server errors should also be attached to their field when possible.
- Place related fields in `grid grid-cols-1 ... sm:grid-cols-2` when appropriate.

### Panels, cards, and alerts

- Ordinary panels use `border bg-surface` or a nearby dark surface and `p-5`.
- Prefer a single border over elevation.
- Alerts must use semantic color, readable contrast, and `role="alert"` for errors or `role="status"` for success.
- Status icons may be circular, but the containing panel should follow the square-edged system.

### Brand mark

Render the wordmark consistently:

```tsx
<Link
  aria-label="Quiz Room home"
  className="inline-flex items-center gap-1 font-display text-xl uppercase tracking-[-0.03em] text-ink sm:text-[23px]"
  to="/"
>
  <span className="text-primary-500">QUIZ</span> ROOM
  <b aria-hidden="true" className="ml-1 text-2xl not-italic text-primary-500">ϟ</b>
</Link>
```

Extract this to a shared component before adding another copy.

## Accessibility requirements

- Use semantic landmarks (`header`, `nav`, `main`, `section`, `form`) and the correct native control.
- Every input must have a programmatically associated label. Placeholder text is not a label.
- Icon-only buttons require a precise `aria-label`; decorative icons use `aria-hidden="true"`.
- Maintain strong contrast. Never place muted text on a similarly dark surface for essential information.
- Keep keyboard focus visible; never use `focus:outline-none` without adding a focus ring or border state.
- Error and success messages must be announced with the appropriate ARIA role.
- Do not rely on color alone to communicate state.
- Avoid fixed heights on content containers when text may wrap; use `min-h-*` where needed.

## Content style

- Use plain, direct sentences.
- Headings should be brief and energetic.
- Buttons begin with a verb.
- Error messages explain what happened or what the user can do next.
- Do not expose implementation language, raw server errors, or blame the user.
- Use sentence case for body copy and display-style uppercase through CSS, not hard-coded uppercase strings.

## Rules for creating a new component

Before writing code:

1. Search `client/src/component` for an existing component that can be reused or extended.
2. Identify whether the component is shared UI or page-specific composition.
3. Choose colors, typography, spacing, and shadows only from this system.

While writing code:

1. Define a narrow TypeScript props interface.
2. Preserve native HTML semantics and allow required native attributes through props where useful.
3. Cover default, hover, focus, disabled/loading, error, and success states that apply.
4. Keep mobile layout usable at 320px and add responsive behavior progressively.
5. Avoid duplicated magic values. If a visual value will be reused, add a named token to `tailwind.config.js`.

Before handing off:

1. Run `npm run lint` in `client`.
2. Run `npm run build` in `client`.
3. Verify keyboard navigation, visible focus, labels, and error announcements.
4. Check the component at mobile and desktop widths.
5. Confirm that no unrelated visual system, font, color, or border-radius was introduced.

## Reference components

Use these files as working examples:

- `client/src/component/Button/Button.tsx` — primary button and loading behavior.
- `client/src/component/Form/TextInput.tsx` — labels, errors, focus, and password reveal.
- `client/src/Pages/Auth/AuthLayout.tsx` — focused page width and responsive gutters.
- `client/src/Pages/Auth/AuthHeader.tsx` — page heading hierarchy.
- `client/src/Pages/Home/HomePage.tsx` — marketing layout, navigation, hero type, panels, and responsive composition.

When existing code conflicts with this document, prefer the named theme tokens, accessibility requirements, and reusable-component rules here, then update the older pattern if it is within the task scope.
