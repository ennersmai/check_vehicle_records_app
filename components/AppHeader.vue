<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
    <div class="flex items-center justify-between h-14 px-4">
      <button 
        v-if="showBack"
        @click="handleBack"
        class="p-2 -ml-2 text-gray-700 hover:text-gray-900"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div v-else class="w-10"></div>
      
      <h1 class="text-lg font-semibold text-gray-900">{{ title }}</h1>
      
      <div class="w-10"></div>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  showBack?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showBack: true
});

const router = useRouter();

const handleBack = () => {
  router.back();
};
</script>
