# 🏗️ Architecture Overview

Complete visual guide to how the Movie Matcher app works internally.

---

## 🌳 Component Tree

```
App.jsx
└── SwipeFeed.jsx (Main Hub)
    ├── useMovies() Hook
    │   └── Fetches from TMDB API
    │
    ├── MovieCard.jsx (Current Top Card)
    │   ├── Draggable with Framer Motion
    │   ├── Shows movies[currentIndex]
    │   └── Calls onDragEnd callback
    │
    ├── MovieCard.jsx (Next Card in Stack)
    │   ├── Non-draggable
    │   └── Shows movies[currentIndex + 1]
    │
    ├── LoadingSpinner.jsx (Loading State)
    └── "No More Movies" Screen (End State)
```

---

## 🔄 Complete State Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        APP INITIALIZATION                        │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │  SwipeFeed Component Mounts      │
        │  ├─ currentIndex = 0             │
        │  ├─ swipeStats = {liked: 0...}   │
        │  └─ useMovies() starts           │
        └──────────────┬────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────┐
        │     useMovies Hook (Custom)          │
        │  ├─ setIsLoading(true)               │
        │  ├─ fetch(TMDB_API)                  │
        │  ├─ Parse JSON response              │
        │  ├─ Filter movies (poster + overview)
        │  ├─ setMovies([Movie1, Movie2...])   │
        │  └─ setIsLoading(false)              │
        └──────────────┬───────────────────────┘
                       │
              Movies Data Ready
                       │
                       ▼
        ┌──────────────────────────────────┐
        │  SwipeFeed Re-renders             │
        │  ├─ isLoading = false             │
        │  ├─ movies.length > 0             │
        │  └─ Show MovieCard                │
        └──────────────┬─────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │   Display MovieCard Component     │
        │  ├─ Background: movie poster      │
        │  ├─ Title + Rating                │
        │  ├─ Release date + Overview       │
        │  └─ Ready for drag interaction    │
        └──────────────┬─────────────────────┘
                       │
        USER INTERACTION: DRAG & SWIPE
                       │
                       ▼
        ┌──────────────────────────────────┐
        │   User Drags Card Left/Right     │
        │   offset.x = -250 (left swipe)    │
        └──────────────┬─────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │   onDragEnd Fires                 │
        │   (Framer Motion callback)        │
        │   info = {                        │
        │     offset: { x: -250 },          │
        │     velocity: { x: -800 }         │
        │   }                               │
        └──────────────┬─────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────────┐
        │   handleDragEnd() Evaluates             │
        │                                          │
        │   Is swipe significant?                  │
        │   if (|offset.x| > 50 OR |velocity| > 500)
        │      YES ─→ Call handleSwipe()          │
        │      NO  ─→ Snap card back to center    │
        └──────────────┬───────────────────────────┘
                       │
         YES, Swipe is significant
                       │
                       ▼
        ┌─────────────────────────────────────┐
        │   handleSwipe(direction)             │
        │   direction = 'left' (dislike)       │
        │                                      │
        │   1. Update swipeStats:              │
        │      disliked += 1                   │
        │                                      │
        │   2. Update currentIndex:            │
        │      currentIndex: 0 → 1             │
        │                                      │
        │   3. Trigger State Update            │
        │      (React re-render)               │
        └──────────────┬──────────────────────┘
                       │
                       ▼
        ┌────────────────────────────────────┐
        │   React Component Re-renders        │
        │   ├─ currentIndex = 1               │
        │   ├─ swipeStats.disliked = 1        │
        │   └─ Render new MovieCardPile       │
        └──────────────┬─────────────────────┘
                       │
                       ▼
        ┌────────────────────────────────────┐
        │   AnimatePresence Handles Exit      │
        │   ├─ Old card (movies[0]) animates out
        │   ├─ Slides off screen              │
        │   └─ Removed from DOM               │
        └──────────────┬─────────────────────┘
                       │
                       ▼
        ┌────────────────────────────────────┐
        │   New MovieCard Slides In           │
        │   ├─ movies[1] becomes active      │
        │   ├─ movies[2] visible behind      │
        │   └─ Ready for next swipe           │
        └──────────────┬─────────────────────┘
                       │
                       ▼
        ┌────────────────────────────────────┐
        │   REPEAT UNTIL no more movies      │
        │   when: currentIndex >= movies.length
        └──────────────┬─────────────────────┘
                       │
                       ▼
        ┌────────────────────────────────────┐
        │   Show "No More Movies" Screen      │
        │   ├─ Total swiped: X               │
        │   ├─ Liked: Y                      │
        │   ├─ Disliked: Z                   │
        │   └─ "Start Over" button           │
        └────────────────────────────────────┘
