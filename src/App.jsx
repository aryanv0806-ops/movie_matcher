/**
 * Main App Component
 * Entry point for the Movie Matcher application
 */

import { SwipeFeed } from './components/SwipeFeed';
import { TMDB_CONFIG } from './config/tmdbConfig';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* Main swipe feed component */}
      {/* You can change the endpoint to TMDB_CONFIG.endpoints.topRated or .upcoming */}
      <SwipeFeed endpoint={TMDB_CONFIG.endpoints.popular} />
    </div>
  );
}

export default App;
