## 📖 Component Reference Guide

---

## SwipeFeed Component

**Location:** `src/components/SwipeFeed.jsx`

**Purpose:** Main swipe interface with state management and card orchestration

### Props
```typescript
interface SwipeFeedProps {
  endpoint?: string;  // TMDB API endpoint (default: popular)
}
```

### Example Usage
```jsx
import { SwipeFeed } from './components/SwipeFeed';
import { TMDB_CONFIG } from './config/tmdbConfig';

function App() {
  return (
    <SwipeFeed endpoint={TMDB_CONFIG.endpoints.topRated} />
  );
}
```

### State Variables
```javascript
const [currentIndex, setCurrentIndex] = useState(0);
// ├─ Tracks which movie card is active
// └─ Updated when user swipes

const [swipeStats, setSwipeStats] = useState({
  liked: 0,    // Count of right swipes
  disliked: 0  // Count of left swipes
});
```

### Key Functions

#### `handleSwipe(direction)`
- **Triggered by:** `onDragEnd` after threshold check
- **Parameters:** `direction` = 'left' | 'right'
- **Side Effects:**
  - Updates swipeStats (liked or disliked count)
  - Increments currentIndex by 1
  - Triggers re-render with next movie

```javascript
handleSwipe('right')  // User liked movie
handleSwipe('left')   // User disliked movie
```

#### `handleDragEnd(event, info)`
- **Triggered by:** Framer Motion's drag completion
- **Checks:** 
  - Is swipe distance > 50px? OR
  - Is swipe velocity > 500px/s?
- **Calls:** `handleSwipe()` if threshold met

### Accessibility Features
- Loading spinner with helpful message
- Error state with retry button
- Progress indicator (Card X of Y)
- No more movies message with stats

### Performance Considerations
- Uses `useCallback` to memoize handlers
- `AnimatePresence` for smooth transitions
- Only renders 2 cards in memory (current + next)

---

## MovieCard Component

**Location:** `src/components/MovieCard.jsx`

**Purpose:** Individual draggable movie card with UI and drag handler

### Props
```typescript
interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    overview: string;
    vote_average: number;
  };
  onDragEnd: (event, info) => void;
  index: number;  // Position in card stack
}
```

### Example Usage
```jsx
<MovieCard 
  movie={movieObject}
  onDragEnd={handleDragEnd}
  index={0}
/>
```

### Visual Structure
```
┌─────────────────────────┐
│                         │
│   Poster Image BG       │ ← Dark filtered background
│   (brightness: 0.5)     │
│                         │
│  Gradient Overlay       │ ← from-slate-900 to transparent
│  (Dark to clear)        │
│                         │
│  ┌─────────────────┐    │
│  │ ⭐ 8.5 / 10     │    │ ← Rating badge
│  └─────────────────┘    │
│                         │
│  Movie Title Here       │ ← Font size: text-4xl
│  (Max 2 lines)          │
│                         │
│  2024 • Movie           │ ← Release year
│                         │
│  Plot overview text...  │ ← Max 3 lines truncated
│  This is a great film   │
│  that you should watch  │
│                         │
│  👈 Swipe left or right 👉 │
│                         │
└─────────────────────────┘
```

### Drag Behavior
- **Direction:** Left or Right only
- **Rotation:** Subtle rotation as dragged (built into Framer Motion)
- **Snap Back:** If threshold not met, card returns to center
- **Feedback:** `whileTap={{ scale: 0.95 }}` on touch

### Data Transformation
```javascript
// Truncates overview to 150 characters
const truncatedOverview = overview.length > 150 
  ? `${overview.substring(0, 150)}...` 
  : overview;

// Extracts year from ISO date
const releaseYear = new Date(release_date).getFullYear();

// Gets full poster URL
const posterUrl = getPosterUrl(poster_path);
```

### Styling Classes
```javascript
// Container
"absolute w-full h-full"  // Full screen, positioned absolutely

// Card itself
"rounded-3xl overflow-hidden shadow-2xl"

// Background image
"bg-cover bg-center"

// Gradient overlay
"bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"

// Content area
"p-8" // Padding: 2rem (32px)
```

---

## LoadingSpinner Component

**Location:** `src/components/LoadingSpinner.jsx`

**Purpose:** Loading state UI with animated spinner

### Props
```typescript
interface LoadingSpinnerProps {
  message?: string;  // Custom loading message
}
```

### Example Usage
```jsx
<LoadingSpinner message="Discovering amazing movies..." />

// Or default
<LoadingSpinner /> // Uses "Loading movies..."
```

### Visual Output
```
     ╱─╲
    │   │
     ╲─╱  ← Spinning circle (2s rotation)

   Loading movies...
   Finding the perfect movies for you...
```

### Animation Details
- **Rotation:** 360° in 2 seconds, infinite loop
- **Timing:** linear easing (consistent speed)
- **Color:** Border gray, top border red (accent)

---

## useMovies Hook

**Location:** `src/hooks/useMovies.js`

**Purpose:** Custom React hook for TMDB API data fetching

### Function Signature
```javascript
useMovies(endpoint: string) => {
  movies: Array,
  isLoading: boolean,
  error: string | null,
  refetch: Function
}
```

