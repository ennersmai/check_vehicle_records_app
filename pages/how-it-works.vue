<template>
  <div class="min-h-screen bg-white font-sans">
    <WebNav />

    <!-- Hero -->
    <section class="bg-primary text-white py-16 md:py-20">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl md:text-5xl font-bold mb-4">How It Works</h1>
        <p class="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
          A full vehicle history check in seconds — no account needed to search.
        </p>
      </div>
    </section>

    <!-- Steps -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <div class="space-y-12">
        <!-- Step 1 -->
        <div class="flex gap-6 md:gap-10 items-start">
          <div class="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white font-bold text-xl flex items-center justify-center">
            1
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">Enter the Registration Number</h2>
            <p class="text-gray-600 leading-relaxed">
              Type any UK vehicle registration plate into the search bar on our home page. No sign-up required for a basic check — just enter the reg and hit <strong>Check Now</strong>.
            </p>
          </div>
        </div>

        <!-- Connector -->
        <div class="ml-6 w-px h-6 bg-gray-200"></div>

        <!-- Step 2 -->
        <div class="flex gap-6 md:gap-10 items-start">
          <div class="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white font-bold text-xl flex items-center justify-center">
            2
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">Get an Instant Basic Report</h2>
            <p class="text-gray-600 leading-relaxed">
              Within seconds you'll see a free summary — make, model, year, colour, fuel type, engine size, and current MOT status. Confirm this matches the vehicle you're looking at.
            </p>
          </div>
        </div>

        <div class="ml-6 w-px h-6 bg-gray-200"></div>

        <!-- Step 3 -->
        <div class="flex gap-6 md:gap-10 items-start">
          <div class="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white font-bold text-xl flex items-center justify-center">
            3
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">Unlock the Full Premium Report</h2>
            <p class="text-gray-600 leading-relaxed mb-4">
              For a complete history, purchase a Premium Check starting from <strong>£9.99</strong>. Choose the package that suits you — single check, or a bundle if you're comparing several vehicles.
            </p>
            <div class="grid sm:grid-cols-2 gap-3">
              <div v-for="item in premiumItems" :key="item" class="flex items-start gap-2">
                <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-sm text-gray-600">{{ item }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="ml-6 w-px h-6 bg-gray-200"></div>

        <!-- Step 4 -->
        <div class="flex gap-6 md:gap-10 items-start">
          <div class="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white font-bold text-xl flex items-center justify-center">
            4
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">Secure Payment via Stripe</h2>
            <p class="text-gray-600 leading-relaxed">
              Pay safely through Stripe — the same payment platform used by millions of websites worldwide. We never store your card details. Once payment is confirmed, your report is unlocked instantly.
            </p>
          </div>
        </div>

        <div class="ml-6 w-px h-6 bg-gray-200"></div>

        <!-- Step 5 -->
        <div class="flex gap-6 md:gap-10 items-start">
          <div class="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white font-bold text-xl flex items-center justify-center">
            5
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">View Your Full Vehicle History</h2>
            <p class="text-gray-600 leading-relaxed">
              Read your detailed report on any device — desktop, tablet, or phone. If you purchased a multi-check bundle, your remaining credits are saved to your account and can be used on any other vehicle at any time.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing summary -->
    <section class="bg-gray-50 py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">Simple, Transparent Pricing</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div v-for="pkg in packages" :key="pkg.name"
            class="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm"
            :class="pkg.highlight ? 'border-primary ring-2 ring-primary' : ''"
          >
            <div v-if="pkg.highlight" class="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Most Popular</div>
            <h3 class="text-lg font-bold text-gray-900 mb-1">{{ pkg.name }}</h3>
            <p class="text-3xl font-bold text-primary mb-1">{{ pkg.price }}</p>
            <p v-if="pkg.perCheck" class="text-sm text-gray-400 mb-4">{{ pkg.perCheck }}/check</p>
            <p v-else class="text-sm text-gray-400 mb-4">&nbsp;</p>
            <p class="text-sm text-gray-600">{{ pkg.description }}</p>
            <div v-if="pkg.savings" class="mt-3">
              <span class="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">{{ pkg.savings }}</span>
            </div>
          </div>
        </div>
        <div class="text-center mt-10">
          <NuxtLink
            to="/landing"
            class="inline-block bg-primary hover:bg-primary-link text-white font-bold px-8 py-3 rounded-xl transition"
          >
            Start a Free Check
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-10">Common Questions</h2>
      <div class="space-y-6">
        <div v-for="faq in faqs" :key="faq.q" class="border-b border-gray-100 pb-6">
          <h3 class="font-semibold text-gray-900 mb-2">{{ faq.q }}</h3>
          <p class="text-gray-600 text-sm leading-relaxed">{{ faq.a }}</p>
        </div>
      </div>
    </section>

    <WebFooter />
  </div>
</template>

<script setup lang="ts">
const premiumItems = [
  'Outstanding finance check',
  'Stolen vehicle database',
  'Write-off & accident records',
  'Mileage discrepancy analysis',
  'Full MOT history',
  'Ownership history',
  'Import/export status',
  'Current market valuation',
  'Recalls & plate changes',
  'Vehicle images & specs',
];

const packages = [
  {
    name: '1 Check',
    price: '£9.99',
    perCheck: '',
    description: 'Perfect for a single purchase or one-off check.',
    savings: '',
    highlight: false,
  },
  {
    name: '5 Checks',
    price: '£24.99',
    perCheck: '£5.00',
    description: 'Great for comparing a shortlist of vehicles.',
    savings: 'Save 50%',
    highlight: true,
  },
  {
    name: '10 Checks',
    price: '£39.99',
    perCheck: '£4.00',
    description: 'Best value for dealers and serious buyers.',
    savings: 'Save 60%',
    highlight: false,
  },
];

const faqs = [
  {
    q: 'Do I need an account to run a check?',
    a: 'You can view a free basic summary without an account. To purchase and view a full premium report you will need to create a free account — this lets us deliver your report and save your purchase history.',
  },
  {
    q: 'How quickly do I get the report?',
    a: 'Instantly. As soon as payment is confirmed your premium report is unlocked and displayed on screen. There is no waiting and no email to open.',
  },
  {
    q: 'What data sources do you use?',
    a: 'We pull from trusted and verified UK data sources including DVLA records, MOT history, HPI-equivalent finance and theft databases, and insurance write-off registers.',
  },
  {
    q: 'Do unused credits expire?',
    a: 'No. Credits purchased in a bundle are saved to your account and have no expiry date. Use them whenever you need them.',
  },
  {
    q: 'Is my payment information safe?',
    a: 'Yes. All payments are processed by Stripe, a PCI-DSS Level 1 certified payment provider. We never store or see your card details.',
  },
  {
    q: 'Can I use the app on my phone?',
    a: 'Absolutely. Download the Check Vehicle Records app for iOS or Android to run checks on the go with the same data and reports.',
  },
];
</script>
