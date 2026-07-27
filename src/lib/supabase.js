import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://edjacalxbvefzemtqejb.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkamFjYWx4YnZlZnplbXRxZWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODA1NjcsImV4cCI6MjEwMDY1NjU2N30.aq2MDakqaX5lx0RUzYcso2HuwdSZN7X7s8JH-XL8Thc'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

/**
 * Upload file to property-deals storage bucket
 */
export async function uploadPropertyMedia(file) {
  const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`
  const { data, error } = await supabase.storage
    .from('property-deals')
    .upload(fileName, file, { cacheControl: '3600', upsert: true })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('property-deals')
    .getPublicUrl(fileName)

  return publicUrl
}

/**
 * Upload file to scheduled-meetings storage bucket
 */
export async function uploadMeetingAttachment(file) {
  const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`
  const { data, error } = await supabase.storage
    .from('scheduled-meetings')
    .upload(fileName, file, { cacheControl: '3600', upsert: true })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('scheduled-meetings')
    .getPublicUrl(fileName)

  return publicUrl
}
