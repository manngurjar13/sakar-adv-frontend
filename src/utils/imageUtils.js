// Simple utility to construct full image URLs by adding base URL
const BACKEND_URL = 'http://72.61.229.88:5000'

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  
  // Add base URL to the path
  return `${BACKEND_URL}${imagePath}`
}
