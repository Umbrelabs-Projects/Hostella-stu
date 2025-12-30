// utils/printBookingDetails.ts

import { jsPDF } from "jspdf";
// Note: If you see a 'Cannot find module qrcode' error, ensure 'qrcode' is installed and available in node_modules.
// @ts-ignore
import QRCode from "qrcode";
import { useAuthStore } from "@/store/useAuthStore";
import { Booking } from "@/types/bookingStatus";
import { generateReceiptData, formatCurrency } from "@/utils/receiptCalculator";

// Company Legal Identity (replace with real values)
const COMPANY = {
  name: "Hostella Technologies Limited",
  regNumber: "RC1234567",
  tin: "C0000000001",
  address: "123 Main Street, Accra, Ghana",
  country: "Ghana",
  email: "info@hostella.com",
  phone: "+233 20 000 0000",
  verificationBaseUrl: "https://verify.hostella.com/",
  logoUrl: "/public/icons/hostella-logo.svg", // Update path as needed
};

// Utility to load logo as base64 (for jsPDF)
async function getLogoBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/**
 * Generates a downloadable PDF receipt with all required international elements.
 * @param booking Booking object
 * @param options Optional: { usdRate, usdAmount, paymentTraceId, paymentTimestamp, receiptType, version, language }
 */
