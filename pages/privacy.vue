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
      <h1 class="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <div class="bg-white rounded-lg shadow-sm p-8 space-y-6 text-gray-700">
        <p class="text-sm text-gray-500">Last Updated: {{ new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
          <p>
            Welcome to Check Vehicle Records ("CVR", "we", "us", or "our"). We are committed to protecting your personal information 
            and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
            when you use our mobile application and services.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">2.1 Personal Information</h3>
          <p class="mb-4">We may collect the following personal information:</p>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li>Name and email address (when you create an account)</li>
            <li>Payment information (processed securely through third-party payment processors)</li>
            <li>Vehicle registration numbers (VRMs) that you search</li>
            <li>Device information and unique identifiers</li>
            <li>Usage data and analytics</li>
          </ul>

          <h3 class="text-xl font-semibold text-gray-800 mb-3 mt-6">2.2 Automatically Collected Information</h3>
          <p class="mb-4">When you use our app, we automatically collect:</p>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li>Device type, operating system, and version</li>
            <li>IP address and general location data</li>
            <li>App usage statistics and crash reports</li>
            <li>Time and date of access</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
          <p class="mb-4">We use the information we collect to:</p>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li>Provide and maintain our vehicle checking services</li>
            <li>Process your transactions and manage your account</li>
            <li>Send you vehicle history reports</li>
            <li>Improve and optimize our app performance</li>
            <li>Communicate with you about updates, offers, and support</li>
            <li>Detect and prevent fraud or unauthorized access</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
          <p class="mb-4">We may share your information with:</p>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li><strong>Service Providers:</strong> Third-party companies that help us operate our app (e.g., cloud hosting, payment processing, analytics)</li>
            <li><strong>Vehicle Data Providers:</strong> To retrieve vehicle history information on your behalf</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          </ul>
          <p class="mt-4">We do not sell your personal information to third parties.</p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your personal information. 
            This includes encryption, secure servers, and regular security assessments. However, no method of transmission 
            over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to provide our services and comply with legal obligations. 
            When you delete your account, we will delete or anonymize your personal information within 30 days, except where 
            we are required to retain it for legal or regulatory purposes.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
          <p class="mb-4">Depending on your location, you may have the following rights:</p>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li><strong>Access:</strong> Request a copy of your personal information</li>
            <li><strong>Correction:</strong> Request correction of inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
            <li><strong>Portability:</strong> Request transfer of your data to another service</li>
            <li><strong>Objection:</strong> Object to processing of your personal information</li>
            <li><strong>Withdrawal of Consent:</strong> Withdraw consent where processing is based on consent</li>
          </ul>
          <p class="mt-4">To exercise these rights, please contact us at <a href="mailto:privacy@checkvehiclerecords.co.uk" class="text-blue-600 hover:underline">privacy@checkvehiclerecords.co.uk</a></p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
          <p>
            Our services are not intended for users under the age of 18. We do not knowingly collect personal information 
            from children. If you believe we have collected information from a child, please contact us immediately.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">9. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your country of residence. 
            We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">10. Third-Party Services</h2>
          <p class="mb-4">Our app may contain links to third-party services. We use the following third-party services:</p>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li>Supabase (authentication and database)</li>
            <li>RevenueCat (subscription management)</li>
            <li>Payment processors (Apple Pay, Google Pay)</li>
          </ul>
          <p class="mt-4">These services have their own privacy policies, and we encourage you to review them.</p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">11. Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our app and store certain information. 
            You can instruct your device to refuse all cookies or to indicate when a cookie is being sent.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
            Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy 
            periodically for any changes.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
          <p class="mb-4">If you have any questions about this Privacy Policy, please contact us:</p>
          <ul class="space-y-2">
            <li><strong>Email:</strong> <a href="mailto:privacy@checkvehiclerecords.co.uk" class="text-blue-600 hover:underline">privacy@checkvehiclerecords.co.uk</a></li>
            <li><strong>Support:</strong> <a href="mailto:support@checkvehiclerecords.co.uk" class="text-blue-600 hover:underline">support@checkvehiclerecords.co.uk</a></li>
          </ul>
        </section>

        <section class="border-t pt-6 mt-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">GDPR Compliance (EU Users)</h2>
          <p class="mb-4">
            If you are a resident of the European Economic Area (EEA), you have certain data protection rights under GDPR. 
            We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of your personal information.
          </p>
          <p>
            Our legal basis for processing your personal information includes: (1) your consent, (2) performance of a contract, 
            (3) compliance with legal obligations, and (4) our legitimate interests.
          </p>
        </section>

        <section class="border-t pt-6 mt-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">California Privacy Rights (CCPA)</h2>
          <p class="mb-4">
            If you are a California resident, you have specific rights regarding your personal information under the 
            California Consumer Privacy Act (CCPA):
          </p>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li>Right to know what personal information is collected</li>
            <li>Right to know if personal information is sold or disclosed</li>
            <li>Right to opt-out of the sale of personal information</li>
            <li>Right to deletion of personal information</li>
            <li>Right to non-discrimination for exercising your rights</li>
          </ul>
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
