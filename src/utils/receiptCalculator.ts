/**
 * Receipt Calculation Utility
 * 
 * Calculates receipt breakdown according to specification:
 * - Base Amount (Actual Rent)
 * - VAT (15%)
 * - Tourism Levy (1%)
 * - Service Fee (2%)
 * - Fixed Charges: Maintenance (GHS 500), Generator (GHS 300), Water Bill (GHS 200)
 */

export interface ReceiptBreakdown {
  baseAmount: number;
  vat: number;
  tourismLevy: number;
  serviceFee: number;
  maintenanceFee: number;
  generatorFee: number;
  waterBill: number;
  subtotal: number;
  totalTaxesAndLevies: number;
  totalFixedCharges: number;
  grandTotal: number;
}

export interface ReceiptData {
  receiptNumber: string;
  dateTime: string;
  customerName: string;
  propertyName: string;
  paymentReference: string;
  paymentMethod: string;
  breakdown: ReceiptBreakdown;
}

/**
 * Calculate receipt breakdown from grand total (Actual Rent Paid)
 * 
 * The grand total is the actual rent amount paid (booking price).
 * The base amount is calculated backwards so that:
 * baseAmount + taxes + fixedCharges = grandTotal
 * 
 * Formula: baseAmount = (grandTotal - fixedCharges) / (1 + vatRate + tourismLevyRate + serviceFeeRate)
 */
export function calculateReceiptBreakdown(grandTotal: number): ReceiptBreakdown {
  // Fixed charges
  const maintenanceFee = 500.00;
  const generatorFee = 300.00;
  const waterBill = 200.00;
  const totalFixedCharges = maintenanceFee + generatorFee + waterBill;

  // Calculate base amount backwards from grand total
  // grandTotal = baseAmount + (baseAmount * 0.15) + (baseAmount * 0.01) + (baseAmount * 0.02) + fixedCharges
  // grandTotal = baseAmount * (1 + 0.15 + 0.01 + 0.02) + fixedCharges
  // baseAmount = (grandTotal - fixedCharges) / 1.18
  const taxRate = 0.15 + 0.01 + 0.02; // VAT + Tourism Levy + Service Fee = 18%
  const baseAmount = (grandTotal - totalFixedCharges) / (1 + taxRate);

  // Percentage-based charges (calculated from base amount)
  const vat = baseAmount * 0.15; // 15%
  const tourismLevy = baseAmount * 0.01; // 1%
  const serviceFee = baseAmount * 0.02; // 2%

  // Totals
  const subtotal = baseAmount;
  const totalTaxesAndLevies = vat + tourismLevy + serviceFee;

  return {
    baseAmount: roundToTwoDecimals(baseAmount),
    vat: roundToTwoDecimals(vat),
    tourismLevy: roundToTwoDecimals(tourismLevy),
    serviceFee: roundToTwoDecimals(serviceFee),
    maintenanceFee: roundToTwoDecimals(maintenanceFee),
    generatorFee: roundToTwoDecimals(generatorFee),
    waterBill: roundToTwoDecimals(waterBill),
    subtotal: roundToTwoDecimals(subtotal),
    totalTaxesAndLevies: roundToTwoDecimals(totalTaxesAndLevies),
    totalFixedCharges: roundToTwoDecimals(totalFixedCharges),
    grandTotal: roundToTwoDecimals(grandTotal), // Use the actual grand total (booking price)
  };
}

/**
 * Calculate base amount from grand total (reverse calculation)
 * 
 * If the booking price represents the grand total paid, use this to calculate
 * the base amount (actual rent) before taxes and fees.
 * 
 * Formula: baseAmount = (grandTotal - fixedCharges) / (1 + vatRate + tourismLevyRate + serviceFeeRate)
 */
export function calculateBaseAmountFromTotal(grandTotal: number): number {
  const fixedCharges = 500.00 + 300.00 + 200.00; // Maintenance + Generator + Water
  const taxRate = 0.15 + 0.01 + 0.02; // VAT + Tourism Levy + Service Fee = 18%
  const baseAmount = (grandTotal - fixedCharges) / (1 + taxRate);
  return roundToTwoDecimals(baseAmount);
}

/**
 * Generate receipt data from booking and payment information
 * 
 * @param grandTotal - The actual rent amount paid (booking price) - this becomes the grand total
 */
export function generateReceiptData(
  bookingId: string,
  grandTotal: number,
  customerName: string,
  propertyName: string,
  paymentReference: string,
  paymentMethod: string
): ReceiptData {
  const breakdown = calculateReceiptBreakdown(grandTotal);
  
  // Generate receipt number (format: RCP-YYYYMMDD-XXXX)
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const receiptNumber = `RCP-${dateStr}-${randomStr}`;

  return {
    receiptNumber,
    dateTime: now.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    customerName,
    propertyName,
    paymentReference,
    paymentMethod,
    breakdown,
  };
}

/**
 * Round number to 2 decimal places
 */
function roundToTwoDecimals(num: number): number {
  return Math.round(num * 100) / 100;
}

/**
 * Format currency in Ghana Cedis
 */
export function formatCurrency(amount: number): string {
  return `GHS ${amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

