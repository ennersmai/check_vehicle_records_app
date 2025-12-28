/**
 * Vehicle Data Mapper
 * Normalizes data from DVLA and CheckCarDetails APIs into a consistent format
 */

export interface NormalizedVehicleData {
  // Basic Info
  registrationNumber: string
  make: string
  model: string
  colour: string
  yearOfManufacture: number | string
  fuelType: string
  bodyStyle: string
  engineCapacity: string
  
  // Technical
  bhp: string
  torque: string
  co2Emissions: string
  euroStatus: string
  wheelplan: string
  
  // Registration
  registrationDate: string
  placeOfFirstRegistration: string
  vehicleAge: string
  dateOfLastV5CIssued: string
  
  // MOT
  motStatus: string
  motExpiryDate: string
  motMileage: string
  motInformation: string
  
  // Tax
  taxStatus: string
  taxDueDate: string
  taxSixMonths: string
  taxTwelveMonths: string
  
  // Premium fields
  vin: string
  previousOwners: string
  lastOwnerSince: string
  outstandingFinance: string
  stolenRecord: string
  writtenOffRecord: string
  importedExported: string
  insurance: string
  insuranceGroup: string
}

export interface NormalizedPremiumData extends NormalizedVehicleData {
  // History
  financeRecords: any[]
  stolenRecords: any[]
  writeOffRecords: any[]
  keeperChanges: any[]
  plateChanges: any[]
  
  // MOT History
  motHistory: any[]
  motSummary: {
    totalTests: number
    passedTests: number
    failedTests: number
  }
  
  // Mileage
  mileageHistory: any[]
  mileageSummary: {
    lastRecorded: string
    averageMileage: number
    status: string
    issues: string
  }
  
  // Images
  vehicleImages: string[]
  
  // Specs
  performance: {
    bhp: string
    torque: string
    topSpeed: string
    acceleration: string
  }
  dimensions: {
    length: string
    width: string
    height: string
    wheelbase: string
    kerbWeight: string
  }
  consumption: {
    urban: string
    extraUrban: string
    combined: string
  }
}

/**
 * Maps DVLA API response to normalized format
 */
export function mapDvlaData(data: any): Partial<NormalizedVehicleData> {
  if (!data) return {}
  
  return {
    registrationNumber: data.registrationNumber || '',
    make: data.make || '',
    model: data.model || '',
    colour: data.colour || '',
    yearOfManufacture: data.yearOfManufacture || '',
    fuelType: data.fuelType || '',
    bodyStyle: inferBodyStyle(data.wheelplan, data.typeApproval),
    engineCapacity: formatEngineCapacity(data.engineCapacity),
    
    co2Emissions: data.co2Emissions ? `${data.co2Emissions} g/km` : '',
    euroStatus: data.euroStatus || '',
    wheelplan: data.wheelplan || '',
    
    registrationDate: formatDate(data.monthOfFirstRegistration),
    placeOfFirstRegistration: '', // Not available from DVLA
    vehicleAge: calculateVehicleAge(data.yearOfManufacture),
    dateOfLastV5CIssued: formatDate(data.dateOfLastV5CIssued),
    
    motStatus: data.motStatus || '',
    motExpiryDate: formatDate(data.motExpiryDate),
    motMileage: '', // Not available from basic DVLA
    motInformation: data.motStatus === 'Valid' ? 'MOT is valid' : 'Check MOT status',
    
    taxStatus: data.taxStatus || '',
    taxDueDate: formatDate(data.taxDueDate),
    taxSixMonths: '', // Not available from DVLA
    taxTwelveMonths: '', // Not available from DVLA
    
    importedExported: data.markedForExport ? 'Marked for export' : 'No',
  }
}

/**
 * Maps CheckCarDetails vehicleregistration response
 */
export function mapCheckCarDetailsBasic(data: any): Partial<NormalizedVehicleData> {
  if (!data) return {}
  
  return {
    registrationNumber: data.registrationNumber || '',
    make: data.make || '',
    model: data.model || '',
    colour: data.colour || '',
    yearOfManufacture: data.yearOfManufacture || '',
    fuelType: data.fuelType || '',
    bodyStyle: inferBodyStyle(data.wheelplan, data.typeApproval),
    engineCapacity: formatEngineCapacity(data.engineCapacity),
    
    co2Emissions: data.co2Emissions ? `${data.co2Emissions} g/km` : '',
    wheelplan: data.wheelplan || '',
    
    registrationDate: formatDate(data.dateOfLastV5CIssued),
    placeOfFirstRegistration: data.registrationPlace || '',
    vehicleAge: data.vehicleAge || calculateVehicleAge(data.yearOfManufacture),
    dateOfLastV5CIssued: formatDate(data.dateOfLastV5CIssued),
    
    motStatus: data.mot?.motStatus || '',
    motExpiryDate: formatDate(data.mot?.motDueDate),
    motMileage: '',
    motInformation: data.mot?.days ? `${data.mot.days} days remaining` : '',
    
    taxStatus: data.tax?.taxStatus || '',
    taxDueDate: formatDate(data.tax?.taxDueDate),
    taxSixMonths: '',
    taxTwelveMonths: '',
  }
}

