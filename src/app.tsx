import { LocationProvider, ErrorBoundary, Router, lazy } from 'preact-iso';
import { Navbar } from './components/layout/Navbar';
import { ToastContainer } from './components/ui/Toast';
import { AuthGuard } from './components/layout/AuthGuard';
import { loadSession } from './lib/auth/session';

loadSession();

const Landing = lazy(() => import('./pages/Landing'));
const Editor = lazy(() => import('./pages/Editor'));
const Gallery = lazy(() => import('./pages/Gallery'));
const SpriteDetail = lazy(() => import('./pages/SpriteDetail'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const ListingDetail = lazy(() => import('./pages/ListingDetail'));
const Library = lazy(() => import('./pages/Library'));
const Profile = lazy(() => import('./pages/Profile'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const NotFound = lazy(() => import('./pages/NotFound'));

export function App() {
  return (
    <LocationProvider>
      <ErrorBoundary>
        <Navbar />
        <ToastContainer />
        <main>
          <Router>
            <Landing path="/" />
            <Login path="/login" />
            <AuthCallback path="/auth/callback" />
            <Gallery path="/gallery" />
            <SpriteDetail path="/gallery/:spriteId" />
            <Marketplace path="/marketplace" />
            <ListingDetail path="/marketplace/:listingId" />
            <Pricing path="/pricing" />
            <Profile path="/u/:userId" />
            <AuthGuard path="/editor/:projectId?" component={Editor} />
            <AuthGuard path="/library" component={Library} />
            <AuthGuard path="/settings" component={Settings} />
            <NotFound default />
          </Router>
        </main>
      </ErrorBoundary>
    </LocationProvider>
  );
}
