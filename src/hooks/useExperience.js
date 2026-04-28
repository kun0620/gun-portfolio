import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

let experienceCache = null
let experiencePending = null
let experienceCachedAt = 0
const EXPERIENCE_CACHE_TTL = 10000

function loadExperience() {
  if (experienceCache && Date.now() - experienceCachedAt < EXPERIENCE_CACHE_TTL) return Promise.resolve(experienceCache)
  if (!experiencePending) {
    experiencePending = supabase.from('experience').select('*').order('display_order', { ascending: true })
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) return null
        experienceCache = data
        experienceCachedAt = Date.now()
        return data
      })
      .finally(() => { experiencePending = null })
  }
  return experiencePending
}

export function useExperience() {
  const [data, setData] = useState(experienceCache)
  const [loading, setLoading] = useState(true)

  const fetch = () => {
    setLoading(true)
    supabase.from('experience').select('*').order('display_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          experienceCache = data
          experienceCachedAt = Date.now()
          setData(data)
        }
        setLoading(false)
      })
  }

  useEffect(() => {
    let alive = true
    loadExperience()
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
