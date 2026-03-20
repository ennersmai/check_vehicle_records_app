<template>
  <div v-if="imageUrl" class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" @click.self="$emit('close')">
    <!-- Close button -->
    <button
      @click="$emit('close')"
      class="absolute top-4 right-4 z-[60] w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white transition"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Zoom controls -->
    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 bg-black/50 rounded-full px-4 py-2">
      <button @click="zoomOut" class="text-white hover:text-gray-300 transition" title="Zoom out">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
        </svg>
      </button>
      <span class="text-white text-sm min-w-[3rem] text-center">{{ Math.round(scale * 100) }}%</span>
      <button @click="zoomIn" class="text-white hover:text-gray-300 transition" title="Zoom in">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <button @click="resetZoom" class="text-white hover:text-gray-300 transition text-xs ml-1" title="Reset zoom">Reset</button>
    </div>

    <!-- Image container -->
    <div
      class="max-w-[90vw] max-h-[85vh] overflow-hidden cursor-grab active:cursor-grabbing"
      @wheel.prevent="handleWheel"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="endDrag"
      @mouseleave="endDrag"
    >
      <img
        :src="imageUrl"
        alt="Vehicle"
        class="max-w-full max-h-[85vh] object-contain select-none transition-transform duration-100"
        :style="{ transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)` }"
        draggable="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  imageUrl: string | null
}>();

const emit = defineEmits<{
  close: []
}>();

const scale = ref(1);
const translateX = ref(0);
const translateY = ref(0);
let dragging = false;
let lastX = 0;
let lastY = 0;

const zoomIn = () => {
  scale.value = Math.min(scale.value + 0.25, 4);
};

const zoomOut = () => {
  scale.value = Math.max(scale.value - 0.25, 0.5);
  if (scale.value <= 1) {
    translateX.value = 0;
    translateY.value = 0;
  }
};

const resetZoom = () => {
  scale.value = 1;
  translateX.value = 0;
  translateY.value = 0;
};

const handleWheel = (e: WheelEvent) => {
  const delta = e.deltaY > 0 ? -0.15 : 0.15;
  scale.value = Math.max(0.5, Math.min(scale.value + delta, 4));
  if (scale.value <= 1) {
    translateX.value = 0;
    translateY.value = 0;
  }
};

const startDrag = (e: MouseEvent) => {
  if (scale.value > 1) {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  }
};

const onDrag = (e: MouseEvent) => {
  if (!dragging) return;
  translateX.value += (e.clientX - lastX) / scale.value;
  translateY.value += (e.clientY - lastY) / scale.value;
  lastX = e.clientX;
  lastY = e.clientY;
};

const endDrag = () => {
  dragging = false;
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close');
};

watch(() => props.imageUrl, (val) => {
  if (val) {
    resetZoom();
    document.addEventListener('keydown', handleKeydown);
  } else {
    document.removeEventListener('keydown', handleKeydown);
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>
