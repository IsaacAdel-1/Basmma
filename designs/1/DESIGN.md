---
name: Curated Gallery & Studio
colors:
  surface: '#fbf9f9'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#775a19'
  on-secondary: '#ffffff'
  secondary-container: '#fed488'
  on-secondary-container: '#785a1a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1c19'
  on-tertiary-container: '#848480'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#e9c176'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4201'
  tertiary-fixed: '#e4e2dd'
  tertiary-fixed-dim: '#c8c6c2'
  on-tertiary-fixed: '#1b1c19'
  on-tertiary-fixed-variant: '#474744'
  background: '#fbf9f9'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md-mobile:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  title-sm:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.5'
    letterSpacing: 0.05em
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.1em
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style
The design system is centered on the concept of the "Digital Atelier"—a space where technology meets high art. It is designed for a sophisticated audience of photographers, interior designers, and art collectors who value curation over clutter. 

The aesthetic is **Minimalist** with a focus on **Editorial** flair. By utilizing expansive whitespace (negative space), the interface recedes to ensure the photography and wall art remain the focal points. The emotional response should be one of calm, luxury, and professional precision. The style avoids trendy distractions, opting instead for a timeless, gallery-like experience that treats every screen as a canvas.

## Colors
The palette is rooted in classic gallery tones. 

- **Primary (#1A1A1A):** A deep charcoal, almost black, used for high-contrast typography and structural elements. It provides the "frame" for the artwork.
- **Secondary (#C5A059):** A muted, satin gold used sparingly for active states, calls to action, and premium accents. 
- **Tertiary (#F9F7F2):** A soft, warm cream used as the primary background color. It is less harsh than pure white, evoking the feel of high-quality archival paper.
- **Neutral (#707070):** A balanced grey for secondary text and decorative borders, ensuring the hierarchy remains clear without competing with the art.

## Typography
The typographic strategy employs a high-contrast pairing to evoke a "magazine" feel. 

**Playfair Display** is used for headlines and display text. Its elegant serifs and variable stroke widths communicate luxury and artistic intent. For the Arabic script, a compatible high-contrast serif or a refined Naskh-style font should be used to maintain the editorial tone.

**IBM Plex Sans** (and **IBM Plex Sans Arabic**) serves as the functional workhorse. It is a modern, neutral grotesque that provides excellent legibility for tool labels, metadata, and body descriptions, ensuring the technical aspects of photo editing remain clear and accessible.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop to mimic the curated walls of a physical gallery. 

- **Desktop:** A 12-column grid with a maximum width of 1440px. Large margins (64px) ensure the content feels prestigious and uncrowded. 
- **Gaps:** Vertical spacing between sections is intentionally large (120px) to give each collection or toolset "room to breathe."
- **Masonry/Gallery:** For the tableau display, a dynamic masonry layout is used, but with strictly consistent gutters (24px) to maintain a sense of order amidst varying image aspect ratios.
- **Mobile:** Reflows to a 2-column or 1-column stack with reduced margins (20px), prioritizing vertical scrolling and large image previews.

## Elevation & Depth
This design system avoids heavy shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**.

Depth is primarily communicated through the stacking of surfaces. The base layer is the Tertiary Cream (#F9F7F2). Floating panels (like editing sidebars) use the same color but are defined by a 1px solid border in a very light Neutral or a subtle 10% opacity Primary.

When shadows are necessary (e.g., for a modal or a floating action button), they must be "Ambient Shadows"—extremely diffused, with a large blur radius (30px+) and very low opacity (5%), appearing more like a soft glow than a physical drop shadow. This maintains the minimalist, flat-art aesthetic.

## Shapes
The shape language is **Sharp (0)**. 

To reflect the literal frames of wall art and the precision of photography, the system utilizes 90-degree angles for all primary elements including buttons, input fields, and image containers. This architectural sharpness communicates confidence and sophistication. Softening is only permitted for iconography or specific user-avatar elements to provide a slight human touch against the rigid grid.

## Components
- **Buttons:** Primary buttons are solid Charcoal (#1A1A1A) with white text, sharp corners, and no gradient. Secondary buttons use a 1px Charcoal border with a transparent background. 
- **The "Frame" Card:** Every artwork is displayed in a "Frame" component—a container with generous internal padding (the "matting") before the image itself.
- **Editing Sliders:** Minimalist lines with a Secondary Gold (#C5A059) handle. No bubbles or bulky indicators.
- **Lists:** Clean, border-bottom only separation using the Neutral color at 20% opacity. High vertical padding (16px-24px) between items.
- **Input Fields:** Bottom-border only (underline style) for a sleek, non-intrusive look, especially in "Gallery Info" or "Search" areas.
- **Navigation:** A persistent, minimal top bar with "Label-Caps" typography for links, ensuring the navigation occupies as little visual real estate as possible.