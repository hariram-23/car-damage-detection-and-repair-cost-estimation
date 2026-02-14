# Color Scheme Update Guide

## New Color Palette
- **Primary (Sage Green)**: #A5C89E
- **Secondary (Lime Green)**: #D8E983  
- **Accent (Light Cream)**: #FFFBB1
- **Olive**: #AEB877
- **Dark**: #2C3E2E
- **Dark Light**: #3D5240
- **Light Background**: #F5F9F3

## Updated Tailwind Classes

### Background Colors
- `bg-dark` → `bg-light-bg` (light cream background)
- `bg-dark-light` → `bg-white/80` (white with transparency)
- `bg-gray-800` → `bg-gray-200`
- `bg-gray-700` → `bg-gray-200`

### Text Colors
- `text-white` → `text-dark`
- `text-gray-400` → `text-dark/70`
- `text-gray-500` → `text-dark/50`
- `text-primary` → stays `text-primary` (now sage green)

### Border Colors
- `border-gray-700` → `border-gray-300`
- `border-gray-800` → `border-primary/20`

### Button Styles
- `cyber-button` → `nature-button` (sage green gradient)
- `cyber-border` → `nature-border` (sage green border with shadow)
- New: `accent-button` (lime/cream gradient)

## Files Updated
✅ tailwind.config.js
✅ src/index.css
✅ src/pages/Landing.jsx
✅ src/pages/Dashboard.jsx

## Files Pending Update
- src/pages/Login.jsx
- src/pages/Signup.jsx
- src/pages/Analyze.jsx
- src/pages/BatchAnalyze.jsx
- src/pages/CompareAnalyze.jsx
- src/pages/History.jsx
- src/pages/Report.jsx
- src/pages/ResetPassword.jsx

## Quick Update Script
Run the PowerShell script to batch update:
```powershell
.\update-colors.ps1
```

## Manual Review Needed
After running the script, manually review:
1. Modal backgrounds
2. Button hover states
3. Chart colors (Recharts components)
4. Image placeholder colors
5. Status badge colors
