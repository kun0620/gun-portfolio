import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '../context/marketplaceThemeContext.jsx';
import { LangProvider } from '../context/marketplaceLangContext.jsx';
import ListingsPage from './marketplace/ListingsPage.jsx';

export default function KradoMarketplacePage() {
  const navigate = useNavigate();

  return (
    <ThemeProvider>
      <LangProvider>
        <ListingsPage onBack={() => navigate('/')} />
      </LangProvider>
    </ThemeProvider>
  );
}
