<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4">
    <canvas ref="chartCanvas" class="w-full h-40"></canvas>
  </div>
</template>

<script setup lang="ts">
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface MotRecord {
  date: string;
  result: 'PASS' | 'FAIL';
  advisoryCount?: number;
  failureCount?: number;
}

const props = defineProps<{
  data: MotRecord[];
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const createChart = () => {
  if (!chartCanvas.value || !props.data?.length) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) return;

  // Sort data by date
  const sortedData = [...props.data].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const labels = sortedData.map(d => {
    const date = new Date(d.date);
    return date.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
  });

  const advisories = sortedData.map(d => d.advisoryCount || 0);
  const failures = sortedData.map(d => d.failureCount || 0);

  // Color bars based on pass/fail
  const backgroundColors = sortedData.map(d => 
    d.result === 'PASS' ? '#22c55e' : '#ef4444'
  );

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Advisories',
          data: advisories,
          backgroundColor: '#fbbf24',
          borderRadius: 4
        },
        {
          label: 'Failures',
          data: failures,
          backgroundColor: '#ef4444',
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 12,
            font: { size: 10 }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: { size: 10 }
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            font: { size: 10 },
            stepSize: 1
          }
        }
      }
    }
  });
};

onMounted(() => {
  createChart();
});

watch(() => props.data, () => {
  createChart();
}, { deep: true });

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>
