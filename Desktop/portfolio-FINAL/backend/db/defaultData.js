export const DEFAULT_DATA = {
  profile: {
    name: 'Lukman',
    title: 'Full-Stack Developer & Digital Product Builder',
    tagline: 'I build the software your business runs on.',
    subhead: '20+ years shipping production platforms — fintech wallets, workforce systems, e-commerce, marketplaces — for founders who need it built right, not just built fast.',
    location: 'Lagos, Nigeria',
    timezone: 'WAT (UTC+1)',
    availability: 'available',
    email: 'hello@4gotechnology.com.ng',
    phone: '+234 000 000 0000',
    company: '4GO Technology LTD',
    yearsExperience: 20,
    stack: ['React', 'Vite', 'Node.js', 'Express', 'PostgreSQL', 'TypeScript', 'Tailwind', 'WebAuthn', 'Paystack', 'Flutterwave'],
    about: `I'm Lukman — a full-stack developer and the builder behind 4GO Technology LTD. For over two decades I've designed and shipped digital products end to end: architecture, backend, frontend, and the unglamorous parts in between like payment integration, auth, and admin tooling.\n\nMy work spans fintech (offline-capable digital wallets), workforce management platforms, fashion marketplaces, and business websites with full e-commerce. I care about the same thing on every project: does it actually work, for real users, under real conditions.\n\nIf you're a founder, a small business owner, or a team that needs software built — not just discussed — that's what I do.`,
    heroCommands: [
      '$ whoami',
      'lukman — full-stack developer, 20+ yrs',
      '$ status --check',
      '✓ available for new builds',
      '$ stack --list',
      'react · node · postgres · vite'
    ]
  },

  portfolio: [
    {
      id: 'p1',
      title: 'KoboPay',
      subtitle: 'Offline-capable digital wallet (Nigeria)',
      description: 'A full-stack digital wallet with a distinctive offline transaction capability using a 60/40 balance-lock mechanism, WebAuthn app lock, VTU bill payments, and multi-provider payment integration (Paystack + Flutterwave fallback).',
      stack: ['React', 'Node.js', 'PostgreSQL', 'WebAuthn', 'Paystack', 'Flutterwave'],
      mediaType: 'image',
      mediaUrl: '',
      link: '',
      featured: true
    },
    {
      id: 'p2',
      title: 'LEAF Enterprise',
      subtitle: 'AI-powered workforce management platform',
      description: 'Recruitment and workforce management platform with full technical architecture: database schema, API design, and an MVP roadmap built for scale from day one.',
      stack: ['React', 'Node', 'Express', 'PostgreSQL', 'OAuth'],
      mediaType: 'image',
      mediaUrl: '',
      link: '',
      featured: true
    },
    {
      id: 'p3',
      title: 'FitGenius',
      subtitle: 'African fashion marketplace (NG · GH · KE)',
      description: 'AI-powered marketplace connecting customers with tailors across Nigeria, Ghana, and Kenya, with an onboarding and registration flow refined through iterative user testing.',
      stack: ['React', 'Node.js', 'AI Matching'],
      mediaType: 'image',
      mediaUrl: '',
      link: '',
      featured: true
    },
    {
      id: 'p4',
      title: 'StrikeOdds',
      subtitle: 'Live sports betting platform',
      description: 'Full-featured single-file betting platform with live odds simulation, bet slip functionality, and a dark-themed professional interface.',
      stack: ['JavaScript', 'Real-time UI'],
      mediaType: 'image',
      mediaUrl: '',
      link: '',
      featured: false
    }
  ],

  services: [
    {
      id: 's1',
      name: 'Business Website',
      priceFrom: '₦350,000',
      duration: '2–3 weeks',
      description: 'A fast, mobile-friendly website that tells customers who you are and makes it easy to reach you.',
      features: ['Custom design', 'Mobile-responsive', 'Contact & booking forms', 'SEO basics']
    },
    {
      id: 's2',
      name: 'Online Store (E-commerce)',
      priceFrom: '₦650,000',
      duration: '3–4 weeks',
      description: 'A complete online store with product management and secure checkout.',
      features: ['Product catalog & admin dashboard', 'Paystack / Flutterwave checkout', 'Order management', 'Inventory tracking']
    },
    {
      id: 's3',
      name: 'Custom Platform / SaaS',
      priceFrom: '₦1,500,000',
      duration: '6+ weeks',
      description: 'End-to-end platform development — auth, dashboards, APIs, database design, and deployment.',
      features: ['Full-stack architecture', 'Admin dashboard', 'Third-party integrations', 'Ongoing support option']
    }
  ],

  testimonials: [
    {
      id: 't1',
      name: 'Business Owner',
      role: 'Fashion Retail',
      quote: 'Delivered exactly what was scoped, on time, and handled every technical detail without needing us to chase.',
      rating: 5
    }
  ],

  jobs: [
    {
      id: 'j1',
      title: 'Frontend Developer (React)',
      type: 'Contract',
      location: 'Remote',
      description: 'Join the 4GO Technology team building client platforms. Looking for someone comfortable with React, Vite, and translating designs into polished, responsive UI.',
      active: true
    }
  ],

  legal: {
    privacyPolicy: `Last updated: 2026\n\nWe collect only the information you provide through our contact and booking forms — name, email, phone number, and project details — in order to respond to your enquiry and deliver services you request.\n\nWe do not sell or share your personal information with third parties, except payment processors (Paystack, Flutterwave) strictly to process payments you authorize.\n\nYou may request access to, correction of, or deletion of your data at any time by contacting us directly.`,
    termsOfService: `Last updated: 2026\n\nBy booking a service through this site, you agree to the scope, timeline, and pricing confirmed in writing before work begins. A deposit may be required to reserve a project slot.\n\nDelivery timelines are estimates and may shift based on scope changes or delayed feedback. Payments made through Paystack or Flutterwave are processed securely by those providers; we do not store your card details.\n\nFinal deliverables are provided upon completion of agreed payment terms. Ownership of custom code transfers to the client upon full payment, unless otherwise agreed in writing.`
  }
}
