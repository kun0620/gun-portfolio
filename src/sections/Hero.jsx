import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Code, Briefcase, MessageSquare, Mail, ExternalLink } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { fadeUp, scaleIn, staggerContainer } from '../lib/animations'

const ICON_MAP = {
  github: Code,
  linkedin: Briefcase,
  twitter: MessageSquare,
  email: Mail,
}

export default function Hero() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    supabase.from('profile').select('*').single().then(({ data }) => setProfile(data))
  }, [])

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center px-4 pt-14">
      <motion.div
        className="text-center max-w-2xl"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {profile?.avatar_url && (
          <motion.img
            src={profile.avatar_url}
            alt="avatar"
            variants={scaleIn}
            className="w-24 h-24 rounded-full mx-auto mb-6 object-cover border-4 border-[var(--accent)] shadow-lg"
          />
        )}
        <motion.h1
          variants={fadeUp}
          className="text-4xl md:text-6xl font-bold text-gray-900 mb-4"
        >
          {profile?.hero_title ?? 'Hi, I\'m Gun'}
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="text-xl md:text-2xl text-gray-500 mb-8"
        >
          {profile?.hero_subtitle ?? 'Full-Stack Developer'}
        </motion.p>
        {profile?.about_text && (
          <motion.p variants={fadeUp} className="text-gray-600 mb-10 leading-relaxed">
            {profile.about_text}
          </motion.p>
        )}
        <motion.a
          href="#projects"
          variants={fadeUp}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block px-8 py-3 rounded-full text-white font-semibold bg-[var(--accent)] hover:brightness-90 transition-all"
        >
          See My Work
        </motion.a>
        {profile?.social_links && profile.social_links.length > 0 && (
          <motion.div variants={fadeUp} className="mt-8 flex gap-4 justify-center">
            {profile.social_links.map((link, idx) => {
              const Icon = ICON_MAP[link.icon] ?? ExternalLink
              return (
                <motion.a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-full bg-gray-100 hover:bg-[var(--accent)] text-gray-700 hover:text-white flex items-center justify-center transition-colors"
                  title={link.platform}
                >
                  <Icon size={20} />
                </motion.a>
              )
            })}
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
