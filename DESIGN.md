---
name: Karigar
description: Professional identity and trust system for the informal workforce.
colors:
  primary: "#2F6B4F"
  accent: "#C5A059"
  neutral-bg: "#F8F3E8"
  neutral-text: "#3D2B1F"
  neutral-dark: "#242424"
  surface: "#FDFBF7"
typography:
  display:
    fontFamily: "'Yatra One', cursive, system-ui, sans-serif"
    fontSize: "clamp(3rem, 8vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1.1
  editorial-heading:
    fontFamily: "'Playfair Display', serif"
    fontSize: "clamp(2.25rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "'Astra Sans', system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "'Manrope', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "'Astra Sans', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.5px"
  handwritten:
    fontFamily: "'Caveat', cursive"
    fontSize: "1.1rem"
    fontWeight: 400
rounded:
  md: "12px"
spacing:
  sm: "0.75rem"
  md: "1.5rem"
  lg: "3.5rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "0.5rem 2.25rem"
  button-primary-hover:
    backgroundColor: "#26553f"
    textColor: "#ffffff"
---

# Design System: Karigar

## Overview

**Creative North Star: "Premium Editorial"**

Karigar has transitioned from a "Digital Guildhall" to a "Premium Editorial" experience. The goal is to evoke a human, warm, and distinctly Indian feel, prioritizing the artisans' stories and craft over raw UI elements. It moves away from any "SaaS" or "AI" aesthetic toward that of a curated exhibit or a high-end documentary magazine.

**Key Characteristics:**
- **Editorial Layout**: Emphasis on white space, high-contrast serif typography, and documentary-style imagery.
- **Heritage Palette**: Warm ivory and earthy tones that feel timeless and grounded.
- **Tactile Contrast**: Pairing elegant serifs with clean modern sans-serifs and human handwritten notes.
- **Subtle Depth**: Soft shadows and thin gold accents that suggest prestige without being loud.

## Colors

A palette designed to feel like high-quality archival paper and natural dyes.

### Primary
- **Forest Green** (#2F6B4F): Stability, growth, and professional trust. Used for primary CTAs and key identity markers.

### Accents
- **Antique Gold** (#C5A059): Prestige, quality, and heritage. Used for subtle accents, decorative lines, and high-value labels.

### Neutrals
- **Ivory** (#F8F3E8): The dominant background. Evokes the feel of handmade paper.
- **Off-White** (#FDFBF7): Used for surface contrast and card backgrounds.
- **Deep Charcoal / Brown** (#3D2B1F): The primary text color. A rich, warm brown that provides high legibility while feeling organic.
- **Deep Charcoal** (#242424): Used for secondary text and deep contrast.

## Typography

A juxtaposition of prestige, utility, and humanity.

**Display Font:** Yatra One (Cultural heritage / Identity)
**Editorial Font:** Playfair Display (Prestige / Storytelling)
**Body Font:** Manrope (Modern readability / Utility)
**Label Font:** Astra Sans (Structured metadata)
**Accent Font:** Caveat (Human touch / Handwritten notes)

### Hierarchy
- **Display** (400, clamp(3rem, 8vw, 4.5rem), 1.1): The ultimate identity markers (Hero).
- **Editorial Heading** (700, clamp(2.25rem, 5vw, 3rem), 1.2): Used for storytelling and artisan profiles.
- **Title** (600, 1.25rem, 1.4): Used for sub-section headings.
- **Body** (400, 1rem, 1.7): The primary reading text.
- **Label** (600, 0.875rem, 1.2, uppercase): Used for categories and metadata.
- **Handwritten** (400, 1.1rem): Used for "marginalia" and human notes.

## Layout

The layout follows an editorial grid, prioritizing breathability and visual storytelling.

- **Container**: 24px horizontal padding with a centered fluid width (max 1200px).
- **Rhythm**: Spacing follows a rhythmic scale based on 1.5rem (24px).
- **Responsive**: 3-column (desktop) $\rightarrow$ 2-column (tablet) $\rightarrow$ 1-column (mobile).

## Elevation & Depth

The system uses "Tonal Layering" to avoid artificiality.

- **Soft Lift**: Use of very light, diffuse shadows (`rgba(0,0,0,0.05)`) to create a sense of floating paper.
- **Thin Borders**: 1px gold or neutral borders to define boundaries without creating harsh lines.
- **Backdrop Blurs**: Soft glassmorphism (blur 12px) used only in modals to maintain focus on the content.

## Shapes

- **Corner Strategy**: A consistent 12px radius (`rounded.md`) for primary containers, creating a softened, approachable feel.
- **Editorial Contrast**: Use of sharp lines for decorative rules contrasted with organic rounded buttons.

## Components

### Buttons
- **Primary**: Forest Green background, white text, 12px rounded.
- **Hover**: Deepens to #26553f with a subtle scale (1.03).

### Editorial Cards
- **Layout**: Horizontal split (40% image, 60% content).
- **Interaction**: Image zoom (1.03x) and vertical lift on hover.
- **Hierarchy**: Label $\rightarrow$ Name (Serif) $\rightarrow$ Metadata $\rightarrow$ Summary.

### Skill Passport
- **Style**: High-fidelity exhibit card.
- **Frame**: Thin antique gold border with a deep, soft shadow.
- **Typography**: Playfair Display for names, Manrope for details.
