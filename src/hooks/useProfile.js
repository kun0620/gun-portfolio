import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

let profileCache = null
let profilePending = null
let profileCachedAt = 0
const PROFILE_CACHE_TTL = 10000

function loadProfile() {
  if (profileCache && Date.now() - profileCachedAt < PROFILE_CACHE_TTL) return Promise.resolve(profileCache)
  if (!profilePending) {
    profilePending = supabase.from('profile').select('*').limit(1).single()
      .then(({ data, error }) => {
        if (error || !data) return null
        profileCache = data
        profileCachedAt = Date.now()
        return data
      })
      .finally(() => { profilePending = null })
  }
  return profilePending
}

export function useProfile() {
  const [data, setData] = useState(profileCache)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    loadProfile()
      .then((data) => {
        if (alive && data) setData(data)
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => { alive = false }
  }, [])

  return { data, loading, refetch: () => {
    setLoading(true)
    supabase.from('profile').select('*').limit(1).single()
      .then(({ data, error }) => {
        if (!error && data) {
          profileCache = data
          profileCachedAt = Date.now()
          setData(data)
        }
        setLoading(false)
      })
  }}
}
