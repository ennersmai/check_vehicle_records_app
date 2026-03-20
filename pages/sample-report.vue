<template>
  <div class="min-h-screen bg-white font-sans">
    <WebNav />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Vehicle Photo Placeholder -->
      <div class="bg-gray-200 rounded-xl aspect-video flex items-center justify-center mb-6 overflow-hidden">
        <CarSilhouette bodyStyle="hatchback" class="w-40 h-40 text-gray-400" />
      </div>

      <!-- Registration Plate -->
      <div class="bg-primary text-white text-center py-3 rounded-lg mb-6">
        <span class="text-xl font-bold tracking-widest">AA11 AAA</span>
      </div>

      <!-- Traffic Light Indicators -->
      <div class="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-10">
        <div v-for="indicator in statusIndicators" :key="indicator.id" class="flex flex-col items-center text-center">
          <div
            :class="[
              'w-12 h-12 rounded-full mb-2 flex items-center justify-center shadow-lg',
              indicator.status === 'green' ? 'bg-gradient-to-br from-green-400 to-green-600' : '',
              indicator.status === 'yellow' ? 'bg-gradient-to-br from-yellow-300 to-amber-500' : '',
              indicator.status === 'red' ? 'bg-gradient-to-br from-red-400 to-red-600' : ''
            ]"
          >
            <svg v-if="indicator.status === 'green'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else-if="indicator.status === 'yellow'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <svg v-else class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p class="text-xs text-gray-700 leading-tight font-medium">{{ indicator.label }}</p>
        </div>
      </div>

      <!-- Vehicle Information & Specification Details -->
      <h2 class="text-2xl font-bold text-gray-900 text-center mb-8">Vehicle Information &amp; Specification Details</h2>
      <div class="grid md:grid-cols-2 gap-x-8 gap-y-0 mb-12">
        <div v-for="item in vehicleInfoItems" :key="item.label" class="flex justify-between py-3 border-b border-gray-200">
          <span class="text-gray-600 text-sm">{{ item.label }}</span>
          <span class="font-medium text-gray-900 text-sm">{{ item.value }}</span>
        </div>
      </div>

      <!-- Ownership & Insurance -->
      <h2 class="text-2xl font-bold text-gray-900 text-center mb-8">Ownership &amp; Insurance</h2>
      <div class="grid md:grid-cols-2 gap-x-8 gap-y-0 mb-12">
        <div v-for="item in ownershipItems" :key="item.label" class="flex justify-between py-3 border-b border-gray-200">
          <span class="text-gray-600 text-sm">{{ item.label }}</span>
          <span class="font-medium text-gray-900 text-sm">{{ item.value }}</span>
        </div>
      </div>

      <!-- Mot Section -->
      <h2 class="text-2xl font-bold text-gray-900 text-center mb-8">Mot</h2>

      <!-- MOT Status Banner -->
      <div class="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 mb-8">
        <div class="bg-green-500 rounded-full p-1">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-semibold text-green-800">MOT Expiry: on or about</p>
          <p class="text-sm text-green-700">{{ sampleData.motExpiryDate }}</p>
        </div>
      </div>

      <!-- Mileage Chart Placeholder -->
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-sm font-medium text-gray-700 mb-3">Mileage graph over the years</p>
          <div class="h-40 flex items-end justify-between gap-1 px-2">
            <div v-for="(val, i) in mileageBars" :key="i" class="flex-1 bg-primary rounded-t" :style="{ height: val + '%' }"></div>
          </div>
          <div class="flex justify-between text-xs text-gray-400 mt-1 px-2">
            <span>2015</span><span>2017</span><span>2019</span><span>2021</span><span>2023</span>
          </div>
        </div>
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-sm font-medium text-gray-700 mb-3">MOT outcome over the years</p>
          <div class="h-40 flex items-end justify-between gap-1 px-2">
            <div v-for="(item, i) in motOutcomeBars" :key="i" class="flex-1 rounded-t" :class="item.pass ? 'bg-green-500' : 'bg-red-500'" :style="{ height: item.height + '%' }"></div>
          </div>
          <div class="flex justify-between text-xs text-gray-400 mt-1 px-2">
            <span>2015</span><span>2017</span><span>2019</span><span>2021</span><span>2023</span>
          </div>
        </div>
      </div>

      <!-- MOT History Timeline -->
      <div class="mb-12">
        <div class="relative">
          <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
          <div class="space-y-5">
            <div v-for="(mot, idx) in motHistoryList" :key="idx" class="relative flex gap-4">
              <div class="relative flex-shrink-0">
                <div
                  :class="[
                    'w-8 h-8 rounded-full border-4 border-white flex items-center justify-center z-10 shadow',
                    mot.result === 'PASS' ? 'bg-green-500' : 'bg-red-500'
                  ]"
                >
                  <svg v-if="mot.result === 'PASS'" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <div class="flex-1 border border-gray-200 rounded-lg p-4 bg-white">
                <div class="flex justify-between items-start mb-1">
                  <div>
                    <p class="font-medium text-gray-900 text-sm">{{ mot.date }}</p>
                    <p class="text-xs text-gray-500">{{ mot.mileage }}</p>
                  </div>
                  <span :class="['px-3 py-1 rounded-full text-xs font-medium', mot.result === 'PASS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                    {{ mot.result }}
                  </span>
                </div>
                <div v-if="mot.advisories?.length" class="mt-2">
                  <p class="text-xs text-yellow-700 font-medium mb-1">Advisories:</p>
                  <ul class="text-xs text-gray-600 space-y-0.5">
                    <li v-for="(adv, i) in mot.advisories" :key="i" class="flex items-start gap-1">
                      <span class="text-yellow-500">•</span> {{ adv }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Technical -->
      <h2 class="text-2xl font-bold text-gray-900 text-center mb-8">Technical</h2>
      <div class="grid md:grid-cols-2 gap-x-8 gap-y-0 mb-12">
        <div v-for="item in technicalItems" :key="item.label" class="flex justify-between py-3 border-b border-gray-200">
          <span class="text-gray-600 text-sm">{{ item.label }}</span>
          <span class="font-medium text-gray-900 text-sm">{{ item.value }}</span>
        </div>
      </div>

      <!-- Build Sheet -->
      <h2 class="text-2xl font-bold text-gray-900 text-center mb-8">Build Sheet</h2>
      <div class="grid md:grid-cols-2 gap-x-8 gap-y-0 mb-14">
        <div v-for="item in buildSheetItems" :key="item.label" class="flex justify-between py-3 border-b border-gray-200">
          <span class="text-gray-600 text-sm">{{ item.label }}</span>
          <span class="font-medium text-gray-900 text-sm">{{ item.value }}</span>
        </div>
      </div>

      <!-- Download PDF Button -->
      <div class="flex justify-center mb-10">
        <button
          @click="downloadPdf"
          class="bg-primary hover:bg-primary-link text-white font-bold text-sm tracking-wider px-10 py-4 rounded transition flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          DOWNLOAD FULL PDF REPORT
        </button>
      </div>
    </div>

    <WebFooter />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
});

