# 🚀 Quick Reference Card

Handy cheat sheet for common tasks and quick troubleshooting.

---

## ⌨️ Commands

```bash
# First time setup
npm install                 # Install all dependencies

# Development
npm run dev                 # Start dev server (localhost:5173)
npm run build              # Build for production
npm run preview            # Preview production build locally

# Debugging
npm run dev -- --debug     # Verbose logging
npm run build -- --debug   # Debug build
```

---

## 🔧 Environment Setup

```bash
# 1. Create env file
cp .env.example .env.local

# 2. Edit .env.local
VITE_TMDB_API_KEY=paste_api_key_here

# 3. Restart dev server (Ctrl+C, then npm run dev)
```

---

## 📊 State Management Cheat Sheet

### SwipeFeed State Variables
```javascript
const [currentIndex, setCurrentIndex] = useState(0);
// Tracks which movie is active (0 = first, 1 = second, etc)

const [swipeStats, setSwipeStats] = useState({
  liked: 0,         // +1 on right swipe
  disliked: 0       // +1 on left swipe
});
```

### useMovies Hook Return
```javascript
const { movies, isLoading, error, refetch } = useMovies(endpoint);

// movies[]       - Array of movie objects from TMDB
// isLoading      - true while fetching, false when done
// error          - null if success, string if fails
// refetch()      - Function to retry API call
```

### Common State Updates
```javascript
// After right swipe
currentIndex: 0 → 1
swipeStats.liked: 0 → 1

// After left swipe
currentIndex: 1 → 2
swipeStats.disliked: 1 → 1

// Out of movies
currentIndex >= movies.length

// Re-render screen
"No more movies" message shows
```

---

## 🎨 Component Usage Examples

### Use Different Movie Source
```jsx
// In src/App.jsx, change:
<SwipeFeed endpoint={TMDB_CONFIG.endpoints.popular} />

// To:
<SwipeFeed endpoint={TMDB_CONFIG.endpoints.topRated} />
<SwipeFeed endpoint={TMDB_CONFIG.endpoints.upcoming} />
```

### Access Movie Data in MovieCard
```javascript
const {
  title,                // Movie name
  poster_path,          // Image path (for getPosterUrl)
  release_date,         // "2023-01-15"
  overview,             // Plot description
  vote_average,         // 1-10 rating
  id                    // Unique identifier
} = movie;
```

### Debug State Changes
```jsx
// Add to SwipeFeed.jsx render
useEffect(() => {
  console.log('currentIndex updated:', currentIndex);
}, [currentIndex]);

useEffect(() => {
  console.log('Stats updated:', swipeStats);
}, [swipeStats]);
```

---

## 🔑 Key Code Locations

| What | Where | Line # |
|---|---|---|
| Handle swipe | SwipeFeed.jsx | ~85 |
| Drag detection | SwipeFeed.jsx | ~75 |
| Movie fetch | useMovies.js | ~20 |
| Card rendering | MovieCard.jsx | ~30 |
| Loading spinner | LoadingSpinner.jsx | ~10 |

---

## 🐛 Troubleshooting One-Liners

| Problem | Solution |
|---|---|
| "API Error: 401" | Check .env.local has correct API key |
| "Module not found" | Run: `npm install` |
| "Cards won't swipe" | Check Framer Motion installed: `npm install framer-motion` |
| "No movies show" | Check browser console for errors |
| "Image not loading" | Verify movie has `poster_path` (should be filtered) |
| "Port 5173 taken" | Change in vite.config.js or kill process |
| ".env.local ignored" | Make sure it's in root directory, not in src/ |
| "Re-render not working" | Check useCallback dependencies in handleSwipe |

---

## 🎯 Swipe Threshold Values

```javascript
// Current settings in SwipeFeed.jsx (~line 80)
const SWIPE_THRESHOLD = 50;      // pixels
const VELOCITY_THRESHOLD = 500;  // pixels/second

// Increase these values to make swiping harder
// Decrease to make swiping easier

// Mobile friendly:
const SWIPE_THRESHOLD = 30;      // Easier for touch
const VELOCITY_THRESHOLD = 400;  // Less velocity needed
```

---

## 🎨 Tailwind Common Classes

