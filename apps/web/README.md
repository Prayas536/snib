# Web Application

Main landing page and public-facing application for the Space Character project.

## 🎨 Features

- **Custom Cursor**: Animated spaceship cursor that follows mouse movement
- **Hero Section**: Engaging landing page with parallax effects
- **Network Section**: Display of features and network benefits
- **CTA Section**: Call-to-action for user engagement
- **Responsive Design**: Fully responsive across all devices
- **Dark Mode**: Theme support with next-themes
- **Animation**: Smooth scroll and count-up animations using Framer Motion

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom plugins
- **State Management**: React Query for server state
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives
- **Routing**: Wouter (lightweight router)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📂 Project Structure

```
src/
├── components/
│   ├── ui/              # Radix UI-based components (70+ components)
│   ├── layout/          # Layout components (Navbar, Footer)
│   ├── hero/            # Hero section components
│   ├── features/        # Feature showcase components
│   ├── network/         # Network section components
│   ├── cta/             # Call-to-action components
│   └── cursor/          # Custom cursor component
├── hooks/
│   ├── useCountUp.ts    # Number animation hook
│   ├── useMouseParallax.ts # Parallax effect hook
│   ├── useScrollProgress.ts # Scroll tracking hook
│   └── use-mobile.tsx   # Mobile detection hook
├── pages/
│   ├── Home.tsx         # Main landing page
│   └── not-found.tsx    # 404 page
├── lib/
│   └── utils.ts         # Utility functions
├── App.tsx              # Root component with routing
├── main.tsx             # React entry point
└── index.css            # Global styles
```

## 🚀 Getting Started

### Development

```bash
# Start development server
pnpm run dev

# Type check
pnpm run typecheck
```

The app will open at `http://localhost:5173`

### Building

```bash
# Build for production
pnpm run build

# Preview production build
pnpm run serve
```

## 📦 Dependencies

### Key Packages
- `react-query`: Server state management
- `framer-motion`: Advanced animations
- `react-hook-form`: Form handling
- `zod`: Schema validation
- `wouter`: Client-side routing
- `next-themes`: Theme management

### UI Components
- `@radix-ui/*`: Accessible UI primitives
- `lucide-react`: Icon library
- `recharts`: Chart components

## 🎯 Performance

- **Code Splitting**: Automatic chunk splitting via Vite
- **Tree Shaking**: Unused code removal
- **Lazy Loading**: Route-based code splitting
- **Image Optimization**: Next-gen image formats

## 🔗 API Integration

Uses `@workspace/api-client-react` for type-safe API communication:

```typescript
import { useGetUsers } from '@workspace/api-client-react'

function MyComponent() {
  const { data, isLoading } = useGetUsers()
  // ...
}
```

## 🎨 Styling

### Tailwind CSS Configuration

- Custom theme colors and spacing
- Responsive utilities
- Dark mode support
- Custom animations and transitions

### Adding New Styles

1. Use Tailwind utilities when possible
2. For complex styles, add to `index.css`
3. Follow existing naming conventions
4. Keep specificity low for maintainability

## 🧪 Testing

Component development and testing in the UI Sandbox:

```bash
pnpm --filter @workspace/ui-sandbox run dev
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interactions
- Optimized performance on mobile devices

## 🚀 Deployment

```bash
# Build production-ready bundle
pnpm run build

# Output in dist/ directory
```

The built application is ready for deployment to any static hosting platform.

## 📝 Code Style

- TypeScript for type safety
- Functional components with hooks
- ESLint for code quality
- Prettier for formatting

## 🤝 Contributing

When adding new features:

1. Create components in appropriate folders
2. Add types for all props
3. Test in UI Sandbox before deployment
4. Run `pnpm run typecheck` before commit

## 📄 License

MIT
