# Astro Blog Customization Guide

This guide explains how to customize the appearance and behavior of your Astro blog, including colors, links, tags, and other visual elements.

## Color Customization

The blog uses CSS custom properties (variables) for consistent theming. All colors are defined in `/src/components/GlobalStyles.astro`.

### Color Variables

The main color system includes:

```css
/* Primary Colors */
--primary-color: oklch(60% 0.15 240);           /* Main accent color */
--primary-color-hover: oklch(95% 0.02 240);     /* Text color on hover */
--primary-color-hover-bg: oklch(25% 0.12 240);  /* Background on hover */
--primary-color-lighten: oklch(85% 0.08 240);   /* Lighter shade */
--primary-color-dark: oklch(40% 0.18 240);      /* Darker shade */

/* Text Colors */
--text-color: oklch(20% 0.02 240);              /* Main text */
--heading-color: oklch(15% 0.02 240);           /* Headings */
--primary-text-color: oklch(95% 0.02 240);      /* Text on colored backgrounds */

/* Background Colors */
--bg-color: oklch(98% 0.01 240);                /* Page background */
--card-color: oklch(100% 0 0);                  /* Card backgrounds */
--secondary-bg: oklch(96% 0.01 240);            /* Secondary backgrounds */

/* Interactive Elements */
--border-color: oklch(85% 0.02 240);            /* Borders */
--link-color: oklch(50% 0.15 240);              /* Links */
--link-hover: oklch(40% 0.18 240);              /* Links on hover */
```

### Customizing Link Colors

To change link colors throughout the site:

1. **Regular Links**: Modify `--link-color` in GlobalStyles.astro
2. **Link Hover State**: Modify `--link-hover` in GlobalStyles.astro
3. **Navigation Links**: These inherit from primary colors but can be customized separately

Example:
```css
/* Make links purple */
--link-color: oklch(45% 0.20 300);
--link-hover: oklch(35% 0.25 300);
```

### Customizing Tag Colors

Tags in the blog have specific hover behavior. To customize:

1. **Tag Background**: Uses `--primary-color`
2. **Tag Hover Background**: Uses `--primary-color-hover-bg` 
3. **Tag Hover Text**: Uses `--primary-color-hover`

The tag hover styling is defined in `/src/components/PostCard.astro`:
```css
hover:bg-[var(--primary-color-hover-bg)] hover:text-[var(--primary-color-hover)]
```

### Navigation Colors

Navigation elements can be customized by modifying:

- `--primary-color`: Navigation item backgrounds
- `--primary-color-hover-bg`: Hover backgrounds
- `--primary-color-hover`: Hover text color

### Calendar Colors

The integrated calendar uses themed colors:

- **Calendar Header**: Uses `--primary-color` for background
- **Day Cells**: Use `--card-color` for background
- **Events**: Use `--primary-color` with hover effects
- **Today Highlight**: Uses `--primary-color-lighten`
- **Form Elements**: Inherit from the main color scheme

## Color Scheme Examples

### Blue Theme (Default)
```css
--primary-color: oklch(60% 0.15 240);           /* Blue */
--primary-color-hover-bg: oklch(25% 0.12 240);  /* Dark blue */
--primary-color-hover: oklch(95% 0.02 240);     /* White text */
```

### Green Theme
```css
--primary-color: oklch(60% 0.15 120);           /* Green */
--primary-color-hover-bg: oklch(25% 0.12 120);  /* Dark green */
--primary-color-hover: oklch(95% 0.02 120);     /* White text */
```

### Purple Theme
```css
--primary-color: oklch(60% 0.15 300);           /* Purple */
--primary-color-hover-bg: oklch(25% 0.12 300);  /* Dark purple */
--primary-color-hover: oklch(95% 0.02 300);     /* White text */
```

### Red Theme
```css
--primary-color: oklch(60% 0.15 0);             /* Red */
--primary-color-hover-bg: oklch(25% 0.12 0);    /* Dark red */
--primary-color-hover: oklch(95% 0.02 0);       /* White text */
```

## OKLCH Color Format

This blog uses the OKLCH color format for better color consistency and accessibility:

- **L (Lightness)**: 0-100% - Controls brightness
- **C (Chroma)**: 0-0.4+ - Controls saturation/intensity  
- **H (Hue)**: 0-360 - Controls the color itself
  - 0/360: Red
  - 60: Yellow  
  - 120: Green
  - 180: Cyan
  - 240: Blue
  - 300: Magenta

Example: `oklch(60% 0.15 240)` = Medium lightness, moderate saturation, blue hue

## Dark Mode Support

The color system automatically adapts for dark mode. To customize dark mode colors, modify the `@media (prefers-color-scheme: dark)` section in GlobalStyles.astro.

## Calendar Customization

The calendar component can be further customized in `/src/styles/calendar.css`:

- **Month Navigation**: `.month-nav-btn` classes
- **Day Cells**: `.calendar-day` classes  
- **Events**: `.event-pill` classes
- **Forms**: `.event-form` and related classes

## Testing Changes

After making color changes:

1. Save the files
2. The dev server will auto-reload
3. Test in both light and dark modes
4. Check hover states and interactive elements
5. Verify calendar functionality

## Advanced Customization

For more advanced theming:

1. **Fonts**: Modify the font imports in BaseHead.astro
2. **Spacing**: Adjust Tailwind spacing classes throughout components
3. **Animations**: Customize transition classes and durations
4. **Layout**: Modify component layouts in the respective .astro files

Remember to test all changes thoroughly across different screen sizes and color schemes!