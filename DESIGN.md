# DESIGN.md

## 1. Design Direction

The interface uses a dark, high-contrast technical aesthetic with restrained green accents.

The visual language should feel:

* Professional
* Technical
* Precise
* Modern
* Production-ready
* Calm rather than flashy

Avoid excessive cyberpunk styling, strong neon effects, busy gradients, and decorative technical elements that do not improve understanding.

---

## 2. Core Design Tokens

### 2.1 Color Tokens

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

### 2.2 Extended Color Tokens

```css
:root {
  --color-background-deep: #070A0E;
  --color-surface-soft: #0F151C;
  --color-surface-hover: #1A2530;

  --color-border-subtle: rgba(48, 54, 61, 0.65);
  --color-border-strong: rgba(126, 231, 135, 0.45);

  --color-accent-muted: rgba(126, 231, 135, 0.12);
  --color-accent-soft: rgba(126, 231, 135, 0.18);
  --color-accent-glow: rgba(126, 231, 135, 0.22);

  --color-info: #58A6FF;
  --color-warning: #D29922;
  --color-success: #7EE787;
}
```

### 2.3 Color Usage

Use colors according to these roles:

| Token              | Usage                                         |
| ------------------ | --------------------------------------------- |
| `background`       | Main page canvas                              |
| `surface`          | Cards, content panels, inputs                 |
| `surface-elevated` | Floating panels, dialogs, AI assistant        |
| `text-primary`     | Headings, labels, key content                 |
| `text-secondary`   | Body copy, metadata, descriptions             |
| `accent`           | Active states, links, actions, highlights     |
| `border`           | Card outlines, separators, control boundaries |
| `error`            | Errors, destructive actions, failed states    |

### 2.4 Accent Constraints

The green accent must remain restrained.

Preferred uses:

* Active navigation
* Link text
* Status labels
* Primary buttons
* Thin borders
* Small icons
* Architecture connectors
* Important keywords
* Focus outlines

Avoid:

* Large green backgrounds
* Green paragraph text
* Strong green gradients
* Heavy neon shadows
* Applying green to every interactive element

---

## 3. Typography

### 3.1 Font Families

Use Manrope for primary content and JetBrains Mono for technical labels. In the Next.js implementation, these fonts should be exposed through CSS variables and consumed by Tailwind.

```css
:root {
  --font-sans:
    var(--font-manrope),
    ui-sans-serif,
    system-ui,
    sans-serif;

  --font-mono:
    var(--font-jetbrains-mono),
    "SFMono-Regular",
    Consolas,
    monospace;
}
```

Tailwind should match these tokens:

```typescript
fontFamily: {
  sans: [
    "var(--font-manrope)",
    "ui-sans-serif",
    "system-ui",
    "sans-serif",
  ],
  mono: [
    "var(--font-jetbrains-mono)",
    "SFMono-Regular",
    "Consolas",
    "monospace",
  ],
}
```

### 3.2 Typography Roles

Use sans-serif for:

* Headlines
* Body copy
* Navigation
* Buttons
* Card titles
* Form labels

Use monospace for:

* Section labels
* Metadata
* Technology tags
* Status badges
* Code
* Architecture annotations
* Short technical labels

### 3.3 Type Scale

```css
:root {
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 2rem;
  --text-4xl: 2.75rem;
  --text-5xl: clamp(2.75rem, 5vw, 4.75rem);
}
```

### 3.4 Typography Rules

* Hero headlines should occupy no more than three lines on desktop.
* Highlight only one phrase or line with the accent color.
* Use a body line height between `1.6` and `1.75`.
* Keep long text blocks between approximately 55 and 75 characters wide.
* Use uppercase monospace only for short labels.
* Avoid uppercase body copy.
* Use font weight rather than color alone to establish hierarchy.

---

## 4. Spacing System

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
}
```

Recommended usage:

* Desktop page padding: `32px–48px`
* Tablet page padding: `24px`
* Mobile page padding: `16px`
* Desktop section spacing: `80px–112px`
* Mobile section spacing: `56px–72px`
* Card gaps: `16px–24px`
* Maximum content width: `1440px`

The interface should feel spacious even when presenting dense technical content.

---

## 5. Layout

### 5.1 Grid

Use a 12-column desktop grid.

Recommended patterns:

* Hero text: 5 columns
* Hero visual: 7 columns
* Featured cards: 3 equal columns
* Content with metadata panel: 8 columns and 4 columns
* Skill cards: 4 or 5 columns depending on available width

### 5.2 Breakpoints

```css
/* Mobile */
@media (max-width: 767px) {}

/* Tablet */
@media (min-width: 768px) and (max-width: 1199px) {}

