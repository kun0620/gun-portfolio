export const th = {
  nav: { about: "เกี่ยวกับ", skills: "ทักษะ", projects: "ผลงาน", experience: "ประสบการณ์", contact: "ติดต่อ", cv: "ดาวน์โหลด CV" },
  status: { online: "ออนไลน์", ping: "พิง", uptime: "อัปไทม์", deploys: "ดีพลอย", location: "พิกัด", lastCommit: "คอมมิตล่าสุด" },
  hero: {
    handle: "~/gun $",
    whoami: "whoami",
    name: "GUN",
    tagline: "IT Support Engineer | ดูแลโครงสร้างพื้นฐาน & ระบบ ERP",
    roles: ["IT Infrastructure", "ERP Support (Epicor)", "Network Support", "Microsoft 365 Admin"],
    cta1: "ดูผลงาน",
    cta2: "ติดต่อผม",
    available: "พร้อมรับโอกาสใหม่",
  },
  about: {
    kicker: "// about.md",
    title: "วิศวกร · นักสร้าง · นักแก้ปัญหา",
    body: [
      "IT Support Engineer ประสบการณ์กว่า 5 ปี ในการดูแลโครงสร้างพื้นฐาน IT, ระบบ และผู้ใช้ในสภาพแวดล้อมโรงงานอุตสาหกรรมในจังหวัดชลบุรีและระยอง",
      "มีความเชี่ยวชาญด้าน hardware, software, network support และระบบ ERP (Epicor) มีประสบการณ์ในการแก้ไขปัญหา, บำรุงรักษาระบบ และดูแลให้การดำเนินงานประจำวันราบรื่น",
      "ปัจจุบันขยายทักษะด้าน web development และ automation scripting เพื่อสร้างเครื่องมือที่ทำให้การดำเนินงาน IT ในโรงงานรวดเร็วและเชื่อถือได้ยิ่งขึ้น",
    ],
    stats: [
      { value: "5+", label: "ปีในสายงาน IT โรงงาน" },
      { value: "2", label: "บริษัทอุตสาหกรรม" },
      { value: "3.75", label: "เกรดเฉลี่ย" },
    ],
  },
  skills: {
    kicker: "// skills.json",
    title: "เครื่องมือที่ใช้ประจำ",
    groups: [
      {
        name: "Infrastructure & Network",
        items: ["Windows Server", "Active Directory", "Network Design", "LAN/Wi-Fi Support", "VLAN Segmentation", "Firewall (WatchGuard)", "IP Camera (Dahua)", "NAS/Backup (Synology)", "UPS Management", "Hardware Troubleshooting"],
      },
      {
        name: "Systems & Cloud",
        items: ["Microsoft 365 Admin", "Azure (Fundamentals)", "ERP Support (Epicor)", "User Account Management", "Data Backup", "System Monitoring", "VMware", "Windows OS", "Printer & Device Config"],
      },
      {
        name: "Web & Automation",
        items: ["HTML/CSS", "JavaScript", "React", "Next.js", "Node.js", "SQL/Database", "Git/GitHub", "Basic Scripting", "AI Integration"],
      },
    ],
  },
  projects: {
    kicker: "// projects/",
    title: "ผลงานที่เลือกมา",
    filters: ["ทั้งหมด", "Infrastructure", "Web"],
    items: [
      {
        tag: "INFRA",
        name: "ออกแบบและวางระบบเครือข่ายโรงงาน",
        sub: "โรงงานผลิต · ~50 ผู้ใช้ · ศรีราชา ชลบุรี",
        body: "ออกแบบและติดตั้งโครงสร้างพื้นฐานเครือข่ายสมบูรณ์แบบ — VLAN segmentation, WatchGuard Firebox M270, Active Directory พร้อม Group Policy, ระบบ IP camera (Dahua NVR, 7×5MP, 60 วัน retention), UPS และ Microsoft 365 พร้อม ERP on-premise",
        stack: ["Windows Server", "Active Directory", "WatchGuard", "Dahua NVR", "Cisco", "Microsoft 365", "Synology NAS"],
        metrics: [["users", "~50"], ["cameras", "7×5MP"], ["retention", "60 วัน"]],
        featured: true,
      },
      {
        tag: "INFRA",
        name: "ซัพพอร์ตและติดตั้งระบบ ERP",
        sub: "Top Link Industrial · Epicor ERP",
        body: "ซัพพอร์ตการติดตั้ง, ตั้งค่า และแก้ไขปัญหาระบบ Epicor ERP ทั่วทั้งโรงงาน จัดการ user account, สิทธิ์การเข้าถึง และประสานงานกับ vendor",
        stack: ["Epicor ERP", "Windows Server", "Microsoft 365", "Active Directory"],
      },
      {
        tag: "INFRA",
        name: "IT Support ประจำโรงงาน",
        sub: "TRIPLE Q Machine Tool · 4 ปี",
        body: "IT support ประจำโรงงาน 4 ปี ติดตั้งและบำรุงรักษาคอมพิวเตอร์, เครื่องพิมพ์ และอุปกรณ์เครือข่าย แก้ไขปัญหาเพื่อให้สายการผลิตดำเนินต่อเนื่อง",
        stack: ["Windows OS", "Network Devices", "Hardware Support", "LAN"],
      },
      {
        tag: "WEB",
        name: "Portfolio Website",
        sub: "โปรเจกต์ส่วนตัว · React + Supabase",
        body: "Portfolio นี้ — สร้างด้วย React, Tailwind CSS, Motion.dev และ Supabase รองรับการสลับภาษาไทย/อังกฤษ พร้อม contact form เชื่อมต่อ Supabase",
        stack: ["React", "Vite", "Tailwind CSS", "Motion.dev", "Supabase", "Vercel"],
      },
    ],
  },
  experience: {
    kicker: "// timeline",
    title: "ประสบการณ์",
    items: [
      {
        range: "เม.ย. 2567 — ปัจจุบัน",
        role: "IT Support Specialist",
        org: "บจก. ท็อปลิงค์อินดัสเทรียล (ไทยแลนด์)",
        body: "ดูแล IT support ครบวงจรในโรงงาน — hardware, software, network และ ERP (Epicor) จัดการ Microsoft 365, user account, data backup และประสานงาน vendor ออกแบบและวางระบบเครือข่ายโรงงานทั้งหมด รวมถึง VLAN, WatchGuard, AD และ IP camera",
      },
      {
        range: "ม.ค. 2563 — ก.พ. 2567",
        role: "IT Support",
        org: "บจก. ทริปเปิลคิว (2009) แมชชีนทูล",
        body: "IT support ประจำโรงงาน 4 ปี ติดตั้งและบำรุงรักษาคอมพิวเตอร์, เครื่องพิมพ์ และอุปกรณ์เครือข่าย แก้ไขปัญหา hardware, software และ network เพื่อให้การผลิตดำเนินต่อเนื่อง",
      },
      {
        range: "2560 — 2562",
        role: "ปวส. — เทคโนโลยีสารสนเทศ",
        org: "วิทยาลัยเทคนิคระยอง",
        body: "เกรดเฉลี่ย 3.75 · เรียนดีอันดับต้น เน้น computer hardware, networking และ system administration",
      },
      {
        range: "2558 — 2560",
        role: "ปวช. — คอมพิวเตอร์ธุรกิจ",
        org: "วิทยาลัยเทคนิคระยอง",
        body: "เกรดเฉลี่ย 3.65 · พื้นฐาน business computing, ระบบสำนักงาน และการเขียนโปรแกรมเบื้องต้น",
      },
    ],
  },
  contact: {
    kicker: "// contact.sh",
    title: "มาสร้างระบบที่เชื่อถือได้ด้วยกัน",
    body: "รับงาน IT infrastructure, ERP support และโปรเจกต์ IT โรงงานในชลบุรี / ระยอง ตอบเร็วสุด: Email หรือ Line",
    form: { name: "ชื่อ", email: "อีเมล", message: "ข้อความ", send: "send_message()", sent: "✓ ส่งแล้ว จะตอบกลับภายใน 24 ชม." },
    socials: ["GitHub", "LinkedIn", "Line", "Email", "WeChat"],
    qr: "WeChat QR",
    email: "gorawit.phinit@gmail.com",
    phone: "089-529-2758",
    location: "ศรีราชา ชลบุรี ประเทศไทย",
  },
  v2: {
    loading: "กำลังเริ่มต้นระบบ",
    nav: {
      links: [
        { id: "v2-highlights", label: "ความสามารถ" },
        { id: "v2-projects", label: "ผลงาน" },
        { id: "v2-experience", label: "ประสบการณ์" },
        { id: "v2-contact", label: "ติดต่อ" },
      ],
    },
    hero: {
      badge: "พร้อมรับงาน · IT Engineer",
      title: "งานโครงสร้างพื้นฐานที่เร็ว ชัด และพร้อมใช้งานจริงระดับโปรดักชัน",
      subtitle: "เวอร์ชันพอร์ตใหม่ที่สร้างด้วย GSAP โดยเน้น timeline, scroll orchestration และข้อมูลผลงานจริงจากโรงงานอุตสาหกรรม",
      ctaPrimary: "ดูผลงาน",
      ctaSecondary: "คุยกับผม",
    },
    highlights: {
      kicker: "// capabilities",
      title: "ความสามารถหลัก",
      items: [
        { title: "คิดแบบเจ้าของระบบ", body: "ตั้งแต่เครือข่ายถึง ERP จะดูแลครบวงจร ลดการส่งต่องาน และทำให้ความรับผิดชอบชัดเจน" },
        { title: "แก้ปัญหาแบบดูสัญญาณก่อน", body: "วิเคราะห์ปัญหาจากบริบทจริงก่อนเสมอ: สาเหตุหลัก, ผลกระทบ, และเส้นทางฟื้นตัวที่ปลอดภัยที่สุด" },
        { title: "ปล่อยงานแบบปลอดภัย", body: "ทุกการเปลี่ยนแปลงทำแบบเป็นเฟส มีการติดตามเสถียรภาพ และมีเอกสารให้ดูแลต่อได้จริง" },
      ],
    },
    proof: {
      title: "ออกแบบเพื่อข้อจำกัดจริงของโรงงาน ไม่ใช่แค่เดโมสวย",
      responseValue: "<24ชม.",
      stats: {
        projects: "โปรเจกต์เด่น",
        years: "ปีประสบการณ์ IT โรงงาน",
        response: "เวลาตอบกลับโดยทั่วไป",
      },
    },
    projects: {
      title: "ตัวอย่างงานที่เลือกมา",
    },
    experience: {
      title: "ไทม์ไลน์ล่าสุด",
    },
    contact: {
      title: "ต้องการทีม IT ที่เสถียรและรับแรงกดดันหน้างานได้จริงไหม?",
      ctaPrimary: "ส่งอีเมล",
      ctaSecondary: "เปิดหน้าเดิม",
    },
  },
  footer: "เขียนด้วยกาแฟเยอะไปและ VLAN เต็มตู้ © 2026 กรวิชญ์ พินิจ",
};
