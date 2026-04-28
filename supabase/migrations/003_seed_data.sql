insert into public.profile (
  tagline_en, tagline_th,
  bio_en, bio_th,
  stat_1_value, stat_1_label_en, stat_1_label_th,
  stat_2_value, stat_2_label_en, stat_2_label_th,
  stat_3_value, stat_3_label_en, stat_3_label_th,
  email, phone, location_en, location_th,
  github_url, linkedin_url, line_id
)
select
  'IT Support Engineer | Infrastructure & ERP Support',
  'IT Support Engineer | ดูแลโครงสร้างพื้นฐาน & ระบบ ERP',
  array[
    'IT Support Engineer with over 5 years of experience supporting IT infrastructure, systems, and users in manufacturing environments across Chonburi and Rayong.',
    'Strong background in hardware, software, network support, and ERP systems (Epicor). Experienced in troubleshooting, system maintenance, and ensuring stable daily IT operations.',
    'Currently expanding into web development and automation scripting — building tools that make factory IT operations faster, smarter, and more reliable.'
  ],
  array[
    'IT Support Engineer ประสบการณ์กว่า 5 ปี ในการดูแลโครงสร้างพื้นฐาน IT, ระบบ และผู้ใช้ในสภาพแวดล้อมโรงงานอุตสาหกรรมในจังหวัดชลบุรีและระยอง',
    'มีความเชี่ยวชาญด้าน hardware, software, network support และระบบ ERP (Epicor) มีประสบการณ์ในการแก้ไขปัญหา, บำรุงรักษาระบบ และดูแลให้การดำเนินงานประจำวันราบรื่น',
    'ปัจจุบันขยายทักษะด้าน web development และ automation scripting เพื่อสร้างเครื่องมือที่ทำให้การดำเนินงาน IT ในโรงงานรวดเร็วและเชื่อถือได้ยิ่งขึ้น'
  ],
  '5+', 'Years in factory IT', 'ปีในสายงาน IT โรงงาน',
  '2', 'Manufacturing companies', 'บริษัทอุตสาหกรรม',
  '3.75', 'GPA — top of class', 'เกรดเฉลี่ย',
  'gorawit.phinit@gmail.com', '089-529-2758',
  'Sriracha, Chonburi, Thailand', 'ศรีราชา ชลบุรี ประเทศไทย',
  'https://github.com/kun0620', null, null
where not exists (select 1 from public.profile);

with rows(tag, name_en, name_th, sub_en, sub_th, body_en, body_th, stack, metrics, featured, display_order, case_study_url, github_url, live_url) as (
  values
  (
    'INFRA',
    'Enterprise Network Infrastructure',
    'ออกแบบและวางระบบเครือข่ายโรงงาน',
    'Manufacturing Facility · ~50 users · Sriracha, Chonburi',
    'โรงงานผลิต · ~50 ผู้ใช้ · ศรีราชา ชลบุรี',
    'Designed and deployed full network infrastructure for a mid-size factory — VLAN segmentation, WatchGuard Firebox M270 firewall, Active Directory with Group Policy, IP camera system (Dahua NVR, 7×5MP cameras, 60-day retention), UPS power protection, and Microsoft 365 with on-premise ERP.',
    'ออกแบบและติดตั้งโครงสร้างพื้นฐานเครือข่ายสมบูรณ์แบบ — VLAN segmentation, WatchGuard Firebox M270, Active Directory พร้อม Group Policy, ระบบ IP camera (Dahua NVR, 7×5MP, 60 วัน retention), UPS และ Microsoft 365 พร้อม ERP on-premise',
    array['Windows Server', 'Active Directory', 'WatchGuard', 'Dahua NVR', 'Cisco', 'Microsoft 365', 'Synology NAS'],
    '[["users","~50"],["cameras","7×5MP"],["retention","60 days"]]'::jsonb,
    true, 0, null, null, null
  ),
  (
    'INFRA',
    'ERP System Support & Deployment',
    'ซัพพอร์ตและติดตั้งระบบ ERP',
    'Top Link Industrial · Epicor ERP',
    'Top Link Industrial · Epicor ERP',
    'Supported installation, configuration, and troubleshooting of Epicor ERP across the manufacturing facility. Managed user accounts, access permissions, and vendor coordination.',
    'ซัพพอร์ตการติดตั้ง, ตั้งค่า และแก้ไขปัญหาระบบ Epicor ERP ทั่วทั้งโรงงาน จัดการ user account, สิทธิ์การเข้าถึง และประสานงานกับ vendor',
    array['Epicor ERP', 'Windows Server', 'Microsoft 365', 'Active Directory'],
    null::jsonb, false, 1, null, null, null
  ),
  (
    'INFRA',
    'Factory IT Operations',
    'IT Support ประจำโรงงาน',
    'TRIPLE Q Machine Tool · 4 years',
    'TRIPLE Q Machine Tool · 4 ปี',
    'On-site IT support for factory operations over 4 years — installed and maintained desktops, printers, network devices, and ensured system stability for production lines.',
    'IT support ประจำโรงงาน 4 ปี ติดตั้งและบำรุงรักษาคอมพิวเตอร์, เครื่องพิมพ์ และอุปกรณ์เครือข่าย แก้ไขปัญหาเพื่อให้สายการผลิตดำเนินต่อเนื่อง',
    array['Windows OS', 'Network Devices', 'Hardware Support', 'LAN'],
    null::jsonb, false, 2, null, null, null
  ),
  (
    'WEB',
    'Portfolio Website',
    'Portfolio Website',
    'Personal project · React + Supabase',
    'โปรเจกต์ส่วนตัว · React + Supabase',
    'This portfolio — built with React, Tailwind CSS, Motion.dev, and Supabase. Supports Thai/English switching with a Supabase-backed contact form and admin-managed content.',
    'Portfolio นี้ — สร้างด้วย React, Tailwind CSS, Motion.dev และ Supabase รองรับการสลับภาษาไทย/อังกฤษ พร้อม contact form และข้อมูลที่แก้ผ่าน admin panel',
    array['React', 'Vite', 'Tailwind CSS', 'Motion.dev', 'Supabase', 'Vercel'],
    null::jsonb, false, 3, null, 'https://github.com/kun0620/gun-portfolio', null
  )
)
insert into public.projects (tag, name_en, name_th, sub_en, sub_th, body_en, body_th, stack, metrics, featured, display_order, case_study_url, github_url, live_url)
select * from rows
where not exists (
  select 1 from public.projects p where p.name_en = rows.name_en
);

