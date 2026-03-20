<template>
  <div class="min-h-screen bg-white font-sans">
    <WebNav />

    <section class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h1>

      <div class="space-y-3">
        <div
          v-for="(faq, idx) in faqs"
          :key="idx"
          class="bg-gray-50 rounded-lg overflow-hidden"
        >
          <button
            @click="toggle(idx)"
            class="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-100 transition"
          >
            <span class="font-semibold text-gray-900 text-sm pr-4">{{ faq.question }}</span>
            <svg
              class="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200"
              :class="{ 'rotate-180': openIndex === idx }"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div v-if="openIndex === idx" class="px-6 pb-5 text-sm text-gray-600 leading-relaxed">
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </section>

    <WebFooter />
  </div>
</template>

<script setup lang="ts">
const openIndex = ref<number | null>(null);

const toggle = (idx: number) => {
  openIndex.value = openIndex.value === idx ? null : idx;
};

const faqs = [
  {
    question: 'What is a vehicle report?',
    answer: 'A vehicle report is a comprehensive check on a car\'s history. It includes data on outstanding finance, previous accidents, write-offs, stolen status, MOT history, mileage discrepancies, and more — all sourced from official UK databases.'
  },
  {
    question: 'How do I generate a report?',
    answer: 'Simply enter a UK vehicle registration number on our app or website, and we\'ll instantly pull together all available data into a clear, easy-to-read report. Free basic checks are available, and premium reports offer deeper insights.'
  },
  {
    question: 'Where does the data come from?',
    answer: 'Our reports are compiled from trusted UK sources including the DVLA, MOT testing records, insurance write-off databases, finance agreement registries, and police stolen vehicle records. This ensures you get accurate, up-to-date information.'
  },
  {
    question: 'Is my payment secure?',
    answer: 'Absolutely. All payments are processed securely through encrypted payment providers (Google Play, Apple App Store, or Stripe on web). We never store your card details directly — your financial information is always protected.'
  },
  {
    question: 'Can I download or share my report?',
    answer: 'Yes! Premium reports can be downloaded as a full PDF document, which you can save, print, or share with others. This is especially useful when negotiating a purchase or keeping records for your own vehicle.'
  }
];
</script>
