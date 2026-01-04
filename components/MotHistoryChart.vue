<template>
  <div class="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-4 shadow-sm">
    <canvas ref="chartCanvas" class="w-full h-48"></canvas>
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

  // Filter out entries with invalid dates, then sort by date
  const validData = props.data.filter(d => {
    if (!d.date) return false;
    const date = new Date(d.date);
    return !isNaN(date.getTime());
  });

  if (!validData.length) return;

  const sortedData = [...validData].sort((a, b) => 
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

  // Create pass/fail indicator bars at bottom
  const passFailColors = sortedData.map(d => 
    d.result === 'PASS' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)'
  );

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Advisories',
          data: advisories,
          backgroundColor: 'rgba(251, 191, 36, 0.85)',
          borderColor: 'rgba(251, 191, 36, 1)',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false
        },
        {
          label: 'Failures',
          data: failures,
          backgroundColor: 'rgba(239, 68, 68, 0.85)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 14,
            boxHeight: 14,
            borderRadius: 4,
            useBorderRadius: true,
            font: { size: 11, weight: '500' },
            color: '#4b5563',
            padding: 16
          }
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.9)',
          titleFont: { size: 12, weight: 'bold' },
          bodyFont: { size: 12 },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            title: (items) => {
              const idx = items[0]?.dataIndex;
              if (idx !== undefined) {
                const result = sortedData[idx]?.result;
                return `${items[0]?.label} - ${result === 'PASS' ? '✅ PASSED' : '❌ FAILED'}`;
              }
              return items[0]?.label || '';
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: { size: 11 },
            color: '#6b7280'
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          ticks: {
            font: { size: 11 },
            color: '#6b7280',
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