/**
 * Maps CheckCarDetails premium data (carhistorycheck, mot, mileage, etc.)
 */
export function mapPremiumData(
  basicData: any,
  historyData: any,
  motData: any,
  mileageData: any,
  imageData: any,
  specsData: any
): NormalizedPremiumData {
  const basic = mapDvlaData(basicData) || mapCheckCarDetailsBasic(basicData)
  
  // Extract history data
  const history = historyData?.VehicleHistory || {}
  const vehicleReg = historyData?.VehicleRegistration || {}
  
  // Extract specs data
  const performance = specsData?.Performance || historyData?.Performance || {}
  const dimensions = specsData?.Dimensions || historyData?.Dimensions || {}
  const consumption = specsData?.Performance?.FuelEconomy || historyData?.Consumption || {}
  const smmtDetails = specsData?.SmmtDetails || historyData?.SmmtDetails || {}
  
  return {
    ...basic,
    
    // VIN and ownership
    vin: vehicleReg.Vin || specsData?.VehicleIdentification?.Vin || '',
    previousOwners: String(history.NumberOfPreviousKeepers || ''),
    lastOwnerSince: formatDate(history.KeeperChangesList?.[0]?.DateOfLastKeeperChange),
    
    // History flags
    outstandingFinance: history.financeRecord ? 'Yes - Finance recorded' : 'No records found',
    stolenRecord: history.stolenRecord ? 'Yes - Stolen record found' : 'No records found',
    writtenOffRecord: history.writeOffRecord ? 'Yes - Write-off recorded' : 'No records found',
    importedExported: vehicleReg.Imported ? 'Imported' : (vehicleReg.Exported ? 'Exported' : 'No'),
    
    // History arrays
    financeRecords: history.finance || [],
    stolenRecords: history.stolen || [],
    writeOffRecords: history.writeoff || [],
    keeperChanges: history.KeeperChangesList || [],
    plateChanges: history.PlateChangeList || [],
    
    // MOT History
    motHistory: motData?.motHistory || [],
    motSummary: {
      totalTests: motData?.motHistorySummary?.totalTests || 0,
      passedTests: motData?.motHistorySummary?.passedTests || 0,
      failedTests: motData?.motHistorySummary?.failedTests || 0,
    },
    
    // Mileage
    mileageHistory: mileageData?.mileage || [],
    mileageSummary: {
      lastRecorded: mileageData?.summary?.lastRecordedMileage || '',
      averageMileage: mileageData?.summary?.averageMileage || 0,
      status: mileageData?.summary?.averageMileageStatus || '',
      issues: mileageData?.summary?.mileageIssueDescription || '',
    },
    
    // Images
    vehicleImages: imageData?.VehicleImages?.ImageDetailsList?.map((img: any) => img.ImageUrl) || [],
    
    // Performance
    bhp: formatBhp(performance.Power?.Bhp || smmtDetails.PowerBhp),
    torque: formatTorque(performance.Torque?.Nm || smmtDetails.TorqueNm),
    performance: {
      bhp: formatBhp(performance.Power?.Bhp || smmtDetails.PowerBhp),
      torque: formatTorque(performance.Torque?.Nm || smmtDetails.TorqueNm),
      topSpeed: formatSpeed(performance.Statistics?.MaxSpeedMph || performance.MaxSpeed?.Mph || smmtDetails.MaxSpeedMph),
      acceleration: formatAcceleration(performance.Statistics?.ZeroToSixtyMph || performance.Acceleration?.ZeroTo60Mph),
    },
    
    // Dimensions
    dimensions: {
      length: formatDimension(dimensions.LengthMm || dimensions.CarLength),
      width: formatDimension(dimensions.WidthMm || dimensions.Width),
      height: formatDimension(dimensions.HeightMm || dimensions.Height),
      wheelbase: formatDimension(dimensions.WheelBaseLengthMm || dimensions.WheelBase),
      kerbWeight: formatWeight(dimensions.KerbWeightKg || dimensions.KerbWeight),
    },
    
    // Fuel consumption
    consumption: {
      urban: formatMpg(consumption.UrbanColdMpg || consumption.UrbanCold?.Mpg),
      extraUrban: formatMpg(consumption.ExtraUrbanMpg || consumption.ExtraUrban?.Mpg),
      combined: formatMpg(consumption.CombinedMpg || consumption.Combined?.Mpg),
    },
    
    // Tax rates from specs
    taxSixMonths: formatCurrency(specsData?.VehicleExciseDutyDetails?.VedRate?.Standard?.SixMonths || historyData?.vedRate?.Standard?.SixMonth),
    taxTwelveMonths: formatCurrency(specsData?.VehicleExciseDutyDetails?.VedRate?.Standard?.TwelveMonths || historyData?.vedRate?.Standard?.TwelveMonth),
    
    insurance: '',
    insuranceGroup: '',
  } as NormalizedPremiumData
}

