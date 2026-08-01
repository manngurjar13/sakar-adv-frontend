export const getImageUrl = (imagePath) => {
  if (!imagePath) return null

  if (typeof imagePath === 'object' && imagePath.url) {
    return imagePath.url
  }

  if (typeof imagePath !== 'string') {
    return null
  }

  if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
    return imagePath
  }

  return imagePath
}
