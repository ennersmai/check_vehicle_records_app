<template>
  <div 
    class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
    @click="handleClick"
  >
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <h3 class="text-lg font-bold text-gray-900">{{ vehicle.vrm }}</h3>
        <p v-if="nickname" class="text-sm text-gray-600">{{ nickname }}</p>
      </div>
      <slot name="actions" />
    </div>

    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-600">Make & Model</span>
        <span class="text-sm font-medium text-gray-900">
          {{ vehicle.make || 'N/A' }} {{ vehicle.model || '' }}
        </span>
      </div>

      <div v-if="vehicle.year" class="flex items-center justify-between">
        <span class="text-sm text-gray-600">Year</span>
        <span class="text-sm font-medium text-gray-900">{{ vehicle.year }}</span>
      </div>

      <div v-if="vehicle.colour" class="flex items-center justify-between">
        <span class="text-sm text-gray-600">Colour</span>
        <span class="text-sm font-medium text-gray-900">{{ vehicle.colour }}</span>
      </div>

      <div v-if="vehicle.fuel_type" class="flex items-center justify-between">
        <span class="text-sm text-gray-600">Fuel Type</span>
        <span class="text-sm font-medium text-gray-900">{{ vehicle.fuel_type }}</span>
      </div>

      <div v-if="vehicle.mot_expiry" class="flex items-center justify-between">
        <span class="text-sm text-gray-600">MOT Expiry</span>
        <StatusBadge 
          :status="motStatus" 
          :label="formatDate(vehicle.mot_expiry)"
        />
      </div>

      <div v-if="vehicle.tax_status" class="flex items-center justify-between">
        <span class="text-sm text-gray-600">Tax Status</span>
        <StatusBadge 
          :status="taxStatus" 
          :label="vehicle.tax_status"
        />
      </div>
    </div>

    <div v-if="showDate && createdAt" class="mt-3 pt-3 border-t border-gray-100">
      <span class="text-xs text-gray-500">{{ formatDate(createdAt) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Vehicle } from '~/types';

interface Props {
  vehicle: Vehicle;
  nickname?: string;
  createdAt?: string;
  showDate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showDate: true
});

const emit = defineEmits<{
  click: [];
}>();

const handleClick = () => {
  emit('click');
};

const motStatus = computed(() => {
  if (!props.vehicle.mot_expiry) return 'info';
  const expiryDate = new Date(props.vehicle.mot_expiry);
  const today = new Date();
  const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) return 'invalid';
  if (daysUntilExpiry < 30) return 'warning';
  return 'valid';
});

const taxStatus = computed(() => {
  if (!props.vehicle.tax_status) return 'info';
  const status = props.vehicle.tax_status.toLowerCase();
  if (status.includes('taxed')) return 'valid';
  if (status.includes('sorn')) return 'info';
  return 'invalid';
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
};
</script>