// ── Hard-coded sample data matching AA11AAA from the JSON files ──
// This is the exact data the mapPremiumData() function would produce
// from vehicle_lookups_rows_AA11AAA.json + premium_lookups_rows_AA11AAA.json

const sampleData = {
  vrm: 'AA11 AAA',
  make: 'MINI',
  model: 'Cooper D',
  colour: 'SILVER',
  yearOfManufacture: 2011,
  fuelType: 'DIESEL',
  bodyStyle: 'Hatchback',
  engineCapacity: '1598cc',
  engineNumber: '71327569',
  vin: 'WMWSW32000T120611',
  co2Emissions: '99 g/km',
  euroStatus: '5a',
  wheelplan: '2 AXLE RIGID BODY',
  kerbWeight: '1090 kg',
  doorPlan: '3 DOOR HATCHBACK',
  transmission: 'MANUAL 6 GEARS',
  seatingCapacity: 4,

  // Registration & ownership
  registrationDate: '22/03/2011',
  dateOfManufacture: '22/03/2011',
  countryOfOrigin: 'UNITED KINGDOM',
  vehicleAge: `${new Date().getFullYear() - 2011} years`,
  dateOfLastV5CIssued: '07/03/2014',
  previousOwners: '0',
  lastOwnerSince: '07/03/2014',
  v5cCount: '2',
  scrapped: 'No',
  importedExported: 'No',

  // History checks
  outstandingFinance: 'No records found',
  stolenRecord: 'No records found',
  writtenOffRecord: 'No records found',

  // MOT
  motStatus: 'Valid',
  motExpiryDate: '22/03/2026',

  // Tax
  taxStatus: 'Taxed',
  taxDueDate: '01/03/2026',
  taxSixMonths: 'N/A',
  taxTwelveMonths: '£20.00',
  taxBand: 'A',

  // Performance
  bhp: '112 BHP',
  powerKw: '82 kW',
  torque: '270 Nm',
  torqueFtLb: '199 ft-lb',
  topSpeed: '122 mph',
  acceleration: '9.7s (0-60)',

  // Dimensions
  length: '3723 mm',
  width: '1683 mm',
  height: '1407 mm',
  wheelbase: '2467 mm',
  grossWeight: '1540 kg',
  fuelTankCapacity: '40L',

  // Engine
  cylinders: '4',
  arrangement: 'I',
  valveGear: 'DOHC',
  aspiration: 'Turbocharged',
  engineDescription: 'N47C16U1-B',
  drivingAxle: 'FWD',
  driveType: '4x2',

  // Consumption
  urbanMpg: '67.3 mpg',
  extraUrbanMpg: '80.7 mpg',
  combinedMpg: '74.3 mpg',

  // SMMT
  marque: 'Mini',
  series: 'R56',
  range: 'Hatch',
};

