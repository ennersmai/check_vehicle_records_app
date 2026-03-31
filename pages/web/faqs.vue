<template>
  <div class="min-h-screen bg-white font-sans">
    <WebNav />

    <section class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h1>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-16">
        <svg class="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
      </div>

      <!-- FAQs -->
      <div v-else class="space-y-3">
        <div
          v-for="(faq, idx) in faqs"
          :key="faq.id"
          class="bg-gray-50 rounded-lg overflow-hidden"
        >
          <button
            @click="toggle(idx)"
            class="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-100 transition cursor-pointer"
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
            <div v-html="faq.answer"></div>
          </div>
        </div>
      </div>

      <!-- Contact CTA -->
      <div class="mt-12 text-center">
        <p class="text-gray-500 mb-4">Still have questions?</p>
        <NuxtLink to="/support" class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition">
          Contact Support
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>
    </section>

    <WebFooter />
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();

const openIndex = ref<number | null>(null);
const loading = ref(true);
const faqs = ref<any[]>([]);

const toggle = (idx: number) => {
  openIndex.value = openIndex.value === idx ? null : idx;
};

onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true });

    if (!error && data) {
      faqs.value = data;
    } else {
      // Fallback to default FAQs if no data
      faqs.value = getDefaultFAQs();
    }
  } catch (err) {
    console.error('Failed to load FAQs:', err);
    faqs.value = getDefaultFAQs();
  } finally {
    loading.value = false;
  }
});

const getDefaultFAQs = () => [
  {
    id: '1',
    question: 'What is a vehicle report?',
    answer: 'A vehicle report is a comprehensive check on a car\'s history. It includes data on outstanding finance, previous accidents, write-offs, stolen status, MOT history, mileage discrepancies, and more — all sourced from official UK databases.'
  },
  {
    id: '2',
    question: 'How do I generate a report?',
    answer: 'Simply enter a UK vehicle registration number on our app or website, and we\'ll instantly pull together all available data into a clear, easy-to-read report. Free basic checks are available, and premium reports offer deeper insights.'
  },
  {
    id: '3',
    question: 'Where does the data come from?',
    answer: 'Our reports are compiled from trusted UK sources including the DVLA, MOT testing records, insurance write-off databases, finance agreement registries, and police stolen vehicle records. This ensures you get accurate, up-to-date information.'
  },
  {
    id: '4',
    question: 'Is my payment secure?',
    answer: 'Absolutely. All payments are processed securely through encrypted payment providers (Google Play, Apple App Store, or Stripe on web). We never store your card details directly — your financial information is always protected.'
  },
  {
    id: '5',
    question: 'Can I download or share my report?',
    answer: 'Yes! Premium reports can be downloaded as a full PDF document, which you can save, print, or share with others. This is especially useful when negotiating a purchase or keeping records for your own vehicle.'
  }
];

useHead({
  title: 'FAQs - Check Vehicle Records UK',
  meta: [
    { name: 'description', content: 'Frequently asked questions about vehicle history checks, MOT records, and our services.' }
  ]
});
</script>
