## 🚀 Quick Start Guide - Movie Matcher

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- TMDB API key (free account)

---

### Step 1: Get Your TMDB API Key
1. Visit: https://www.themoviedb.org/settings/api
2. Sign up for a free account (or log in)
3. Accept Terms of Service
4. Create a new API key for your application
5. Copy your **API Key (v3 auth)**

---

### Step 2: Set Up Environment Variables
```bash
# In your project root, create or update .env.local
VITE_TMDB_API_KEY=paste_your_api_key_here
```

**Don't commit .env.local to git!** Add it to .gitignore:
```
.env
.env.local
.env.*.local
```

---

### Step 3: Install Dependencies
```bash
npm install
# or
yarn install
```

**Required packages:**
- `react` - UI library
- `react-dom` - React DOM
- `framer-motion` - Animations
- `tailwindcss` - Styling
- `vite` - Build tool (already in create-vite)

---

### Step 4: Run Development Server
```bash
npm run dev
```

Open your browser to the URL shown (usually http://localhost:5173)

---

### Step 5: Start Swiping! 🎬
- **Swipe Right** 👉 = Like the movie
- **Swipe Left** 👈 = Skip the movie
- **Stats** = Visible in the top right corner

---

## 📱 How the Swipe Mechanism Works

### The State Update Process

When you drag a card:

```
1. You drag card → 300px left
               ↓
2. onDragEnd captures: { offset: { x: -300 }, velocity: { x: -800 } }
               ↓
3. handleDragEnd checks:
   - Math.abs(-300) > 50? ✅ YES
   - Direction: -300 < 0 = LEFT (dislike)
               ↓
4. handleSwipe('left') executes:
   ├─ swipeStats.disliked += 1
   └─ currentIndex: 0 → 1
               ↓
5. Component Re-renders:
   ├─ movies[1] becomes visible (new active card)
   ├─ movies[2] slides in behind it
   └─ movies[0] exits with animation
               ↓
6. Next movie is now playable!
```

---

## 🎯 Customization

### Change Movie Source
Edit `src/App.jsx`:

```javascript
// Options:
// - endpoints.popular (default)
// - endpoints.topRated
// - endpoints.upcoming

<SwipeFeed endpoint={TMDB_CONFIG.endpoints.topRated} />
```

### Adjust Swipe Sensitivity
Edit `src/components/SwipeFeed.jsx` line ~80:

```javascript
const SWIPE_THRESHOLD = 50;      // Increase = harder to swipe
const VELOCITY_THRESHOLD = 500;  // Increase = requires faster swipe
```

### Change Card Colors/Styling
Edit `src/components/MovieCard.jsx` - All Tailwind classes:

```javascript
// Dark theme colors in PlayCard.jsx
className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40"
```

---

## 🐛 Common Issues & Fixes

### Issue: "API Error: 401"
**Solution:** Your API key is invalid or expired
- Re-generate key at https://www.themoviedb.org/settings/api
- Update .env.local with new key
- Restart dev server

### Issue: Cards won't swipe
**Solution:** Check if Framer Motion is installed
```bash
npm install framer-motion
```

### Issue: Images show broken links
**Solution:** Some movies don't have posters (already filtered)
- Check browser console for actual image URLs
- Verify TMDB_IMAGE_BASE_URL in config/tmdbConfig.js

### Issue: "No more movies" appears instantly
**Solution:** Movies are being filtered out
- Check movies have both `poster_path` and `overview`
- Add console.log in useMovies.js to debug API response

---

## 📊 Project Structure at a Glance

```
src/
├── components/           ← React UI components
│   ├── SwipeFeed.jsx    ← Main swipe interface & state
│   ├── MovieCard.jsx    ← Individual card UI & drag
│   └── LoadingSpinner.jsx ← Loading UI
├── hooks/               ← Custom React hooks
│   └── useMovies.js     ← TMDB API fetching logic
├── config/              ← Configuration files
│   └── tmdbConfig.js    ← TMDB API setup & helpers
├── App.jsx              ← App entry point
└── App.css              ← Global styles
```

---

## 🔑 Key Files to Know

| File | Purpose |
|------|---------|
| **SwipeFeed.jsx** | State management hub (currentIndex, swipeStats) |
| **useMovies.js** | Fetches data from TMDB API |
| **tmdbConfig.js** | API endpoints & image URL helper |
| **MovieCard.jsx** | Renders individual card with drag handler |

---

## ✨ Pro Tips

1. **Monitor Network Tab** (DevTools → Network)
   - See actual TMDB API calls
   - Check image URLs loading correctly

2. **Use React DevTools**
   - Watch state updates in real-time
   - Debug component re-renders

3. **Test Different Endpoints**
   - Popular may have more complete data
   - TopRated might have better movie quality

4. **Customize Thresholds** for better UX on mobile vs desktop

---

## 🎓 Next Steps to Extend This

1. **Save Favorites** → Store liked movies in localStorage
2. **Share Mode** → Let two people vote on same card
3. **Recommendations** → ML-based matching
4. **Social Features** → Compare your lists with friends
5. **Sync to External** → Save matches to IMDb, Letterboxd, etc.

---

## 📚 Documentation Files

- **TECHNICAL_DOCUMENTATION.md** - Deep dive into code architecture
- **.env.example** - Environment variables template
- **SETUP_GUIDE.md** - This file
- **COMPONENT_REFERENCE.md** - Component API reference

---

## 💬 Need Help?

1. Check TECHNICAL_DOCUMENTATION.md for deep explanations
2. Look at console errors with `console.log()` debugging
3. Test API key directly: https://api.themoviedb.org/3/movie/popular?api_key=YOUR_KEY
4. Check TMDB API docs: https://developer.themoviedb.org/

---

**Happy Swiping! 🎬🍿**
