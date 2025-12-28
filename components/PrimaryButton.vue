<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="w-full px-6 py-3 text-base font-semibold text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed active:opacity-90"
    :class="[
      variant === 'primary' ? 'bg-primary' : 'bg-gray-600',
      sizeClass
    ]"
    @click="handleClick"
  >
    <span v-if="loading" class="flex items-center justify-center">
      <svg class="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Loading...
    </span>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  disabled: false,
  loading: false,
  variant: 'primary',
  size: 'md'
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'py-2 text-sm';
    case 'lg': return 'py-4 text-lg';
    default: return 'py-3 text-base';
  }
});

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>