// Traffic light indicators (matches mobile calculateTrafficLightStatus logic)
const statusIndicators = [
  { id: 1, label: 'No Outstanding\nFinance', status: 'green' },
  { id: 2, label: 'No Previous\nAccidents', status: 'green' },
  { id: 3, label: 'Not Stolen', status: 'green' },
  { id: 4, label: 'No Mileage\nDiscrepancy', status: 'green' },
  { id: 5, label: 'Valid MOT', status: 'green' },
  { id: 6, label: 'Not Imported', status: 'green' },
];

// Vehicle Info & Spec grid (matching mobile vehicle-info tab layout)
const vehicleInfoItems = [
  { label: 'Registration', value: sampleData.vrm },
  { label: 'Import / Export', value: sampleData.importedExported },
  { label: 'Vin Number', value: sampleData.vin },
  { label: 'Previous owners', value: sampleData.previousOwners },
  { label: 'Make', value: sampleData.make },
  { label: 'Current owner since', value: sampleData.lastOwnerSince },
  { label: 'Model', value: sampleData.model },
  { label: 'Fuel type', value: sampleData.fuelType },
  { label: 'Colour', value: sampleData.colour },
  { label: 'Body style', value: sampleData.bodyStyle },
  { label: 'Year of Registration', value: String(sampleData.yearOfManufacture) },
  { label: 'Engine size', value: sampleData.engineCapacity },
];

// Ownership & Insurance grid (matching mobile ownership/registration tab)
const ownershipItems = [
  { label: 'Registration date', value: sampleData.registrationDate },
  { label: 'Road Tax', value: sampleData.taxStatus },
  { label: 'Date of last V5C', value: sampleData.dateOfLastV5CIssued },
  { label: 'Tax Band', value: sampleData.taxBand },
  { label: 'Vehicle Age', value: sampleData.vehicleAge },
  { label: 'Insurance', value: 'Group TBC' },
  { label: 'Last MOT Mileage', value: 'N/A' },
  { label: 'Insurance Group', value: 'TBC' },
  { label: 'Last MOT information', value: sampleData.motStatus },
  { label: 'Imported/Exported', value: sampleData.importedExported },
];

