<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <NuxtLink to="/landing" class="flex items-center">
            <img src="/cvr_logo.png" alt="Check Vehicle Records" class="h-10" />
          </NuxtLink>
          <NuxtLink to="/landing" class="text-blue-600 hover:text-blue-700 transition">
            ← Back to Home
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">Support & Contact</h1>
      
      <div class="bg-white rounded-lg shadow-sm p-8 mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
        <p class="text-gray-700 mb-8">
          We're here to help! If you have any questions, concerns, or feedback about Check Vehicle Records, 
          please don't hesitate to reach out to us.
        </p>

        <div class="grid md:grid-cols-2 gap-8">
          <div class="border rounded-lg p-6">
            <div class="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">General Support</h3>
            <p class="text-gray-600 mb-4">For general inquiries and support</p>
            <a href="mailto:support@checkvehiclerecords.com" class="text-blue-600 hover:underline font-medium">
              support@checkvehiclerecords.com
            </a>
          </div>

          <div class="border rounded-lg p-6">
            <div class="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Billing & Subscriptions</h3>
            <p class="text-gray-600 mb-4">Questions about payments or subscriptions</p>
            <a href="mailto:billing@checkvehiclerecords.com" class="text-blue-600 hover:underline font-medium">
              billing@checkvehiclerecords.com
            </a>
          </div>

          <div class="border rounded-lg p-6">
            <div class="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Privacy & Data</h3>
            <p class="text-gray-600 mb-4">Privacy concerns and data requests</p>
            <a href="mailto:privacy@checkvehiclerecords.com" class="text-blue-600 hover:underline font-medium">
              privacy@checkvehiclerecords.com
            </a>
          </div>

          <div class="border rounded-lg p-6">
            <div class="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Legal & Terms</h3>
            <p class="text-gray-600 mb-4">Legal inquiries and terms questions</p>
            <a href="mailto:legal@checkvehiclerecords.com" class="text-blue-600 hover:underline font-medium">
              legal@checkvehiclerecords.com
            </a>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="bg-white rounded-lg shadow-sm p-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
        
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">How do I cancel my subscription?</h3>
            <p class="text-gray-700">
              You can cancel your subscription at any time through your device's subscription settings:
            </p>
            <ul class="list-disc list-inside mt-2 ml-4 text-gray-700">
              <li><strong>iOS:</strong> Settings → Your Name → Subscriptions → Check Vehicle Records</li>
              <li><strong>Android:</strong> Google Play Store → Menu → Subscriptions → Check Vehicle Records</li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">How accurate are the vehicle reports?</h3>
            <p class="text-gray-700">
              We aggregate data from multiple reliable sources to provide comprehensive reports. However, we recommend 
              conducting your own due diligence and physical inspection before purchasing any vehicle.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Can I get a refund?</h3>
            <p class="text-gray-700">
              Refund requests are handled according to Apple App Store and Google Play Store policies. Please contact 
              the respective store's support for refund requests, or email us at billing@checkvehiclerecords.com for assistance.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Is my data secure?</h3>
            <p class="text-gray-700">
              Yes, we take data security seriously. All data is encrypted in transit and at rest. We never sell your 
              personal information to third parties. Read our <NuxtLink to="/privacy" class="text-blue-600 hover:underline">Privacy Policy</NuxtLink> for more details.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
            <p class="text-gray-700">
              We accept all payment methods supported by Apple App Store and Google Play Store, including credit/debit 
              cards, Apple Pay, and Google Pay.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">How long does it take to receive a report?</h3>
            <p class="text-gray-700">
              Most vehicle reports are generated instantly. In rare cases where data needs to be retrieved from external 
              sources, it may take a few minutes.
            </p>
          </div>
        </div>
      </div>

      <!-- Response Time -->
      <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Response Time</h3>
        <p class="text-gray-700">
          We aim to respond to all inquiries within 24-48 hours during business days. For urgent matters, 
          please mark your email as "URGENT" in the subject line.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 py-8 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-sm">&copy; {{ new Date().getFullYear() }} Check Vehicle Records. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
});
</script>
