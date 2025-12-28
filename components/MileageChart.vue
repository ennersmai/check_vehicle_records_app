<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4">
    <canvas ref="chartCanvas" class="w-full h-40"></canvas>
  </div>
</template>

<script setup lang="ts">
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface MileageRecord {
  date: string;
  mileage: number;
}

const props = defineProps<{
  data: MileageRecord[];
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const createChart = () => {
  if (!chartCanvas.value || !props.data?.length) return;

  // Destroy existing chart
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

  const values = sortedData.map(d => d.mileage);

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Mileage',
        data: values,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#10b981'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.parsed.y.toLocaleString()} miles`
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
          beginAtZero: false,
          ticks: {
            font: { size: 10 },
            callback: (value) => `${(Number(value) / 1000).toFixed(0)}k`
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
