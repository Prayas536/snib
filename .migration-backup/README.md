# Space Character Page

A modern, scalable web application built with React, TypeScript, and Tailwind CSS. This monorepo contains the main web application, UI component sandbox, and backend API.

## 🏗️ Project Structure

```
space-character-page/
├── apps/
│   ├── web/              # Main React application (landing page)
│   ├── ui-sandbox/       # UI component showcase and development environment
│   └── api/              # Express backend API server
├── packages/
│   ├── api-client-react/ # Auto-generated React hooks for API communication
│   ├── api-spec/         # OpenAPI specification and code generation config
│   ├── api-zod/          # Auto-generated Zod schemas for type safety
│   └── db/               # Drizzle ORM database schema and migrations
├── scripts/              # Utility scripts and shared utilities
└── package.json          # Root workspace configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ or later
- pnpm 8+ ([installation guide](https://pnpm.io/installation))

### Installation

```bash
# Install dependencies
pnpm install

# Start development server (all apps in parallel)
pnpm run dev

# Build all applications
pnpm run build

# Type check entire workspace
pnpm run typecheck
```

## 📦 Applications

### Web (`apps/web`)

The main landing page and public-facing application built with React, Vite, and Tailwind CSS.

**Features:**
- Custom cursor animation
- Parallax effects
- Smooth scroll animations
- Responsive design
- Modern component library integration

**Running:**
```bash
pnpm --filter @workspace/web run dev
```

### UI Sandbox (`apps/ui-sandbox`)

A component showcase and development environment for the UI library. Useful for isolated component development and documentation.

**Running:**
```bash
pnpm --filter @workspace/ui-sandbox run dev
```

### API (`apps/api`)

Express-based backend API server with:
- TypeScript support
- Request logging with Pino
- CORS configuration
- Health check endpoint

**Running:**
```bash
pnpm --filter @workspace/api run dev
```

## 📚 Packages

### api-client-react
Auto-generated React Query hooks for type-safe API communication. Generated from OpenAPI specification using Orval.

### api-spec
OpenAPI specification file and Orval configuration for code generation. Source of truth for API contracts.

### api-zod
Auto-generated Zod schemas for runtime type validation. Generated from OpenAPI specification.

### db
Database schema and migrations using Drizzle ORM. Defines all data models.

## 🛠️ Development

### Code Quality

```bash
# Format code with Prettier
pnpm run format

# Type check all packages
pnpm run typecheck
```

### Building

```bash
# Build all applications
pnpm run build

# Build specific app
pnpm --filter @workspace/web run build
```

## 📋 Scripts

- `pnpm run dev` - Start all development servers in parallel
- `pnpm run build` - Build all applications
- `pnpm run typecheck` - Type check entire workspace
- `pnpm --filter <package> run dev` - Start specific package
- `pnpm --filter <package> run build` - Build specific package

## 🔒 Security

- Supply-chain attack defense: All npm packages must be at least 1 day old before installation
- Type safety through TypeScript and Zod schemas
- CORS protection on API endpoints
- Input validation on all API routes

## 📄 License

MIT

## 🤝 Contributing

When adding new features:

1. Create components in the appropriate application
2. Add types to the API specification if needed
3. Run `pnpm run typecheck` to ensure type safety
4. Test components in the UI sandbox before deployment

## 📞 Support

For issues or questions, please refer to the individual app READMEs:
- [Web App Documentation](./apps/web/README.md)
- [UI Sandbox Documentation](./apps/ui-sandbox/README.md)
- [API Documentation](./apps/api/README.md)
