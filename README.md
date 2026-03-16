# 🎬 Real-Time Movie Matcher

A modern, swipeable movie discovery web app built with **React**, **Tailwind CSS**, and **Framer Motion**. Discover movies in real-time using data from The Movie Database (TMDB) API.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-3-teal?logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-10-pink)

---

## ✨ Features

✅ **Real-time TMDB API Integration** - Fetch live movie data (Popular, Top Rated, Upcoming)

✅ **Smooth Swipe Gestures** - Drag left to dislike, right to like with physics-based animations

✅ **Dark Modern UI** - Sleek dark theme with gradient overlays and smooth transitions

✅ **Movie Details Card** - Poster image, title, release year, vote rating, and plot summary

✅ **State Management** - Track liked/disliked movies in real-time

✅ **Loading States** - Animated spinner while fetching data

✅ **Error Handling** - Graceful error messages with retry functionality

✅ **Fully Responsive** - Works smoothly on desktop and mobile devices

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ 
- **npm** or **yarn**
- **TMDB API Key** (free account at https://www.themoviedb.org)

### 1. Clone or Navigate to Project
```bash
cd "Movie matcher"
```

### 2. Install Dependencies
```bash
npm install
```

**Key packages:**
- `react` & `react-dom` - UI framework
- `framer-motion` - Animations & gestures
- `tailwindcss` - Styling
- `vite` - Build tool

### 3. Set Up Environment Variables
```bash
# Create .env.local file in root directory
VITE_TMDB_API_KEY=your_api_key_here
```

Get your free API key here: https://www.themoviedb.org/settings/api

### 4. Start Development Server
```bash
npm run dev
```

Open http://localhost:5173 in your browser

### 5. Start Swiping! 🎬
- **👉 Swipe Right** = Like the movie
- **👈 Swipe Left** = Skip the movie
- Watch your stats update in the top right!

---

## 📁 Project Structure

```
📦 Movie matcher/
├── src/
│   ├── components/
│   │   ├── SwipeFeed.jsx          # Main swipe interface & state hub
│   │   ├── MovieCard.jsx          # Individual draggable card
│   │   └── LoadingSpinner.jsx     # Loading UI component
│   ├── hooks/
│   │   └── useMovies.js           # Custom hook for TMDB API
│   ├── config/
│   │   └── tmdbConfig.js          # API configuration & helpers
│   ├── App.jsx                     # App entry point
│   └── App.css                     # Global styles
├── TECHNICAL_DOCUMENTATION.md      # Deep technical dive
├── SETUP_GUIDE.md                  # Step-by-step setup
├── COMPONENT_REFERENCE.md          # Component API docs
├── .env.example                    # Env template
└── README.md                       # This file
```

---

## 🎯 Key Features Explained

### 🔄 State Management
Three state variables control the entire app:
- `currentIndex` - Which movie is currently displayed
- `liked` - Count of right swipes
- `disliked` - Count of left swipes

When you swipe:
```
currentIndex = 0 (showing Movie #1)
     ↓ (swipe)
currentIndex = 1 (showing Movie #2)
     ↓ (swipe)
currentIndex = 2 (showing Movie #3)
```

### 🎬 Movie Card Stack
- **Top Card** (z-index: 10) - Active and draggable
- **Next Card** (z-index: 9) - Visible behind, ready to show
- Smooth animation when transitioning

### 👆 Swipe Detection
Triggers when:
- Dragged **50+ pixels** horizontally, OR
- Swiped with **500+ px/sec velocity**

### 🎨 Card Styling
Each card displays:
- TMDB poster image (background)
- Dark overlay (gradient from-slate-900)
- Movie title (max 2 lines)
- Release year
- Vote rating (1-10)
- Plot overview (max 3 lines)

---

## 🔑 How It Works

### Data Flow
```
1. App mounts → useMovies hook fetches from TMDB
2. Movies loaded → SwipeFeed renders with currentIndex = 0
3. User drags card → onDragEnd fires
4. Swipe detected → handleSwipe() called
5. currentIndex increments → Component re-renders
6. Next movie displayed → Repeat
```

### State Update Example
```javascript
// Before swipe
movies = [Movie1, Movie2, Movie3, ...]
currentIndex = 0  → Showing Movie1

// User swipes right (likes)
handleSwipe('right')
├─ swipeStats.liked += 1
└─ setCurrentIndex(1)

// After re-render
currentIndex = 1  → Showing Movie2
```

---

## ⚙️ Configuration

### Change Movie Source
Edit `src/App.jsx`:
```javascript
// Options:
<SwipeFeed endpoint={TMDB_CONFIG.endpoints.popular} />    // Default
<SwipeFeed endpoint={TMDB_CONFIG.endpoints.topRated} />   // Top rated
<SwipeFeed endpoint={TMDB_CONFIG.endpoints.upcoming} />   // Coming soon
```

### Adjust Swipe Sensitivity
Edit `src/components/SwipeFeed.jsx` (~80):
```javascript
const SWIPE_THRESHOLD = 50;        // pixels (increase = harder to swipe)
const VELOCITY_THRESHOLD = 500;    // px/sec (increase = needs faster swipe)
```

### Customize Colors
Edit `src/components/MovieCard.jsx` - All Tailwind classes:
```javascript
// Card container
className="rounded-3xl overflow-hidden shadow-2xl"

// Gradient overlay
className="bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"
```

---

## 🐛 Troubleshooting

### "API Error: 401"
Your API key is invalid or missing
- ✅ Verify key in .env.local
- ✅ Re-generate at https://www.themoviedb.org/settings/api
- ✅ Restart dev server after changing .env

### Cards Won't Swipe
Framer Motion not installed properly
```bash
npm install framer-motion --save
```

### Images Not Loading
Some movies lack poster images
- Check console for actual API response
- Verify `getPosterUrl()` function returns valid URLs
- Ensure TMDB_IMAGE_BASE_URL is correct

### Show Blank Screen
Check browser console for errors
- Missing environment variable
- API fetch failed
- Component not imported

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **TECHNICAL_DOCUMENTATION.md** | Architecture, data flow, deep tech explanation |
| **SETUP_GUIDE.md** | Step-by-step setup with troubleshooting |
| **COMPONENT_REFERENCE.md** | API docs for each component |
| **README.md** | This file - overview & quick start |

---

## 🎓 Learning Resources

- **React Hooks** - https://react.dev/reference/react/hooks
- **Framer Motion** - https://www.framer.com/motion/
- **Tailwind CSS** - https://tailwindcss.com/docs
- **TMDB API** - https://developer.themoviedb.org/docs

---

## 🚀 Future Enhancement Ideas

- 🔍 **Smart Recommendations** - ML-based movie matching
- 💾 **Save Favorites** - Store liked movies locally
- 👥 **Watch Together** - Share mode for friends
- 🏆 **Leaderboard** - Compare stats with others
- 🎬 **Movie Details** - Click to see more info
- 📱 **PWA** - Install as mobile app
- 🎨 **Dark/Light Mode** - User preference
- 🌍 **Multi-language** - Internationalization

---

## 🛠️ Tech Stack

```json
{
  "frontend": "React 18 (Functional Components & Hooks)",
  "styling": "Tailwind CSS 3",
  "animations": "Framer Motion 10",
  "data": "TMDB API (The Movie Database)",
  "buildTool": "Vite 5",
  "package_manager": "npm or yarn"
}
```

---

## 📄 Environment Variables

Create `.env.local` in the root directory:
```env
VITE_TMDB_API_KEY=your_api_key_here
```

**Where to get your API key:**
1. Go to https://www.themoviedb.org/settings/api
2. Create a free account
3. Accept Terms of Service
4. Generate new API key
5. Copy to .env.local

---

## 🎨 Customization Examples

### Add Genre Filter
```jsx
const [genre, setGenre] = useState(null);
const filteredEndpoint = genre 
  ? `${TMDB_CONFIG.baseURL}/discover/movie?with_genres=${genre}&api_key=${...}`
  : TMDB_CONFIG.endpoints.popular;
```

### Add Sound Effects
```jsx
import useSound from 'use-sound';
const [playLike] = useSound('/sounds/like.mp3');

const handleSwipe = (direction) => {
  if (direction === 'right') playLike();
  // ...
};
```

### Save to Favorites (localStorage)
```jsx
const saveFavorite = (movie) => {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  favorites.push(movie);
  localStorage.setItem('favorites', JSON.stringify(favorites));
};
```

---

## 📞 Support

If you encounter issues:
1. Check the **SETUP_GUIDE.md** troubleshooting section
2. Review **TECHNICAL_DOCUMENTATION.md** for deep explanations
3. Check **COMPONENT_REFERENCE.md** for API details
4. Look at browser console for error messages
5. Verify your TMDB API key is correct

---

## 📝 License

This project is built as a learning exercise. Feel free to modify, extend, and use it for your own projects!

---

## 🙌 Acknowledgments

- **TMDB** - For the amazing movie database API
- **React Team** - Modern UI library
- **Framer Motion** - Smooth animations
- **Tailwind Labs** - Utility-first CSS

---

## 🎬 Ready to Build?

1. Get your TMDB API key
2. Copy it to `.env.local`
3. Run `npm install && npm run dev`
4. Start discovering movies!

**Happy Swiping! 🍿🎭**

---

<div align="center">

Made with ❤️ for movie lovers

[GitHub](https://github.com) • [TMDB API Docs](https://developer.themoviedb.org/) • [React Docs](https://react.dev/)

</div>
