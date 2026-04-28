import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL ?? ''
const key = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export const supabase = createClient(url, key)

/** Get public URL for a path in portfolio-assets bucket */
export function getPublicUrl(path) {
  if (!path) return null
  const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(path)
  return data.publicUrl
}

/** Upload a file to portfolio-assets bucket, returns storage path */
export async function uploadAsset(folder, file) {
  const ext = file.name.split('.').pop()
  const path = `${folder}/${Date.now()}.${ext}`
  const { error } = await supabase.storage
    .from('portfolio-assets')
    .upload(path, file, { upsert: true })
  if (error) throw error
  return path
}