// Simulated MOT history for sample
const motHistoryList = [
  { date: '15 Mar 2024', mileage: '68,421 miles', result: 'PASS', advisories: ['Nearside front tyre worn close to legal limit', 'Offside rear brake disc worn'] },
  { date: '10 Mar 2023', mileage: '61,203 miles', result: 'PASS', advisories: ['Brake fluid dirty'] },
  { date: '08 Mar 2022', mileage: '54,118 miles', result: 'PASS', advisories: [] },
  { date: '12 Mar 2021', mileage: '47,882 miles', result: 'PASS', advisories: ['Nearside front anti-roll bar linkage ball joint has slight play'] },
  { date: '09 Mar 2020', mileage: '42,530 miles', result: 'FAIL', advisories: ['Offside headlamp aim too high'] },
  { date: '05 Mar 2019', mileage: '35,660 miles', result: 'PASS', advisories: [] },
  { date: '01 Mar 2018', mileage: '28,450 miles', result: 'PASS', advisories: ['Nearside rear tyre worn close to legal limit'] },
  { date: '28 Feb 2017', mileage: '21,300 miles', result: 'PASS', advisories: [] },
  { date: '25 Feb 2016', mileage: '14,210 miles', result: 'PASS', advisories: [] },
  { date: '20 Feb 2015', mileage: '7,120 miles', result: 'PASS', advisories: [] },
];

// Simulated bar chart data
const mileageBars = [10, 20, 30, 42, 50, 58, 68, 77, 88, 100];
const motOutcomeBars = [
  { pass: true, height: 90 },
  { pass: true, height: 85 },
  { pass: true, height: 90 },
  { pass: true, height: 80 },
  { pass: true, height: 90 },
  { pass: false, height: 50 },
  { pass: true, height: 85 },
  { pass: true, height: 90 },
  { pass: true, height: 95 },
  { pass: true, height: 90 },
];

// Technical section (matching mobile technical tab)
const technicalItems = [
  { label: 'BHP', value: sampleData.bhp },
  { label: 'Power (kW)', value: sampleData.powerKw },
  { label: 'Torque', value: sampleData.torque },
  { label: 'Torque (ft-lb)', value: sampleData.torqueFtLb },
  { label: 'Top Speed', value: sampleData.topSpeed },
  { label: '0-60 mph', value: sampleData.acceleration },
  { label: 'CO2 Emissions', value: sampleData.co2Emissions },
  { label: 'Euro Status', value: sampleData.euroStatus },
  { label: 'Cylinders', value: sampleData.cylinders },
  { label: 'Arrangement', value: sampleData.arrangement },
  { label: 'Valve Gear', value: sampleData.valveGear },
  { label: 'Aspiration', value: sampleData.aspiration },
  { label: 'Transmission', value: sampleData.transmission },
  { label: 'Drive Type', value: sampleData.driveType },
  { label: 'Driving Axle', value: sampleData.drivingAxle },
  { label: 'Urban', value: sampleData.urbanMpg },
  { label: 'Extra Urban', value: sampleData.extraUrbanMpg },
  { label: 'Combined', value: sampleData.combinedMpg },
];

// Build Sheet (matching mobile dimensions + extra build details)
const buildSheetItems = [
  { label: 'VIN', value: sampleData.vin },
  { label: 'Marque', value: sampleData.marque },
  { label: 'Engine Number', value: sampleData.engineNumber },
  { label: 'Series', value: sampleData.series },
  { label: 'Engine Description', value: sampleData.engineDescription },
  { label: 'Range', value: sampleData.range },
  { label: 'Length', value: sampleData.length },
  { label: 'Effective', value: sampleData.registrationDate },
  { label: 'Width', value: sampleData.width },
  { label: 'Wheelplan', value: sampleData.wheelplan },
  { label: 'Height', value: sampleData.height },
  { label: 'Wheelbase', value: sampleData.wheelbase },
  { label: 'Kerb Weight', value: sampleData.kerbWeight },
  { label: 'Max Speed (kph)', value: '197' },
  { label: 'Gross Weight', value: sampleData.grossWeight },
  { label: 'Max Speed (mph)', value: '122' },
  { label: 'Fuel Tank', value: sampleData.fuelTankCapacity },
  { label: 'Door Plan', value: sampleData.doorPlan },
  { label: 'Seats', value: String(sampleData.seatingCapacity) },
  { label: 'Country of Origin', value: sampleData.countryOfOrigin },
];

