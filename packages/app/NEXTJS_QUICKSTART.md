# Next.js Quick Start Guide

## Immediate Next Steps

### 1. Install Dependencies
```bash
cd /Users/pete/vizsurvey/packages/app
yarn install
```

### 2. Set Up Environment Variables

Create or update your environment files with the `NEXT_PUBLIC_` prefix:

**Example `.env.local`:**
```bash
# Copy from your existing .env files and rename variables
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
NEXT_PUBLIC_FIREBASE_SERVER_URL=your_server_url_here
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_VERSION=2.1
```

### 3. Run Development Server
```bash
yarn dev
```

The app will be available at `http://localhost:3000`

### 4. Build for Production
```bash
yarn build
yarn start
```

## What Changed?

### File Structure
```
packages/app/
├── src/
│   ├── app/                    # NEW: Next.js App Router
│   │   ├── layout.js          # Root layout with providers
│   │   ├── page.js            # Home page (/)
│   │   ├── start/page.js      # /start route
│   │   ├── consent/page.js    # /consent route
│   │   └── ...                # Other routes
│   ├── components/            # Same as before
│   ├── features/              # Same as before
│   └── hooks/
│       └── useNavigation.js   # NEW: Navigation compatibility
├── next.config.js             # NEW: Next.js config
├── tsconfig.json              # NEW: TypeScript config
└── package.json               # UPDATED: New scripts & deps
```

### Key Differences

1. **No more `src/index.js`** - Entry point is now `src/app/layout.js`
2. **No more `src/App.js`** - Routing is now file-based in `src/app/`
3. **Environment variables** - Must start with `NEXT_PUBLIC_`
4. **Navigation** - Uses Next.js router (wrapped for compatibility)
5. **Scripts** - Use `yarn dev` for development, not `yarn start`

## Common Issues & Solutions

### Issue: "Module not found"
**Solution:** Run `yarn install` to install Next.js dependencies

### Issue: Environment variables not loading
**Solution:** 
1. Ensure variables start with `NEXT_PUBLIC_`
2. Restart the dev server after changing `.env` files
3. Check `.env.example` for the correct format

### Issue: "Cannot find module 'next'"
**Solution:** Run `yarn install` in the `packages/app` directory

### Issue: Routing not working
**Solution:** All routes are now file-based. Check that page files exist in `src/app/[route]/page.js`

### Issue: Redux state not persisting
**Solution:** This should work the same as before. Check browser console for errors.

## Testing

### Manual Testing
1. Start dev server: `yarn dev`
2. Visit `http://localhost:3000`
3. Test each route:
   - `/start?participant_id=123&study_id=test&session_id=1`
   - `/consent`
   - `/demographic`
   - `/survey`
   - etc.

### Cypress Tests
Cypress tests may need updates to work with Next.js:
```bash
yarn cypress-open
```

## Deployment

### Build Command
```bash
yarn build
```

### Start Command
```bash
yarn start
```

### Output Directory
`.next/` (this is automatically created during build)

### Environment Variables
Make sure to set all `NEXT_PUBLIC_*` variables in your deployment environment.

## Need Help?

- See `MIGRATION.md` for detailed migration information
- Check Next.js docs: https://nextjs.org/docs
- Check the console for error messages

## Rollback

If you need to go back to Create React App, see the "Rollback Plan" section in `MIGRATION.md`.
