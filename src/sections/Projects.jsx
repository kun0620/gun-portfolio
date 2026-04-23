import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function ProjectCard({ project }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-lg hover:scale-105 transition-all duration-300">
      {project.image_url && (
        <img src={project.image_url} alt={project.title} className="w-full h-44 object-cover" />
      )}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-lg mb-2">{project.title}</h3>
        <p className="text-gray-500 text-sm mb-4 flex-1">{project.description}</p>
        {project.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-3 text-sm">
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noreferrer"
              className="text-[var(--accent)] font-medium hover:underline">Live ↗</a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noreferrer"
              className="text-gray-500 font-medium hover:underline">GitHub ↗</a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    supabase.from('projects').select('*').order('display_order').then(({ data }) => setProjects(data ?? []))
  }, [])

  return (
    <section id="projects" className="py-20 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Projects</h2>
        <p className="text-gray-500 text-center mb-12">Things I've built</p>
        {projects.length === 0 ? (
          <p className="text-center text-gray-400">No projects yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map(p => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </div>
    </section>
  )
}
