import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

export function useExperience() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetch = () => {
    setLoading(true)
    supabase.from('experience').select('*').order('display_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) setData(data)
        setLoading(false)
      })
  }

  useEffect(() => { fetch() }, [])

  return { data, loading, refetch: fetch }
}
