import zipToCountyData from '@/data/zip-to-county.json'
import amiData from '@/data/ami.json'

export type AmiLookupResult = {
  state: string
  county: string
  ami: number
}

export function lookupByZip(
  zip: string,
  householdSize: number
): AmiLookupResult | null {
  // Look up county from ZIP
  const countyInfo = (zipToCountyData as Record<string, { state: string; county: string }>)[zip]

  if (!countyInfo) {
    return null
  }

  // Find matching AMI record
  const amiRecord = (amiData as Array<{
    state: string
    county: string
    householdSize: number
    ami: number
  }>).find(
    (record) =>
      record.state === countyInfo.state &&
      record.county === countyInfo.county &&
      record.householdSize === householdSize
  )

  if (!amiRecord) {
    return null
  }

  return {
    state: amiRecord.state,
    county: amiRecord.county,
    ami: amiRecord.ami,
  }
}
