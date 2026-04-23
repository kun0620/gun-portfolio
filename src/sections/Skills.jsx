import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Skills() {
  const [skills, setSkills] = useState([])

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
        {Object.keys(grouped).length === 0 ? (
          <p className="text-center text-gray-400">No skills listed yet.</p>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-[#1D9E75] uppercase tracking-wider mb-3">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map(s => (
                    <span key={s.id} className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 text-sm font-medium hover:border-[#1D9E75] hover:text-[#1D9E75] transition-colors">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
