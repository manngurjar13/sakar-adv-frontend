import { supabase } from './supabase'

const sanitizeFileName = (fileName = 'file') => {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()
}

const buildStoragePath = ({ recordId, folder = 'main', fileName }) => {
  const uniqueSegment = crypto.randomUUID()
  return `${recordId}/${folder}/${uniqueSegment}-${sanitizeFileName(fileName)}`
}

export const uploadPublicFile = async ({ bucket, file, recordId, folder }) => {
  if (!file) return null

  const filePath = buildStoragePath({
    recordId,
    folder,
    fileName: file.name,
  })

  const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: '3600',
    upsert: true,
  })

  if (uploadError) {
    throw new Error(uploadError.message || 'Failed to upload file')
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}

export const extractStoragePathFromPublicUrl = (publicUrl, bucket) => {
  if (!publicUrl || !bucket) return null

  const marker = `/storage/v1/object/public/${bucket}/`
  const markerIndex = publicUrl.indexOf(marker)
  if (markerIndex === -1) return null

  return publicUrl.slice(markerIndex + marker.length)
}

export const deletePublicFile = async ({ bucket, publicUrl }) => {
  const storagePath = extractStoragePathFromPublicUrl(publicUrl, bucket)
  if (!storagePath) return

  await supabase.storage.from(bucket).remove([storagePath])
}