// ── PDF Generation ──
const downloadPdf = () => {
  // Build a printable HTML document and trigger browser print-to-PDF
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to download the PDF report.');
    return;
  }

  const tableRow = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;color:#555;font-size:13px">${label}</td><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;font-weight:600;text-align:right;font-size:13px">${value}</td></tr>`;

  const sectionTitle = (title: string) =>
    `<h2 style="font-size:18px;font-weight:700;color:#1a1a1a;text-align:center;margin:28px 0 14px;padding-bottom:8px;border-bottom:2px solid #007ea7">${title}</h2>`;

  const indicatorDot = (status: string, label: string) => {
    const color = status === 'green' ? '#22c55e' : status === 'yellow' ? '#eab308' : '#ef4444';
    const icon = status === 'green' ? '✓' : status === 'yellow' ? '!' : '✗';
    return `<div style="text-align:center;flex:1"><div style="width:36px;height:36px;border-radius:50%;background:${color};color:#fff;display:inline-flex;align-items:center;justify-content:center;font-weight:bold;font-size:16px;margin-bottom:4px">${icon}</div><div style="font-size:10px;color:#555">${label.replace('\n', '<br/>')}</div></div>`;
  };

  const motRow = (mot: any) => {
    const color = mot.result === 'PASS' ? '#22c55e' : '#ef4444';
    const advisories = mot.advisories?.length
      ? `<div style="margin-top:4px;font-size:11px;color:#666">${mot.advisories.map((a: string) => `• ${a}`).join('<br/>')}</div>`
      : '';
    return `<div style="display:flex;gap:12px;margin-bottom:12px">
      <div style="width:24px;height:24px;border-radius:50%;background:${color};flex-shrink:0;margin-top:2px"></div>
      <div style="flex:1;border:1px solid #e5e7eb;border-radius:8px;padding:10px">
        <div style="display:flex;justify-content:space-between"><div><strong style="font-size:13px">${mot.date}</strong><br/><span style="font-size:11px;color:#888">${mot.mileage}</span></div><span style="background:${mot.result === 'PASS' ? '#dcfce7' : '#fee2e2'};color:${mot.result === 'PASS' ? '#166534' : '#991b1b'};padding:2px 10px;border-radius:12px;font-size:11px;font-weight:600;height:fit-content">${mot.result}</span></div>
        ${advisories}
      </div>
    </div>`;
  };

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>CVR Report - ${sampleData.vrm}</title>
<style>@page{size:A4;margin:15mm}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1a1a1a;margin:0;padding:20px}table{width:100%;border-collapse:collapse}@media print{.no-print{display:none}}</style>
</head><body>
<div style="text-align:center;margin-bottom:20px">
  <h1 style="font-size:22px;color:#007ea7;margin:0">Check Vehicle Records</h1>
  <p style="color:#888;font-size:12px;margin:4px 0 12px">Premium Vehicle Report</p>
  <div style="background:#007ea7;color:#fff;padding:10px;border-radius:8px;font-size:18px;font-weight:700;letter-spacing:2px;display:inline-block">${sampleData.vrm}</div>
</div>

<div style="display:flex;gap:8px;justify-content:center;margin:20px 0">${statusIndicators.map(s => indicatorDot(s.status, s.label)).join('')}</div>

${sectionTitle('Vehicle Information & Specification Details')}
<table>${vehicleInfoItems.map(i => tableRow(i.label, i.value)).join('')}</table>

${sectionTitle('Ownership & Insurance')}
<table>${ownershipItems.map(i => tableRow(i.label, i.value)).join('')}</table>

${sectionTitle('MOT History')}
<div style="margin-bottom:8px"><strong style="color:#22c55e">MOT Status: Valid</strong> — Expiry: ${sampleData.motExpiryDate}</div>
${motHistoryList.map(m => motRow(m)).join('')}

${sectionTitle('Technical')}
<table>${technicalItems.map(i => tableRow(i.label, i.value)).join('')}</table>

${sectionTitle('Build Sheet')}
<table>${buildSheetItems.map(i => tableRow(i.label, i.value)).join('')}</table>

<div style="text-align:center;margin-top:30px;font-size:11px;color:#aaa">
  <p>Report generated by Check Vehicle Records — www.checkvehiclerecords.co.uk</p>
  <p>Generated on ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
</div>
</body></html>`;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };
};
</script>
