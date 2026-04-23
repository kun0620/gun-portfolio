import { useState } from 'react'

const links = [
  { label: 'Home', href: '#hero' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <a href="#hero" className="font-bold text-lg text-[#1D9E75]">Gun.</a>

        {/* Desktop */}
        <ul className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-[#1D9E75] transition-colors">{l.label}</a>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <ul className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 space-y-3 text-sm font-medium text-gray-600">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} className="block pt-3 hover:text-[#1D9E75]">{l.label}</a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
