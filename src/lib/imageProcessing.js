export const normalizeImageToAspectRatio = async ({
  file,
  targetWidth = 1920,
  targetHeight = 1080,
  outputType = 'image/jpeg',
  quality = 0.92,
}) => {
  if (!(file instanceof File)) {
    return file
  }

  const sourceUrl = URL.createObjectURL(file)

  try {
    const image = await new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = sourceUrl
    })

    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight

    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('Canvas is not supported in this browser')
    }

    const scale = Math.max(targetWidth / image.width, targetHeight / image.height)
    const drawWidth = image.width * scale
    const drawHeight = image.height * scale
    const offsetX = (targetWidth - drawWidth) / 2
    const offsetY = (targetHeight - drawHeight) / 2

    context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) {
            resolve(result)
            return
          }
          reject(new Error('Failed to convert image'))
        },
        outputType,
        quality
      )
    })

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'banner'
    const extension = outputType === 'image/png' ? 'png' : 'jpg'

    return new File([blob], `${baseName}-16x9.${extension}`, {
      type: outputType,
      lastModified: Date.now(),
    })
  } finally {
    URL.revokeObjectURL(sourceUrl)
  }
}