```jsx
/* Colors */
className="text-white"          // White text
className="bg-slate-900"        // Dark background
className="border-red-500"      // Red border

/* Sizing */
className="w-full"              // 100% width
className="h-screen"            // Full viewport height
className="p-8"                 // Padding 2rem

/* Flexbox */
className="flex items-center justify-center"
className="gap-4"               // Space between items

/* Gradients */
className="bg-gradient-to-b"    // Gradient (top to bottom)
className="from-slate-900 to-transparent"

/* Rounded Corners */
className="rounded-3xl"         // Very round corners
className="rounded-lg"          // Less round

/* Shadows & Effects */
className="shadow-2xl"          // Large shadow
className="opacity-50"          // 50% transparent
```

---

## 📱 Mobile Testing

```bash
# Test on your device (same WiFi network)
1. Find your PC IP: ipconfig (Windows) / ifconfig (Mac/Linux)
2. Start dev server: npm run dev
3. On mobile, visit: http://YOUR_IP:5173
4. Test touch swipes
```

---

## 🔍 Browser DevTools Tips

### React DevTools
```
1. Open in Components tab
2. Select <SwipeFeed /> component
3. Watch state change on swipe
4. currentIndex increments
5. swipeStats updates
```

### Network Tab
```
1. Open DevTools → Network
2. Filter: "api.themoviedb.org"
3. See TMDB API calls
4. Check response → results array
5. Search for "poster_path" to verify images
```

### Console
```javascript
// Add debugging
console.log('currentIndex:', currentIndex);
console.log('movies loaded:', movies.length);
console.log('stats:', swipeStats);
```

---

## 🎬 Movie Object Structure (from TMDB API)

```javascript
{
  id: 550,
  title: "Fight Club",
  poster_path: "/adw6Lq9FiC9zwtBWwq4YpDQx76y.jpg",
  release_date: "1999-10-15",
  overview: "An insomniac office worker and a devil-may-care soapmaker form an underground fight club...",
  vote_average: 8.8,
  popularity: 39.8,
  // ... more properties available
}
```

---

## 🚀 Performance Tips

```javascript
// 1. Only render visible cards (already done)
// 2. Memoize handlers with useCallback (already done)
// 3. Filter API results before storing (already done)
// 4. Use React.memo for child components (optional improvement)

// To add memoization:
import { memo } from 'react';
export const MovieCard = memo(({ movie, onDragEnd, index }) => {
  // component code
});
```

---

## 🌐 API Endpoints Reference

```javascript
// Popular Movies
GET /3/movie/popular?api_key={key}&page=1

// Top Rated
GET /3/movie/top_rated?api_key={key}&page=1

// Upcoming
GET /3/movie/upcoming?api_key={key}&page=1

// Base URL
https://api.themoviedb.org/3

// Image URL
https://image.tmdb.org/t/p/w500{poster_path}
```

---

## 📝 Common Edits

### Change Loading Message
File: `src/components/LoadingSpinner.jsx`
```jsx
// Line 16, change:
message = "Discovering amazing movies..."
// To:
message = "Finding your next favorite movie..."
```

### Adjust Card Styling
File: `src/components/MovieCard.jsx`
```jsx
// Line 47, change colors:
className="bg-gradient-to-t from-slate-900"
// To:
className="bg-gradient-to-t from-black"
```

### Add Console Logging
File: `src/components/SwipeFeed.jsx`
```jsx
// In handleSwipe function, add:
console.log(`Swiped ${direction}: "${movies[currentIndex]?.title}"`);
```

---

## ✅ Pre-Launch Checklist

Before deploying:
- [ ] Set real TMDB API key in .env
- [ ] Test on desktop browser
- [ ] Test on mobile device
- [ ] Swipe left and right (both work?)
- [ ] Stats counter updating?
- [ ] "No more movies" message shown?
- [ ] No console errors?
- [ ] npm run build completes successfully?
- [ ] .env.local NOT in version control?

---

## 🔗 Useful Links

```
TMDB API Docs: https://developer.themoviedb.org/docs
React Hooks:   https://react.dev/reference/react/hooks
Framer Motion: https://www.framer.com/motion/
Tailwind CSS:  https://tailwindcss.com/docs
Vite Docs:     https://vitejs.dev/
```

---

## 🎓 Next Learning Steps

### If you want to add:
- **Favorites** → localStorage (local save)
- **Filters** → Add genre/year dropdown
- **Sound** → use-sound package
- **Sharing** → API endpoint for matches
- **Database** → Firebase or Supabase
- **Accounts** → Auth provider (Firebase Auth, etc)

### Resources:
- TECHNICAL_DOCUMENTATION.md - How to extend
- COMPONENT_REFERENCE.md - Component APIs
- ARCHITECTURE_OVERVIEW.md - System design

---

**Print this page or keep it bookmarked! 📌**
