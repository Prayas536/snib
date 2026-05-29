# UI Sandbox

Component showcase and development environment for the UI component library. This application provides an interactive interface to browse, preview, and test all UI components in isolation.

## 🎯 Purpose

- **Component Showcase**: Browse all 70+ UI components
- **Development Environment**: Develop and test components in isolation
- **Living Documentation**: Visual documentation of component library
- **Integration Testing**: Test component combinations and interactions

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Library**: Radix UI primitives
- **File Watching**: Chokidar for hot reload

## 📂 Project Structure

```
src/
├── components/
│   └── ui/              # 70+ UI components from Radix UI
├── hooks/
│   ├── use-mobile.tsx   # Mobile detection
│   └── use-toast.ts     # Toast notification hook
├── .generated/
│   └── mockup-components.ts # Auto-generated component registry
├── App.tsx              # Component preview interface
├── main.tsx             # Entry point
└── index.css            # Styles
```

## 🚀 Getting Started

### Development

```bash
# Start development server
pnpm run dev

# Type check
pnpm run typecheck
```

The sandbox will open at `http://localhost:5174`

### Building

```bash
# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## 📦 Included Components

### Layout
- Accordion
- Breadcrumb
- Card
- Drawer
- Navigation Menu
- Pagination
- Sidebar
- Tabs

### Input
- Button
- Button Group
- Checkbox
- Command
- Input
- Input OTP
- Label
- Radio Group
- Select
- Switch
- Textarea
- Toggle
- Toggle Group

### Dialog
- Alert Dialog
- Context Menu
- Dialog
- Dropdown Menu
- Hover Card
- Popover
- Sheet
- Tooltip

### Display
- Alert
- Avatar
- Badge
- Calendar
- Carousel
- Chart
- Empty
- Progress
- Scroll Area
- Separator
- Skeleton
- Slider
- Spinner

### Feedback
- Toast
- Sonner (toast library)
- Toaster

### Utility
- Aspect Ratio
- Collapsible
- Resizable Panels
- And many more...

## 🎨 Using Components

All components are automatically registered in the component preview. To add a new component:

1. Create the component in `src/components/ui/`
2. Export it from the registry
3. The component appears in the sandbox automatically

## 🔄 Hot Module Replacement (HMR)

- Automatic reload on file changes
- Preserves component state during development
- Instant feedback for styling changes

## 📱 Responsive Testing

Test component behavior across different screen sizes:
- Desktop (1920px)
- Laptop (1440px)
- Tablet (768px)
- Mobile (375px)

## 🧪 Testing Components

1. Open the sandbox in your browser
2. Navigate to the component you want to test
3. Interact with the component
4. Check console for any errors or warnings
5. Verify responsive behavior at different breakpoints

## 🛠️ Creating New Components

Example component structure:

```typescript
// components/ui/my-component.tsx
import React from 'react'
import { cn } from '@/lib/utils'

export interface MyComponentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary'
}

export const MyComponent = React.forwardRef<
  HTMLDivElement,
  MyComponentProps
>(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center',
      variant === 'default' && 'bg-primary',
      variant === 'secondary' && 'bg-secondary',
      className
    )}
    {...props}
  />
))
MyComponent.displayName = 'MyComponent'
```

## 📚 Radix UI Integration

All components use [Radix UI](https://www.radix-ui.com/) as the foundation:
- Accessible by default
- Unstyled for custom design
- Headless component approach
- Comprehensive documentation

## 🎯 Best Practices

1. **Accessibility First**: All components must be keyboard navigable
2. **Props Documentation**: Document all component props with TypeScript
3. **Forward Refs**: Use `React.forwardRef` for components
4. **Styling**: Use Tailwind CSS utility classes
5. **Testing**: Test components with multiple content types

## 🔗 Component Library Management

Components are shared between `web` and `ui-sandbox`. When updating:

1. Update the component in the shared library
2. Test in `ui-sandbox`
3. Update in `web` if needed
4. Run `pnpm run typecheck`

## 📝 Documentation

Each component should include:
- PropTypes or TypeScript interface
- Usage examples
- Accessibility notes
- Responsive behavior description

## 🚀 Deployment

```bash
# Build the sandbox
pnpm run build

# Output in dist/ directory
```

Deploy to any static hosting platform.

## 🐛 Troubleshooting

### Components not appearing
- Clear browser cache
- Restart dev server
- Check console for errors

### Styling issues
- Verify Tailwind CSS configuration
- Check class name conflicts
- Ensure proper CSS specificity

### Performance issues
- Check for unoptimized re-renders
- Use React DevTools Profiler
- Optimize component state management

## 📄 License

MIT