export async function printBookingDetails(
  booking: Booking,
  options?: {
    usdRate?: number;
    usdAmount?: number;
    paymentTraceId?: string;
    paymentTimestamp?: string;
    receiptType?: string;
    version?: string;
    language?: string;
  }
) {
  const { user } = useAuthStore.getState();
  if (!booking) {
    alert("No booking details available to download.");
    return;
  }

  // Receipt Data
  const receipt = generateReceiptData(
    String(booking.bookingId || booking.id || "N/A"),
    Number(booking.price) || 0,
    `${user?.firstName || booking.firstName || ""} ${user?.lastName || booking.lastName || ""}`.trim(),
    booking.hostelName || "N/A",
    (booking as any).payment?.reference || "N/A",
    (booking as any).payment?.method || (booking as any).payment?.provider || "N/A"
  );

  // PDF Setup
  const doc = new jsPDF();
  let y = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;

  // Branding: Logo
  const logoBase64 = await getLogoBase64(COMPANY.logoUrl);
  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", margin, y - 10, 30, 18);
  }

  // Receipt Type & Version
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(options?.receiptType || "Tax Receipt", pageWidth - margin, y, { align: "right" });
  if (options?.version) {
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`v${options.version}`, pageWidth - margin, y + 6, { align: "right" });
  }
  y += 10;

  // Company Legal Identity (Header)
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(COMPANY.name, margin, y);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Reg. No: ${COMPANY.regNumber} | TIN: ${COMPANY.tin} | ${COMPANY.address}, ${COMPANY.country}`,
    margin,
    y + 6
  );
  doc.text(`Email: ${COMPANY.email} | Tel: ${COMPANY.phone}`, margin, y + 12);
  y += 20;

  // ISSUED BY / BILLED TO
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("ISSUED BY", margin, y);
  doc.text("BILLED TO", pageWidth / 2 + 10, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.text("Hostella Booking System", margin, y);
  doc.text(receipt.customerName, pageWidth / 2 + 10, y);
  y += 5;
  doc.text(COMPANY.name, margin, y);
  doc.text(booking.email || user?.email || "N/A", pageWidth / 2 + 10, y);
  y += 5;
  doc.text(COMPANY.address, margin, y);
  doc.text(booking.phone || "N/A", pageWidth / 2 + 10, y);
  y += 10;

  // Property Relationship
  doc.setFont("helvetica", "bold");
  doc.text("Property Partner:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text((booking.hostelName || "N/A"), margin + 40, y);
  y += 5;
  doc.setFont("helvetica", "italic");
  doc.text("Operated via Hostella Booking System", margin, y);
  y += 8;

  // Stay/Service Period
  doc.setFont("helvetica", "bold");
  doc.text("Stay Period:", margin, y);
  doc.setFont("helvetica", "normal");
  // Use reportingDate as check-in, and assignedAt as check-out if available
  let stayPeriod = "N/A";
  if (booking.reportingDate && booking.assignedAt) {
    stayPeriod = `${new Date(booking.reportingDate).toLocaleDateString()} - ${new Date(booking.assignedAt).toLocaleDateString()}`;
  } else if (booking.reportingDate) {
    stayPeriod = `${new Date(booking.reportingDate).toLocaleDateString()}`;
  }
  doc.text(stayPeriod, margin + 30, y);
  y += 10;

  // Receipt Info
  doc.setFont("helvetica", "bold");
  doc.text("Receipt No:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(receipt.receiptNumber, margin + 30, y);
  doc.setFont("helvetica", "bold");
  doc.text("Date:", pageWidth / 2, y);
  doc.setFont("helvetica", "normal");
  doc.text(receipt.dateTime, pageWidth / 2 + 15, y);
  y += 8;

  // Currency & FX
  doc.setFont("helvetica", "bold");
  doc.text("Currency:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text("GHS (ISO 4217)", margin + 25, y);
  if (options?.usdAmount && options?.usdRate) {
    doc.text(`USD Equivalent (Info): $${options.usdAmount.toFixed(2)}`, margin + 70, y);
    y += 5;
    doc.text(`Exchange Rate: 1 USD = ${options.usdRate} GHS`, margin + 70, y);
  }
  y += 8;

  // Financial Summary
  doc.setFont("helvetica", "bold");
  doc.text("Amount Before Tax:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(formatCurrency(receipt.breakdown.baseAmount), pageWidth - margin, y, { align: "right" });
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Total Tax (VAT, Levies, Fees):", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(formatCurrency(receipt.breakdown.totalTaxesAndLevies), pageWidth - margin, y, { align: "right" });
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Total Non-Tax Charges:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(formatCurrency(receipt.breakdown.totalFixedCharges), pageWidth - margin, y, { align: "right" });
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total (Paid):", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(formatCurrency(receipt.breakdown.grandTotal), pageWidth - margin, y, { align: "right" });
  y += 10;

  // Payment Processor Trace
  if (options?.paymentTraceId || options?.paymentTimestamp) {
    doc.setFont("helvetica", "bold");
    doc.text("Processed via:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(receipt.paymentMethod, margin + 30, y);
    if (options.paymentTraceId) {
      doc.text(`Reference Trace ID: ${options.paymentTraceId}`, margin + 70, y);
    }
    y += 5;
    if (options.paymentTimestamp) {
      doc.text(`Payment Confirmation: ${options.paymentTimestamp}`, margin + 70, y);
    }
    y += 8;
  }

  // Tax Compliance Language
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text(
    "VAT charged in accordance with Ghana Revenue Authority (GRA) regulations.",
    margin,
    y
  );
  y += 5;

  // Digital Verification (QR + URL)
  const verifyUrl = `${COMPANY.verificationBaseUrl}${receipt.receiptNumber}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 60 });
  doc.addImage(qrDataUrl, "PNG", margin, y, 20, 20);
  doc.setFont("helvetica", "normal");
  doc.text("Verify: ", margin + 25, y + 8);
  doc.setTextColor(37, 99, 235);
  doc.textWithLink(verifyUrl, margin + 40, y + 8, { url: verifyUrl });
  doc.setTextColor(0, 0, 0);
  y += 25;

  // Terms & Disclaimer
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text(
    "This is an electronically generated receipt and is valid without signature or stamp. Disputes must be reported within 48 hours of issuance.",
    margin,
    y
  );
  y += 5;
  doc.text("This receipt is valid for tax and audit purposes.", margin, y);

  // Save PDF
  doc.save(`receipt-${receipt.receiptNumber}.pdf`);
}
