import { useFinanceLang } from '../../context/financeLangContext.jsx';

export default function BalanceCard({ summary, showBalance, setShowBalance }) {
  const { tr } = useFinanceLang();

  const displayBalance = showBalance
    ? `฿${summary.totalBalance.toLocaleString()}`
    : tr.hiddenBalance;

  return (
    <section className="rounded-xl border border-[#2A2A2A] relative overflow-hidden shadow-2xl bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]">
      <div className="absolute -right-20 -top-20 w-64 h-64 border border-amber-500/20 rounded-full opacity-10" />
      <div className="p-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[12px] tracking-[0.08em] text-[#888888] uppercase">{tr.totalBalance}</span>
            <button className="text-[#888888] hover:text-[#F0F0F0] transition-colors" onClick={() => setShowBalance((v) => !v)}>
              <span className="material-symbols-outlined text-sm">{showBalance ? 'visibility' : 'visibility_off'}</span>
            </button>
          </div>
          <div className="text-[42px] leading-[1.2] tracking-[-0.03em] font-bold text-[#F0F0F0] tabular-nums mb-4">
            {displayBalance}
          </div>
          <div className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
            <span className="material-symbols-outlined text-amber-500 text-xs">arrow_upward</span>
            <span className="text-[11px] text-amber-500 font-medium tabular-nums">+฿{summary.monthlyChange.toLocaleString()} {tr.thisMonth}</span>
          </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="rounded-lg p-4 flex-1 md:w-40 bg-[#1A1A1A]/80 border border-[#2A2A2A]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 border border-emerald-500/30">
                <span className="material-symbols-outlined text-xs">download</span>
              </div>
              <span className="text-[11px] text-[#888888]">{tr.income}</span>
            </div>
            <div className="text-[18px] font-bold tabular-nums text-[#F0F0F0]">฿{summary.income.toLocaleString()}</div>
          </div>
          <div className="rounded-lg p-4 flex-1 md:w-40 bg-[#1A1A1A]/80 border border-[#2A2A2A]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 border border-red-500/30">
                <span className="material-symbols-outlined text-xs">upload</span>
              </div>
              <span className="text-[11px] text-[#888888]">{tr.expenses}</span>
            </div>
            <div className="text-[18px] font-bold tabular-nums text-[#F0F0F0]">฿{summary.expenses.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
