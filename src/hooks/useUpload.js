import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function useUpload() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function upload(file, path) {
    if (!file) return null
    setLoading(true)
    setError(null)
    try {
      const filename = `${Date.now()}-${file.name}`
      const filepath = `${path}/${filename}`
      const { error: uploadError, data } = await supabase.storage
        .from('portfolio-images')
        .upload(filepath, file)
      if (uploadError) throw uploadError
      const { data: publicUrl } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filepath)
      return publicUrl.publicUrl
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { upload, loading, error }
}
