<template>
  <!-- Fullscreen Image Modal with Pinch-to-Zoom -->
  <div v-if="imageUrl" class="fixed inset-0 bg-black z-50 overflow-hidden">
    <!-- Close button -->
    <button 
      @click="$emit('close')" 
      class="absolute z-[60] w-10 h-10 flex items-center justify-center bg-white/20 rounded-full text-white" 
      style="top: max(env(safe-area-inset-top, 12px), 12px); right: 16px;"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <div 
      ref="imageContainer"
      class="w-full h-full flex items-center justify-center touch-none"
      @click.self="$emit('close')"
      @touchstart="$emit('touchstart', $event)"
      @touchmove="$emit('touchmove', $event)"
      @touchend="$emit('touchend', $event)"
    >
      <img 
        :src="imageUrl" 
        alt="Vehicle" 
        class="h-screen object-contain transition-transform duration-200"
        :style="{ transform: `rotate(90deg) scale(${scale}) translate(${translateX}px, ${translateY}px)` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  imageUrl: string | null
  scale: number
  translateX: number
  translateY: number
}>()

defineEmits<{
  close: []
  touchstart: [e: TouchEvent]
  touchmove: [e: TouchEvent]
  touchend: [e: TouchEvent]
}>()

const imageContainer = ref<HTMLElement | null>(null)

defineExpose({
  imageContainer
})
</script>