/* Desktop */
@media (min-width: 1200px) {}
```

### 5.3 Responsive Behavior

Desktop:

* Split hero layout
* Full navigation
* Three-column card grids
* Floating assistant panel
* Full architecture diagrams

Tablet:

* Two-column card grids
* Condensed navigation
* Simplified technical diagrams
* Reduced horizontal spacing

Mobile:

* Single-column layout
* Collapsed navigation
* Hero visual below text
* Stacked cards
* Full-width or bottom-sheet assistant
* Reduced technical grid density

---

## 6. Background Treatment

Use a subtle technical grid in selected areas such as the hero, diagrams, or feature sections.

```css
.technical-grid {
  background-image:
    linear-gradient(
      rgba(126, 231, 135, 0.035) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(126, 231, 135, 0.035) 1px,
      transparent 1px
    );

  background-size: 32px 32px;
}
```

Optional visual details:

* Faint node patterns
* Subtle connector lines
* Soft radial glow
* Gentle vignette
* Sparse data-point dots

The background must remain secondary to the content.

---

## 7. Surfaces

Use layered dark surfaces to create hierarchy.

### Base Surface

```css
.surface {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}
```

### Elevated Surface

```css
.surface-elevated {
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.28);
}
```

### Hover Surface

```css
.surface:hover {
  background: var(--color-surface-hover);
  border-color: var(--color-border-strong);
}
```

Use borders and background contrast before using shadows.

---

## 8. Border Radius

```css
:root {
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-pill: 999px;
}
```

Recommended usage:

* Tags and status badges: `6px`
* Buttons and inputs: `8px`
* Cards: `12px`
* Dialogs and floating panels: `16px`
* Circular controls: `999px`

Avoid excessive rounding. The interface should feel technical rather than playful.

---

## 9. Shadows and Glow

```css
:root {
  --shadow-panel:
    0 20px 50px rgba(0, 0, 0, 0.28);

  --shadow-card:
    0 12px 30px rgba(0, 0, 0, 0.18);

  --shadow-glow:
    0 0 40px rgba(126, 231, 135, 0.08);
}
```

Use shadows sparingly.

Green glow should appear only around:

* Active AI elements
* Important architecture nodes
* Focused technical visuals
* Selected controls

---

## 10. Navigation

The desktop navigation should be horizontal and visually quiet.

Recommended structure:

* Brand on the left
* Navigation links in the center
* Primary contact action on the right

### Active State

Use:

* Accent-colored text
* Thin underline
* Slightly increased weight

### Sticky Header

```css
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;

  background: rgba(11, 15, 20, 0.88);
  border-bottom: 1px solid var(--color-border-subtle);
  backdrop-filter: blur(16px);
}
```

The mobile navigation should open as an overlay or drawer with clear focus behavior.

---

## 11. Buttons

### 11.1 Primary Button

```css
.button-primary {
  color: #071009;
  background: var(--color-accent);
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-md);
  font-weight: 600;
}
```

### 11.2 Secondary Button

```css
.button-secondary {
  color: var(--color-text-primary);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}
```

### 11.3 Ghost Button

```css
.button-ghost {
  color: var(--color-text-secondary);
  background: transparent;
  border: 1px solid transparent;
}
```

### 11.4 Button States

Every button must define:

* Default
* Hover
* Focus
* Active
* Disabled
* Loading

Hover effects should use small color or border changes rather than large movement.

---

## 12. Links

Links should use the accent color.

On hover and focus:

* Show underline
* Increase brightness slightly
* Preserve visible keyboard focus

Links with arrows may shift the arrow horizontally by `2px–4px`.

---

## 13. Cards

### 13.1 Card Style

```css
.card {
  background:
    linear-gradient(
      180deg,
      #111820 0%,
      #0E141B 100%
    );

  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}
