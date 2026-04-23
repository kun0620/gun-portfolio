import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Hero() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    supabase.from('profile').select('*').single().then(({ data }) => setProfile(data))
  }, [])

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center px-4 pt-14">
      <div className="text-center max-w-2xl">
        {profile?.avatar_url && (
          <img
            src={profile.avatar_url}
            alt="avatar"
            className="animate-fade-in w-24 h-24 rounded-full mx-auto mb-6 object-cover border-4 border-[var(--accent)]"
          />
        )}
        <h1 className="animate-slide-up text-4xl md:text-6xl font-bold text-gray-900 mb-4" style={{ animationDelay: '0.1s' }}>
          {profile?.hero_title ?? 'Hi, I\'m Gun'}
        </h1>
        <p className="animate-slide-up text-xl md:text-2xl text-gray-500 mb-8" style={{ animationDelay: '0.2s' }}>
          {profile?.hero_subtitle ?? 'Full-Stack Developer'}
        </p>
        {profile?.about_text && (
          <p className="animate-slide-up text-gray-600 mb-10 leading-relaxed" style={{ animationDelay: '0.3s' }}>{profile.about_text}</p>
        )}
        <a
          href="#projects"
          className="animate-slide-up inline-block px-8 py-3 rounded-full text-white font-semibold bg-[var(--accent)] hover:brightness-90 transition-all"
          style={{ animationDelay: '0.4s' }}
        >
          See My Work
        </a>
        {profile?.social_links && profile.social_links.length > 0 && (
          <div className="mt-8 flex gap-4 justify-center">
            {profile.social_links.map((link, idx) => (
              <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-[#1D9E75] text-gray-700 hover:text-white flex items-center justify-center transition-colors text-lg"
                title={link.platform}>
                {link.icon === 'github' && '🐙'}
                {link.icon === 'linkedin' && '💼'}
                {link.icon === 'twitter' && '𝕏'}
                {link.icon === 'email' && '✉️'}
                {!['github', 'linkedin', 'twitter', 'email'].includes(link.icon) && '🔗'}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
