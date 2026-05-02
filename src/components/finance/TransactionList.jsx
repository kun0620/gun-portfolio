import { useFinanceLang } from '../../context/financeLangContext.jsx';
import TransactionRow from './TransactionRow.jsx';

export default function TransactionList({
  txFilter,
  setTxFilter,
  searchQuery,
  setSearchQuery,
  filtered,
  categories,
}) {
  const { tr } = useFinanceLang();

  return (
    <section className="w-full md:w-[60%] flex flex-col gap-4">
      <div className="bg-[#111111] rounded-xl border border-[#2A2A2A] p-6 flex-1 flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-[15px] font-semibold text-[#F0F0F0]">{tr.recentTransactions}</h2>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex bg-[#0A0A0A] rounded-lg p-1 border border-[#2A2A2A]">
              <button onClick={() => setTxFilter('all')} className={`px-3 py-1 text-[11px] rounded-md ${txFilter === 'all' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/50' : 'text-[#888888] hover:text-[#F0F0F0]'}`}>{tr.filterAll}</button>
              <button onClick={() => setTxFilter('income')} className={`px-3 py-1 text-[11px] rounded-md ${txFilter === 'income' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/50' : 'text-[#888888] hover:text-[#F0F0F0]'}`}>{tr.filterIncome}</button>
              <button onClick={() => setTxFilter('expense')} className={`px-3 py-1 text-[11px] rounded-md ${txFilter === 'expense' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/50' : 'text-[#888888] hover:text-[#F0F0F0]'}`}>{tr.filterExpense}</button>
            </div>
            <div className="relative flex-1 sm:w-44">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#888888] text-sm">search</span>
              <input
                className="w-full h-9 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg pl-8 pr-3 text-[11px] text-[#F0F0F0] focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                placeholder={tr.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="grid grid-cols-[auto_1fr_auto] gap-4 px-3 py-2 border-b border-[#2A2A2A] text-[12px] tracking-[0.08em] text-[#888888] uppercase">
            <div className="w-10" />
            <div>Details</div>
            <div className="text-right">Amount</div>
          </div>
          <div className="flex flex-col divide-y divide-[#2A2A2A]">
            {filtered.map((transaction) => {
              const category = categories.find((item) => item.id === transaction.category) || categories[categories.length - 1];
              return <TransactionRow key={transaction.id} transaction={transaction} category={category} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
