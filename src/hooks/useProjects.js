import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

let projectsCache = null
let projectsPending = null
let projectsCachedAt = 0
const PROJECTS_CACHE_TTL = 10000

function loadProjects() {
  if (projectsCache && Date.now() - projectsCachedAt < PROJECTS_CACHE_TTL) return Promise.resolve(projectsCache)
  if (!projectsPending) {
    projectsPending = supabase.from('projects').select('*').order('display_order', { ascending: true })
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) return null
        projectsCache = data
        projectsCachedAt = Date.now()
        return data
      })
      .finally(() => { projectsPending = null })
  }
  return projectsPending
}

export function useProjects() {
  const [data, setData] = useState(projectsCache)
  const [loading, setLoading] = useState(true)

  const fetch = () => {
    setLoading(true)
    supabase.from('projects').select('*').order('display_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          projectsCache = data
          projectsCachedAt = Date.now()
          setData(data)
        }
        setLoading(false)
      })
  }

  useEffect(() => {
    let alive = true
    loadProjects()
      .then((data) => {
        if (alive && data) setData(data)
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => { alive = false }
  }, [])

  return { data, loading, refetch: fetch }
}