with rows(range_en, range_th, role, org_en, org_th, body_en, body_th, display_order) as (
  values
  (
    'Apr 2024 — Present',
    'เม.ย. 2567 — ปัจจุบัน',
    'IT Support Specialist',
    'Top Link Industrial (Thailand) Co., Ltd.',
    'บจก. ท็อปลิงค์อินดัสเทรียล (ไทยแลนด์)',
    'Provide full IT support in a manufacturing environment — hardware, software, network, and ERP (Epicor). Manage Microsoft 365, user accounts, data backup, and vendor coordination. Designed and deployed complete factory network including VLAN, WatchGuard firewall, Active Directory, and IP camera system.',
    'ดูแล IT support ครบวงจรในโรงงาน — hardware, software, network และ ERP (Epicor) จัดการ Microsoft 365, user account, data backup และประสานงาน vendor ออกแบบและวางระบบเครือข่ายโรงงานทั้งหมด รวมถึง VLAN, WatchGuard, AD และ IP camera',
    0
  ),
  (
    'Jan 2020 — Feb 2024',
    'ม.ค. 2563 — ก.พ. 2567',
    'IT Support',
    'TRIPLE Q (2009) Machine Tool Co., Ltd.',
    'บจก. ทริปเปิลคิว (2009) แมชชีนทูล',
    'On-site IT support for factory operations over 4 years. Installed, configured, and maintained desktops, printers, and network devices. Troubleshot hardware, software, and network issues for stable production.',
    'IT support ประจำโรงงาน 4 ปี ติดตั้งและบำรุงรักษาคอมพิวเตอร์, เครื่องพิมพ์ และอุปกรณ์เครือข่าย แก้ไขปัญหา hardware, software และ network เพื่อให้การผลิตดำเนินต่อเนื่อง',
    1
  ),
  (
    '2017 — 2019',
    '2560 — 2562',
    'Higher Vocational Certificate — Information Technology',
    'Rayong Technical College',
    'วิทยาลัยเทคนิคระยอง',
    'GPA 3.75 · Graduated top of class. Focused on computer hardware, networking, and system administration.',
    'เกรดเฉลี่ย 3.75 · เรียนดีอันดับต้น เน้น computer hardware, networking และ system administration',
    2
  )
)
insert into public.experience (range_en, range_th, role, org_en, org_th, body_en, body_th, display_order)
select * from rows
where not exists (
  select 1 from public.experience e where e.role = rows.role and e.range_en = rows.range_en
);
