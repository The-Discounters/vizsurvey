# TODO: Post-Conversion Steps

## Immediate Actions (Required)

### 1. Install Dependencies
```bash
cd /Users/pete/vizsurvey/packages/app
yarn install
```
**Status:** ⬜ Not Started

---

### 2. Configure Environment Variables

You need to update your environment files to use the `NEXT_PUBLIC_` prefix.

#### Step 2a: Check your existing environment files
```bash
# Look at your current values (they won't load in the terminal due to .gitignore)
ls -la | grep .env
```

You should have:
- `.env.local`
- `.env.development`
- `.env.production`

#### Step 2b: Update each file

For each file, rename all variables from `REACT_APP_*` to `NEXT_PUBLIC_*`:

**Before:**
```bash
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
# ... etc
```

**After:**
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
# ... etc
```

See `.env.example` for the complete list of required variables.

**Status:** ⬜ Not Started

---

### 3. Test Development Server
```bash
yarn dev
```

Expected output:
```
▲ Next.js 14.2.0
- Local:        http://localhost:3000
```

Visit `http://localhost:3000` and verify:
- [ ] Page loads without errors
- [ ] Console shows no critical errors
- [ ] Dev home page displays (if not in production mode)

**Status:** ⬜ Not Started

---

## Testing (Required)

### 4. Test All Routes

Visit each route and verify it works:

- [ ] `/` - Home page (dev links or invalid link page)
- [ ] `/start?participant_id=123&study_id=test&session_id=1` - Initialization
- [ ] `/consent` - Consent page
- [ ] `/demographic` - Demographic form
- [ ] `/melquestioninstructions` - MEL instructions
- [ ] `/instruction` - General instructions
- [ ] `/survey` - Survey questions
- [ ] `/break` - Break page
- [ ] `/experiencequestionaire` - Experience questionnaire
- [ ] `/financialquestionaire` - Financial questionnaire
- [ ] `/debrief` - Debrief page
- [ ] `/finished` - Completion page
- [ ] `/comparesurveys` - Survey comparison (if used)
- [ ] `/invalidlink` - Invalid link page

**Status:** ⬜ Not Started

---

### 5. Test Complete User Flow

Run through a complete survey session:

1. [ ] Start from `/start` with valid parameters
2. [ ] Complete consent form
3. [ ] Fill out demographic information
4. [ ] Read instructions
5. [ ] Answer survey questions
6. [ ] Complete post-survey questionnaires
7. [ ] Reach finished page
8. [ ] Verify data is saved to Firebase

**Status:** ⬜ Not Started

---

### 6. Test Redux State

Verify Redux is working:
- [ ] Open Redux DevTools in browser
- [ ] Navigate through pages
- [ ] Verify state updates correctly
- [ ] Check that state persists to Firebase

**Status:** ⬜ Not Started

---

### 7. Test Firebase Integration

- [ ] Firebase initialization works
- [ ] Data is written to Firestore
- [ ] Analytics events are tracked
- [ ] No Firebase errors in console

**Status:** ⬜ Not Started

---

## Production Build (Required)

### 8. Build for Production
```bash
yarn build
```

Expected output:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

**Status:** ⬜ Not Started

---

### 9. Test Production Build Locally
```bash
yarn start
```

Visit `http://localhost:3000` and verify:
- [ ] App loads correctly
- [ ] No console errors
- [ ] Performance is good
- [ ] All routes work

**Status:** ⬜ Not Started

---

## Optional but Recommended

### 10. Update Cypress Tests

Your Cypress tests may need updates:

```bash
yarn cypress-open
```

Check and update:
- [ ] Route paths (should be the same)
- [ ] Selectors (should be the same)
- [ ] Timing/waits (may need adjustment)
- [ ] Any hardcoded URLs

**Status:** ⬜ Not Started

---

### 11. Update Deployment Configuration

If using AWS Amplify, update:
- [ ] Build command: `yarn build`
- [ ] Start command: `yarn start`
- [ ] Output directory: `.next`
- [ ] Environment variables (use `NEXT_PUBLIC_` prefix)
- [ ] Node version: 18+ recommended

**Status:** ⬜ Not Started

---

### 12. Clean Up Old Files (Optional)

After verifying everything works, you can optionally remove:
- [ ] `src/index.js` (no longer used)
- [ ] `src/App.js` (no longer used)
- [ ] `public/index.html` (Next.js generates HTML)

**Note:** Keep these files for now until you're confident everything works!

**Status:** ⬜ Not Started

---

## Troubleshooting

### If you see "Module not found" errors:
1. Run `yarn install`
2. Delete `node_modules` and `.next` folders
3. Run `yarn install` again
4. Run `yarn dev`

### If environment variables aren't loading:
1. Check they start with `NEXT_PUBLIC_`
2. Restart the dev server
3. Check for typos in variable names
4. Verify `.env.local` exists and is not in `.gitignore`

### If routing doesn't work:
1. Check that page files exist in `src/app/[route]/page.js`
2. Verify each page exports a default function
3. Check browser console for errors

### If Redux isn't working:
1. Check Redux DevTools in browser
2. Verify `src/app/layout.js` includes the Provider
3. Check console for Redux errors

---

## Success Criteria

✅ You're done when:
- [x] All dependencies installed
- [x] Environment variables configured
- [x] Dev server runs without errors
- [x] All routes accessible and working
- [x] Complete user flow works end-to-end
- [x] Production build succeeds
- [x] Production server runs correctly
- [x] Data saves to Firebase correctly

---

## Need Help?

1. Check `NEXTJS_QUICKSTART.md` for quick reference
2. Check `MIGRATION.md` for detailed information
3. Check `CONVERSION_SUMMARY.md` for what changed
4. Check Next.js docs: https://nextjs.org/docs

---

**Remember:** The old Create React App setup is still in the git history if you need to rollback!
