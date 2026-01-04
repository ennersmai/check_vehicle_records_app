<template>
  <div class="min-h-screen bg-white pb-20">
    <div class="px-10 py-4">
      <button @click="$router.back()" class="flex items-center text-gray-900 hover:text-gray-700">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center px-10 mt-20">
      <svg class="animate-spin h-12 w-12 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600 text-sm">{{ loadingMessage }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center px-10 mt-12">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h2 class="text-xl font-bold text-gray-900 mb-2">{{ errorTitle }}</h2>
      <p class="text-gray-600 text-center mb-6">{{ error }}</p>
      <PrimaryButton @click="$router.push('/home')" class="w-full max-w-sm">
        TRY ANOTHER VEHICLE
      </PrimaryButton>
    </div>

    <!-- Main Content -->
    <div v-else class="px-10">
      <!-- Fixed Header -->
      <div class="sticky top-0 bg-white z-10 pb-4">
        <h1 class="text-3xl font-bold text-primary text-center mb-1">Vehicle</h1>
        <p class="text-gray-900 text-xl text-center mb-6">Premium Details</p>

        <!-- Category Dropdown -->
        <div class="mb-6">
          <select
            v-model="activeTab"
            class="w-full px-4 py-3 bg-white border-2 border-primary rounded-lg font-medium text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option v-for="tab in tabs" :key="tab.id" :value="tab.id">
              {{ tab.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="pb-6">
        <!-- OVERVIEW Tab -->
        <div v-if="activeTab === 'overview'" class="space-y-6">
          <!-- Vehicle Photo -->
          <div class="bg-gray-200 rounded-lg aspect-video flex items-center justify-center" @click="vehicleData?.photoUrl && openFullscreen(vehicleData.photoUrl)">
            <img v-if="vehicleData?.photoUrl" :src="vehicleData.photoUrl" alt="Vehicle" class="w-full h-full object-cover rounded-lg cursor-pointer" />
            <CarSilhouette v-else-if="vehicleData" :bodyStyle="vehicleData.bodyStyle" class="w-32 h-32 text-gray-400" />
            <svg v-else class="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <!-- Traffic Light Status Indicators - Improved -->
          <div class="grid grid-cols-3 gap-3">
            <div v-for="indicator in statusIndicators" :key="indicator.id" class="flex flex-col items-center">
              <div 
                :class="[
                  'w-14 h-14 rounded-full mb-2 flex items-center justify-center shadow-lg transition-transform hover:scale-105',
                  indicator.status === 'green' ? 'bg-gradient-to-br from-green-400 to-green-600' : '',
                  indicator.status === 'yellow' ? 'bg-gradient-to-br from-yellow-300 to-amber-500' : '',
                  indicator.status === 'red' ? 'bg-gradient-to-br from-red-400 to-red-600' : ''
                ]"
              >
                <svg v-if="indicator.status === 'green'" class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else-if="indicator.status === 'yellow'" class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <svg v-else class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p class="text-xs text-center text-gray-700 leading-tight font-medium">{{ indicator.label }}</p>
            </div>
          </div>
        </div>

        <!-- VEHICLE INFO Tab -->
        <div v-if="activeTab === 'vehicle-info'" class="space-y-4">
          <h3 class="font-bold text-gray-900 text-sm mb-4 uppercase border-b border-gray-900 pb-2">Vehicle Specifications</h3>
          
          <div class="space-y-0">
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Registration</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.registration || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Vin Number</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.vinNumber || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Make</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.make || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Model</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.model || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Colour</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.colour || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Year of Registration</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.yearOfManufacture || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Import/ Export</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.importedExported || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Previous owners</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.previousOwners !== undefined && vehicleData?.previousOwners !== '' ? vehicleData.previousOwners : 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Current owner since</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.lastOwnerSince || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">V5C Certificates</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.v5cCount || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Country of Origin</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.countryOfOrigin || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Fuel type</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.fuelType || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Body style</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.bodyStyle || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Engine size</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.engineCapacity || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Engine Number</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.engineNumber || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Kerb Weight</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.kerbWeight || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3">
              <span class="text-gray-700 text-sm">Scrapped</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.scrapped || 'N/A' }}</span>
            </div>
          </div>
        </div>

        <!-- MOT Tab -->
        <div v-if="activeTab === 'mot'" class="space-y-6">
          <!-- MOT Summary -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <p class="text-2xl font-bold text-gray-900">{{ motSummary.totalTests }}</p>
                <p class="text-xs text-gray-600">Total Tests</p>
              </div>
              <div>
                <p class="text-2xl font-bold text-green-600">{{ motSummary.passedTests }}</p>
                <p class="text-xs text-gray-600">Passed</p>
              </div>
              <div>
                <p class="text-2xl font-bold text-red-600">{{ motSummary.failedTests }}</p>
                <p class="text-xs text-gray-600">Failed</p>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <p class="font-semibold text-gray-900">MOT Expiry: <span class="font-normal">{{ formattedMotExpiry }}</span></p>
          </div>

          <!-- Charts -->
          <div class="grid grid-cols-1 gap-4">
            <div>
              <p class="text-sm font-medium text-gray-700 mb-1">Mileage Over Time</p>
              <p v-if="mileageChartData.length" class="text-xs text-gray-500 mb-2">
                {{ mileageChartData[mileageChartData.length - 1]?.mileage?.toLocaleString() }} to {{ mileageChartData[0]?.mileage?.toLocaleString() }} miles ({{ formatDate(mileageChartData[mileageChartData.length - 1]?.date) }} to {{ formatDate(mileageChartData[0]?.date) }})
              </p>
              <MileageChart v-if="mileageChartData.length" :data="mileageChartData" />
              <div v-else class="bg-gray-100 rounded-lg h-40 flex items-center justify-center">
                <p class="text-gray-500 text-sm">No mileage data available</p>
              </div>
            </div>

            <div>
              <p class="text-sm font-medium text-gray-700 mb-1">MOT History Timeline</p>
              <p class="text-xs text-gray-500 mb-2">{{ motHistory.length }} tests from {{ formatDate(motHistory[0]?.date) }} to {{ formatDate(motHistory[motHistory.length - 1]?.date) }}</p>
              <MotHistoryChart v-if="motChartData.length" :data="motChartData" />
              <div v-else class="bg-gray-100 rounded-lg h-40 flex items-center justify-center">
                <p class="text-gray-500 text-sm">No MOT history available</p>
              </div>
            </div>
          </div>

          <!-- MOT History List with Timeline -->
          <div v-if="motHistory.length" class="mt-6">
            <h3 class="font-bold text-gray-900 text-sm uppercase border-b border-gray-900 pb-2 mb-4">MOT History</h3>
            <div class="relative">
              <!-- Timeline line -->
              <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
              
              <div class="space-y-6">
                <div v-for="(mot, idx) in motHistory" :key="idx" class="relative flex gap-4">
                  <!-- Timeline node -->
                  <div class="relative flex-shrink-0">
                    <div 
                      :class="[
                        'w-8 h-8 rounded-full border-4 border-white flex items-center justify-center z-10',
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
                  
                  <!-- Content card -->
                  <div class="flex-1 border border-gray-200 rounded-lg p-4 bg-white">
                    <div class="flex justify-between items-start mb-2">
                      <div>
                        <p class="font-medium text-gray-900">{{ formatDate(mot.date) }}</p>
                        <p class="text-sm text-gray-600">{{ mot.mileage?.toLocaleString() }} miles</p>
                      </div>
                      <span :class="['px-3 py-1 rounded-full text-xs font-medium', mot.result === 'PASS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                        {{ mot.result }}
                      </span>
                    </div>
                    <div v-if="mot.advisories?.length" class="mt-2">
                      <p class="text-xs text-yellow-700 font-medium mb-1">Advisories:</p>
                      <ul class="text-xs text-gray-600 space-y-1">
                        <li v-for="(adv, i) in mot.advisories" :key="i" class="flex items-start gap-1">
                          <span class="text-yellow-500">•</span>
                          {{ adv }}
                        </li>
                      </ul>
                    </div>
                    <div v-if="mot.failures?.length" class="mt-2">
                      <p class="text-xs text-red-700 font-medium mb-1">Failures:</p>
                      <ul class="text-xs text-gray-600 space-y-1">
                        <li v-for="(fail, i) in mot.failures" :key="i" class="flex items-start gap-1">
                          <span class="text-red-500">•</span>
                          {{ fail }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TECHNICAL Tab -->
        <div v-if="activeTab === 'technical'" class="space-y-6">
          <h3 class="font-bold text-gray-900 text-sm mb-4 uppercase border-b border-gray-900 pb-2">Performance</h3>
          <div class="space-y-0">
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">BHP</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.performance?.bhp || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Torque</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.performance?.torque || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Top Speed</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.performance?.topSpeed || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">0-60 mph</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.performance?.acceleration || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Power (kW)</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.performance?.powerKw || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200" v-if="premiumData?.performance?.powerRpm">
              <span class="text-gray-700 text-sm">Power @ RPM</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.performance?.powerRpm }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200" v-if="premiumData?.performance?.torqueFtLb">
              <span class="text-gray-700 text-sm">Torque (ft-lb)</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.performance?.torqueFtLb }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200" v-if="premiumData?.performance?.torqueRpm">
              <span class="text-gray-700 text-sm">Torque @ RPM</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.performance?.torqueRpm }}</span>
            </div>
            <div class="flex justify-between py-3" v-if="premiumData?.performance?.co2">
              <span class="text-gray-700 text-sm">CO2 Emissions</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.performance?.co2 }}</span>
            </div>
          </div>

          <h3 class="font-bold text-gray-900 text-sm mb-4 uppercase border-b border-gray-900 pb-2 mt-6">Engine</h3>
          <div class="space-y-0">
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Cylinders</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.engine?.cylinders || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Arrangement</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.engine?.arrangement || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Valve Gear</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.engine?.valveGear || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3">
              <span class="text-gray-700 text-sm">Aspiration</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.engine?.aspiration || 'N/A' }}</span>
            </div>
          </div>

          <h3 class="font-bold text-gray-900 text-sm mb-4 uppercase border-b border-gray-900 pb-2 mt-6">Transmission & Drivetrain</h3>
          <div class="space-y-0">
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Type</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.transmission?.type || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Gears</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.transmission?.gears || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200" v-if="premiumData?.transmission?.driveType">
              <span class="text-gray-700 text-sm">Drive Type</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.transmission?.driveType }}</span>
            </div>
            <div class="flex justify-between py-3" v-if="premiumData?.drivingAxle">
              <span class="text-gray-700 text-sm">Driving Axle</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.drivingAxle }}</span>
            </div>
          </div>

          <h3 class="font-bold text-gray-900 text-sm mb-4 uppercase border-b border-gray-900 pb-2 mt-6">Dimensions</h3>
          <div class="space-y-0">
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Length</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.dimensions?.length || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Width</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.dimensions?.width || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Height</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.dimensions?.height || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Wheelbase</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.dimensions?.wheelbase || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Kerb Weight</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.dimensions?.kerbWeight || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200" v-if="premiumData?.dimensions?.grossWeight">
              <span class="text-gray-700 text-sm">Gross Weight</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.dimensions?.grossWeight }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Doors</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.dimensions?.numberOfDoors || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3">
              <span class="text-gray-700 text-sm">Seats</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.dimensions?.numberOfSeats || 'N/A' }}</span>
            </div>
          </div>

          <h3 class="font-bold text-gray-900 text-sm mb-4 uppercase border-b border-gray-900 pb-2 mt-6">Fuel Consumption</h3>
          <div class="space-y-0">
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Urban</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.consumption?.urban || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Extra Urban</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.consumption?.extraUrban || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Combined</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.consumption?.combined || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3">
              <span class="text-gray-700 text-sm">CO2</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.consumption?.co2 || vehicleData?.co2Emissions || 'N/A' }}</span>
            </div>
          </div>
        </div>

        <!-- BUILD SHEET Tab -->
        <div v-if="activeTab === 'build-sheet'" class="space-y-6">
          <!-- Vehicle Images -->
          <div>
            <h3 class="font-semibold text-gray-900 mb-3">Vehicle Images</h3>
            <div v-if="premiumData?.vehicleImages?.length" class="grid grid-cols-2 gap-2">
              <div v-for="(img, idx) in premiumData.vehicleImages" :key="idx" class="bg-gray-200 rounded-lg aspect-video cursor-pointer" @click="openFullscreen(img)">
                <img :src="img" alt="Vehicle" class="w-full h-full object-cover rounded-lg" />
              </div>
            </div>
            <div v-else class="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
              <CarSilhouette v-if="vehicleData" :bodyStyle="vehicleData.bodyStyle" class="w-32 h-32 text-gray-400" />
            </div>
          </div>

          <!-- Build Sheet Data -->
          <h3 class="font-bold text-gray-900 text-sm uppercase border-b border-gray-900 pb-2">Build Sheet</h3>
          <div class="space-y-0">
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">VIN</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.vin || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Euro Status</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.euroStatus || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">CO2 Emissions</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.co2Emissions || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Wheelplan</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.wheelplan || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Road Tax Status</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.taxStatus || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Tax (6 Months)</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.taxSixMonths || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Tax (12 Months)</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.taxTwelveMonths || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Tax Band</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.taxBand || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">V5C Issued</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.dateOfLastV5CIssued || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3">
              <span class="text-gray-700 text-sm">Date of Manufacture</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.dateOfManufacture || 'N/A' }}</span>
            </div>
          </div>

          <!-- Mileage Summary -->
          <div v-if="premiumData?.mileageSummary" class="mt-6">
            <h3 class="font-bold text-gray-900 text-sm uppercase border-b border-gray-900 pb-2">Mileage Analysis</h3>
            <div class="space-y-0">
              <div class="flex justify-between py-3 border-b border-gray-200">
                <span class="text-gray-700 text-sm">Last Recorded</span>
                <span class="font-medium text-gray-900 text-sm">{{ premiumData.mileageSummary.lastRecorded }} miles</span>
              </div>
              <div class="flex justify-between py-3 border-b border-gray-200">
                <span class="text-gray-700 text-sm">Average Mileage</span>
                <span class="font-medium text-gray-900 text-sm">{{ premiumData.mileageSummary.averageMileage }} miles/year</span>
              </div>
              <div class="flex justify-between py-3 border-b border-gray-200">
                <span class="text-gray-700 text-sm">Status</span>
                <span :class="['font-medium text-sm', premiumData.mileageSummary.status === 'LOW' ? 'text-green-600' : premiumData.mileageSummary.status === 'HIGH' ? 'text-red-600' : 'text-yellow-600']">{{ premiumData.mileageSummary.status }}</span>
              </div>
              <div v-if="premiumData.mileageSummary.issues" class="py-3">
                <span class="text-red-600 text-sm">⚠️ {{ premiumData.mileageSummary.issues }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BottomNav />

    <!-- Fullscreen Image Modal with Pinch-to-Zoom (Landscape) -->
    <div v-if="fullscreenImage" @click="closeFullscreen" class="fixed inset-0 bg-black z-50 overflow-hidden">
      <div 
        ref="imageContainer"
        class="w-full h-full flex items-center justify-center touch-none"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <img 
          :src="fullscreenImage" 
          alt="Vehicle" 
          class="h-screen object-contain transition-transform duration-200"
          :style="{ transform: `rotate(90deg) scale(${imageScale}) translate(${imageTranslateX}px, ${imageTranslateY}px)` }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mapPremiumData, calculateTrafficLightStatus } from '~/utils/vehicleDataMapper';

const route = useRoute();
const router = useRouter();
const { getCachedPremiumLookup, getCachedVehicle } = useVehicle();

const vrm = computed(() => route.params.vrm as string);
const vehicleData = ref<any>(null);
const premiumData = ref<any>(null);
const activeTab = ref('overview');
const loading = ref(true);
const loadingMessage = ref('Loading premium report...');
const error = ref('');
const errorTitle = ref('');
const fullscreenImage = ref<string | null>(null);
const imageContainer = ref<HTMLElement | null>(null);
const imageScale = ref(1);
const imageTranslateX = ref(0);
const imageTranslateY = ref(0);

// Touch gesture state
let initialDistance = 0;
let initialScale = 1;
let lastTouchX = 0;
let lastTouchY = 0;
let isDragging = false;

// Fullscreen image functions
const openFullscreen = (imageUrl: string) => {
  fullscreenImage.value = imageUrl;
  imageScale.value = 1;
  imageTranslateX.value = 0;
  imageTranslateY.value = 0;
};

const closeFullscreen = () => {
  fullscreenImage.value = null;
  imageScale.value = 1;
  imageTranslateX.value = 0;
  imageTranslateY.value = 0;
};

// Calculate distance between two touch points
const getDistance = (touch1: Touch, touch2: Touch) => {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

// Touch gesture handlers
const handleTouchStart = (e: TouchEvent) => {
  if (e.touches.length === 2) {
    // Pinch zoom start
    e.preventDefault();
    initialDistance = getDistance(e.touches[0], e.touches[1]);
    initialScale = imageScale.value;
  } else if (e.touches.length === 1 && imageScale.value > 1) {
    // Pan start (only when zoomed in)
    isDragging = true;
    lastTouchX = e.touches[0].clientX;
    lastTouchY = e.touches[0].clientY;
  }
};

const handleTouchMove = (e: TouchEvent) => {
  if (e.touches.length === 2) {
    // Pinch zoom
    e.preventDefault();
    const currentDistance = getDistance(e.touches[0], e.touches[1]);
    const scale = (currentDistance / initialDistance) * initialScale;
    imageScale.value = Math.max(1, Math.min(scale, 4)); // Limit between 1x and 4x
  } else if (e.touches.length === 1 && isDragging && imageScale.value > 1) {
    // Pan (only when zoomed in)
    e.preventDefault();
    const deltaX = e.touches[0].clientX - lastTouchX;
    const deltaY = e.touches[0].clientY - lastTouchY;
    imageTranslateX.value += deltaX / imageScale.value;
    imageTranslateY.value += deltaY / imageScale.value;
    lastTouchX = e.touches[0].clientX;
    lastTouchY = e.touches[0].clientY;
  }
};

const handleTouchEnd = (e: TouchEvent) => {
  if (e.touches.length < 2) {
    initialDistance = 0;
  }
  if (e.touches.length === 0) {
    isDragging = false;
    // Reset position if zoomed out to 1x
    if (imageScale.value === 1) {
      imageTranslateX.value = 0;
      imageTranslateY.value = 0;
    }
  }
};

const tabs = [
  { id: 'overview', label: 'OVERVIEW' },
  { id: 'vehicle-info', label: 'VEHICLE INFO' },
  { id: 'mot', label: 'MOT' },
  { id: 'technical', label: 'TECHNICAL' },
  { id: 'build-sheet', label: 'BUILD SHEET' }
];

// Traffic light status indicators - will be updated from real data
const statusIndicators = computed(() => {
  const hasFinance = premiumData.value?.outstandingFinance?.includes('Finance recorded');
  const hasStolen = premiumData.value?.stolenRecord?.includes('Stolen record');
  const hasWriteOff = premiumData.value?.writtenOffRecord?.includes('Write-off');
  const hasMileageIssues = premiumData.value?.mileageSummary?.mileageIssues === 'Yes';
  const hasValidMot = premiumData.value?.motStatus === 'Valid';
  const isImportedExported = premiumData.value?.importedExported !== 'No';
  
  return [
    { 
      id: 1, 
      label: hasFinance ? 'Outstanding Finance' : 'No Outstanding Finance',
      status: hasFinance ? 'red' : 'green'
    },
    { 
      id: 2, 
      label: hasWriteOff ? 'Previous Accidents Found' : 'No Previous Accidents',
      status: hasWriteOff ? 'yellow' : 'green'
    },
    { 
      id: 3, 
      label: hasStolen ? 'Stolen Record' : 'Not Stolen',
      status: hasStolen ? 'red' : 'green'
    },
    { 
      id: 4, 
      label: hasMileageIssues ? 'Mileage Discrepancy' : 'No Mileage Issues',
      status: hasMileageIssues ? 'yellow' : 'green'
    },
    { 
      id: 5, 
      label: hasValidMot ? 'Valid MOT' : 'MOT Expired',
      status: hasValidMot ? 'green' : 'red'
    },
    { 
      id: 6, 
      label: isImportedExported ? 'Import/Export Record' : 'Not Imported/Exported',
      status: isImportedExported ? 'yellow' : 'green'
    }
  ];
});

// MOT History computed - sorted oldest first
const motHistory = computed(() => {
  const history = premiumData.value?.motHistory || [];
  return [...history].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB; // Ascending order (oldest first)
  });
});
const motSummary = computed(() => premiumData.value?.motSummary || { totalTests: 0, passedTests: 0, failedTests: 0 });

