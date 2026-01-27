# Valentine's Day Countdown Website

A production-quality, visually stunning romantic Valentine's Day countdown website built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- **15 Days of Content**: Progressive unlock from January 31 to February 14, 2025
- **444 Total Items**: A carefully curated collection of text, images, audio, and songs
- **Timezone-Accurate Unlocks**: Each day unlocks at 4:44 AM EST (America/New_York)
- **Beautiful Animations**: Smooth transitions, micro-interactions, and reveal mechanics
- **Luxury Aesthetic**: Elegant black and gold design with premium typography
- **Responsive Design**: Mobile-first approach with iPhone-optimized experience
- **State Persistence**: Revealed content persists in localStorage

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **Luxon** (timezone handling)
- **Google Fonts** (Cormorant Garamond, Montserrat)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Configuration

Edit `config/valentine.ts` to customize:

- `START_DATE`: First day unlock date
- `END_DATE`: Final day unlock date
- `UNLOCK_HOUR`: Hour of unlock (default: 4)
- `UNLOCK_MINUTE`: Minute of unlock (default: 44)
- `TIMEZONE`: Timezone for unlocks (default: "America/New_York")

## Content Structure

All content is defined in `data/days.ts`. Each day includes:

- `dayNumber`: Day index (1-15)
- `dateISO`: ISO date string
- `title`: Day title
- `subtitle`: Day subtitle
- `items`: Array of content items

### Item Types

- **text**: `{ type: "text", value: string }`
- **image**: `{ type: "image", src: string, alt: string }`
- **audio**: `{ type: "audio", src: string, label: string }`
- **song**: `{ type: "song", title: string, artist: string, link?: string }`

## Adding Images

1. Place images in `public/images/` directory
2. Update `data/days.ts` to reference images:
   ```typescript
   { type: "image", src: "/images/photo1.jpg", alt: "Description" }
   ```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect Next.js and deploy

The site will be live at `https://your-project.vercel.app`

### Environment Variables

No environment variables are required for basic functionality.

## Project Structure

```
├── app/
│   ├── day/[dayNumber]/    # Individual day pages
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── components/
│   ├── BackgroundDecor.tsx # Background effects
│   ├── CountdownHero.tsx   # Countdown timer
│   ├── DayCard.tsx         # Day card component
│   ├── DayGrid.tsx         # Grid of all days
│   ├── RevealPanel.tsx     # Content reveal component
│   └── SwanLogo.tsx        # Animated swan logo
├── config/
│   └── valentine.ts        # Configuration constants
├── data/
│   └── days.ts             # All day content
└── lib/
    ├── storage.ts          # localStorage utilities
    └── unlock.ts           # Unlock logic
```

## Customization

### Colors

Edit `tailwind.config.ts` to customize the color palette:

```typescript
colors: {
  black: "#07070A",
  "near-black": "#0D0D12",
  gold: "#D6B25E",
  "soft-gold": "#F1E3B1",
  white: "#F7F4EE",
}
```

### Typography

Fonts are configured in `app/layout.tsx`. To change fonts:

1. Import a new font from `next/font/google`
2. Add it to the layout
3. Update `tailwind.config.ts` font family

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus states on all interactive elements
- Reduced motion support via `prefers-reduced-motion`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Private project - All rights reserved.

