<template>
  <div class="min-h-screen bg-white font-sans">
    <WebNav />

    <!-- Hero Section -->
    <section id="hero" class="bg-gray-50 py-12 md:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <!-- Left: Text + Search -->
          <div>
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-3">
              Check a vehicle's<br />history in seconds
            </h1>
            <p class="text-gray-500 text-lg mb-8">Get an instant report</p>
            <!-- Search Bar -->
            <div class="flex items-stretch max-w-lg mb-2">
              <div class="flex items-center bg-white border border-gray-300 rounded-l-lg px-4 flex-1">
                <svg class="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.25 18.75a1.5 1.5 0 01-1.5-1.5V6.75a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v1.5m-9 0h9m-9 3h4.5m-4.5 3h9"/>
                </svg>
                <input
                  v-model="regNumber"
                  type="text"
                  placeholder="Enter registration number"
                  class="w-full py-3.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent uppercase"
                  @keydown.enter="handleCheck"
                />
              </div>
              <button
                @click="handleCheck"
                :disabled="lookupLoading"
                class="bg-primary hover:bg-primary-link text-white font-bold text-sm tracking-wider px-6 rounded-r-lg transition whitespace-nowrap disabled:opacity-60 flex items-center gap-2"
              >
                <svg v-if="lookupLoading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                {{ lookupLoading ? 'CHECKING...' : 'CHECK NOW' }}
              </button>
            </div>
            <p v-if="lookupError" class="text-red-500 text-xs ml-1 mt-1">{{ lookupError }}</p>
            <p v-else class="text-primary text-xs ml-1">Example: AB12 CDE</p>
          </div>
          <!-- Right: Car image + check badges -->
          <div class="flex flex-col items-center md:items-end">
            <div class="w-[65%]">
            <!-- Hero car image -->
            <div class="w-full mb-6">
              <img src="/car.png" alt="Vehicle" class="w-full h-auto object-contain" />
            </div>
            <!-- Check badges -->
            <div class="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M8 12l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-gray-700">No mileage issues</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M8 12l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-gray-700">Finance outstanding</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M8 12l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-gray-700">MOT valid</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M8 12l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-gray-700">No previous accident</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M8 12l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-gray-700">Not stolen</span>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Is It Important -->
    <section class="py-16 md:py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">Why Is It Important?</h2>
        <p class="text-center text-gray-500 mb-14 max-w-2xl mx-auto">
          The Key to Smarter Vehicle Decisions Get the facts before you buy, sell, or trade.
        </p>
        <!-- 6 icon cards -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          <!-- Avoid Hidden Issues -->
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 mb-3 flex items-center justify-center">
              <img src="/avoid_hidden.webp" alt="Avoid Hidden Issues" class="w-16 h-16 object-contain" />
            </div>
            <p class="text-sm font-medium text-gray-800">Avoid Hidden<br/>Issues</p>
          </div>
          <!-- Verify Ownership History -->
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 mb-3 flex items-center justify-center">
              <img src="/verify_ownership.webp" alt="Verify Ownership History" class="w-16 h-16 object-contain" />
            </div>
            <p class="text-sm font-medium text-gray-800">Verify Ownership<br/>History</p>
          </div>
          <!-- Spot Mileage Fraud -->
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 mb-3 flex items-center justify-center">
              <img src="/spot_mileage_fraud.webp" alt="Spot Mileage Fraud" class="w-16 h-16 object-contain" />
            </div>
            <p class="text-sm font-medium text-gray-800">Spot Mileage<br/>fraud</p>
          </div>
          <!-- Uncover Recalls -->
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 mb-3 flex items-center justify-center">
              <img src="/uncover_recalls.webp" alt="Uncover Recalls" class="w-16 h-16 object-contain" />
            </div>
            <p class="text-sm font-medium text-gray-800">Uncover<br/>Recalls</p>
          </div>
          <!-- Check for Stolen Records -->
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 mb-3 flex items-center justify-center">
              <img src="/stolen_records.webp" alt="Check for Stolen Records" class="w-16 h-16 object-contain" />
            </div>
            <p class="text-sm font-medium text-gray-800">Check for<br/>Stolen Records</p>
          </div>
          <!-- Outstanding Finance -->
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 mb-3 flex items-center justify-center">
              <img src="/outsanding_finance.webp" alt="Outstanding Finance" class="w-16 h-16 object-contain" />
            </div>
            <p class="text-sm font-medium text-gray-800">Outstanding<br/>Finance</p>
          </div>
        </div>
      </div>
    </section>

    <!-- What You'll Get -->
    <section class="py-16 md:py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">What You'll Get?</h2>
        <p class="text-center text-gray-500 mb-2 max-w-2xl mx-auto">Comprehensive Vehicle Details You Can Count On</p>
        <p class="text-center text-gray-500 mb-14 max-w-2xl mx-auto">All the essential details you need for a smarter, safer vehicle decision.</p>
        <!-- Checklist grid -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12 max-w-4xl mx-auto">
          <div v-for="item in whatYouGet" :key="item" class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M8 12l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-gray-700 text-sm">{{ item }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="py-16 md:py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">Why Choose Us?</h2>
        <p class="text-center text-gray-500 mb-2 max-w-2xl mx-auto">Search Vehicle Records with Confidence</p>
        <p class="text-center text-gray-500 mb-14 max-w-2xl mx-auto">Your go-to solution for fast, accurate vehicle history.</p>
        <!-- 6 cards in 2 rows -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <!-- Comprehensive Data -->
          <div class="text-center py-6">
            <div class="w-14 h-14 mx-auto mb-4 flex items-center justify-center">
              <img src="/comprehensive_data.webp" alt="Comprehensive Data" class="w-14 h-14 object-contain" />
            </div>
            <h3 class="text-base font-bold text-gray-900 mb-2">Comprehensive data</h3>
            <p class="text-sm text-gray-500 max-w-xs mx-auto">Get accurate, up-to-date vehicle history reports with all essential details.</p>
          </div>
          <!-- Trusted Source -->
          <div class="text-center py-6">
            <div class="w-14 h-14 mx-auto mb-4 flex items-center justify-center">
              <img src="/trusted_source.webp" alt="Trusted Source" class="w-14 h-14 object-contain" />
            </div>
            <h3 class="text-base font-bold text-gray-900 mb-2">Trusted Source</h3>
            <p class="text-sm text-gray-500 max-w-xs mx-auto">We provide verified and reliable data from credible providers.</p>
          </div>
          <!-- Anytime Access -->
          <div class="text-center py-6">
            <div class="w-14 h-14 mx-auto mb-4 flex items-center justify-center">
              <img src="/anytime_access.webp" alt="Anytime Access" class="w-14 h-14 object-contain" />
            </div>
            <h3 class="text-base font-bold text-gray-900 mb-2">Anytime Access</h3>
            <p class="text-sm text-gray-500 max-w-xs mx-auto">Available 24/7 allowing you to search for vehicle records at your convenience.</p>
          </div>
          <!-- Ease of Use -->
          <div class="text-center py-6">
            <div class="w-14 h-14 mx-auto mb-4 flex items-center justify-center">
              <img src="/ease_of_use.webp" alt="Ease of Use" class="w-14 h-14 object-contain" />
            </div>
            <h3 class="text-base font-bold text-gray-900 mb-2">Ease of Use</h3>
            <p class="text-sm text-gray-500 max-w-xs mx-auto">Our platform is simple and quick to navigate for fast results</p>
          </div>
          <!-- Exceptional Support -->
          <div class="text-center py-6">
            <div class="w-14 h-14 mx-auto mb-4 flex items-center justify-center">
              <img src="/support.webp" alt="Exceptional Support" class="w-14 h-14 object-contain" />
            </div>
            <h3 class="text-base font-bold text-gray-900 mb-2">Exceptional Support</h3>
            <p class="text-sm text-gray-500 max-w-xs mx-auto">Our team is always ready to assist with quick and helpful responses.</p>
          </div>
          <!-- Affordable Pricing -->
          <div class="text-center py-6">
            <div class="w-14 h-14 mx-auto mb-4 flex items-center justify-center">
              <img src="/affordable_pricing.webp" alt="Affordable Pricing" class="w-14 h-14 object-contain" />
            </div>
            <h3 class="text-base font-bold text-gray-900 mb-2">Affordable Pricing</h3>
            <p class="text-sm text-gray-500 max-w-xs mx-auto">Enjoy transparent and competitive pricing with no hidden fees.</p>
          </div>
        </div>
      </div>
    </section>

    <WebFooter />
  </div>
