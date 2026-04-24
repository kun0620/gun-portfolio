import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Code, Briefcase, MessageSquare, Mail, ExternalLink } from 'lucide-react'
import { supabase } from '../lib/supabase'

const ICON_MAP = {
  github: Code,
  linkedin: Briefcase,
  twitter: MessageSquare,
  email: Mail,
}

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState([])

  useEffect(() => {
    supabase.from('profile').select('social_links').single().then(({ data }) => {
      setSocialLinks(data?.social_links ?? [])
    })
  }, [])

  return (
    <footer className="py-8 border-t border-gray-100">
      {socialLinks.length > 0 && (
        <div className="flex gap-3 justify-center mb-4">
          {socialLinks.map((link, idx) => {
            const Icon = ICON_MAP[link.icon] ?? ExternalLink
            return (
              <motion.a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, color: 'var(--accent)' }}
                className="text-gray-400 hover:text-[var(--accent)] transition-colors"
                title={link.platform}
              >
                <Icon size={18} />
              </motion.a>
            )
          })}
        </div>
      )}
      <div className="text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Gun. Built with React + Supabase.
      </div>
    </footer>
  )
}
