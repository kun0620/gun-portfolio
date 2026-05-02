export const stages = [
  { id: 'lead', label_en: 'Lead', label_th: 'ลูกค้าเป้าหมาย', color: '#6366F1' },
  { id: 'qualified', label_en: 'Qualified', label_th: 'คัดกรองแล้ว', color: '#3B82F6' },
  { id: 'proposal', label_en: 'Proposal', label_th: 'เสนอราคา', color: '#F59E0B' },
  { id: 'won', label_en: 'Closed Won', label_th: 'ปิดดีลแล้ว', color: '#10B981' },
];

export const deals = [
  { id: 1, stage: 'lead', name_en: 'Factory ERP Integration', name_th: 'ผสานระบบ ERP โรงงาน', company: 'Thai Steel Co.', value: 180000, closeDate_en: 'Feb 28', closeDate_th: '28 ก.พ.', priority: 'high', winProb: 25, owner: 'GN', tags: ['enterprise'] },
  { id: 2, stage: 'lead', name_en: 'POS System Upgrade', name_th: 'อัปเกรดระบบ POS', company: 'Siam Retail Group', value: 95000, closeDate_en: 'Mar 15', closeDate_th: '15 มี.ค.', priority: 'medium', winProb: 30, owner: 'AT', tags: ['inbound'] },
  { id: 3, stage: 'lead', name_en: 'HR Software License', name_th: 'ใบอนุญาตซอฟต์แวร์ HR', company: 'BKK Logistics', value: 72000, closeDate_en: 'Apr 1', closeDate_th: '1 เม.ย.', priority: 'low', winProb: 20, owner: 'KP', tags: ['partner'] },
  { id: 4, stage: 'lead', name_en: 'Cloud Migration Plan', name_th: 'แผนย้ายระบบขึ้น Cloud', company: 'Phuket Resort Chain', value: 273000, closeDate_en: 'Mar 30', closeDate_th: '30 มี.ค.', priority: 'high', winProb: 35, owner: 'GN', tags: ['enterprise', 'at-risk'] },
  { id: 5, stage: 'qualified', name_en: 'Inventory Management SaaS', name_th: 'SaaS จัดการคลังสินค้า', company: 'Northern Foods Ltd.', value: 240000, closeDate_en: 'Feb 20', closeDate_th: '20 ก.พ.', priority: 'high', winProb: 55, owner: 'AT', tags: ['inbound'] },
  { id: 6, stage: 'qualified', name_en: 'CRM Rollout — 50 seats', name_th: 'เปิดตัว CRM 50 ที่นั่ง', company: 'Chiang Mai Auto Parts', value: 310000, closeDate_en: 'Mar 5', closeDate_th: '5 มี.ค.', priority: 'high', winProb: 60, owner: 'GN', tags: ['enterprise'] },
  { id: 7, stage: 'qualified', name_en: 'Data Analytics Dashboard', name_th: 'แดชบอร์ดวิเคราะห์ข้อมูล', company: 'Fintech Startup BKK', value: 185000, closeDate_en: 'Feb 28', closeDate_th: '28 ก.พ.', priority: 'medium', winProb: 50, owner: 'KP', tags: ['inbound', 'at-risk'] },
  { id: 8, stage: 'qualified', name_en: 'E-commerce Platform', name_th: 'แพลตฟอร์มอีคอมเมิร์ซ', company: 'Bangkok Fashion Co.', value: 245000, closeDate_en: 'Mar 20', closeDate_th: '20 มี.ค.', priority: 'medium', winProb: 45, owner: 'AT', tags: ['partner'] },
  { id: 9, stage: 'proposal', name_en: 'Enterprise Security Suite', name_th: 'ชุดความปลอดภัยองค์กร', company: 'SCG Digital', value: 420000, closeDate_en: 'Feb 15', closeDate_th: '15 ก.พ.', priority: 'high', winProb: 72, owner: 'GN', tags: ['enterprise'] },
  { id: 10, stage: 'proposal', name_en: 'Multi-branch POS', name_th: 'POS หลายสาขา', company: 'True Coffee Chain', value: 195000, closeDate_en: 'Feb 22', closeDate_th: '22 ก.พ.', priority: 'medium', winProb: 65, owner: 'KP', tags: ['inbound'] },
  { id: 11, stage: 'proposal', name_en: 'IoT Monitoring System', name_th: 'ระบบตรวจสอบ IoT', company: 'Eastern Seaboard Mfg.', value: 125000, closeDate_en: 'Mar 1', closeDate_th: '1 มี.ค.', priority: 'low', winProb: 58, owner: 'AT', tags: ['partner', 'at-risk'] },
  { id: 12, stage: 'won', name_en: 'Annual SaaS License', name_th: 'ใบอนุญาต SaaS รายปี', company: 'MBK Group', value: 180000, closeDate_en: 'Jan 31', closeDate_th: '31 ม.ค.', priority: 'high', winProb: 100, owner: 'GN', tags: ['enterprise'] },
  { id: 13, stage: 'won', name_en: 'Web App Development', name_th: 'พัฒนาเว็บแอปพลิเคชัน', company: 'Kasikorn Fintech', value: 220000, closeDate_en: 'Jan 20', closeDate_th: '20 ม.ค.', priority: 'high', winProb: 100, owner: 'AT', tags: ['enterprise'] },
  { id: 14, stage: 'won', name_en: 'IT Infrastructure Setup', name_th: 'ติดตั้งโครงสร้างพื้นฐาน IT', company: 'Pattaya Hotel Group', value: 100000, closeDate_en: 'Jan 15', closeDate_th: '15 ม.ค.', priority: 'medium', winProb: 100, owner: 'KP', tags: ['inbound'] },
];
