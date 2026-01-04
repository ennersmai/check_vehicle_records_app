import { ref } from 'vue'

export const useFullscreenImage = () => {
  const fullscreenImage = ref<string | null>(null)
  const imageContainer = ref<HTMLElement | null>(null)
  const imageScale = ref(1)
  const imageTranslateX = ref(0)
  const imageTranslateY = ref(0)

  // Touch gesture state
  let initialDistance = 0
  let initialScale = 1
  let lastTouchX = 0
  let lastTouchY = 0
  let isDragging = false

  // Fullscreen image functions
  const openFullscreen = (imageUrl: string) => {
    fullscreenImage.value = imageUrl
    imageScale.value = 1
    imageTranslateX.value = 0
    imageTranslateY.value = 0
  }

  const closeFullscreen = () => {
    fullscreenImage.value = null
    imageScale.value = 1
    imageTranslateX.value = 0
    imageTranslateY.value = 0
  }

  // Calculate distance between two touch points
  const getDistance = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  // Touch gesture handlers
  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch zoom start
      e.preventDefault()
      initialDistance = getDistance(e.touches[0], e.touches[1])
      initialScale = imageScale.value
    } else if (e.touches.length === 1 && imageScale.value > 1) {
      // Pan start (only when zoomed in)
      isDragging = true
      lastTouchX = e.touches[0].clientX
      lastTouchY = e.touches[0].clientY
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch zoom
      e.preventDefault()
      const currentDistance = getDistance(e.touches[0], e.touches[1])
      const scale = (currentDistance / initialDistance) * initialScale
      imageScale.value = Math.max(1, Math.min(scale, 4)) // Limit between 1x and 4x
    } else if (e.touches.length === 1 && isDragging && imageScale.value > 1) {
      // Pan (only when zoomed in) - swap X and Y because image is rotated 90 degrees
      e.preventDefault()
      const deltaX = e.touches[0].clientX - lastTouchX
      const deltaY = e.touches[0].clientY - lastTouchY
      // Swap and invert coordinates for 90-degree rotation
      imageTranslateX.value += deltaY / imageScale.value
      imageTranslateY.value -= deltaX / imageScale.value
      lastTouchX = e.touches[0].clientX
      lastTouchY = e.touches[0].clientY
    }
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (e.touches.length < 2) {
      initialDistance = 0
    }
    if (e.touches.length === 0) {
      isDragging = false
      // Reset position if zoomed out to 1x
      if (imageScale.value === 1) {
        imageTranslateX.value = 0
        imageTranslateY.value = 0
      }
    }
  }

  return {
    fullscreenImage,
    imageContainer,
    imageScale,
    imageTranslateX,
    imageTranslateY,
    openFullscreen,
    closeFullscreen,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}
