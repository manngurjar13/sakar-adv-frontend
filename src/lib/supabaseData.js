export const createId = () => crypto.randomUUID()

export const isFileLike = (value) => {
  return typeof File !== 'undefined' && value instanceof File
}

export const getFileFromFormData = (formData, key) => {
  const value = formData.get(key)
  return isFileLike(value) ? value : null
}

export const getStringFromFormData = (formData, key) => {
  const value = formData.get(key)
  return typeof value === 'string' ? value : ''
}

export const ensureArray = (value) => {
  return Array.isArray(value) ? value : []
}

export const cloneJson = (value) => JSON.parse(JSON.stringify(value))
