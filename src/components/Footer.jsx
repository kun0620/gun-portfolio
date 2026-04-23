import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

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
          {socialLinks.map((link, idx) => (
            <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#1D9E75] transition-colors text-lg" title={link.platform}>
              {link.icon === 'github' && '🐙'}
              {link.icon === 'linkedin' && '💼'}
              {link.icon === 'twitter' && '𝕏'}
              {link.icon === 'email' && '✉️'}
              {!['github', 'linkedin', 'twitter', 'email'].includes(link.icon) && '🔗'}
            </a>
          ))}
        </div>
      )}
      <div className="text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Gun. Built with React + Supabase.
      </div>
    </footer>
  )
}
