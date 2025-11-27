# Migration from Create React App to Next.js

This document outlines the migration from Create React App (CRA) to Next.js 14 with the App Router.

## Key Changes

### 1. Project Structure
- **New directory**: `src/app/` - Contains Next.js App Router pages and layout
- **Routes**: Each route is now a folder with a `page.js` file
  - `/start` → `src/app/start/page.js`
  - `/consent` → `src/app/consent/page.js`
  - `/demographic` → `src/app/demographic/page.js`
  - etc.

### 2. Configuration Files
- **Added**: `next.config.js` - Next.js configuration
- **Added**: `tsconfig.json` - TypeScript configuration (supports JS files)
- **Removed**: No longer using `react-scripts`

### 3. Environment Variables
All environment variables have been renamed from `REACT_APP_*` to `NEXT_PUBLIC_*`:
- `REACT_APP_ENV` → `NEXT_PUBLIC_ENV`
- `REACT_APP_VERSION` → `NEXT_PUBLIC_VERSION`
- `REACT_APP_FIREBASE_*` → `NEXT_PUBLIC_FIREBASE_*`

**Action Required**: Update your `.env.development`, `.env.production`, and `.env.local` files to use the new naming convention. See `.env.example` for reference.

### 4. Routing Changes
- **React Router DOM** has been replaced with **Next.js App Router**
- Navigation hook: Created compatibility wrapper at `src/hooks/useNavigation.js`
- Search params: Using `useSearchParams` from `next/navigation` instead of `react-router-dom`

### 5. Scripts
Updated `package.json` scripts:
- `yarn start` → Runs production server (use `yarn dev` for development)
- `yarn dev` → Starts development server
- `yarn build` → Builds the Next.js application
- `yarn lint` → Runs Next.js linting

### 6. Root Layout
- Created `src/app/layout.js` which wraps all pages
- Includes Redux Provider, ServiceAPIProvider, and global styles
- Google Analytics script moved to layout

### 7. Public Assets
Public assets remain in the `public/` folder and are served from the root path.

## Migration Steps Completed

1. ✅ Created Next.js configuration (`next.config.js`)
2. ✅ Created TypeScript config for JS support
3. ✅ Created App Router structure with layout and pages
4. ✅ Updated all environment variable references
5. ✅ Created navigation compatibility layer
6. ✅ Updated all component imports for navigation
7. ✅ Updated package.json dependencies and scripts
8. ✅ Moved routing logic to individual page files

## What You Need to Do

### 1. Install Dependencies
```bash
cd packages/app
yarn install
```

### 2. Update Environment Variables
Copy your existing environment files and rename all variables:
```bash
# Example: .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_FIREBASE_SERVER_URL=your_server_url
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_VERSION=2.1
```

### 3. Test the Application
```bash
# Development
yarn dev

# Production build
yarn build
yarn start
```

### 4. Update Deployment Configuration
If you're using AWS Amplify or another hosting service, update the build commands:
- Build command: `yarn build`
- Start command: `yarn start`
- Output directory: `.next`

## Known Differences

### Client Components
All pages and the root layout use `'use client'` directive because they rely on:
- Redux hooks
- React hooks (useState, useEffect)
- Browser APIs

### Metadata
Since the root layout is a client component, metadata is added directly in the `<head>` tag rather than using Next.js metadata API.

### Routing
- No more `<BrowserRouter>` wrapper
- No more `<Routes>` and `<Route>` components
- Each route is now a separate page file
- Navigation uses Next.js router under the hood

## Testing Checklist

- [ ] Development server starts without errors
- [ ] All routes are accessible
- [ ] Environment variables are loaded correctly
- [ ] Redux state management works
- [ ] Firebase integration works
- [ ] Navigation between pages works
- [ ] Google Analytics tracking works
- [ ] Cypress tests pass (may need updates)

## Rollback Plan

If you need to rollback to CRA:
1. Restore the original `package.json`
2. Delete `next.config.js`, `tsconfig.json`, and `src/app/` directory
3. Restore original `src/index.js` and `src/App.js`
4. Revert environment variable names
5. Run `yarn install`

## Benefits of Next.js

1. **Better Performance**: Automatic code splitting and optimization
2. **Modern Tooling**: Built-in TypeScript support, better dev experience
3. **Active Development**: Next.js is actively maintained (CRA is deprecated)
4. **Future-Proof**: Easy to add SSR/SSG if needed later
5. **Better Build Times**: Faster builds with Turbopack (optional)

## Support

For issues or questions about this migration, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