```

### 13.2 Hover Behavior

On hover:

* Border shifts toward the accent color
* Card rises no more than `4px`
* Visual preview becomes slightly brighter
* Link arrow moves slightly

Avoid large scale changes or dramatic shadows.

### 13.3 Card Hierarchy

Cards should generally include:

* Optional visual
* Metadata or status
* Title
* Description
* Tags
* Action link

Use spacing and typography before adding separators.

---

## 14. Tags and Status Badges

Tags should use monospace typography.

```css
.tag {
  display: inline-flex;
  align-items: center;

  padding: 0.375rem 0.625rem;

  color: var(--color-text-secondary);
  background: rgba(17, 24, 32, 0.88);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);

  font-family: var(--font-mono);
  font-size: var(--text-xs);
}
```

Accent status badge:

```css
.status-accent {
  color: var(--color-accent);
  background: var(--color-accent-muted);
  border: 1px solid var(--color-border-strong);
}
```

Status must not rely on color alone. Include readable text or an icon.

---

## 15. Section Labels

Use small monospace labels above major headings.

Example:

```text
FEATURED PROJECTS ─────
```

Recommended styling:

* Uppercase
* Monospace
* Accent color
* Small font size
* Moderate letter spacing
* Optional horizontal rule

Section labels must supplement, not replace, semantic headings.

---

## 16. Technical Visuals

Architecture visuals should use:

* Dark panels
* Thin borders
* Green connector lines
* Monospace labels
* Clear grouping
* Minimal dimensionality
* Subtle glows
* Logical flow direction

Recommended visual structure:

* Central system node
* Supporting services around it
* Clearly labeled boundaries
* Consistent connector styles
* Small technology icons
* Distinct cloud and on-premise regions

Avoid:

* Decorative arrows without meaning
* Overly complex circuitry
* Unlabeled nodes
* Bright gradients
* Photorealistic infrastructure
* Fake data visualizations

---

## 17. Iconography

Use one consistent outline icon family.

Guidelines:

* Stroke width: `1.5px–2px`
* Default color: secondary text
* Active color: accent
* Use recognizable technology logos where relevant
* Decorative icons should be hidden from screen readers
* Do not mix multiple icon styles

Icons should support labels, not replace them.

---

## 18. Forms and Inputs

Inputs should use dark surfaces and visible boundaries.

```css
.input {
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}
```

Focus state:

```css
.input:focus-visible {
  border-color: var(--color-accent);
  outline: 2px solid var(--color-accent-muted);
  outline-offset: 2px;
}
```

Form guidelines:

* Use persistent labels
* Do not rely only on placeholders
* Keep error messages near the affected control
* Use the error color with text or icons
* Maintain minimum `44px` control height where practical

---

## 19. AI Assistant UI

The AI assistant should feel like a natural extension of the portfolio interface.

### Launcher

* Fixed bottom-right
* Circular or rounded-square
* Accent outline
* Small status indicator
* Minimum `44px × 44px`
* Tooltip on hover and focus

### Panel

Use an elevated dark surface with:

* Header
* Assistant name
* Short scope description
* Message history
* Suggested prompts
* Input field
* Send action
* Close action

### Mobile

Open as:

* Full-width bottom sheet, or
* Near full-screen dialog

The input should remain visible when the mobile keyboard is open.

---

## 20. Motion

Use motion only to communicate state or hierarchy.

```css
:root {
  --transition-fast: 160ms ease;
  --transition-medium: 240ms ease;
}
```

Allowed motion:

* Small card lift
* Link arrow movement
* Assistant open and close
* Mobile navigation transition
* Button state changes
* Subtle connector pulse

Avoid:

* Constant floating animations
* Large parallax effects
* Cursor-following visuals
* Continuous background motion
* Rapid glow effects

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 21. Accessibility

Target WCAG 2.2 AA.

Visual and interaction requirements:

* Minimum `4.5:1` text contrast
* Minimum `3:1` contrast for large text and controls
* Visible focus states
* No hover-only information
* No color-only status communication
* Minimum `44px × 44px` touch targets
* Keyboard-accessible navigation
* Keyboard-accessible dialogs
* Reduced-motion support
* Clear labels and error messages
* Logical focus order
* Sufficient spacing between interactive controls

Recommended focus style:

```css
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}
```

---

## 22. Visual Hierarchy

Use hierarchy in this order:

1. Large primary headline
2. Supporting statement
3. Primary action
4. Technical visual
5. Section heading
6. Card title
7. Body copy
8. Metadata
9. Tags and labels

Do not use accent color as the only method of creating hierarchy.

---

## 23. Empty States

Empty states should remain visually consistent with the dark technical aesthetic.

Use:

* Small outline icon
* Clear title
* Short explanation
* Optional next action

Avoid oversized illustrations or playful consumer-app graphics.

---

## 24. Loading States

Loading states may use:

* Skeleton cards
* Subtle shimmer
* Inline progress labels
* Small spinners

Skeletons should use surface colors rather than bright gray.

Do not use continuous high-contrast animation.

---

## 25. Error States

Use the error color sparingly.

Error components should include:

* Clear error title
* Short explanation
* Recovery action
* Icon or text label in addition to color

```css
.error {
  color: var(--color-error);
  background: rgba(255, 123, 114, 0.08);
  border: 1px solid rgba(255, 123, 114, 0.35);
}
```

---

## 26. Visual Patterns to Use

Use consistently:

* Layered dark surfaces
* Thin technical borders
* Restrained green accent
* Monospace metadata
* Sans-serif headlines
* Architecture-led visuals
* Compact status chips
* Subtle technical grid backgrounds
* Rounded rectangular cards
* Quiet hover states
* Clear spacing
* Visible keyboard focus

---

## 27. Visual Patterns to Avoid

Do not use:

* Excessive neon glow
* Bright green page backgrounds
* Generic stock photography
* Fake terminal output
* Decorative charts with invented data
* Heavy glassmorphism
* Busy gradients
* Multiple strong accent colors
* Large animated backgrounds
* Overly rounded consumer-app styling
* Percentage-based skill meters
* Low-contrast gray text
* Continuous motion without purpose

---

## 28. Visual Acceptance Checklist

The visual design is ready when:

* The interface clearly reads as technical and professional.
* The dark visual system is consistent across all screens.
* The green accent remains restrained.
* Typography hierarchy is clear.
* Monospace text is limited to technical metadata.
* Cards use consistent borders, spacing, and radius.
* Architecture visuals are readable.
* Interactive states are visually distinct.
* Keyboard focus is visible.
* Reduced-motion behavior is implemented.
* Mobile layouts remain clear and usable.
* No decorative effect competes with the content.
