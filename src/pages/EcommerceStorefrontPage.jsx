import { useState } from 'react';
import StoreNavbar from '../components/store/Navbar.jsx';
import CartDrawer from '../components/store/CartDrawer.jsx';
import HomePage from './ecommerce/HomePage.jsx';
import StorePage from './ecommerce/StorePage.jsx';
import { ThemeProvider, useTheme } from '../context/ThemeContext.jsx';
import { LangProvider, useLang } from '../context/LangContext.jsx';
import { CartProvider } from '../context/CartContext.jsx';

function StorefrontShell() {
  const [page, setPage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const { tr } = useLang();
  const { theme } = useTheme();

  return (
    <div className="shop-demo-root" data-theme={theme}>
      <StoreNavbar page={page} onBack={() => setPage('home')} onSearch={setSearchQuery} onGotoStore={() => setPage('store')} />
      <main style={{ paddingTop: 64 }}>
        {page === 'home' ? (
          <HomePage onShopNow={() => setPage('store')} />
        ) : (
          <StorePage onBack={() => setPage('home')} onSearch={searchQuery} />
        )}
      </main>
      <footer className="shop-footer">
        <p>{tr.brand} SYSTEM</p>
        <div>
          <a href="#">{tr.featured}</a>
          <a href="#">{tr.viewAll}</a>
          <a href="#">{tr.continueShopping}</a>
        </div>
      </footer>
      <CartDrawer />
    </div>
  );
}

export default function EcommerceStorefrontPage() {
  return (
    <ThemeProvider>
      <LangProvider>
        <CartProvider>
          <StorefrontShell />
        </CartProvider>
      </LangProvider>
    </ThemeProvider>
  );
}
