import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { fadeUp, staggerContainer } from '../lib/animations'

export default function Skills() {
  const [skills, setSkills] = useState([])
  const { ref, isInView } = useScrollReveal()

  useEffect(() => {
    supabase.from('skills').select('*').order('category').then(({ data }) => setSkills(data ?? []))
  }, [])

  const grouped = skills.reduce((acc, s) => {
    const cat = s.category || 'Other'
    return { ...acc, [cat]: [...(acc[cat] ?? []), s] }
  }, {})

  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Skills</h2>
        <p className="text-gray-500 text-center mb-12">Technologies I work with</p>
        <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          {Object.keys(grouped).length === 0 ? (
            <p className="text-center text-gray-400">No skills listed yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {Object.entries(grouped).map(([category, items]) => (
                <motion.div
                  key={category}
                  variants={fadeUp}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <h3 className="text-sm font-bold text-[var(--accent)] uppercase tracking-wider mb-4">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map(s => (
                      <motion.span
                        key={s.id}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-medium"
                      >
                        {s.name}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
