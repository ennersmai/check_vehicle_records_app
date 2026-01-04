<template>
  <!-- Fullscreen Image Modal with Pinch-to-Zoom (Landscape) -->
  <div v-if="imageUrl" @click="$emit('close')" class="fixed inset-0 bg-black z-50 overflow-hidden">
    <div 
      ref="imageContainer"
      class="w-full h-full flex items-center justify-center touch-none"
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
