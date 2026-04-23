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
            className="w-24 h-24 rounded-full mx-auto mb-6 object-cover border-4 border-[#1D9E75]"
          />
        )}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          {profile?.hero_title ?? 'Hi, I\'m Gun'}
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 mb-8">
          {profile?.hero_subtitle ?? 'Full-Stack Developer'}
        </p>
        {profile?.about_text && (
          <p className="text-gray-600 mb-10 leading-relaxed">{profile.about_text}</p>
        )}
        <a
          href="#projects"
          className="inline-block px-8 py-3 rounded-full text-white font-semibold bg-[#1D9E75] hover:bg-[#179060] transition-colors"
        >
          See My Work
        </a>
      </div>
    </section>
  )
}
