import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FinanceNavbar from '../components/finance/Navbar.jsx';
import BalanceCard from '../components/finance/BalanceCard.jsx';
import SpendingChart from '../components/finance/SpendingChart.jsx';
import TransactionList from '../components/finance/TransactionList.jsx';
import { categories, summary, transactions } from '../data/mockFinance.js';
import { FinanceThemeProvider, useFinanceTheme } from '../context/financeThemeContext.jsx';
import { FinanceLangProvider, useFinanceLang } from '../context/financeLangContext.jsx';

function FinanceShell() {
  const navigate = useNavigate();
  const { theme } = useFinanceTheme();
  const { lang } = useFinanceLang();
  const [showBalance, setShowBalance] = useState(true);
  const [txFilter, setTxFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return transactions
      .filter((transaction) => txFilter === 'all' || transaction.type === txFilter)
      .filter((transaction) => {
        const name = lang === 'en' ? transaction.name_en : transaction.name_th;
        return name.toLowerCase().includes(searchQuery.toLowerCase());
      });
  }, [lang, txFilter, searchQuery]);

  return (
    <div
      className="min-h-screen flex flex-col"
      data-theme={theme}
      style={{
        backgroundColor: theme === 'dark' ? '#0A0A0A' : '#F5F5F3',
        color: theme === 'dark' ? '#F0F0F0' : '#1A1A1A',
      }}
    >
      <FinanceNavbar onBack={() => navigate('/')} />
      <main className="mt-14 p-5 md:p-8 flex-1 flex flex-col gap-6 max-w-7xl mx-auto w-full">
        <BalanceCard summary={summary} showBalance={showBalance} setShowBalance={setShowBalance} />
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <SpendingChart categories={categories} totalSpent={summary.expenses} />
          <TransactionList
            txFilter={txFilter}
            setTxFilter={setTxFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filtered={filtered}
            categories={categories}
          />
        </div>
      </main>
    </div>
  );
}

export default function PersonalFinancePage() {
  return (
    <FinanceThemeProvider>
      <FinanceLangProvider>
        <FinanceShell />
      </FinanceLangProvider>
    </FinanceThemeProvider>
  );
}
