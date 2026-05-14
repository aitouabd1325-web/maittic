import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import ComparePage from './pages/ComparePage';
import WishlistPage from './pages/WishlistPage';
import AlertsPage from './pages/AlertsPage';
import SearchPage from './pages/SearchPage';
import DealsPage from './pages/DealsPage';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="*" element={
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-7xl mb-5">404</div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Page introuvable</h2>
                  <a href="/" className="text-emerald-600 hover:underline font-medium">Retour à l&apos;accueil</a>
                </div>
              </div>
            } />
          </Routes>
        </Layout>
      </AppProvider>
    </BrowserRouter>
  );
}