/**
 * Calculate traffic light status for premium indicators
 */
export function calculateTrafficLightStatus(premiumData: NormalizedPremiumData) {
  return [
    {
      id: 1,
      label: 'Outstanding Finance',
      status: premiumData.financeRecords?.length > 0 ? 'red' : 'green',
      detail: premiumData.outstandingFinance
    },
    {
      id: 2,
      label: 'Previous Accidents',
      status: premiumData.writeOffRecords?.length > 0 ? 'red' : 'green',
      detail: premiumData.writtenOffRecord
    },
    {
      id: 3,
      label: 'Stolen Market',
      status: premiumData.stolenRecords?.length > 0 ? 'red' : 'green',
      detail: premiumData.stolenRecord
    },
    {
      id: 4,
      label: 'Mileage Discrepancy',
      status: getMileageStatus(premiumData.mileageSummary),
      detail: premiumData.mileageSummary?.issues || 'No issues detected'
    },
    {
      id: 5,
      label: 'Valid MOT',
      status: getMotStatus(premiumData.motStatus, premiumData.motExpiryDate),
      detail: premiumData.motStatus
    },
    {
      id: 6,
      label: 'Import/Export',
      status: premiumData.importedExported === 'No' ? 'green' : 'yellow',
      detail: premiumData.importedExported
    }
  ]
}

// Helper functions
function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return dateStr
  }
}

function formatEngineCapacity(cc: number | string | undefined): string {
  if (!cc) return ''
  const ccNum = typeof cc === 'string' ? parseInt(cc) : cc
  return `${ccNum}cc`
}

function calculateVehicleAge(year: number | string | undefined): string {
  if (!year) return ''
  const yearNum = typeof year === 'string' ? parseInt(year) : year
  const age = new Date().getFullYear() - yearNum
  return `${age} year${age !== 1 ? 's' : ''}`
}

function inferBodyStyle(wheelplan: string | undefined, typeApproval: string | undefined): string {
  if (!wheelplan && !typeApproval) return 'saloon'
  
  const wp = wheelplan?.toLowerCase() || ''
  if (wp.includes('hatchback')) return 'hatchback'
  if (wp.includes('estate')) return 'estate'
  if (wp.includes('coupe')) return 'coupe'
  if (wp.includes('convertible')) return 'convertible'
  if (wp.includes('suv') || wp.includes('4x4')) return 'suv'
  if (wp.includes('van')) return 'van'
  if (wp.includes('pickup')) return 'pickup'
  
  return 'saloon'
}

function formatBhp(bhp: number | undefined): string {
  return bhp ? `${Math.round(bhp)} BHP` : ''
}

function formatTorque(nm: number | undefined): string {
  return nm ? `${nm} Nm` : ''
}

function formatSpeed(mph: number | undefined): string {
  return mph ? `${mph} mph` : ''
}

function formatAcceleration(seconds: number | undefined): string {
  return seconds ? `${seconds}s (0-60)` : ''
}

function formatDimension(mm: number | undefined): string {
  return mm ? `${mm} mm` : ''
}

function formatWeight(kg: number | undefined): string {
  return kg ? `${kg} kg` : ''
}

function formatMpg(mpg: number | undefined): string {
  return mpg ? `${mpg} mpg` : ''
}

function formatCurrency(amount: number | undefined): string {
  if (!amount) return ''
  return `£${amount.toFixed(2)}`
}

function getMileageStatus(summary: any): 'green' | 'yellow' | 'red' {
  if (!summary) return 'green'
  if (summary.issues && summary.issues.length > 0) return 'red'
  if (summary.status === 'HIGH') return 'yellow'
  return 'green'
}

function getMotStatus(status: string, expiryDate: string): 'green' | 'yellow' | 'red' {
  if (status === 'Valid') {
    if (expiryDate) {
      const expiry = new Date(expiryDate)
      const now = new Date()
      const daysUntilExpiry = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      if (daysUntilExpiry < 30) return 'yellow'
    }
    return 'green'
  }
  return 'red'
}
