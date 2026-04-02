<template>
  <footer id="get-the-app" class="bg-white cursor-default">
    <!-- Get the App -->
    <div class="py-16 md:py-20 border-t border-gray-100">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get the App</h2>
        <p class="text-gray-500 mb-1">Access vehicle reports instantly</p>
        <p class="text-gray-500 mb-10">on your smartphone or tablet.</p>
        <AppStoreBadges />
      </div>
    </div>

    <!-- Footer bar -->
    <div class="bg-primary text-white py-14">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-10">
          <img src="/Footer-Logo1-Rev4-Final-3.svg" alt="Check Vehicle Records" class="h-14" />
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Company -->
          <div>
            <h4 class="font-semibold text-white mb-4">Company</h4>
            <ul class="space-y-2 text-sm">
              <li><NuxtLink to="/terms" class="text-blue-100 hover:text-white transition cursor-default">Terms and Conditions (T&C)</NuxtLink></li>
              <li><NuxtLink to="/privacy" class="text-blue-100 hover:text-white transition cursor-default">Privacy Policy</NuxtLink></li>
              <li><NuxtLink to="/web/about" class="text-blue-100 hover:text-white transition cursor-default">About us</NuxtLink></li>
              <li><NuxtLink to="/support" class="text-blue-100 hover:text-white transition cursor-default">Contact Us</NuxtLink></li>
            </ul>
          </div>
          <!-- Support -->
          <div>
            <h4 class="font-semibold text-white mb-4">Support</h4>
            <ul class="space-y-2 text-sm">
              <li><NuxtLink to="/how-it-works" class="text-blue-100 hover:text-white transition cursor-default">How it Works</NuxtLink></li>
              <li><NuxtLink to="/support" class="text-blue-100 hover:text-white transition cursor-default">Report an Issue</NuxtLink></li>
              <li><NuxtLink to="/web/faqs" class="text-blue-100 hover:text-white transition cursor-default">FAQs</NuxtLink></li>
              <li><NuxtLink to="/web/blog" class="text-blue-100 hover:text-white transition cursor-default">Blog</NuxtLink></li>
            </ul>
          </div>
          <!-- Follow us -->
          <div>
            <h4 class="font-semibold text-white mb-4">Follow us</h4>
            <div class="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=61576493384497" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition cursor-default">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/checkvehiclerecords" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition cursor-default">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@checkvehiclerecords" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition cursor-default">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.27-1.1-.63-1.62-1-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.51 1.35-.12 2.98.82 3.99.91.94 2.34 1.37 3.6 1.02 1.01-.28 1.86-1.06 2.27-2.05.33-.78.36-1.65.35-2.49-.01-3.76 0-7.52 0-11.28.01-.66 0-1.32 0-1.98z"/>
                </svg>
              </a>
              <a href="https://x.com/checkvehiclerec" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition cursor-default">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>
