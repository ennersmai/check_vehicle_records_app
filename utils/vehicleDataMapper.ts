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
  topSpeed: string
  acceleration: string
  co2Emissions: string
  euroStatus: string
  wheelplan: string
  kerbWeight: string
  
  // Engine Details
  numberOfCylinders: string
  cylinderArrangement: string
  valveGear: string
  aspiration: string
  fuelDelivery: string
  
  // Registration
  registrationDate: string
  countryOfOrigin: string
  vehicleAge: string
  dateOfLastV5CIssued: string
  dateOfManufacture: string
  
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
  taxBand: string
  revenueWeight: string
  
  // Premium fields
  vin: string
  engineNumber: string
  previousOwners: string
  lastOwnerSince: string
  v5cCount: string
  outstandingFinance: string
  stolenRecord: string
  writtenOffRecord: string
  importedExported: string
  scrapped: string
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
    powerKw: string
  }
  dimensions: {
    length: string
    width: string
    height: string
    wheelbase: string
    kerbWeight: string
    unladenWeight: string
    grossWeight: string
    fuelTankCapacity: string
    numberOfDoors: string
    numberOfSeats: string
  }
  consumption: {
    urban: string
    extraUrban: string
    combined: string
    co2: string
  }
  engine: {
    capacity: string
    cylinders: string
    arrangement: string
    valveGear: string
    aspiration: string
    fuelDelivery: string
    description: string
  }
  transmission: {
    type: string
    gears: string
    driveType: string
  }
}

/**
 * Maps DVLA API response to normalized format
 * DVLA provides limited data - model, BHP, tax rates, etc. are NOT available
 */