```

---

## 📊 State Variables & Their Changes

### Initial State (On Mount)
```javascript
// SwipeFeed.jsx
const [currentIndex, setCurrentIndex] = useState(0);
const [swipeStats, setSwipeStats] = useState({
  liked: 0,
  disliked: 0,
});

// useMovies.js
const [movies, setMovies] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);
```

### State During API Call
```
movies = []     (empty, waiting for API)
isLoading = true
currentIndex = 0
swipeStats = { liked: 0, disliked: 0 }
```

### State After API Success
```
movies = [
  { id: 550, title: "Fight Club", poster_path: "/...", ...},
  { id: 278, title: "Shawshank Redemption", ...},
  { id: 238, title: "The Godfather", ...},
  ... 20+ more movies
]
isLoading = false
currentIndex = 0 (showing first movie)
swipeStats = { liked: 0, disliked: 0 }
```

### State After First Swipe
```
currentIndex = 1 (changed from 0)
movies = [  /* same array */  ]
swipeStats = { 
  liked: 1,      (if swiped right)
  disliked: 0
}
```

### State After Multiple Swipes
```
currentIndex = 5 (user swiped 5 times)
swipeStats = { 
  liked: 3,      (3 right swipes)
  disliked: 2    (2 left swipes)
}
```

### State When Out of Movies
```
currentIndex = 20
movies.length = 20
currentIndex >= movies.length === true
→ Show "No more movies" screen
```

---

## 🎬 Movie Card Rendering Logic

### Which Movies Are Shown?

```javascript
// At any point in time, 2 cards are rendered:

// Card 1 (Draggable - Top of Stack)
<MovieCard 
  movie={movies[currentIndex]}      // e.g., movies[2]
  onDragEnd={handleDragEnd}
  index={0}
/>

// Card 2 (Preview - Behind Card 1)
<MovieCard 
  movie={movies[currentIndex + 1]}  // e.g., movies[3]
  onDragEnd={undefined}
  index={1}
/>
```

### Why Only 2 Cards?

**Performance Optimization:**
- Prevents rendering 50+ unnecessary cards
- Each card has poster image (bandwidth saver)
- Smooth animations without lag
- Better memory usage

**User Experience:**
- Users only see current card + next preview
- Reduces visual clutter
- Encourages immediate decision-making

---

## 🎨 Rendering Conditions

### Show Loading Spinner
```javascript
if (isLoading) {
  return <LoadingSpinner />
}
```

### Show Error Screen
```javascript
if (error) {
  return (
    <div>
      <p>Error: {error}</p>
      <button onClick={retry}>Retry</button>
    </div>
  )
}
```

### Show Movie Cards
```javascript
const hasMovies = currentIndex < movies.length

if (hasMovies) {
  return (
    <div>
      {/* Render stacked cards */}
    </div>
  )
}
```

### Show "No More Movies"
```javascript
if (!hasMovies) {
  return (
    <div>
      <h2>No more movies!</h2>
      <p>You swiped {liked + disliked} movies</p>
      <p>Liked: {liked} | Passed: {disliked}</p>
    </div>
  )
}
```

---

## 🔗 Data Flow Through Components

```
┌─────────────────────────────────────────────────────────┐
│ useMovies Hook                                          │
│ ├─ Fetches: /movie/popular?api_key=...                 │
│ ├─ Returns: { movies, isLoading, error, refetch }      │
│ └─ Used by: SwipeFeed                                  │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ Pass movies array
                   ▼
┌──────────────────────────────────────────────────────────┐
│ SwipeFeed Component                                      │
│ ├─ State: currentIndex, swipeStats                      │
│ ├─ Props: endpoint                                      │
│ └─ Renders: MovieCard x2, LoadingSpinner, or EndScreen │
└──────────────┬───────────────────────────────────────────┘
               │
               │ Pass movie object + handlers
               ▼
┌──────────────────────────────────────────────────────────┐
│ MovieCard Component                                      │
│ ├─ Props: movie, onDragEnd, index                       │
│ ├─ Shows: poster, title, rating, overview              │
│ └─ Drag Handler: Calls onDragEnd from SwipeFeed        │
└──────────────────────────────────────────────────────────┘
```

---

## 🧠 Callback Chain

```
User Drags Card
        ↓
Framer Motion onDragEnd
        ↓
handleDragEnd(event, info) in SwipeFeed
    └─ Checks: Is offset > 50px or velocity > 500px/s?
        ├─ YES: handleSwipe(direction)
        │   ├─ Update swipeStats
        │   ├─ setCurrentIndex(prev + 1)
        │   └─ Trigger re-render
        │
        └─ NO: Card snaps back (no callback)
