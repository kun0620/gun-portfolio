export const summary = {
  totalBalance: 284750,
  monthlyChange: 12400,
  income: 48500,
  expenses: 36100,
};

export const categories = [
  { id: 'food', label_en: 'Food & Dining', label_th: 'อาหารและเครื่องดื่ม', color: '#F59E0B', amount: 11550, percent: 32, icon: 'restaurant' },
  { id: 'transport', label_en: 'Transport', label_th: 'การเดินทาง', color: '#3B82F6', amount: 7940, percent: 22, icon: 'local_taxi' },
  { id: 'shopping', label_en: 'Shopping', label_th: 'ช้อปปิ้ง', color: '#8B5CF6', amount: 6500, percent: 18, icon: 'shopping_bag' },
  { id: 'health', label_en: 'Health', label_th: 'สุขภาพ', color: '#10B981', amount: 5050, percent: 14, icon: 'favorite' },
  { id: 'entertain', label_en: 'Entertainment', label_th: 'บันเทิง', color: '#EF4444', amount: 3250, percent: 9, icon: 'live_tv' },
  { id: 'other', label_en: 'Other', label_th: 'อื่นๆ', color: '#888888', amount: 1810, percent: 5, icon: 'more_horiz' },
];

export const transactions = [
  { id: 1, name_en: 'Monthly Salary', name_th: 'เงินเดือน', category: 'other', type: 'income', amount: 48500, date_en: 'Feb 28', date_th: '28 ก.พ.' },
  { id: 2, name_en: 'MRT / BTS', name_th: 'MRT / BTS', category: 'transport', type: 'expense', amount: 850, date_en: 'Feb 27', date_th: '27 ก.พ.' },
  { id: 3, name_en: 'Grab Food', name_th: 'Grab Food', category: 'food', type: 'expense', amount: 320, date_en: 'Feb 27', date_th: '27 ก.พ.' },
  { id: 4, name_en: 'Central Dept. Store', name_th: 'เซ็นทรัล ดีพาร์ทเม้นท์', category: 'shopping', type: 'expense', amount: 2400, date_en: 'Feb 26', date_th: '26 ก.พ.' },
  { id: 5, name_en: 'Netflix', name_th: 'Netflix', category: 'entertain', type: 'expense', amount: 299, date_en: 'Feb 25', date_th: '25 ก.พ.' },
  { id: 6, name_en: 'Hospital Visit', name_th: 'ค่าโรงพยาบาล', category: 'health', type: 'expense', amount: 1800, date_en: 'Feb 24', date_th: '24 ก.พ.' },
  { id: 7, name_en: '7-Eleven', name_th: 'เซเว่นอีเลฟเว่น', category: 'food', type: 'expense', amount: 125, date_en: 'Feb 23', date_th: '23 ก.พ.' },
  { id: 8, name_en: 'Freelance Payment', name_th: 'ค่าจ้างฟรีแลนซ์', category: 'other', type: 'income', amount: 4200, date_en: 'Feb 22', date_th: '22 ก.พ.' },
  { id: 9, name_en: 'PTT Gas Station', name_th: 'ปั๊ม PTT', category: 'transport', type: 'expense', amount: 650, date_en: 'Feb 21', date_th: '21 ก.พ.' },
  { id: 10, name_en: 'Grab Ride', name_th: 'Grab รถ', category: 'transport', type: 'expense', amount: 180, date_en: 'Feb 20', date_th: '20 ก.พ.' },
  { id: 11, name_en: 'Transfer to Savings', name_th: 'โอนเข้าออมทรัพย์', category: 'other', type: 'neutral', amount: 5000, date_en: 'Feb 19', date_th: '19 ก.พ.' },
  { id: 12, name_en: 'Big C Supermarket', name_th: 'บิ๊กซี ซูเปอร์มาร์เก็ต', category: 'food', type: 'expense', amount: 1250, date_en: 'Feb 18', date_th: '18 ก.พ.' },
];
