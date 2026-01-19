<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <img src="/cvr_logo.png" alt="Check Vehicle Records" class="h-10" />
          </div>
          <div class="hidden md:flex space-x-8">
            <a href="#features" class="text-gray-700 hover:text-blue-600 transition">Features</a>
            <a href="#about" class="text-gray-700 hover:text-blue-600 transition">About</a>
            <NuxtLink to="/support" class="text-gray-700 hover:text-blue-600 transition">Support</NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto text-center">
        <div class="mb-8">
          <img src="/cvr_logo.png" alt="Check Vehicle Records" class="h-32 mx-auto mb-8" />
        </div>
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          The Smartest Vehicle Check App
        </h1>
        <p class="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Instant access to comprehensive vehicle history reports. Make informed decisions before you buy.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <div class="bg-black text-white px-8 py-4 rounded-lg flex items-center space-x-3 shadow-lg">
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
            </svg>
            <div class="text-left">
              <div class="text-xs">Download on the</div>
              <div class="text-lg font-semibold">App Store</div>
            </div>
          </div>
          <div class="bg-black text-white px-8 py-4 rounded-lg flex items-center space-x-3 shadow-lg">
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
            </svg>
            <div class="text-left">
              <div class="text-xs">Get it on</div>
              <div class="text-lg font-semibold">Google Play</div>
            </div>
          </div>
        </div>
        <p class="text-sm text-gray-500">Coming soon to iOS and Android</p>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-4xl font-bold text-center text-gray-900 mb-16">Why Choose CVR?</h2>
        <div class="grid md:grid-cols-3 gap-12">
          <div class="text-center">
            <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-4">Instant Reports</h3>
            <p class="text-gray-600">Get comprehensive vehicle history reports in seconds. No waiting, no hassle.</p>
          </div>
          <div class="text-center">
            <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-4">Secure & Private</h3>
            <p class="text-gray-600">Your data is encrypted and protected. We never share your information.</p>
          </div>
          <div class="text-center">
            <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-4">Lightning Fast</h3>
            <p class="text-gray-600">Optimized for speed. Check multiple vehicles in minutes, not hours.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-20 bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl font-bold text-gray-900 mb-8">About CVR</h2>
        <p class="text-lg text-gray-600 mb-6">
          Check Vehicle Records (CVR) is your trusted companion for making informed vehicle purchasing decisions. 
          We aggregate data from multiple reliable sources to provide you with the most comprehensive vehicle history reports available.
        </p>
        <p class="text-lg text-gray-600">
          Whether you're buying from a dealer or a private seller, CVR gives you the confidence to negotiate 
          the best deal and avoid costly surprises down the road.
        </p>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-blue-600">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl font-bold text-white mb-6">Ready to Check Your Next Vehicle?</h2>
        <p class="text-xl text-blue-100 mb-8">Download the app and get started in minutes.</p>
        <p class="text-lg text-blue-200">Available soon on iOS and Android</p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <img src="/cvr_logo.png" alt="Check Vehicle Records" class="h-10 mb-4" />
            <p class="text-sm">Making vehicle history checks simple and accessible for everyone.</p>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-4">Legal</h4>
            <ul class="space-y-2">
              <li><NuxtLink to="/privacy" class="hover:text-white transition">Privacy Policy</NuxtLink></li>
              <li><NuxtLink to="/terms" class="hover:text-white transition">Terms of Service</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-4">Support</h4>
            <ul class="space-y-2">
              <li><NuxtLink to="/support" class="hover:text-white transition">Contact Us</NuxtLink></li>
              <li><a href="mailto:support@checkvehiclerecords.com" class="hover:text-white transition">support@checkvehiclerecords.com</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; {{ new Date().getFullYear() }} Check Vehicle Records. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Landing page - no auth required
definePageMeta({
  layout: false
});
</script>
