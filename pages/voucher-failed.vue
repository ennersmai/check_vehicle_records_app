<template>
  <div class="min-h-screen bg-white flex flex-col" :class="{ 'pb-36': !isWeb }">
    <WebNav v-if="isWeb" />
    <div v-else class="px-6 pt-8 py-4">
      <button @click="$router.back()" class="flex items-center text-gray-900 hover:text-gray-700">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
    </div>

    <div class="flex-1 flex flex-col items-center justify-center px-10">
      <div class="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-6">
        <svg class="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <h1 class="text-3xl font-bold text-red-600 mb-2">Invalid Voucher</h1>
      <p class="text-gray-600 text-center mb-8">{{ errorMessage }}</p>

      <div class="w-full max-w-sm space-y-4">
        <PrimaryButton @click="tryAgain" class="w-full">
          TRY AGAIN
        </PrimaryButton>

        <button 
          @click="$router.push('/purchase-premium')"
          class="w-full text-primary font-medium py-3"
        >
          Purchase premium checks
        </button>
      </div>
    </div>

    <BottomNav v-if="!isWeb" />
    <WebFooter v-if="isWeb" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const isWeb = ref(false);
onMounted(() => { isWeb.value = !(window as any).Capacitor?.isNativePlatform?.(); });

const errorMessage = computed(() => {
  const err = route.query.error as string;
  if (err) {
    return decodeURIComponent(err);
  }
  return 'The voucher code you entered\nis not valid or has expired.';
});

const vrm = computed(() => route.query.vrm as string);

const tryAgain = () => {
  if (vrm.value) {
    router.push(`/redeem-voucher?vrm=${vrm.value}`);
  } else {
    router.push(isWeb.value ? '/landing' : '/home');
  }
};
</script>
