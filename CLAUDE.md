# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Chili's Sticker Placement Audit** - A React web application for auditing restaurant sticker placement compliance. This is a single-page application (SPA) that allows auditors to evaluate 10 different sections of a Chili's restaurant, track compliance, add notes, and upload photos for documentation.

## Core Commands

```bash
# Development
npm start              # Start development server (localhost:3000)
npm run build          # Create production build in /build directory
npm test               # Run tests in watch mode
npm test -- --coverage # Run tests with coverage report
npm run eject          # Eject from Create React App (irreversible)
```

## Application Architecture

### State Management
- **Single source of truth**: All audit data stored in `auditData` state object (App.js:5)
- **Section-based structure**: Each of 10 sections has: `status`, `checkedItems`, `notes`, `photos`, `expanded`
- **Local state only**: No external state management library (Redux, Context API)

### Data Flow
1. User fills restaurant info (name, auditor, date, time)
2. User expands a section to view reference image and checklist
3. User marks section as Pass/Fail, checks items, adds notes, uploads photos
4. Progress automatically calculated from section statuses

### Key Components

**App.js (410 lines)** - Main application component containing:
- 10 predefined audit sections with checklist items and DSI numbers
- All state management and event handlers
- Progress calculation logic (App.js:215-221)
- Photo upload/removal with base64 encoding (App.js:188-213)
- Modal image viewer for enlarged reference images

**AppTest.js** - Minimal test component (not the actual test file)

### Section Structure
Each section in the `sections` array contains:
- `id`: Unique identifier matching reference image filename
- `title`: Display name
- `items`: Array of checklist items with optional `dsi` (Document System ID) numbers

Reference images stored in `/public/images/` as `{sectionId}-reference.png`

### Styling Approach
- **No CSS-in-JS**: All styles in App.css
- **Color scheme**: Chili's brand red (#E4002B) for header, purple gradient background
- **Responsive grid layouts**: Uses CSS Grid for 2-column content on desktop, 1-column on mobile
- **Status indicators**: Color-coded pass (green), fail (red), pending (gray)

## Important Patterns

### Photo Handling
Photos are converted to base64 data URLs (App.js:191-203) and stored in state. This means:
- No backend/database required
- Photos lost on page refresh (no persistence)
- Large file sizes increase memory usage

### Section Expansion
Sections are collapsed by default (`expanded: false`). Only one expanded section loads its reference image at a time, improving initial load performance.

### Progress Calculation
- `evaluated`: Sections with status !== ''
- `passed`: Sections with status === 'pass'
- `passRate`: (passed / evaluated) * 100

## Development Notes

- Built with Create React App (react-scripts 5.0.1)
- React 18.2.0 (uses StrictMode)
- No TypeScript - pure JavaScript
- No routing - single page application
- No backend integration - fully client-side
- No data persistence - all state is ephemeral

## File Organization

```
src/
├── index.js      # React root entry point
├── App.js        # Main application component (USE THIS, not AppTest.js)
├── AppTest.js    # Test/demo component
└── App.css       # All application styles

public/
├── index.html    # HTML template
└── images/       # Reference images for each section
    ├── doors-reference.png
    ├── togo-reference.png
    ├── cookline-reference.png
    └── [7 more section images]
```

## Adding New Audit Sections

To add a new section:
1. Add section object to `sections` array in App.js:13-118
2. Create reference image as `/public/images/{sectionId}-reference.png`
3. State initialization in useEffect will automatically handle the new section

## Known Limitations

- No data export functionality (print, PDF, JSON)
- No data persistence between sessions
- Photos stored as base64 in memory (not optimal for large files)
- No backend API integration
- No authentication/authorization
