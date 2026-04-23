import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Hero from '../sections/Hero'
import Projects from '../sections/Projects'
import Skills from '../sections/Skills'
import Contact from '../sections/Contact'
import Footer from '../components/Footer'

export default function Home() {
  const [seo, setSeo] = useState({ seo_title: "Gun's Portfolio", seo_description: 'Full-Stack Developer', seo_og_image: '' })

  useEffect(() => {
    supabase.from('profile').select('accent_color, seo_title, seo_description, seo_og_image').single().then(({ data }) => {
      if (data?.accent_color) {
        document.documentElement.style.setProperty('--accent', data.accent_color)
      }
      if (data) {
        setSeo({
          seo_title: data.seo_title || "Gun's Portfolio",
          seo_description: data.seo_description || 'Full-Stack Developer',
          seo_og_image: data.seo_og_image || ''
        })
      }
    })
  }, [])

  return (
    <>
      <Helmet>
        <title>{seo.seo_title}</title>
        <meta name="description" content={seo.seo_description} />
        <meta property="og:title" content={seo.seo_title} />
        <meta property="og:description" content={seo.seo_description} />
        {seo.seo_og_image && <meta property="og:image" content={seo.seo_og_image} />}
      </Helmet>
      <div className="min-h-screen bg-white text-gray-900">
        <Navbar />
        <Hero />
        <Projects />
        <Skills />
        <Contact />
        <Footer />
      </div>
    </>
  )
}