export function mapDvlaData(data: any): Partial<NormalizedVehicleData> {
  if (!data) return {}
  
  // Helper to check if a value is a placeholder or empty
  const isPlaceholder = (val: any) => !val || val === 'XX XXXX' || val === 'N/A' || val === '';
  
  // DVLA doesn't provide model - only make
  // Filter out placeholder values like "XX XXXX"
  return {
    registrationNumber: data.registrationNumber || '',
    make: data.make || '',
    model: isPlaceholder(data.model) ? '' : data.model, // Filter out placeholders
    colour: data.colour || '',
    yearOfManufacture: data.yearOfManufacture || '',
    fuelType: data.fuelType || '',
    bodyStyle: isPlaceholder(data.bodyStyle) ? inferBodyStyle(data.wheelplan, data.typeApproval) : data.bodyStyle,
    engineCapacity: formatEngineCapacity(data.engineCapacity),
    
    co2Emissions: data.co2Emissions ? `${data.co2Emissions} g/km` : '',
    euroStatus: data.euroStatus || '',
    wheelplan: data.wheelplan || '',
    
    registrationDate: formatDate(data.monthOfFirstRegistration),
    countryOfOrigin: '', // Not available from DVLA
    vehicleAge: calculateVehicleAge(data.yearOfManufacture),
    dateOfLastV5CIssued: formatDate(data.dateOfLastV5CIssued),
    dateOfManufacture: '',
    kerbWeight: '',
    topSpeed: '',
    acceleration: '',
    numberOfCylinders: '',
    cylinderArrangement: '',
    valveGear: '',
    aspiration: '',
    fuelDelivery: '',
    engineNumber: '',
    v5cCount: '',
    scrapped: '',
    taxBand: '',
    
    motStatus: data.motStatus || '',
    motExpiryDate: formatDate(data.motExpiryDate),
    motMileage: '', // Not available from basic DVLA
    motInformation: data.motStatus === 'Valid' ? 'MOT is valid' : (data.motStatus === 'No details held by DVLA' ? 'No MOT data' : 'Check MOT status'),
    
    taxStatus: data.taxStatus || '',
    taxDueDate: formatDate(data.taxDueDate),
    taxSixMonths: '', // Not available from DVLA
    taxTwelveMonths: '', // Not available from DVLA
    
    revenueWeight: data.revenueWeight ? `${data.revenueWeight} kg` : '',
    
    importedExported: data.markedForExport ? 'Marked for export' : 'No',
    
    // Not available from basic DVLA
    bhp: '',
    torque: '',
    vin: '',
    previousOwners: '',
    lastOwnerSince: '',
    outstandingFinance: '',
    stolenRecord: '',
    writtenOffRecord: '',
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
    countryOfOrigin: data.countryOfOrigin || '',
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
  
  // Extract history data - check multiple possible locations
  const history = historyData?.VehicleHistory || historyData || {}
  const vehicleReg = historyData?.VehicleRegistration || {}
  
  // Extract specs data - check multiple possible locations
  const performance = specsData?.Performance || historyData?.Performance || {}
  const dimensions = specsData?.Dimensions || historyData?.Dimensions || {}
  const weights = specsData?.Weights || {}
  const consumption = specsData?.Performance?.FuelEconomy || historyData?.Consumption || {}
  const smmtDetails = specsData?.SmmtDetails || historyData?.SmmtDetails || {}
  const engine = specsData?.Engine || specsData?.PowerSource?.IceDetails || historyData?.Engine || {}
  const general = specsData?.General || historyData?.General || {}
  const vedRate = specsData?.vedRate || historyData?.vedRate || {}
  const vehicleId = specsData?.VehicleIdentification || {}
  const transmission = specsData?.Transmission || {}
  const vedDetails = specsData?.VehicleExciseDutyDetails || {}
  
  // Get make and model from multiple sources (DVLA doesn't provide model)
  const make = mileageData?.make || basicData?.make || ''
  const model = smmtDetails.ModelVariant || smmtDetails.Range || vehicleReg.Model || mileageData?.model || basicData?.model || ''
  
  // Get VIN from multiple sources
  const vin = vehicleReg.Vin || vehicleId.Vin || historyData?.VehicleRegistration?.Vin || ''
  
  // Get engine number
  const engineNumber = vehicleId.EngineNumber || ''
  
  // Get V5C certificate info for last owner
  const v5cDates = vehicleId.V5cCertificateIssueDates || history.V5CCertificateList?.map((c: any) => c.CertificateDate) || []
  const lastV5cDate = v5cDates.length > 0 ? v5cDates[v5cDates.length - 1] : (history.KeeperChangesList?.[0]?.DateOfLastKeeperChange || '')
  const v5cCount = vehicleId.V5cCertificateCount || v5cDates.length || ''
  
  // Get kerb weight from multiple sources
  const kerbWeight = weights.KerbWeightKg || dimensions.KerbWeightKg || dimensions.KerbWeight || smmtDetails.KerbWeight || 0
  
  // Get country of origin
  const countryOfOrigin = smmtDetails.CountryOfOrigin || vehicleReg.CountryOfOrigin || ''
  
  // Get last MOT mileage from MOT data
  const lastMotMileage = motData?.motHistory?.[0]?.odometerValue 
    ? `${parseInt(motData.motHistory[0].odometerValue).toLocaleString()} miles`
    : mileageData?.mileage?.[0]?.mileage 
      ? `${parseInt(mileageData.mileage[0].mileage).toLocaleString()} miles`
      : ''
  
  // Get last MOT info
  const lastMotInfo = motData?.motHistory?.[0] 
    ? `${motData.motHistory[0].testResult} on ${formatDate(motData.motHistory[0].completedDate)}`
    : motData?.mot?.motStatus || basicData?.motStatus || ''
  
  return {
    ...basic,
    
    // Override make and model with data from premium sources
    make: make || basic.make,
    model,
    
    // VIN and ownership
    vin,
    vinNumber: vin, // Alias for UI compatibility
    engineNumber,
    previousOwners: history.NumberOfPreviousKeepers !== undefined ? String(history.NumberOfPreviousKeepers) : '',
    lastOwnerSince: formatDate(lastV5cDate),
    v5cCount: v5cCount ? String(v5cCount) : '',
    
    // Kerb weight
    kerbWeight: formatWeight(kerbWeight),
    
    // Country of origin
    countryOfOrigin,
    
    // History flags - check for boolean or array existence
    outstandingFinance: (history.financeRecord || history.finance?.length > 0) ? 'Yes - Finance recorded' : 'No records found',
    stolenRecord: (history.stolenRecord || history.stolen?.length > 0) ? 'Yes - Stolen record found' : 'No records found',
    writtenOffRecord: (history.writeOffRecord || history.writeoff?.length > 0) ? 'Yes - Write-off recorded' : 'No records found',
    importedExported: vehicleReg.Imported ? 'Imported' : (vehicleReg.Exported ? 'Exported' : (basicData?.markedForExport ? 'Marked for export' : 'No')),
    
    // History arrays
    financeRecords: history.finance || [],
    stolenRecords: history.stolen || [],
    writeOffRecords: history.writeoff || [],
    keeperChanges: history.KeeperChangesList || [],
    plateChanges: history.PlateChangeList || [],
    
    // MOT mileage and info for display
    lastMotMileage,
    lastMotInformation: lastMotInfo,
    motMileage: lastMotMileage,
    motInformation: lastMotInfo,
    
    // MOT History - map to consistent format
    motHistory: (motData?.motHistory || []).map((mot: any) => ({
      date: mot.completedDate,
      mileage: mot.odometerValue ? parseInt(mot.odometerValue) : null,
      result: mot.testResult === 'PASSED' ? 'PASS' : 'FAIL',
      advisories: mot.defects?.filter((d: any) => d.type === 'ADVISORY').map((d: any) => d.text) || [],
      failures: mot.defects?.filter((d: any) => d.type === 'MAJOR' || d.type === 'DANGEROUS').map((d: any) => d.text) || [],
    })),
    motSummary: {
      totalTests: motData?.motHistorySummary?.totalTests || motData?.motHistory?.length || 0,
      passedTests: motData?.motHistorySummary?.passedTests || motData?.motHistory?.filter((m: any) => m.testResult === 'PASSED').length || 0,
      failedTests: motData?.motHistorySummary?.failedTests || motData?.motHistory?.filter((m: any) => m.testResult === 'FAILED').length || 0,
    },
    motExpiry: formatDate(motData?.mot?.motDueDate || basicData?.motExpiryDate),
    
    // Mileage - map to consistent format
    mileageHistory: (mileageData?.mileage || []).map((m: any) => ({
      date: m.dateOfInformation,
      mileage: m.mileage ? parseInt(m.mileage) : null,
      source: m.source,
    })),
    mileageSummary: {
      lastRecorded: mileageData?.summary?.lastRecordedMileage || (mileageData?.mileage?.[0]?.mileage ? parseInt(mileageData.mileage[0].mileage).toLocaleString() : ''),
      averageMileage: mileageData?.summary?.averageMileage || 0,
      status: mileageData?.summary?.averageMileageStatus || '',
      issues: mileageData?.summary?.mileageIssueDescription || '',
    },
    
    // Images
    vehicleImages: imageData?.VehicleImages?.ImageDetailsList?.map((img: any) => img.ImageUrl) || [],
    
    // Euro status from multiple sources
    euroStatus: general.EuroStatus || smmtDetails.EuroStatus || basicData?.euroStatus || '',
    
    // Body style from premium data - check multiple sources
    bodyStyle: smmtDetails.BodyStyle?.toLowerCase() || specsData?.BodyDetails?.BodyStyle?.toLowerCase() || inferBodyStyle(basicData?.wheelplan, basicData?.typeApproval),
    
    // Scrapped status
    scrapped: history.Scrapped ? 'Yes' : 'No',
    
    // Performance
    bhp: formatBhp(performance.Power?.Bhp || smmtDetails.PowerBhp),
    torque: formatTorque(performance.Torque?.Nm || smmtDetails.TorqueNm),
    topSpeed: formatSpeed(performance.Statistics?.MaxSpeedMph || performance.MaxSpeed?.Mph || smmtDetails.MaxSpeedMph),
    acceleration: formatAcceleration(performance.Statistics?.ZeroToSixtyMph || performance.Acceleration?.ZeroTo60Mph || performance.Acceleration?.Mph),
    performance: {
      bhp: formatBhp(performance.Power?.Bhp || smmtDetails.PowerBhp),
      powerKw: performance.Power?.Kw ? `${performance.Power.Kw} kW` : (smmtDetails.PowerKw ? `${smmtDetails.PowerKw} kW` : ''),
      powerRpm: performance.Power?.Rpm ? `${performance.Power.Rpm} rpm` : '',
      torque: formatTorque(performance.Torque?.Nm || smmtDetails.TorqueNm),
      torqueFtLb: performance.Torque?.FtLb ? `${performance.Torque.FtLb} ft-lb` : '',
      torqueRpm: performance.Torque?.Rpm ? `${performance.Torque.Rpm} rpm` : '',
      topSpeed: formatSpeed(performance.Statistics?.MaxSpeedMph || performance.MaxSpeed?.Mph || smmtDetails.MaxSpeedMph),
      acceleration: formatAcceleration(performance.Statistics?.ZeroToSixtyMph || performance.Acceleration?.ZeroTo60Mph || performance.Acceleration?.Mph),
      co2: smmtDetails.Co2 ? `${smmtDetails.Co2} g/km` : (performance.Co2 ? `${performance.Co2} g/km` : ''),
    },
    
    // Dimensions
    dimensions: {
      length: formatDimension(dimensions.LengthMm || dimensions.CarLength || smmtDetails.Length),
      width: formatDimension(dimensions.WidthMm || dimensions.Width || smmtDetails.Width),
      height: formatDimension(dimensions.HeightMm || dimensions.Height || smmtDetails.Height),
      wheelbase: formatDimension(dimensions.WheelBaseLengthMm || dimensions.WheelBase) || (typeof smmtDetails.Wheelbase === 'number' ? formatDimension(smmtDetails.Wheelbase) : ''),
      kerbWeight: formatWeight(kerbWeight),
      unladenWeight: formatWeight(dimensions.UnladenWeight || smmtDetails.UnladenWeight),
      grossWeight: formatWeight(dimensions.GrossVehicleWeight || smmtDetails.GrossVehicleWeight),
      fuelTankCapacity: dimensions.FuelTankCapacity ? `${dimensions.FuelTankCapacity}L` : (dimensions.FuelTankCapacityLitres ? `${dimensions.FuelTankCapacityLitres}L` : ''),
      numberOfDoors: dimensions.NumberOfDoors?.toString() || smmtDetails.NumberOfDoors?.toString() || '',
      numberOfSeats: dimensions.NumberOfSeats?.toString() || smmtDetails.NumberOfSeats?.toString() || '',
    },
    
    // Fuel consumption
    consumption: {
      urban: formatMpg(consumption.UrbanColdMpg || consumption.UrbanCold?.Mpg || smmtDetails.UrbanColdMpg),
      extraUrban: formatMpg(consumption.ExtraUrbanMpg || consumption.ExtraUrban?.Mpg || smmtDetails.ExtraUrbanMpg),
      combined: formatMpg(consumption.CombinedMpg || consumption.Combined?.Mpg || smmtDetails.CombinedMpg),
      co2: smmtDetails.Co2 ? `${smmtDetails.Co2} g/km` : (performance.Co2 ? `${performance.Co2} g/km` : ''),
    },
    
    // Engine details
    engine: {
      capacity: formatEngineCapacity(engine.EngineCapacityCc || smmtDetails.EngineCapacity || basicData?.engineCapacity),
      cylinders: engine.NumberOfCylinders?.toString() || smmtDetails.NumberOfCylinders?.toString() || '',
      arrangement: engine.CylinderArrangement || smmtDetails.CylinderArrangement || '',
      valveGear: engine.ValveGear || smmtDetails.ValveGear || '',
      aspiration: engine.Aspiration || smmtDetails.Aspiration || '',
      fuelDelivery: engine.FuelDelivery || '',
      description: engine.EngineDescription || engine.Description || '',
    },
    numberOfCylinders: engine.NumberOfCylinders?.toString() || smmtDetails.NumberOfCylinders?.toString() || '',
    cylinderArrangement: engine.CylinderArrangement || smmtDetails.CylinderArrangement || '',
    valveGear: engine.ValveGear || smmtDetails.ValveGear || '',
    aspiration: engine.Aspiration || smmtDetails.Aspiration || '',
    fuelDelivery: engine.FuelDelivery || '',
    
    // Transmission and drivetrain
    drivingAxle: general.DrivingAxle || general.DriveAxle || smmtDetails.DrivingAxle || '',
    transmission: {
      type: transmission.TransmissionType || smmtDetails.Transmission || '',
      gears: transmission.NumberOfGears?.toString() || smmtDetails.NumberOfGears?.toString() || '',
      driveType: transmission.DriveType || smmtDetails.DriveType || '',
    },
    
    // Tax rates from specs - check multiple locations
    taxSixMonths: formatCurrency(vedRate?.Standard?.SixMonth || vedDetails?.VedRate?.Standard?.SixMonths),
    taxTwelveMonths: formatCurrency(vedRate?.Standard?.TwelveMonth || vedDetails?.VedRate?.Standard?.TwelveMonths),
    taxBand: vedDetails?.DvlaBand || vedRate?.vedBand || '',
    
    // Registration info
    registration: basicData?.registrationNumber || vehicleReg.Vrm || vehicleId.Vrm || '',
    registrationDate: formatDate(basicData?.monthOfFirstRegistration || vehicleReg.DateFirstRegisteredUk || vehicleReg.DateFirstRegistered || vehicleId.DateFirstRegistered),
    dateOfManufacture: formatDate(vehicleId.DateOfManufacture || vehicleReg.DateOfManufacture),
    
    // Photo URL from image data
    photoUrl: imageData?.VehicleImages?.ImageDetailsList?.[0]?.ImageUrl || '',
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
    // Handle YYYY-MM format from DVLA (monthOfFirstRegistration)
    if (/^\d{4}-\d{2}$/.test(dateStr)) {
      const [year, month] = dateStr.split('-')
      return `01/${month}/${year}`
    }
    // Handle ISO date strings
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return dateStr
  }
}

function formatEngineCapacity(cc: number | string | undefined): string {
  if (!cc) return ''
  const ccNum = typeof cc === 'string' ? parseInt(cc) : cc
  if (isNaN(ccNum)) return ''
  return `${ccNum}cc`
}

function calculateVehicleAge(year: number | string | undefined): string {
  if (!year) return ''
  const yearNum = typeof year === 'string' ? parseInt(year) : year
  const age = new Date().getFullYear() - yearNum
  return `${age} year${age !== 1 ? 's' : ''}`
}

function inferBodyStyle(wheelplan: string | undefined, typeApproval: string | undefined): string {
  if (!wheelplan && !typeApproval) return ''
  
  const wp = wheelplan?.toLowerCase() || ''
  const ta = typeApproval?.toLowerCase() || ''
  
  // Check wheelplan for body style hints
  if (wp.includes('hatchback')) return 'hatchback'
  if (wp.includes('estate')) return 'estate'
  if (wp.includes('coupe')) return 'coupe'
  if (wp.includes('convertible')) return 'convertible'
  if (wp.includes('suv') || wp.includes('4x4')) return 'suv'
  if (wp.includes('van')) return 'van'
  if (wp.includes('pickup')) return 'pickup'
  
  // M1 = passenger car, but we can't determine exact body style from DVLA alone
  // Return empty to show N/A - body style will be filled from premium data
  if (ta === 'm1') return ''
  
  return ''
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
