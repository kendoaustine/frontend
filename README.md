# GasConnect Frontend

A modern, responsive frontend application for the GasConnect gas supply platform built with Nuxt.js 4, TypeScript, and Tailwind CSS.

## Features

- **Modern Stack**: Built with Nuxt.js 4, Vue 3, TypeScript, and Tailwind CSS
- **Authentication**: Complete authentication system with JWT tokens
- **Responsive Design**: Mobile-first responsive design with Tailwind CSS
- **PWA Support**: Progressive Web App capabilities with offline support
- **Form Validation**: Robust form validation with VeeValidate and Zod
- **State Management**: Pinia for state management
- **API Integration**: Seamless integration with backend microservices
- **TypeScript**: Full TypeScript support for type safety

## Tech Stack

- **Framework**: Nuxt.js 4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Heroicons
- **Forms**: VeeValidate with Zod validation
- **State Management**: Pinia
- **HTTP Client**: Built-in Nuxt $fetch
- **PWA**: Vite PWA plugin
- **Fonts**: Google Fonts (Inter)

## Project Structure

```
frontend/
├── app/                    # Nuxt app directory
├── assets/                 # Static assets
│   └── css/               # CSS files
├── components/            # Vue components
│   ├── ui/               # UI components
│   └── forms/            # Form components
├── composables/          # Vue composables
├── constants/            # Application constants
├── layouts/              # Nuxt layouts
├── middleware/           # Route middleware
├── pages/                # Nuxt pages (auto-routing)
├── plugins/              # Nuxt plugins
├── stores/               # Pinia stores
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Environment Configuration:**

Copy the environment example file:

```bash
cp .env.example .env
```

Update the environment variables in `.env`:

```env
# API Service URLs
NUXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3001
NUXT_PUBLIC_ORDERS_SERVICE_URL=http://localhost:3002
NUXT_PUBLIC_SUPPLIER_SERVICE_URL=http://localhost:3003
NUXT_PUBLIC_API_BASE_URL=http://localhost
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Integration

The frontend integrates with three backend microservices:

- **Auth Service** (port 3001): User authentication and authorization
- **Orders Service** (port 3002): Order management and processing
- **Supplier Service** (port 3003): Supplier management and inventory

API calls are automatically routed through Nitro's dev proxy configuration.

## Authentication

The application uses JWT-based authentication with:

- Login/Register forms with validation
- Automatic token refresh
- Protected routes with middleware
- Role-based access control

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run generate` - Generate static site

## Building for Production

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment

The application can be deployed to various platforms:

- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting
- **Node.js**: Server-side rendering
- **Static**: Pre-generated static site

See the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) for detailed instructions.

## Contributing

1. Follow the existing code style and conventions
2. Use TypeScript for all new code
3. Add proper type definitions
4. Test your changes thoroughly
5. Update documentation as needed

## License

This project is part of the GasConnect platform.
