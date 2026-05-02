import { useFinanceLang } from '../../context/financeLangContext.jsx';

const amountColor = {
  income: '#10B981',
  expense: '#EF4444',
  neutral: '#888888',
};

function formatAmount(transaction) {
  const amount = `฿${transaction.amount.toLocaleString()}`;
  if (transaction.type === 'income') return `+${amount}`;
  if (transaction.type === 'expense') return `-${amount}`;
  return amount;
}

export default function TransactionRow({ transaction, category }) {
  const { lang } = useFinanceLang();
  const name = lang === 'en' ? transaction.name_en : transaction.name_th;
  const date = lang === 'en' ? transaction.date_en : transaction.date_th;
  const categoryName = lang === 'en' ? category.label_en : category.label_th;

  return (
    <div className="grid grid-cols-[auto_1fr_auto] gap-4 p-3 hover:bg-[#1A1A1A] transition-colors items-center cursor-pointer">
      <div className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ backgroundColor: `${category.color}20`, borderColor: `${category.color}66`, color: category.color }}>
        <span className="material-symbols-outlined text-lg">{category.icon}</span>
      </div>
      <div className="flex flex-col justify-center">
        <span className="text-[14px] text-[#F0F0F0] truncate">{name}</span>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-[#888888]">{categoryName}</span>
          <span className="w-1 h-1 rounded-full bg-[#2A2A2A]" />
          <span className="text-[11px] text-[#444444]">{date}</span>
        </div>
      </div>
      <div className="text-[14px] tabular-nums text-right" style={{ color: amountColor[transaction.type] }}>
        {formatAmount(transaction)}
      </div>
    </div>
  );
}
