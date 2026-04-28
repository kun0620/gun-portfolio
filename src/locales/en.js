export const en = {
  nav: { about: "About", skills: "Skills", projects: "Projects", experience: "Experience", contact: "Contact", cv: "Download CV" },
  status: { online: "ONLINE", ping: "PING", uptime: "UPTIME", deploys: "DEPLOYS", location: "LOC", lastCommit: "LAST_COMMIT" },
  hero: {
    handle: "~/gun $",
    whoami: "whoami",
    name: "GUN",
    tagline: "IT Support Engineer | Infrastructure & ERP Support",
    roles: ["IT Infrastructure", "ERP Support (Epicor)", "Network Support", "Microsoft 365 Admin"],
    cta1: "View Projects",
    cta2: "Contact Me",
    available: "Open to new opportunities",
  },
  about: {
    kicker: "// about.md",
    title: "Engineer. Builder. Problem solver.",
    body: [
      "IT Support Engineer with over 5 years of experience supporting IT infrastructure, systems, and users in manufacturing environments across Chonburi and Rayong.",
      "Strong background in hardware, software, network support, and ERP systems (Epicor). Experienced in troubleshooting, system maintenance, and ensuring stable daily IT operations.",
      "Currently expanding into web development and automation scripting — building tools that make factory IT operations faster, smarter, and more reliable.",
    ],
    stats: [
      { value: "5+", label: "Years in factory IT" },
      { value: "2", label: "Manufacturing companies" },
      { value: "3.75", label: "GPA — top of class" },
    ],
  },
  skills: {
    kicker: "// skills.json",
    title: "What I reach for",
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
    title: "Selected work",
    filters: ["All", "Infrastructure", "Web"],
    items: [
      {
        tag: "INFRA",
        name: "Enterprise Network Infrastructure",
        sub: "Manufacturing Facility · ~50 users · Sriracha, Chonburi",
        body: "Designed and deployed full network infrastructure for a mid-size factory — VLAN segmentation, WatchGuard Firebox M270 firewall, Active Directory with Group Policy, IP camera system (Dahua NVR, 7×5MP cameras, 60-day retention), UPS power protection, and Microsoft 365 with on-premise ERP.",
        stack: ["Windows Server", "Active Directory", "WatchGuard", "Dahua NVR", "Cisco", "Microsoft 365", "Synology NAS"],
        metrics: [["users", "~50"], ["cameras", "7×5MP"], ["retention", "60 days"]],
        featured: true,
      },
      {
        tag: "INFRA",
        name: "ERP System Support & Deployment",
        sub: "Top Link Industrial · Epicor ERP",
        body: "Supported installation, configuration, and troubleshooting of Epicor ERP across the manufacturing facility. Managed user accounts, access permissions, and vendor coordination.",
        stack: ["Epicor ERP", "Windows Server", "Microsoft 365", "Active Directory"],
      },
      {
        tag: "INFRA",
        name: "Factory IT Operations",
        sub: "TRIPLE Q Machine Tool · 4 years",
        body: "On-site IT support for factory operations over 4 years — installed and maintained desktops, printers, network devices, and ensured system stability for production lines.",
        stack: ["Windows OS", "Network Devices", "Hardware Support", "LAN"],
      },
      {
        tag: "WEB",
        name: "Portfolio Website",
        sub: "Personal project · React + Supabase",
        body: "This portfolio — built with React, Tailwind CSS, Motion.dev, and Supabase. Supports Thai/English switching with a Supabase-backed contact form.",
        stack: ["React", "Vite", "Tailwind CSS", "Motion.dev", "Supabase", "Vercel"],
      },
    ],
  },
  experience: {
    kicker: "// timeline",
    title: "Experience",
    items: [
      {
        range: "Apr 2024 — Present",
        role: "IT Support Specialist",
        org: "Top Link Industrial (Thailand) Co., Ltd.",
        body: "Provide full IT support in a manufacturing environment — hardware, software, network, and ERP (Epicor). Manage Microsoft 365, user accounts, data backup, and vendor coordination. Designed and deployed complete factory network including VLAN, WatchGuard firewall, Active Directory, and IP camera system.",
      },
      {
        range: "Jan 2020 — Feb 2024",
        role: "IT Support",
        org: "TRIPLE Q (2009) Machine Tool Co., Ltd.",
        body: "On-site IT support for factory operations over 4 years. Installed, configured, and maintained desktops, printers, and network devices. Troubleshot hardware, software, and network issues for stable production.",
      },
      {
        range: "2017 — 2019",
        role: "Higher Vocational Certificate — Information Technology",
        org: "Rayong Technical College",
        body: "GPA 3.75 · Graduated top of class. Focused on computer hardware, networking, and system administration.",
      },
      {
        range: "2015 — 2017",
        role: "Vocational Certificate — Business Computer",
        org: "Rayong Technical College",
        body: "GPA 3.65 · Foundation in business computing, office systems, and basic programming.",
      },
    ],
  },
  contact: {
    kicker: "// contact.sh",
    title: "Let's build something reliable.",
    body: "Open to IT infrastructure roles, ERP support positions, and factory IT projects in Chonburi / Rayong. Fastest reply: email or Line.",
    form: { name: "name", email: "email", message: "message", send: "send_message()", sent: "✓ message queued. I'll reply within 24h." },
    socials: ["GitHub", "LinkedIn", "Line", "Email", "WeChat"],
    qr: "WeChat QR",
    email: "gorawit.phinit@gmail.com",
    phone: "089-529-2758",
    location: "Sriracha, Chonburi, Thailand",
  },
  v2: {
    loading: "SYSTEM INITIALIZING",
    nav: {
      links: [
        { id: "v2-highlights", label: "Capabilities" },
        { id: "v2-projects", label: "Work" },
        { id: "v2-experience", label: "Experience" },
        { id: "v2-contact", label: "Contact" },
      ],
    },
    hero: {
      badge: "Available · IT Engineer",
      title: "Infrastructure engineering with product-level speed and clarity.",
      subtitle: "A faster portfolio experience built with GSAP timelines, scroll orchestration, and real project signals from factory IT operations.",
      ctaPrimary: "Explore Work",
      ctaSecondary: "Talk to Me",
    },
    highlights: {
      kicker: "// capabilities",
      title: "Core Capabilities",
      items: [
        { title: "Autonomous Ops Mindset", body: "From network setup to ERP support, problems are handled end-to-end with less handoff and clearer ownership." },
        { title: "Signal-First Debugging", body: "Incidents are triaged with context first: root cause, impact range, and the fastest safe recovery path." },
        { title: "Production-Safe Delivery", body: "Changes are rolled out in stages, monitored for stability, and documented for future maintenance." },
      ],
    },
    proof: {
      title: "Built for real manufacturing constraints, not demo-only scenarios.",
      responseValue: "<24h",
      stats: {
        projects: "Featured projects",
        years: "Years in factory IT",
        response: "Typical response",
      },
    },
    projects: {
      title: "Featured implementations",
    },
    experience: {
      title: "Recent timeline",
    },
    contact: {
      title: "Need infrastructure and support that stays reliable under pressure?",
      ctaPrimary: "Send Email",
      ctaSecondary: "Open Legacy Site",
    },
  },
  footer: "Built with too much coffee and too many VLANs. © 2026 Gorawit Phinit.",
};
