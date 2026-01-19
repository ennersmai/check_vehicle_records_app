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
      <h1 class="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      <div class="bg-white rounded-lg shadow-sm p-8 space-y-6 text-gray-700">
        <p class="text-sm text-gray-500">Last Updated: {{ new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing or using the Check Vehicle Records ("CVR") mobile application, you agree to be bound by these 
            Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use our services.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">2. Description of Services</h2>
          <p class="mb-4">
            CVR provides vehicle history checking services through our mobile application. Our services include:
          </p>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li>Vehicle registration number (VRM) lookups</li>
            <li>Vehicle history reports</li>
            <li>Premium subscription features</li>
            <li>Vehicle garage management</li>
          </ul>
          <p class="mt-4">
            We aggregate information from publicly available sources and third-party data providers. While we strive for 
            accuracy, we do not guarantee that all information is complete, accurate, or up-to-date.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">3.1 Account Creation</h3>
          <p class="mb-4">
            To use certain features of our app, you must create an account. You agree to:
          </p>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorized access</li>
            <li>Be responsible for all activities under your account</li>
          </ul>

          <h3 class="text-xl font-semibold text-gray-800 mb-3 mt-6">3.2 Account Termination</h3>
          <p>
            We reserve the right to suspend or terminate your account if you violate these Terms or engage in fraudulent, 
            abusive, or illegal activity.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">4. Subscriptions and Payments</h2>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">4.1 Premium Subscriptions</h3>
          <p class="mb-4">
            CVR offers premium subscription plans that provide additional features and benefits. Subscription details:
          </p>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li>Subscriptions are billed on a recurring basis (monthly or annually)</li>
            <li>Prices are displayed in the app and may vary by region</li>
            <li>Payment is processed through Apple App Store or Google Play Store</li>
            <li>Subscriptions automatically renew unless cancelled</li>
          </ul>

          <h3 class="text-xl font-semibold text-gray-800 mb-3 mt-6">4.2 Cancellation and Refunds</h3>
          <p class="mb-4">
            You may cancel your subscription at any time through your device's subscription settings. Cancellation policies:
          </p>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li>Cancellation takes effect at the end of the current billing period</li>
            <li>No refunds for partial subscription periods</li>
            <li>Refund requests are handled according to Apple and Google's refund policies</li>
            <li>We reserve the right to issue refunds at our discretion</li>
          </ul>

          <h3 class="text-xl font-semibold text-gray-800 mb-3 mt-6">4.3 Free Trial</h3>
          <p>
            We may offer free trial periods for premium subscriptions. If you do not cancel before the trial ends, 
            you will be automatically charged for the subscription.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">5. Acceptable Use</h2>
          <p class="mb-4">You agree NOT to:</p>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li>Use the app for any illegal or unauthorized purpose</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt the app's functionality</li>
            <li>Use automated systems (bots, scrapers) to access the app</li>
            <li>Resell or redistribute our services or data</li>
            <li>Reverse engineer or decompile the app</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Harass, abuse, or harm other users</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
          <p class="mb-4">
            All content, features, and functionality of the CVR app are owned by us and are protected by copyright, 
            trademark, and other intellectual property laws. You are granted a limited, non-exclusive, non-transferable 
            license to use the app for personal, non-commercial purposes.
          </p>
          <p>
            The CVR name, logo, and all related marks are our trademarks. You may not use these marks without our 
            prior written permission.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">7. Disclaimers and Limitations</h2>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">7.1 Information Accuracy</h3>
          <p class="mb-4">
            Vehicle history reports are compiled from various sources. We do not guarantee:
          </p>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li>The accuracy, completeness, or timeliness of information</li>
            <li>That all vehicle history events are included</li>
            <li>That information from third-party sources is correct</li>
          </ul>
          <p class="mt-4">
            <strong>You should always conduct your own due diligence and physical inspection before purchasing a vehicle.</strong>
          </p>

          <h3 class="text-xl font-semibold text-gray-800 mb-3 mt-6">7.2 Service Availability</h3>
          <p>
            We strive to maintain 24/7 availability but do not guarantee uninterrupted access. The app may be unavailable 
            due to maintenance, updates, or technical issues.
          </p>

          <h3 class="text-xl font-semibold text-gray-800 mb-3 mt-6">7.3 No Warranties</h3>
          <p>
            THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, 
            INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
          <p class="mb-4">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, CVR SHALL NOT BE LIABLE FOR:
          </p>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li>Any indirect, incidental, special, consequential, or punitive damages</li>
            <li>Loss of profits, revenue, data, or use</li>
            <li>Damages resulting from reliance on information provided</li>
            <li>Damages from unauthorized access to your account</li>
            <li>Any vehicle purchase decisions made based on our reports</li>
          </ul>
          <p class="mt-4">
            Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">9. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless CVR, its affiliates, and their respective officers, directors, 
            employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) 
            arising from your use of the app or violation of these Terms.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">10. Third-Party Services</h2>
          <p>
            Our app integrates with third-party services including payment processors, data providers, and analytics tools. 
            Your use of these services is subject to their respective terms and conditions. We are not responsible for 
            third-party services or content.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">11. Data and Privacy</h2>
          <p>
            Your use of the app is also governed by our Privacy Policy, which is incorporated into these Terms by reference. 
            Please review our <NuxtLink to="/privacy" class="text-blue-600 hover:underline">Privacy Policy</NuxtLink> to 
            understand how we collect, use, and protect your information.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify you of material changes by posting 
            the updated Terms in the app or via email. Your continued use of the app after changes constitutes acceptance 
            of the new Terms.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">13. Governing Law and Disputes</h2>
          <p class="mb-4">
            These Terms are governed by the laws of England and Wales, without regard to conflict of law principles.
          </p>
          <p class="mb-4">
            Any disputes arising from these Terms or your use of the app shall be resolved through:
          </p>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li>Good faith negotiation between the parties</li>
            <li>Binding arbitration if negotiation fails</li>
            <li>Courts of England and Wales for any matters not subject to arbitration</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">14. Severability</h2>
          <p>
            If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall 
            continue in full force and effect.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">15. Entire Agreement</h2>
          <p>
            These Terms, together with our Privacy Policy, constitute the entire agreement between you and CVR regarding 
            your use of the app and supersede all prior agreements.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">16. Contact Information</h2>
          <p class="mb-4">If you have questions about these Terms, please contact us:</p>
          <ul class="space-y-2">
            <li><strong>Email:</strong> <a href="mailto:legal@checkvehiclerecords.com" class="text-blue-600 hover:underline">legal@checkvehiclerecords.com</a></li>
            <li><strong>Support:</strong> <a href="mailto:support@checkvehiclerecords.com" class="text-blue-600 hover:underline">support@checkvehiclerecords.com</a></li>
          </ul>
        </section>

        <section class="border-t pt-6 mt-8">
          <p class="text-sm text-gray-600">
            By using Check Vehicle Records, you acknowledge that you have read, understood, and agree to be bound by 
            these Terms of Service.
          </p>
        </section>
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
