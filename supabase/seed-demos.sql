with rows(tag, name_en, name_th, sub_en, sub_th, body_en, body_th, stack, metrics, featured, display_order) as (
  values
  (
    'DEMO',
    'SaaS Analytics Dashboard',
    'SaaS Analytics Dashboard',
    'Multi-tenant + billing + RBAC',
    'หลายองค์กร + billing + RBAC',
    'Mission-control style SaaS dashboard with role-based access, tenant-aware data boundaries, and subscription lifecycle hooks for growth operations.',
    'แดชบอร์ด SaaS แนว mission-control ที่รองรับหลาย tenant, สิทธิ์ตามบทบาท, และวงจร subscription สำหรับทีมที่ขยายระบบต่อได้จริง.',
    array['React', 'Tailwind', 'Recharts', 'Stripe', 'Supabase'],
    '[["users","12.4k"],["mrr","$48k"]]'::jsonb,
    false,
    101
  ),
  (
    'DEMO',
    'E-commerce Storefront',
    'E-commerce Storefront',
    'Catalog + cart + checkout',
    'แคตตาล็อก + ตะกร้า + ชำระเงิน',
    'High-conversion product storefront flow covering catalog browsing, variant selection, cart persistence, and resilient payment checkout.',
    'โฟลว์หน้าร้านออนไลน์ที่เน้น conversion ครบตั้งแต่ browse สินค้า, เลือกตัวเลือก, เก็บตะกร้า, จนถึง checkout ที่เสถียร.',
    array['Next.js', 'Stripe', 'Sanity', 'Tailwind'],
    '[["skus","240"],["aov","$86"]]'::jsonb,
    false,
    102
  ),
  (
    'DEMO',
    'Two-sided Marketplace',
    'Two-sided Marketplace',
    'Buyer/seller + escrow',
    'ผู้ซื้อ/ผู้ขาย + escrow',
    'Marketplace experience with onboarding on both sides, trust layers, escrow-style payment controls, and transaction state visibility.',
    'ประสบการณ์ marketplace ครบสองฝั่ง มี onboarding, ชั้นความน่าเชื่อถือ, การคุมสถานะชำระเงินแบบ escrow และติดตามธุรกรรมได้ชัดเจน.',
    array['Next.js', 'Prisma', 'Stripe Connect'],
    '[["sellers","180"],["gmv","$1.2M"]]'::jsonb,
    false,
    103
  ),
  (
    'DEMO',
    'CRM / Sales Pipeline',
    'CRM / Sales Pipeline',
    'Deals, tasks, reporting',
    'ดีล งานติดตาม รายงาน',
    'Sales workspace unifying deal stages, follow-up tasks, ownership tracking, and weekly signal dashboards for pipeline quality.',
    'พื้นที่ทำงานทีมขายที่รวม stage ของดีล, งาน follow-up, การถือครองลูกค้า และสัญญาณ pipeline รายสัปดาห์ในหน้าเดียว.',
    array['React', 'GraphQL', 'PostgreSQL'],
    '[["pipeline","$2.4M"],["deals","47"]]'::jsonb,
    false,
    104
  ),
  (
    'DEMO',
    'Booking & Reservation',
    'Booking & Reservation',
    'Calendar slots + payments',
    'ตารางเวลา + ชำระเงิน',
    'Appointment workflow with live calendar availability, slot capacity controls, reminders, and payment confirmation in one flow.',
    'ระบบจองคิวที่มี availability แบบเรียลไทม์, จำกัดจำนวนต่อช่วงเวลา, แจ้งเตือน และยืนยันการชำระเงินในโฟลว์เดียว.',
    array['Next.js', 'FullCalendar', 'Stripe'],
    '[["bookings","1.8k/mo"]]'::jsonb,
    false,
    105
  ),
  (
    'DEMO',
    'LMS / EdTech Platform',
    'LMS / EdTech Platform',
    'Courses, video, progress',
    'คอร์ส วิดีโอ ความคืบหน้า',
    'Learning platform demo with modular courses, video delivery, completion tracking, and learner progress feedback loops.',
    'เดโมแพลตฟอร์มการเรียนรู้ที่มีคอร์สแบบโมดูล, วิดีโอ, การติดตาม completion และ feedback ความคืบหน้าของผู้เรียน.',
    array['Next.js', 'Mux', 'Supabase'],
    '[["courses","32"],["students","950"]]'::jsonb,
    false,
    106
  ),
  (
    'DEMO',
    'FinTech Personal Finance',
    'FinTech Personal Finance',
    'Accounts + transactions + insights',
    'บัญชี ธุรกรรม อินไซต์',
    'Finance dashboard consolidating account aggregation, transaction trends, and practical spending insights for everyday decisions.',
    'แดชบอร์ดการเงินส่วนบุคคลที่รวมหลายบัญชี, วิเคราะห์เทรนด์ธุรกรรม และสรุปอินไซต์การใช้จ่ายที่นำไปตัดสินใจได้จริง.',
    array['React', 'Plaid API', 'Chart.js'],
    '[["accounts","6"],["tx","2.1k"]]'::jsonb,
    false,
    107
  ),
  (
    'DEMO',
    'HealthTech Patient Portal',
    'HealthTech Patient Portal',
    'Records + appointments (mock HIPAA)',
    'ประวัติการรักษา + นัดหมาย (mock HIPAA)',
    'Patient-facing portal demo with secure record views, appointment handling, and privacy-aware UX patterns inspired by healthcare constraints.',
    'เดโมพอร์ทัลผู้ป่วยที่แสดงข้อมูลเวชระเบียนอย่างปลอดภัย จัดการนัดหมาย และออกแบบ UX ให้สอดคล้องข้อจำกัดด้านความเป็นส่วนตัว.',
    array['Next.js', 'Supabase', 'Tailwind'],
    '[["patients","420"]]'::jsonb,
    false,
    108
  ),
  (
    'DEMO',
    'Logistics / Live Tracking',
    'Logistics / Live Tracking',
    'Real-time map + ETA',
    'แผนที่เรียลไทม์ + ETA',
    'Operations panel for dispatch teams with real-time location updates, ETA projection, and shipment health signal monitoring.',
    'แผงควบคุมโลจิสติกส์สำหรับทีมปฏิบัติการ ติดตามตำแหน่งขนส่งสด ๆ คาดการณ์ ETA และดูสัญญาณความเสี่ยงของ shipment.',
    array['React', 'Mapbox', 'WebSocket'],
    '[["shipments","88 live"]]'::jsonb,
    false,
    109
  ),
  (
    'DEMO',
    'Social / Community',
    'Social / Community',
    'Feed + DMs + realtime',
    'ฟีด + แชต + realtime',
    'Community product demo with feed ranking basics, direct messaging, and realtime interaction loops for daily retention.',
    'เดโมแอปชุมชนที่มีฟีด, direct message และ interaction แบบเรียลไทม์ เพื่อโชว์แกน retention ของผลิตภัณฑ์ social.',
    array['Next.js', 'Supabase Realtime'],
    '[["posts","15k"],["dau","3.2k"]]'::jsonb,
    false,
    110
  )
)
insert into public.projects (tag, name_en, name_th, sub_en, sub_th, body_en, body_th, stack, metrics, featured, display_order)
select * from rows
where not exists (
  select 1 from public.projects p where p.name_en = rows.name_en
);
