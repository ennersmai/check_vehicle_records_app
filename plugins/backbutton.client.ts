/**
 * Global Android back button handler.
 * Uses @capacitor/app to intercept the hardware back button.
 * - If a fullscreen image is open, close it
 * - Otherwise navigate back in history
 * - If no history, minimize the app instead of exiting
 */
export default defineNuxtPlugin(() => {
  if (process.server) return

  const setupBackButton = async () => {
    const cap = (window as any).Capacitor
    if (!cap?.Plugins?.App) return

    const App = cap.Plugins.App

    App.addListener('backButton', ({ canGoBack }: { canGoBack: boolean }) => {
      // Check if a fullscreen image modal is open (marked by a data attribute on body)
      const fullscreenOpen = document.body.getAttribute('data-fullscreen-image') === 'true'

      if (fullscreenOpen) {
        // Dispatch a custom event that the useFullscreenImage composable listens for
        window.dispatchEvent(new CustomEvent('close-fullscreen-image'))
        return
      }

      if (canGoBack) {
        window.history.back()
      } else {
        // At root - minimize app instead of exiting
        App.minimizeApp()
      }
    })
  }

  setupBackButton()
})
