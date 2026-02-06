# Netflix Clone – Frontend Features & Decisions

This document tracks frontend-only features, UX decisions, and performance optimizations.
For personal reference and interview preparation.

---

## 1. UI Architecture

### Component Structure

- Banner (hero section)
- Movie Rows (horizontal sliders)
- Movie Card (poster, hover preview)
- Trailer Player (iframe-based)
- Skeleton Loaders

Separation ensures reusable, testable components.

---

## 2. Movie Rows & Scrolling

### Horizontal Rows

- Implemented using Keen Slider
- Responsive `perView` with breakpoints
- Smooth scrolling without layout shift
- Images lazy-loaded

### Row Virtualization

- Intersection Observer used
- Rows render only when visible
- Improves initial load performance
- Skeleton placeholder shown until visible

---

## 3. Hover Preview (Desktop UX)

### Delayed Hover

- Hover activates after ~300–700ms
- Prevents accidental preview triggers
- Timers managed via `useRef`

### Hover Disabled on Mobile

- Uses `matchMedia('(hover: hover)')`
- Prevents broken UX on touch devices

---

## 4. Trailer Autoplay

### Trailer Logic

- Trailer fetched on hover
- YouTube iframe embedded
- Autoplay + muted + inline playback
- Fallback to image if trailer unavailable

### Performance Safeguards

- Cancel fetch on rapid hover (AbortController)
- Cache trailer keys to avoid refetch
- Preload trailers for first visible items

---

## 5. Smooth UI Transitions

### Animations

- No layout resizing on hover
- Only `opacity` and `transform` animated
- GPU-accelerated transitions
- Fade-in on iframe load to prevent flashing

---

## 6. State Management (Frontend)

### Local State

- Hover state (active card)
- Trailer playback state
- Iframe load state

### Planned Global State

- Watchlist via Context
- Trailer cache via Context

---

## 7. Accessibility & Navigation

### Keyboard Support

- Cards are focusable (`tabIndex=0`)
- Arrow keys navigate left/right
- Enter key reserved for play / details

---

## 8. Performance Considerations

- Skeleton loaders instead of spinners
- Lazy rendering of rows
- Avoided unnecessary re-renders
- Avoided layout thrashing on hover

---

## 9. Intentional Non-Features

Not implemented on purpose:

- Hover on mobile
- Layout resizing animations
- Overly complex global state
- Heavy animation libraries

Reason: prioritize smooth UI and predictability.

---

## 10. Interview Talking Points (Frontend)

- Why delayed hover improves UX
- How virtualization reduces DOM cost
- How trailer fetch is made reliable
- Why layout shifts are avoided
- How accessibility is handled in sliders
