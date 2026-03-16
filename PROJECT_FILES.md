# 📋 Project File Structure & Purpose Guide

Complete breakdown of all files created for the Movie Matcher project.

---

## 🎯 Quick Navigation

Start here based on your needs:

- **Just want to run it?** → [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Need to understand the code?** → [TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md)
- **Want API docs for each component?** → [COMPONENT_REFERENCE.md](COMPONENT_REFERENCE.md)
- **Curious about architecture?** → [ARCHITECTURE_OVERVIEW.md](ARCHITECTURE_OVERVIEW.md)
- **First time here?** → [README.md](README.md)

---

## 📁 Complete File Guide

### 📚 Documentation Files
| File | Purpose | Read Time |
|------|---------|-----------|
| **README.md** | Project overview, features, quick start | 5 min |
| **SETUP_GUIDE.md** | Step-by-step setup with troubleshooting | 10 min |
| **TECHNICAL_DOCUMENTATION.md** | Deep dive into code architecture, state flow | 15 min |
| **COMPONENT_REFERENCE.md** | Detailed API docs for each component | 10 min |
| **ARCHITECTURE_OVERVIEW.md** | Visual diagrams of state flow and data flow | 15 min |
| **PROJECT_FILES.md** | This file - guide to all files | 5 min |

### 🔧 Configuration Files
| File | Purpose | Customizable? |
|------|---------|---------------|
| **package.json** | Dependencies, scripts, metadata | ✅ Yes |
| **vite.config.js** | Vite build tool configuration | ✅ Yes |
| **tailwind.config.js** | Tailwind CSS theme extension | ✅ Yes |
| **postcss.config.js** | PostCSS plugins for Tailwind | ⚠️ Usually not |
| **.env.example** | Template for environment variables | ✅ Yes (copy to .env.local) |
| **.gitignore** | Files to exclude from git | ✅ Yes |

### 🎨 React Components
| File | Purpose | Exports |
|------|---------|---------|
| **src/App.jsx** | Main app entry point | `App` component |
| **src/components/SwipeFeed.jsx** | Main swipe interface, state hub | `SwipeFeed` component |
| **src/components/MovieCard.jsx** | Individual draggable card | `MovieCard` component |
| **src/components/LoadingSpinner.jsx** | Loading animation UI | `LoadingSpinner` component |

### 🪝 Custom Hooks
| File | Purpose | Exports |
|------|---------|---------|
| **src/hooks/useMovies.js** | TMDB API fetching logic | `useMovies` hook |

### ⚙️ Configuration & Utilities
| File | Purpose | Exports |
|------|---------|---------|
| **src/config/tmdbConfig.js** | TMDB API setup & helpers | `TMDB_CONFIG`, `getPosterUrl()` |

### 🎯 Styling
| File | Purpose |
|------|---------|
| **src/App.css** | Global styles, Tailwind imports, custom utilities |

### 📄 Entry Points
| File | Purpose |
|------|---------|
| **index.html** | HTML root, Vite entry point |
| **src/main.jsx** | React DOM render, app bootstrap |

---

## 📊 File Tree Structure

```
Movie matcher/
├── 📚 Documentation Files
│   ├── README.md                          ← START HERE
│   ├── SETUP_GUIDE.md                     ← How to run
│   ├── TECHNICAL_DOCUMENTATION.md         ← Code deep dive
│   ├── COMPONENT_REFERENCE.md             ← Component APIs
│   ├── ARCHITECTURE_OVERVIEW.md           ← System design
│   └── PROJECT_FILES.md                   ← This file
│
├── 🔧 Configuration Files
│   ├── package.json                       ← Dependencies & scripts
│   ├── vite.config.js                     ← Vite setup
│   ├── tailwind.config.js                 ← Tailwind theme
│   ├── postcss.config.js                  ← PostCSS plugins
│   ├── .env.example                       ← Env variables template
│   └── .gitignore                         ← Git excludes
│
├── 📄 Entry Points
│   ├── index.html                         ← HTML root
│   └── src/
│       └── main.jsx                       ← React bootstrap
│
└── 🎨 Source Code
    ├── src/
    │   ├── App.jsx                        ← App component
    │   ├── App.css                        ← Global styles
    │   │
    │   ├── components/
    │   │   ├── SwipeFeed.jsx              ← Main interface [CORE]
    │   │   ├── MovieCard.jsx              ← Card component [CORE]
    │   │   └── LoadingSpinner.jsx         ← Loading UI
    │   │
    │   ├── hooks/
    │   │   └── useMovies.js               ← API fetching [CORE]
    │   │
    │   └── config/
    │       └── tmdbConfig.js              ← API configuration
```

---

## 🔑 Core Files (Critical for Functionality)

These 3 files contain the main logic:

### 1. **src/components/SwipeFeed.jsx** [~200 lines]
- **What it does:** Main app interface, manages all state
- **Key logic:** 
  - Fetches movies with `useMovies()`
  - Manages `currentIndex` and `swipeStats`
  - Handles drag completion with `handleDragEnd()`
  - Triggers swipe with `handleSwipe()`
  - Renders cards with `AnimatePresence`
- **Important functions:**
  - `handleSwipe(direction)` - Updates state on swipe
  - `handleDragEnd(event, info)` - Detects swipe threshold
- **Props:** `endpoint` (optional, defaults to popular movies)

### 2. **src/hooks/useMovies.js** [~50 lines]
- **What it does:** Fetches movies from TMDB API
- **Key logic:**
  - Uses `fetch()` to call TMDB API
  - Filters movies (must have poster & overview)
  - Returns `{ movies, isLoading, error, refetch }`
- **Returns:** Object with movies array and state variables
- **Used by:** SwipeFeed component

### 3. **src/components/MovieCard.jsx** [~100 lines]
- **What it does:** Individual card UI with drag handler
- **Key logic:**
  - Framer Motion `drag` for swipe detection
  - `onDragEnd` callback to parent
  - Shows poster image, title, rating, overview
- **Props:** `movie`, `onDragEnd`, `index`
- **Returns:** JSX for draggable card

---

## 🎨 Supporting Files (Nice to Have)

These files support the core functionality:

### **src/components/LoadingSpinner.jsx**
- Shows animated spinner while API loads
- Displayed by SwipeFeed when `isLoading === true`

### **src/config/tmdbConfig.js**
- Centralizes API configuration
- Exports endpoints and `getPosterUrl()` utility
- Reads from `import.meta.env.VITE_TMDB_API_KEY`

### **src/App.jsx**
- Simple entry point
- Renders `<SwipeFeed />`
- Can pass custom endpoint here

### **src/App.css**
- Global styles and Tailwind setup
- Custom utilities like `.line-clamp-2`
- Scrollbar styling

---

## ⚙️ Configuration Files Explained

### **package.json**
```json
{
  "scripts": {
    "dev": "vite",              // Run dev server
    "build": "vite build",      // Build for production
    "preview": "vite preview"   // Preview build locally
  },
  "dependencies": {
    "react": "^18.2.0",
    "framer-motion": "^10.16.4"
  }
}
```

**When to edit:**
- Add new dependencies
- Change scripts
- Update version numbers

### **vite.config.js**
Vite configuration for:
- React plugin setup
- Dev server port (5173)
- Build output directory
- Environment variables

**When to edit:**
- Change port
- Configure build output
- Add production optimizations

### **tailwind.config.js**
Tailwind CSS configuration for:
- Color palette (dark theme)
- Custom spacing
- Custom animations
- Plugin extensions

**When to edit:**
- Add custom colors
- Modify theme
- Add animations

### **.env.example**
Template showing what environment variables are needed:
```
VITE_TMDB_API_KEY=your_api_key_here
```

**How to use:**
1. Copy to `.env.local`
2. Replace `your_api_key_here` with actual key
3. Never commit `.env.local` to git

### **.gitignore**
Files git should ignore:
- `node_modules/` - Dependencies
- `.env.local` - Secret API keys
- `dist/` - Build output

**Don't modify** unless you know what you're doing.

---

## 📖 Documentation Files Purpose

### **README.md**
**Best for:** First-time visitors, project overview

**Contains:**
- Project features
- Quick start (5 min setup)
- Tech stack
- Customization examples
- Troubleshooting

### **SETUP_GUIDE.md**
**Best for:** Setting up the project

**Contains:**
- Step-by-step setup
- Getting TMDB API key
- Installation instructions
- Common issues & fixes
- Customization options

### **TECHNICAL_DOCUMENTATION.md**
**Best for:** Understanding how code works

**Contains:**
- Architecture explanation
- State management deep dive
- Component overview
- Data flow diagrams
- Performance notes
- Learning resources

### **COMPONENT_REFERENCE.md**
**Best for:** Component API and usage

**Contains:**
- SwipeFeed component API
- MovieCard component API
- LoadingSpinner component API
- useMovies hook API
- State flow diagram
- Performance tips

### **ARCHITECTURE_OVERVIEW.md**
**Best for:** Visual learners, understanding system design

**Contains:**
- Component tree
- Complete state flow diagrams
- Rendering conditions
- Data flow through components
- Callback chains
- Performance strategies
- Mobile vs desktop

### **PROJECT_FILES.md** (This File)
**Best for:** Finding files and understanding purpose

**Contains:**
- File structure overview
- Quick navigation guide
- Purpose of each file
- When to edit each file
- Core vs supporting files

---

## 🚀 Recommended Reading Order

### For Quick Setup (30 minutes)
1. README.md (overview)
2. SETUP_GUIDE.md (installation)
3. Try running: `npm install && npm run dev`

### For Understanding the Code (1-2 hours)
1. README.md (features)
2. TECHNICAL_DOCUMENTATION.md (architecture)
3. COMPONENT_REFERENCE.md (API details)
4. Open src/components/SwipeFeed.jsx and read through

### For Deep Mastery (3-4 hours)
1. All documentation files in order
2. ARCHITECTURE_OVERVIEW.md (visual understanding)
3. Trace through code with console.log debugging
4. Modify and experiment with the code

### For Specific Questions
- "How do I set it up?" → SETUP_GUIDE.md
- "What does this component do?" → COMPONENT_REFERENCE.md
- "Why doesn't it work?" → SETUP_GUIDE.md troubleshooting
- "How does state update?" → ARCHITECTURE_OVERVIEW.md
- "What's the big picture?" → TECHNICAL_DOCUMENTATION.md

---

## 🔄 Typical Edit Scenarios

### "I want to change the loading message"
**File:** `src/components/LoadingSpinner.jsx`
**Edit:** Line ~12, change the `message` prop

### "I want to change API endpoint (Top Rated instead of Popular)"
**File:** `src/App.jsx`
**Edit:** Line ~12, change `endpoints.popular` to `endpoints.topRated`

### "I want to make cards harder to swipe"
**File:** `src/components/SwipeFeed.jsx`
**Edit:** Lines ~80-81, increase `SWIPE_THRESHOLD` and `VELOCITY_THRESHOLD`

### "I want to add my API key"
**File:** `.env.local` (copy from `.env.example`)
**Edit:** Replace `your_api_key_here` with actual key

### "I want to change colors"
**File:** `src/components/MovieCard.jsx` OR `tailwind.config.js`
**Edit:** Change Tailwind color classes

### "I want to add more movies to the list"
**File:** `src/config/tmdbConfig.js`
**Edit:** Add new endpoint in the `endpoints` object

---

## ✅ Verification Checklist

**After setup, verify these files exist:**

- ✅ `.env.local` (with your API key)
- ✅ `package.json` (dependencies listed)
- ✅ `src/components/SwipeFeed.jsx` (main component)
- ✅ `src/hooks/useMovies.js` (API hook)
- ✅ `index.html` (entry point)
- ✅ `vite.config.js` (build config)
- ✅ `tailwind.config.js` (styling config)

**Run to verify:**
```bash
npm install          # Install dependencies
npm run dev         # Start dev server
# Should see: "VITE v5.x.x  ready in xxx ms"
```

---

## 🎓 Learning Path

### Week 1: Get It Running
- [ ] Read README.md
- [ ] Follow SETUP_GUIDE.md
- [ ] Run `npm run dev`
- [ ] Swipe some movies!

### Week 2: Understand the Code
- [ ] Read TECHNICAL_DOCUMENTATION.md
- [ ] Review COMPONENT_REFERENCE.md
- [ ] Add console.log() in SwipeFeed.jsx
- [ ] Watch state changes in browser DevTools

### Week 3: Make Your First Change
- [ ] Change API endpoint (popular → topRated)
- [ ] Change loading message
- [ ] Adjust swipe threshold
- [ ] Modify card colors

### Week 4: Extend It
- [ ] Add genre filter
- [ ] Save favorites to localStorage
- [ ] Add sound effects
- [ ] Custom styling

---

## 🤝 Contributing / Extending

### Add New API Endpoints
1. Edit `src/config/tmdbConfig.js`
2. Add to `endpoints` object
3. Use in SwipeFeed: `<SwipeFeed endpoint={TMDB_CONFIG.endpoints.yourEndpoint} />`

### Add New Components
1. Create `src/components/YourComponent.jsx`
2. Export from the file
3. Import in SwipeFeed or App
4. Add documentation

### Add State Tracking
1. Add `useState()` in SwipeFeed
2. Update `handleSwipe()` to modify it
3. Use in render
4. Document in TECHNICAL_DOCUMENTATION.md

---

## 📞 File Lookup Table

| Question | Look in... |
|---|---|
| "How do I get my API key?" | SETUP_GUIDE.md |
| "Where's the API configuration?" | src/config/tmdbConfig.js |
| "How do I change what happens on swipe?" | src/components/SwipeFeed.jsx (handleSwipe function) |
| "What does this component do?" | COMPONENT_REFERENCE.md |
| "Why isn't my API key working?" | SETUP_GUIDE.md (#troubleshooting) |
| "How do dependencies get installed?" | package.json |
| "Where's the main app component?" | src/App.jsx |
| "What does useMovies do?" | src/hooks/useMovies.js |
| "Why are cards stacked?" | ARCHITECTURE_OVERVIEW.md |

---

**Happy coding! 🚀**

For detailed help, see the specific documentation files listed above.