// Formatted MOT expiry date
const formattedMotExpiry = computed(() => {
  const date = vehicleData.value?.motExpiryDate || premiumData.value?.motExpiry;
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleDateString('en-GB');
  } catch {
    return date;
  }
});

// Chart data computed properties
const mileageChartData = computed(() => {
  const mileageData = premiumData.value?.mileageHistory || [];
  return mileageData.map((m: any) => ({
    date: m.date,
    mileage: m.mileage
  }));
});

const motChartData = computed(() => {
  const history = premiumData.value?.motHistory || [];
  return history.map((m: any) => ({
    date: m.date,
    result: m.result,
    passed: m.result === 'PASS' ? 1 : 0,
    advisoryCount: m.advisories?.length || 0,
    failureCount: m.failures?.length || 0
  }));
});

// Helper function to format dates
const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

onMounted(async () => {
  if (!vrm.value) {
    router.push('/home');
    return;
  }

  try {
    loadingMessage.value = 'Loading vehicle data...';
    
    // Get basic vehicle data
    const basicData = await getCachedVehicle(vrm.value);
    if (basicData) {
      vehicleData.value = basicData;
    }

    loadingMessage.value = 'Loading premium report...';
    
    // Get premium data
    const premium = await getCachedPremiumLookup(vrm.value);
    
    if (premium) {
      // Map the premium data
      const mapped = mapPremiumData(
        basicData,
        premium.history_data,
        premium.mot_data,
        premium.mileage_data,
        premium.image_data,
        premium.specs_data
      );
      
      premiumData.value = mapped;
      vehicleData.value = { ...vehicleData.value, ...mapped };
      
      // Update traffic light indicators from real data
      statusIndicators.value = calculateTrafficLightStatus(mapped);
    } else {
      errorTitle.value = 'Premium Data Not Found';
      error.value = 'No premium report found for this vehicle. Please purchase a premium check first.';
    }
  } catch (err: any) {
    errorTitle.value = 'Error Loading Report';
    error.value = err.message || 'Failed to load premium report.';
  } finally {
    loading.value = false;
  }
});
</script>