### Example Usage
```jsx
import { useMovies } from '../hooks/useMovies';
import { TMDB_CONFIG } from '../config/tmdbConfig';

function MyComponent() {
  const { movies, isLoading, error, refetch } = useMovies(
    TMDB_CONFIG.endpoints.popular
  );
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {movies.map(movie => (
        <div key={movie.id}>{movie.title}</div>
      ))}
    </div>
  );
}
```

### Internal Flow
```javascript
1. useEffect runs → fetchMovies()
   ├─ setIsLoading(true)
   ├─ Fetch from endpoint
   ├─ Parse response
   ├─ Filter movies (have poster_path AND overview)
   ├─ setMovies(filtered)
   ├─ Handle errors → setError()
   └─ setIsLoading(false)

2. Return { movies, isLoading, error, refetch }
```

### Error Handling
- Network errors → caught and logged
- Invalid JSON → caught and logged
- Missing API key → 401 response
- Invalid response format → custom error message

### Filtering Logic
```javascript
const filteredMovies = data.results.filter(
  (movie) => movie.poster_path && movie.overview
);
```
Only includes movies with:
- ✅ Poster image
- ✅ Description text

---

## TMDB Config Module

**Location:** `src/config/tmdbConfig.js`

**Purpose:** Centralized TMDB API configuration and utilities

### Exported Constants
```javascript
TMDB_CONFIG = {
  baseURL: 'https://api.themoviedb.org/3',
  imageBaseURL: 'https://image.tmdb.org/t/p/w500',
  apiKey: import.meta.env.VITE_TMDB_API_KEY,
  endpoints: {
    popular: '...',     // Popular movies
    topRated: '...',    // Top rated movies
    upcoming: '...'     // Upcoming movies
  }
}
```

### Exported Functions

#### `getPosterUrl(posterPath: string) => string`
Converts TMDB poster path to full image URL

```javascript
// Input
getPosterUrl('/kqjL17yufvn9OVLyXYpnSOY5a5V.jpg')

// Output
'https://image.tmdb.org/t/p/w500/kqjL17yufvn9OVLyXYpnSOY5a5V.jpg'

// Handles null/undefined
getPosterUrl(null) => ''
```

---

## State Management Flow Diagram

```
┌──────────────────────────────────────────────────┐
│ SwipeFeed Component                              │
├──────────────────────────────────────────────────┤
│                                                  │
│  useState(currentIndex = 0)                      │
│  useState(swipeStats = {liked:0, disliked:0})   │
│                                                  │
│  useMovies(endpoint)                             │
│  ├─ returns: [movies[], isLoading, error]       │
│  └─ triggers on mount                            │
│                                                  │
└──────────────────────────────────────────────────┘
           ↓
      ┌──────────────────────────┐
      │ Render MovieCard         │
      │ ├─ movies[currentIndex]  │
      │ ├─ onDragEnd handler     │
      │ └─ index={0}             │
      └───────────┬──────────────┘
                  ↓
           User drags card
                  ↓
      ┌──────────────────────────┐
      │ handleDragEnd()          │
      │ ├─ Check threshold       │
      │ ├─ Determine direction   │
      │ └─ Call handleSwipe()    │
      └───────────┬──────────────┘
                  ↓
      ┌──────────────────────────┐
      │ handleSwipe(direction)   │
      │ ├─ Update swipeStats     │
      │ ├─ currentIndex += 1     │
      │ └─ Trigger re-render     │
      └───────────┬──────────────┘
                  ↓
         Component re-renders
         (with new currentIndex)
```

---

## Performance Optimization Tips

1. **Memoization**
   - `handleSwipe` uses `useCallback` (prevents recreation)
   - Prevents child component re-renders

2. **AnimatePresence**
   - Enables smooth exit animations
   - Removes unmounted cards from DOM

3. **Lazy Rendering**
   - Only render cards in view + 1 next
   - Don't render entire movies array

4. **API Caching** (Future)
   - Cache results in localStorage
   - Reduce network requests

---

## TypeScript Support (Optional)

You can add TypeScript types:

```typescript
// types/tmdb.ts
export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  overview: string;
  vote_average: number;
}

export interface SwipeFeedState {
  currentIndex: number;
  swipeStats: {
    liked: number;
    disliked: number;
  };
}
```

---

## Extending Components

### Example: Add Genre Filter
```jsx
// In SwipeFeed.jsx, add state
const [selectedGenre, setSelectedGenre] = useState(null);

// Build dynamic endpoint
const endpoint = selectedGenre 
  ? `${TMDB_CONFIG.baseURL}/discover/movie?api_key=${...}&with_genres=${selectedGenre}`
  : TMDB_CONFIG.endpoints.popular;

// Pass to useMovies
const { movies } = useMovies(endpoint);
```

### Example: Add Movie Details Modal
```jsx
// Add state for selected movie
const [selectedMovie, setSelectedMovie] = useState(null);

// On handleSwipe, instead of immediate skip:
setSelectedMovie(movies[currentIndex]);
// Show modal, let user see more details
```

---

**End of Component Reference**

For more details, check TECHNICAL_DOCUMENTATION.md
