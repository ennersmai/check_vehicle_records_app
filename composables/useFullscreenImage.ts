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

  // Close handler for global back button event
  let closeHandler: (() => void) | null = null

  const resetState = () => {
    fullscreenImage.value = null
    imageScale.value = 1
    imageTranslateX.value = 0
    imageTranslateY.value = 0
    // Tell global back button handler that fullscreen is closed
    if (typeof document !== 'undefined') {
      document.body.removeAttribute('data-fullscreen-image')
    }
  }

  // Fullscreen image functions
  const openFullscreen = (imageUrl: string) => {
    fullscreenImage.value = imageUrl
    imageScale.value = 1
    imageTranslateX.value = 0
    imageTranslateY.value = 0

    if (typeof window !== 'undefined') {
      // Mark fullscreen as open for the global back button handler
      document.body.setAttribute('data-fullscreen-image', 'true')

      // Listen for the global back button close event
      if (closeHandler) {
        window.removeEventListener('close-fullscreen-image', closeHandler)
      }
      closeHandler = () => {
        resetState()
        if (closeHandler) {
          window.removeEventListener('close-fullscreen-image', closeHandler)
          closeHandler = null
        }
      }
      window.addEventListener('close-fullscreen-image', closeHandler)
    }
  }

  const closeFullscreen = () => {
    if (typeof window !== 'undefined' && closeHandler) {
      window.removeEventListener('close-fullscreen-image', closeHandler)
      closeHandler = null
    }
    resetState()
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
      // Pan (only when zoomed in) - remap for 90deg CW rotation
      // CSS: rotate(90deg) scale(s) translate(tx, ty) applied R-to-L
      // tx+ → screen DOWN, ty+ → screen LEFT
      // So: swipe right (deltaX+) → ty-  |  swipe down (deltaY+) → tx+
      e.preventDefault()
      const deltaX = e.touches[0].clientX - lastTouchX
      const deltaY = e.touches[0].clientY - lastTouchY
      imageTranslateY.value -= deltaX / imageScale.value
      imageTranslateX.value += deltaY / imageScale.value
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