</template>

<script setup lang="ts">
// Landing page - no auth required
definePageMeta({
  layout: false
});

const regNumber = ref('');
const lookupLoading = ref(false);
const lookupError = ref('');
const { lookupVehicle } = useVehicle();

const handleCheck = async () => {
  const vrm = regNumber.value.trim().toUpperCase().replace(/\s/g, '');
  if (!vrm || vrm.length < 2) {
    lookupError.value = 'Please enter a valid registration number';
    return;
  }
  lookupError.value = '';
  lookupLoading.value = true;
  try {
    const result = await lookupVehicle(vrm);
    if (result.success) {
      navigateTo(`/confirm-vehicle/${vrm}`);
    } else {
      switch (result.errorCode) {
        case 'NOT_FOUND':
          lookupError.value = 'No vehicle found with this registration. Please check and try again.';
          break;
        case 'INVALID_VRM':
          lookupError.value = 'Invalid registration format. Please enter a valid UK registration.';
          break;
        default:
          lookupError.value = result.error || 'Unable to retrieve vehicle information. Please try again.';
      }
    }
  } catch {
    lookupError.value = 'Connection error. Please check your internet connection.';
  } finally {
    lookupLoading.value = false;
  }
};

const whatYouGet = [
  'Vehicle Evaluation',
  'Stolen Vehicle Check',
  'Vehicle Recalls',
  'Accident Records',
  'Vehicle Images',
  'Mileage Verification',
  'Ownership History',
  'Mot History',
  'Market Value Estimate',
  'Finance & Tax Status',
  'Vehicle Specifications',
  'And Much More!',
];

</script>
