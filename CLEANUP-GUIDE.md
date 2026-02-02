# Next.js Files Cleanup Guide

## Overview
Now that the vanilla HTML/JS implementation is complete, you can safely remove the old Next.js files to clean up your repository. This document lists which files and folders can be deleted.

## ⚠️ Before You Delete

**IMPORTANT**: Test the new `index.html` thoroughly before removing Next.js files. Open `index.html` in a browser and verify:
- ✅ Navigation works
- ✅ Modals open and close
- ✅ Search functionality works
- ✅ Data visualization loads (if using estadisticas.csv)
- ✅ All styling appears correct

## Files and Folders to Delete

### Core Next.js Structure
```
📁 src/                          (entire folder)
   ├── app/
   ├── components/
   └── lib/

📄 next.config.ts                (Next.js configuration)
📄 tsconfig.json                 (TypeScript configuration)
📄 postcss.config.mjs            (PostCSS configuration)
📄 tailwind.config.ts            (Tailwind build configuration - we use CDN now)
```

### Dependencies
```
📄 package.json                  (npm dependencies)
📄 package-lock.json             (npm lock file)
📁 node_modules/                 (if present - entire folder)
```

### Configuration Files
```
📄 components.json               (shadcn/ui configuration)
📄 next-env.d.ts                 (if present - Next.js TypeScript definitions)
```

### IDE/Build Artifacts
```
📁 .next/                        (if present - Next.js build output)
📁 .idx/                         (IDE configuration)
📄 .modified                     (tracking file)
```

## Files to Keep

### New Vanilla Implementation
```
✅ index.html                    (main HTML file)
✅ js/main.js                    (main JavaScript)
✅ js/data-visualization.js      (data viz JavaScript)
✅ data/estadisticas.csv         (data file)
```

### Static Assets
```
✅ public/                       (keep entire folder - contains temas downloads and other assets)
✅ docs/                         (if present - documentation)
```

### Repository Metadata
```
✅ .git/                         (Git repository)
✅ .gitignore                    (Git ignore rules)
✅ README.md                     (project README)
✅ apphosting.yaml               (hosting configuration)
```

## Step-by-Step Cleanup Process

### Option 1: Manual Deletion (Recommended for first time)

1. **Create a backup** of your entire project folder first
2. Delete folders one at a time:
   ```cmd
   rmdir /s /q src
   rmdir /s /q node_modules
   rmdir /s /q .next
   rmdir /s /q .idx
   ```

3. Delete individual files:
   ```cmd
   del next.config.ts
   del tsconfig.json
   del postcss.config.mjs
   del tailwind.config.ts
   del package.json
   del package-lock.json
   del components.json
   del .modified
   ```

### Option 2: Git Clean (If using version control)

If you want to keep a history of the Next.js version:

1. Commit your new vanilla implementation:
   ```cmd
   git add index.html js/ data/
   git commit -m "Add vanilla HTML/JS implementation"
   ```

2. Remove old files and commit:
   ```cmd
   git rm -r src/
   git rm next.config.ts tsconfig.json postcss.config.mjs tailwind.config.ts
   git rm package.json package-lock.json components.json
   git commit -m "Remove Next.js framework files"
   ```

## Verification After Cleanup

After removing files, verify:

1. ✅ `index.html` still opens and works correctly
2. ✅ All JavaScript files load (check browser console for errors)
3. ✅ Chart.js and Tailwind CDN links work
4. ✅ Static assets in `/public/` are accessible
5. ✅ Git repository is still intact (if using Git)

## Estimated Space Saved

- **src/ folder**: ~100-500 KB (source code)
- **node_modules/**: ~100-500 MB (if present)
- **package files**: ~500 KB
- **Total**: Approximately **100-500 MB**

## Rollback Plan

If something goes wrong:

1. If you created a backup, simply restore it
2. If using Git, you can restore deleted files:
   ```cmd
   git checkout HEAD~1 -- src/
   git checkout HEAD~1 -- package.json
   ```

## Notes

- The `.gitignore` file may still reference Next.js patterns - you can clean it up but it won't cause issues
- If you're deploying via Vercel or similar platforms, update deployment settings to serve `index.html` as static site
- Consider updating `README.md` to reflect that this is now a vanilla HTML/JS project
