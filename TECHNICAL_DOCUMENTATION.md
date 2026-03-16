# 🎬 Real-Time Movie Matcher - Technical Documentation

## Overview
A modern, swipeable movie discovery app built with React, Tailwind CSS, and Framer Motion. Integrates real-time data from The Movie Database (TMDB) API.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── SwipeFeed.jsx          # Main swipe interface (State management hub)
│   ├── MovieCard.jsx          # Individual card component (Drag handler)
│   └── LoadingSpinner.jsx     # Loading state UI
├── hooks/
│   └── useMovies.js           # Custom hook for TMDB API fetching
├── config/
│   └── tmdbConfig.js          # TMDB API configuration & utilities
└── App.jsx                     # Entry point
```

---

## 🔑 Key Features

### 1. **TMDB API Integration** (`src/hooks/useMovies.js`)
- Custom React hook that encapsulates all API logic
- Fetches movie data from TMDB endpoints (Popular, Top Rated, Upcoming)
- Handles loading, error, and success states
- Filters movies without posters or overviews for better UX

```javascript
const { movies, isLoading, error, refetch } = useMovies(endpoint);
```

### 2. **State Management** (`src/components/SwipeFeed.jsx`)
Three main state variables control the swipe logic:

```javascript
const [currentIndex, setCurrentIndex] = useState(0);        // Current card index
const [swipeStats, setSwipeStats] = useState({              // Track likes/dislikes
  liked: 0,
  disliked: 0,
});
```

### 3. **Swipe Logic & State Updates**

**How a swipe works (Complete Flow):**

1. **Drag Detection**: Framer Motion's `drag` and `onDragEnd` detect when user drags the card
   
2. **Threshold Check** (`handleDragEnd`):
   - Swipe threshold: ±50px OR ±500px/s velocity
   - Determines if swipe is intentional or just a touch

3. **State Update** (`handleSwipe`):
   ```javascript
   // Direction: 'left' (dislike) or 'right' (like)
   const handleSwipe = (direction) => {
     // 1. Update stats
     setSwipeStats(prev => ({
       liked: direction === 'right' ? prev.liked + 1 : prev.liked,
       disliked: direction === 'left' ? prev.disliked + 1 : prev.disliked,
     }));
     
     // 2. Move to next card
     setCurrentIndex(prevIndex => prevIndex + 1);
   };
   ```

4. **Re-render & Next Card**:
   - Component re-renders with `currentIndex + 1`
   - `movies[currentIndex]` becomes the new active card
   - `movies[currentIndex + 1]` appears behind as the next card in stack
   - Card exits with animation, new card animates in

5. **Edge Case - No More Cards**:
   ```javascript
   const hasMovies = currentIndex < movies.length;
   if (!hasMovies) {
     // Show "No more movies" screen with stats
   }
   ```

---

## 🎨 UI/UX Components

### MovieCard (`src/components/MovieCard.jsx`)
**Dark-themed card with:**
- TMDB poster image as background (with brightness filter)
- Gradient overlay (transparent to dark)
- Movie title, release year, rating badge
- Truncated 150-char overview
- Rating score (1-10 out of 10)
- Swipe hint text

**Framer Motion Effects:**
- `drag`: Enables drag/swipe with constraints
- `onDragEnd`: Captures drag completion
- `whileTap`: Scale-down effect on tap
- `AbsoluteLayout`: Enables card stacking effect

### LoadingSpinner (`src/components/LoadingSpinner.jsx`)
- Animated rotating spinner (Framer Motion)
- Loading message and subtitle
- Shown while TMDB API fetches data

### SwipeFeed (`src/components/SwipeFeed.jsx`)
**Main container with:**
- Header showing like/dislike counts
- Card container with AnimatePresence (for smooth card transitions)
- Renders 2 cards in stack (current + next)
- Bottom progress indicator
- "No more movies" screen

---

## 🔄 Data Flow Diagram

```
User Drags Card Left/Right
        ↓
onDragEnd fires with { offset, velocity }
        ↓
handleDragEnd checks thresholds
        ↓
Is swipe significant?
        ├─ YES → handleSwipe(direction)
        │         ├─ Update swipeStats
        │         ├─ setCurrentIndex(prev + 1)
        │         └─ Component re-renders
        │
        └─ NO → Card snaps back to center
        
After setCurrentIndex:
        ↓
currentIndex = 2 (changed from 1)
        ↓
Component renders movies[2] as active card
Component renders movies[3] behind it
        ↓
UserSees next movie card
```

---

## 📝 Implementation Notes

### Why `useCallback` in handleSwipe?
- Dependency on `currentIndex`, `movies`, `swipeStats`
- Prevents unnecessary re-renders and infinite loops
- Ensures drag handler uses latest state

### Why `AnimatePresence` in SwipeFeed?
- Smooth exit animations when cards are removed
- Prevents visual glitches when list changes
- Works with Framer Motion's `key` prop

### Why filter movies in `useMovies`?
```javascript
const filteredMovies = data.results.filter(
  (movie) => movie.poster_path && movie.overview
);
```
- TMDB API includes some incomplete entries
- Ensures all cards have poster images and descriptions
- Better data quality for users

---

## ⚙️ Setup Instructions

### 1. Get TMDB API Key
- Go to: https://www.themoviedb.org/settings/api
- Create free account
- Copy your API key

### 2. Set Environment Variable
```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Add your API key
VITE_TMDB_API_KEY=your_api_key_here
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 🎯 Endpoints Available

Switch between different movie lists in `App.jsx`:

```javascript
// Popular movies (default)
<SwipeFeed endpoint={TMDB_CONFIG.endpoints.popular} />

// Top rated movies
<SwipeFeed endpoint={TMDB_CONFIG.endpoints.topRated} />

// Upcoming movies
<SwipeFeed endpoint={TMDB_CONFIG.endpoints.upcoming} />
```

---

## 🚀 Future Enhancements

1. **Pagination**: Load more movies as user approaches the end
2. **Categories**: Filter by genre, release year, rating
3. **Favorites List**: Save liked movies to localStorage or database
4. **User Accounts**: Store preferences and match history
5. **Animations**: Enhanced exit/enter animations for cards
6. **Sounds**: Add swipe sound effects
7. **Mobile Optimization**: Improve mobile swipe gestures
8. **API Caching**: Cache results to reduce API calls

---

## 🐛 Troubleshooting

### "API Error: 401"
- Check your TMDB_API_KEY in .env.local
- Key should be copied exactly from TMDB settings

### Cards not swiping
- Ensure Framer Motion is installed: `npm install framer-motion`
- Check browser console for error messages
- Try with a fresh build: `npm run build`

### Images not loading
- Verify `getPosterUrl()` returns valid URLs
- Check TMDB_IMAGE_BASE_URL is correct
- Some movies may not have poster images (filtered out)

### State not updating
- Check React DevTools for state changes
- Verify `handleDragEnd` is being called
- Ensure thresholds aren't too high

---

## 📦 Dependencies

```json
{
  "react": "^18.x",
  "framer-motion": "^10.x",
  "tailwindcss": "^3.x"
}
```

---

## 🎓 Learning Resources

- **Framer Motion**: https://www.framer.com/motion/
- **React Hooks**: https://react.dev/reference/react/hooks
- **TMDB API**: https://developer.themoviedb.org/docs/getting-started
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## 📄 License

Built as a learning project. Feel free to modify and extend!
