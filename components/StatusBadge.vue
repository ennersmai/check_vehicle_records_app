<template>
  <span 
    class="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full"
    :class="badgeClass"
  >
    <span 
      class="w-2 h-2 mr-2 rounded-full"
      :class="dotClass"
    ></span>
    {{ label }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  status: 'valid' | 'invalid' | 'expired' | 'warning' | 'info';
  label: string;
}

const props = defineProps<Props>();

const badgeClass = computed(() => {
  switch (props.status) {
    case 'valid':
      return 'bg-green-100 text-green-800';
    case 'invalid':
      return 'bg-red-100 text-red-800';
    case 'expired':
      return 'bg-orange-100 text-orange-800';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800';
    case 'info':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
});

const dotClass = computed(() => {
  switch (props.status) {
    case 'valid':
      return 'bg-green-500';
    case 'invalid':
      return 'bg-red-500';
    case 'expired':
      return 'bg-orange-500';
    case 'warning':
      return 'bg-yellow-500';
    case 'info':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
});
</script>