```

---

## ⚡ Performance Optimization Strategies

### 1. useCallback Optimization
```javascript
const handleSwipe = useCallback(
  (direction) => {
    // Prevents recreation on every render
    // Only recreates when dependencies change
  },
  [currentIndex, movies, swipeStats]  // Dependencies
);
```

**Why?** Prevents unnecessary child component re-renders

### 2. AnimatePresence Optimization
```javascript
<AnimatePresence>
  {movies.map((movie, idx) => {
    if (idx >= currentIndex && idx < currentIndex + 2) {
      return <MovieCard key={movie.id} ... />
    }
  })}
</AnimatePresence>
```

**Why?** Smooth exit animations without rendering all cards

### 3. Image Lazy Loading
```javascript
// Framer Motion only renders visible cards
// Poster images only load when card is visible
<div style={{ backgroundImage: `url('${posterUrl}')` }} />
```

**Why?** Reduces bandwidth and initial load times

### 4. API Response Filtering
```javascript
const filteredMovies = data.results.filter(
  (movie) => movie.poster_path && movie.overview
);
```

**Why?** Prevents incomplete cards from showing

---

## 🔌 API Integration Points

```
SwipeFeed Component
  │
  └─ useMovies(endpoint)
      │
      ├─ On Mount: Calls useEffect
      │   └─ Triggers fetch(endpoint)
      │
      └─ Returns:
          ├─ movies: Movie[]
          ├─ isLoading: boolean
          ├─ error: string | null
          └─ refetch: function
```

### TMDB API Endpoints Used

```
1. Popular Movies
   GET /3/movie/popular?api_key=...

2. Top Rated Movies
   GET /3/movie/top_rated?api_key=...

3. Upcoming Movies
   GET /3/movie/upcoming?api_key=...
```

### API Response Structure
```javascript
{
  "page": 1,
  "results": [
    {
      "id": 550,
      "title": "Fight Club",
      "poster_path": "/adw6Lq9FiC9zwtBWwq4YpDQx76y.jpg",
      "release_date": "1999-10-15",
      "overview": "An insomniac office worker...",
      "vote_average": 8.8,
      // ... more properties
    },
    // ... more movies
  ],
  "total_pages": 37,
  "total_results": 728
}
```

---

## 🎯 Error Handling Flow

```
User Action / Component Mount
        ↓
API Call Initiated
        ↓
         ├─ Network Error
         │  └─ catch() → setError(message)
         │
         ├─ Invalid Response
         │  └─ if (!data.results) → setError(message)
         │
         └─ Success
            └─ Parse, Filter, setMovies()
        ↓
Component Re-renders
        ├─ error exists? → Show error screen with retry
        └─ error null?   → Show cards
```

---

## 🔄 Re-render Triggers

SwipeFeed re-renders when:

1. ✅ `movies` changes (API returns data)
2. ✅ `currentIndex` changes (swipe detected)
3. ✅ `swipeStats` changes (like/dislike count)
4. ✅ `isLoading` changes (API call starts/ends)
5. ✅ `error` changes (API fails)

MovieCard re-renders when:

1. ✅ `movie` prop changes (new movie object)
2. ✅ `onDragEnd` callback reference changes (rare)
3. ✅ `index` changes (card position)

---

## 📱 Mobile vs Desktop Differences

### Desktop
- Mouse: Click & drag swipe
- Threshold: 50px drag distance
- Smooth animations

### Mobile
- Touch: Drag & swipe gesture
- Threshold: 50px drag distance OR 500px/s velocity (easier on mobile)
- Haptic feedback possible

**No conditional rendering needed** - Framer Motion handles both automatically!

---

## 🚀 Optimization Opportunities

| Optimization | Impact | Complexity |
|---|---|---|
| Infinite scroll / Pagination | Handle 1000s of movies | Medium |
| Image caching | Faster re-renders | Low |
| localStorage favorites | Persist data | Low |
| Web Workers for filtering | Non-blocking | High |
| Virtual scrolling | Many movies | High |

---

## 📈 Scalability Considerations

**Current Setup Handles:**
- ✅ 50-100 movies comfortably
- ✅ Desktop & mobile
- ✅ Network slowness (loading spinner)

**For Larger Scale:**
- 🔧 Implement pagination
- 🔧 Add caching layer
- 🔧 Virtual scrolling for 1000+ items
- 🔧 Service Worker for offline support

---

**END OF ARCHITECTURE OVERVIEW**

For implementation details, see COMPONENT_REFERENCE.md
For troubleshooting, see SETUP_GUIDE.md
