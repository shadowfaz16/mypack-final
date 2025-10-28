import { PricingRule, InsuranceRate, ServiceType } from '@/types/database.types';

export interface CalculatePriceParams {
  weight: number; // in kg
  length: number; // in cm
  width: number; // in cm
  height: number; // in cm
  destinationState: string;
  declaredValue?: number; // in MXN
  includeInsurance?: boolean;
}

export interface PriceCalculation {
  serviceCost: number;
  insuranceCost: number;
  totalCost: number;
  serviceType: ServiceType;
  appliedRule: PricingRule | null;
  appliedInsuranceRate: InsuranceRate | null;
}

/**
 * Determines service type based on weight
 */
export function determineServiceType(weight: number): ServiceType {
  return weight <= 50 ? 'menudeo' : 'mayoreo';
}

/**
 * Calculates volumetric weight (peso volumétrico)
 * Formula: (L x W x H) / 5000
 */
export function calculateVolumetricWeight(length: number, width: number, height: number): number {
  return (length * width * height) / 5000;
}

/**
 * Gets the billable weight (greater of actual weight or volumetric weight)
 */
export function getBillableWeight(
  actualWeight: number,
  length: number,
  width: number,
  height: number
): number {
  const volumetricWeight = calculateVolumetricWeight(length, width, height);
  return Math.max(actualWeight, volumetricWeight);
}

/**
 * Finds the applicable pricing rule
 */
export function findApplicablePricingRule(
  pricingRules: PricingRule[],
  weight: number,
  destinationState: string,
  serviceType: ServiceType
): PricingRule | null {
  // Filter by service type, destination, and active status
  const applicableRules = pricingRules.filter(
    (rule) =>
      rule.is_active &&
      rule.service_type === serviceType &&
      rule.destination_zone.toLowerCase() === destinationState.toLowerCase() &&
      weight >= rule.min_weight &&
      weight <= rule.max_weight
  );

  // Return the first matching rule (should be only one if configured correctly)
  return applicableRules[0] || null;
}

/**
 * Finds the applicable insurance rate
 */
export function findApplicableInsuranceRate(
  insuranceRates: InsuranceRate[],
  declaredValue: number
): InsuranceRate | null {
  const applicableRates = insuranceRates.filter(
    (rate) =>
      rate.is_active &&
      declaredValue >= rate.min_value &&
      declaredValue <= rate.max_value
  );

  return applicableRates[0] || null;
}

/**
 * Calculates service cost based on pricing rule
 */
export function calculateServiceCost(
  rule: PricingRule,
  billableWeight: number
): number {
  const weightAboveMin = Math.max(0, billableWeight - rule.min_weight);
  return rule.base_price + (weightAboveMin * rule.price_per_kg);
}

/**
 * Calculates insurance cost based on insurance rate
 */
export function calculateInsuranceCost(
  rate: InsuranceRate,
  declaredValue: number
): number {
  return (declaredValue * rate.rate_percentage) / 100;
}

/**
 * Main function to calculate complete pricing
 */
export async function calculatePrice(
  params: CalculatePriceParams,
  pricingRules: PricingRule[],
  insuranceRates: InsuranceRate[]
): Promise<PriceCalculation> {
  const { weight, length, width, height, destinationState, declaredValue, includeInsurance } = params;

  // Determine service type
  const serviceType = determineServiceType(weight);

  // Calculate billable weight
  const billableWeight = getBillableWeight(weight, length, width, height);

  // Find applicable pricing rule
  const applicableRule = findApplicablePricingRule(
    pricingRules,
    billableWeight,
    destinationState,
    serviceType
  );

  if (!applicableRule) {
    throw new Error(
      `No se encontró una regla de precio para peso: ${billableWeight}kg, destino: ${destinationState}`
    );
  }

  // Calculate service cost
  const serviceCost = calculateServiceCost(applicableRule, billableWeight);

  // Calculate insurance cost if requested
  let insuranceCost = 0;
  let appliedInsuranceRate: InsuranceRate | null = null;

  if (includeInsurance && declaredValue && declaredValue > 0) {
    appliedInsuranceRate = findApplicableInsuranceRate(insuranceRates, declaredValue);
    
    if (!appliedInsuranceRate) {
      throw new Error(
        `No se encontró una tasa de seguro para valor declarado: $${declaredValue} MXN`
      );
    }

    insuranceCost = calculateInsuranceCost(appliedInsuranceRate, declaredValue);
  }

  // Calculate total
  const totalCost = serviceCost + insuranceCost;

  return {
    serviceCost: Math.round(serviceCost * 100) / 100, // Round to 2 decimals
    insuranceCost: Math.round(insuranceCost * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    serviceType,
    appliedRule: applicableRule,
    appliedInsuranceRate,
  };
}

/**
 * Formats currency in MXN
 */
export function formatMXN(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
}

/**
 * Formats weight display
 */
export function formatWeight(weight: number): string {
  return `${weight.toFixed(2)} kg`;
}

/**
 * Formats dimensions display
 */
export function formatDimensions(length: number, width: number, height: number): string {
  return `${length} x ${width} x ${height} cm`;
}

