import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import Packages from './pages/Packages';
import Admin from './pages/Admin';

const ADMIN_LOGIN_ROUTE = '/jyothu-control-panel-login';
const ADMIN_PANEL_ROUTE = '/jyothu-control-panel';


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/packages" element={<Packages />} />
            </Route>
            {/* Admin has its own full-screen layout (hidden route) */}
            <Route path={ADMIN_LOGIN_ROUTE} element={<Admin />} />
            <Route path={ADMIN_PANEL_ROUTE} element={<Admin />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App