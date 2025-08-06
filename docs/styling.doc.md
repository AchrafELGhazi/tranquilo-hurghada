# Tranquilo Hurghada Color Usage Guide

## Your Color Palette

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|--------|
| **Cream** | `#F3E9DC` | `rgb(243, 233, 220)` | Main background, light text |
| **Terracotta** | `#D96F32` | `rgb(217, 111, 50)` | Primary buttons, accents |
| **Burnt Orange** | `#C75D2C` | `rgb(199, 93, 44)` | Main text, dark accents |
| **Golden Yellow** | `#F8B259` | `rgb(248, 178, 89)` | Highlights, hover states |

---

## How to Use Colors

### 1. In CSS (Direct)
```css
.my-element {
  background-color: #F3E9DC;  /* Cream */
  color: #C75D2C;             /* Burnt Orange */
  border: 1px solid #D96F32;  /* Terracotta */
}
```

### 2. Using CSS Variables
```css
.my-element {
  background-color: var(--cream);
  color: var(--burnt-orange);
  border: 1px solid var(--terracotta);
}
```

### 3. Using Utility Classes
```html
<!-- Text Colors -->
<p class="text-cream">Cream text</p>
<p class="text-terracotta">Terracotta text</p>
<p class="text-burnt-orange">Burnt orange text</p>
<p class="text-golden-yellow">Golden yellow text</p>

<!-- Background Colors -->
<div class="bg-cream">Cream background</div>
<div class="bg-terracotta">Terracotta background</div>
<div class="bg-burnt-orange">Burnt orange background</div>
<div class="bg-golden-yellow">Golden yellow background</div>

<!-- Border Colors -->
<div class="border border-terracotta">Terracotta border</div>
```

### 4. In Tailwind Config (if needed)
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'cream': '#F3E9DC',
        'terracotta': '#D96F32',
        'burnt-orange': '#C75D2C',
        'golden-yellow': '#F8B259',
      }
    }
  }
}
```

---

## Quick Copy-Paste

**CSS Variables:**
```css
--cream: #F3E9DC;
--terracotta: #D96F32;
--burnt-orange: #C75D2C;
--golden-yellow: #F8B259;
```

**Hex Codes:**
- Cream: `#F3E9DC`
- Terracotta: `#D96F32`
- Burnt Orange: `#C75D2C`
- Golden Yellow: `#F8B259`

**RGB Values:**
- Cream: `rgb(243, 233, 220)`
- Terracotta: `rgb(217, 111, 50)`
- Burnt Orange: `rgb(199, 93, 44)`
- Golden Yellow: `rgb(248, 178, 89)`

---

## Font Usage

```css
/* Roboto for body text */
font-family: var(--font-roboto);

/* Butler for headings */
font-family: var(--font-butler);
```

Or use utility classes:
```html
<h1 class="font-butler">Heading</h1>
<p class="font-roboto">Body text</p>
``` 

---

## That's it! Use any method that works for your project. ✨