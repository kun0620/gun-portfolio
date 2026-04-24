import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

export function useProfile() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('profile').select('*').limit(1).single()
      .then(({ data, error }) => {
        if (!error && data) setData(data)
        setLoading(false)
      })
  }, [])

  return { data, loading, refetch: () => {
    setLoading(true)
    supabase.from('profile').select('*').limit(1).single()
      .then(({ data, error }) => {
        if (!error && data) setData(data)
        setLoading(false)
      })
  }}
}
