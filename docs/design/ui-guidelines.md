# Biogrix UI Guidelines

Design system for the Biogrix public website. All frontend development must follow these guidelines.

---

## 1. Brand Design Philosophy

Biogrix represents **renewable energy** and **infrastructure reliability**. The design must inspire:

- **Trust** — Users entrust us with their energy supply. Visual clarity and consistency build confidence.
- **Sustainability** — Green tones reflect biogas as clean, renewable energy.
- **Professionalism** — Clean layouts and typography signal reliability and competence.
- **Clarity** — Information is easy to find and understand.
- **Modernity** — Fresh, contemporary design that feels current and progressive.

The aesthetic is **restrained and purposeful**. Avoid decorative clutter; every element should support usability and brand perception.

---

## 2. Brand Voice

Communication style for all copy (headlines, body text, CTAs):

- **Clear** — Short sentences. One idea per sentence.
- **Confident** — State benefits directly. Avoid hedging.
- **Trustworthy** — Emphasize reliability, safety, and proven results.
- **Solution-focused** — Lead with outcomes, not features.
- **Simple language** — Use everyday words. Avoid technical jargon.

Messaging must work for both engineers and rural operators.

---

## 3. Color System

Renewable-energy friendly palette.

### Primary — Sustainability Green

| Token   | HEX       | Usage                                      |
|---------|-----------|--------------------------------------------|
| Primary | `#16A34A` | Buttons, links, primary actions, highlights |

**Use for:** Primary buttons, navigation links, highlights.

### Secondary — Soft Green (Backgrounds)

| Token     | HEX       | Usage                            |
|-----------|-----------|----------------------------------|
| Secondary | `#DCFCE7` | Section backgrounds, cards       |

**Use for:** Alternate section backgrounds, card backgrounds.

### Accent — Energy Yellow (Power & Flame)

| Token  | HEX       | Usage                         |
|--------|-----------|-------------------------------|
| Accent | `#FACC15` | Call-to-action elements       |

**Use for:** Key CTAs, energy indicators, urgent actions.

### Neutral — Grayscale

| Token       | HEX       | Usage                |
|-------------|-----------|----------------------|
| Neutral 900 | `#111827` | Primary text         |
| Neutral 700 | `#374151` | Secondary text       |
| Neutral 500 | `#6B7280` | Muted text           |
| Neutral 200 | `#E5E7EB` | Borders, dividers    |
| Neutral 50  | `#F9FAFB` | Page background      |

**Use for:** Text hierarchy, borders, backgrounds.

---

## 4. Iconography

**Recommended:** [Lucide Icons](https://lucide.dev/)

| Domain      | Icons                           |
|-------------|---------------------------------|
| Plants      | Factory, TreeDeciduous, Leaf    |
| Meters      | Gauge, Activity                 |
| Gas usage   | Flame, Droplets                 |
| Billing     | Receipt, CreditCard, Wallet     |
| Maintenance | Wrench, Settings                |
| Reports     | BarChart2, FileText, TrendingUp |

Use 24px for navigation, 20px for inline. Color: Primary for active, Neutral 500 for inactive.

---

## 5. Motion & Interaction

| Rule           | Value                                |
|----------------|--------------------------------------|
| Transitions    | 150–200ms, ease-in-out               |
| Hover states   | Subtle elevation or color shift      |
| Focus states   | Visible outline (2px primary)        |
| Loading states | Skeleton loaders or spinner          |

Keep interactions fast and purposeful.

---

## 6. Typography System

### Font Stack

- **Headings:** Inter
- **Body:** Inter

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Type Scale

| Element    | Size  | Weight | Line Height | Usage                    |
|------------|-------|--------|-------------|--------------------------|
| H1         | 36px  | 700    | 1.2         | Hero, page titles        |
| H2         | 30px  | 600    | 1.3         | Section headings         |
| H3         | 24px  | 600    | 1.4         | Subsections              |
| H4         | 20px  | 600    | 1.4         | Card titles              |
| Body       | 16px  | 400    | 1.6         | Paragraphs               |
| Body Small | 14px  | 400    | 1.5         | Captions, metadata       |
| Small      | 12px  | 400    | 1.4         | Labels, footnotes        |

### Color Mapping

- **H1, H2, H3:** Neutral 900 (`#111827`)
- **Body:** Neutral 700 (`#374151`)
- **Muted:** Neutral 500 (`#6B7280`)

---

## 7. Layout Principles

### Content Width

- **Max width:** 1200px (main content)
- **Narrow:** 720px (text-heavy sections)
- **Wide:** 1400px (data-heavy views)

### Spacing Scale (8px base)

xs: 4px | sm: 8px | md: 16px | lg: 24px | xl: 32px | 2xl: 48px | 3xl: 64px | 4xl: 96px

### Section Padding

- **Vertical:** 64px–96px
- **Horizontal:** 24px–32px (responsive)

---

## 8. Component Style Guidelines

### Buttons

| Type      | Background | Text    | Hover         |
|-----------|------------|---------|---------------|
| Primary   | Primary    | White   | Darker green  |
| Secondary | Transparent| Primary | Secondary bg  |
| Accent    | Accent     | Neutral 900 | Darker yellow |

- **Padding:** 12px 24px
- **Border radius:** 8px
- **Font:** 16px, weight 600

### Cards

- **Background:** White or Secondary
- **Border:** 1px Neutral 200
- **Border radius:** 12px
- **Padding:** 24px
- **Shadow:** Subtle

### Navigation Bar

- **Background:** White
- **Border:** 1px Neutral 200
- **Link color:** Neutral 700
- **Active/Hover:** Primary
- **Height:** 64px

### Footer

- **Background:** Neutral 900
- **Text:** Neutral 500
- **Links:** White, hover Primary
- **Padding:** 48px vertical

---

## 9. Accessibility Rules

- **Contrast:** Body text 4.5:1 minimum
- **Text sizes:** Min 16px body, 14px labels
- **Focus:** Visible 2px primary outline
- **Keyboard:** All interactive elements reachable via Tab

---

## 10. Tailwind Implementation

### Color Tokens

```javascript
theme: {
  extend: {
    colors: {
      primary: "#16A34A",
      secondary: "#DCFCE7",
      accent: "#FACC15",
      neutral: {
        900: "#111827",
        700: "#374151",
        500: "#6B7280",
        200: "#E5E7EB",
        50: "#F9FAFB",
      },
    },
  },
}
```

### Usage

- **Primary button:** `bg-primary hover:bg-[#15803d] text-white`
- **Secondary section:** `bg-secondary`
- **Accent CTA:** `bg-accent text-neutral-900`
- **Heading:** `text-neutral-900 font-semibold`
- **Body:** `text-neutral-700`

---

## Summary

- **Primary** → buttons, highlights
- **Secondary** → backgrounds
- **Accent** → call-to-action elements

All public website UI should align with these guidelines for a cohesive, trustworthy experience.
