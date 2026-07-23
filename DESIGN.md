# Design

## Direction

The Tirtayasa Portfolio is a dark, precise, technical brand surface for a Data Analyst & AI Enabler. It should feel calm, credible, production-ready, and business-aware.

Keep the style restrained: high contrast, spacious layouts, sharp hierarchy, one green accent. Avoid cyberpunk excess, generic SaaS polish, decorative gradients, glassmorphism, and technical ornament that does not improve clarity.

## Visual Tokens

Use the committed frontend tokens as the source of truth.

```css
:root {
  --color-background: #0B0F14;
  --color-surface: #111820;
  --color-surface-elevated: #17212B;
  --color-text-primary: #E6EDF3;
  --color-text-secondary: #9DA7B3;
  --color-accent: #7EE787;
  --color-border: #30363D;
  --color-error: #FF7B72;
}
```

Color roles:

- Background: page canvas and technical grid base.
- Surface: cards, panels, inputs, and content blocks.
- Surface elevated: dialogs, chat panel, floating UI.
- Text primary: headings, labels, key content.
- Text secondary: body copy, metadata, descriptions.
- Accent: primary actions, links, active states, focus, small status details.
- Border: card outlines, separators, control boundaries.
- Error: failed states and validation errors.

Use accent sparingly. It should highlight decisions, not decorate every element. Avoid large green backgrounds, green body copy, heavy neon shadows, and strong green gradients.

## Typography

- Sans: `var(--font-manrope)`, then system sans.
- Mono: `var(--font-jetbrains-mono)`, then system mono.

Use sans-serif for headings, body, navigation, forms, and buttons. Use monospace only for short technical labels, badges, metadata, tags, code, and assistant/status details.

Rules:

- Keep prose readable at `1.6–1.75` line height.
- Keep long text around `55–75ch`.
- Use uppercase monospace only for short labels.
- Use weight, size, and spacing before adding more color.
- Hero headings should stay balanced and fit within three desktop lines.

## Layout

- Max page width: `max-w-7xl` unless a route has a reason to be narrower.
- Page padding: `16px` mobile, `24px` tablet, `32–48px` desktop.
- Section rhythm: `56–72px` mobile, `80–112px` desktop.
- Card/control gaps: `16–24px`.
- Use grid for real 2D layouts and flex/flex-wrap for simple rows.
- Preserve generous negative space; dense technical content should still breathe.

The homepage may use the subtle `technical-grid` background. Do not repeat decorative grid treatment on every section.

## Components

Shared UI should follow the existing Tailwind/Radix/lucide patterns.

- Cards: rounded `lg/xl`, `border-border`, `bg-surface`, optional hover elevation via `bg-surface-elevated` or subtle translate. Do not nest cards.
- Buttons/links: minimum touch target `44px`, clear focus state, primary action uses accent fill or border.
- Tags/badges: compact monospace, muted text, subtle borders.
- Forms: labels must be visible; validation copy must be specific and readable.
- Chat UI: elevated, keyboard-accessible, usable when backend/AI is unavailable.
- Icons: lucide icons only; use them as cues, not decoration.

## Interaction and Motion

Motion should be quiet and purposeful:

- Small hover shifts, border changes, and link underline transitions are enough for most elements.
- Do not animate layout-heavy properties.
- Every animation must remain usable with `prefers-reduced-motion: reduce`.
- Content must be visible by default; never rely on JS-triggered reveal to show important content.

## Accessibility

- Body text contrast must meet WCAG AA.
- Focus states must be visible on every interactive element.
- Icon-only controls need screen-reader labels.
- Dialogs, menus, chat, and forms must work by keyboard.
- Do not rely on color alone for state.
- Preserve public page usability if the backend or assistant fails.

## Implementation Notes

- Frontend uses Next.js App Router, Tailwind CSS, Radix UI, lucide-react, Manrope, and JetBrains Mono.
- Component filenames should be PascalCase and match exports.
- Only `NEXT_PUBLIC_*` values may be read by browser code.
- Keep design changes focused; follow existing tokens before adding new ones.
