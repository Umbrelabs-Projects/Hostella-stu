"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useBookingStore } from "@/store/useBookingStore";
import { usePaymentStore } from "@/store/usePaymentStore";
import { useAuthStore } from "@/store/useAuthStore";
import { generateReceiptData, formatCurrency, ReceiptData } from "@/utils/receiptCalculator";
import { Download, ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SkeletonCard } from "@/components/ui/skeleton";
import { jsPDF } from "jspdf";

export default function ReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.id as string;
  const { selectedBooking, loading: bookingLoading, fetchBookingById } = useBookingStore();
  const { currentPayment, loading: paymentLoading, fetchPaymentsByBookingId } = usePaymentStore();
  const { user } = useAuthStore();
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  useEffect(() => {
    if (bookingId) {
      fetchBookingById(bookingId);
      fetchPaymentsByBookingId(bookingId);
    }
  }, [bookingId, fetchBookingById, fetchPaymentsByBookingId]);

  useEffect(() => {
    if (selectedBooking && currentPayment && user) {
      // Only generate receipt if payment is confirmed
      const isPaymentConfirmed = 
        currentPayment.status === 'CONFIRMED' || 
        currentPayment.status === 'completed' ||
        selectedBooking.status === 'approved' ||
        selectedBooking.status === 'pending approval';

      if (isPaymentConfirmed) {
        // The booking price is the grand total (Actual Rent Paid)
        // The base amount and all charges are calculated backwards to add up to this total
        const grandTotal = parseFloat(selectedBooking.price || '0');
        
        const customerName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Customer';
        const propertyName = selectedBooking.hostelName || 'Hostel';
        const paymentReference = currentPayment.reference || selectedBooking.bookingId || 'N/A';
        const paymentMethod = 
          currentPayment.provider === 'BANK_TRANSFER' ? 'Bank Transfer' :
          currentPayment.provider === 'PAYSTACK' ? 'Mobile Money (Paystack)' :
          'Payment';

        const receipt = generateReceiptData(
          bookingId,
          grandTotal,
          customerName,
          propertyName,
          paymentReference,
          paymentMethod
        );
        
        setReceiptData(receipt);
      }
    }
  }, [selectedBooking, currentPayment, user, bookingId]);

  const handleDownloadPDF = () => {
    if (!receiptData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPos = margin;

    // Helper function to add text with word wrap
    const addText = (text: string, fontSize: number, isBold: boolean = false, align: 'left' | 'center' | 'right' = 'left', color: [number, number, number] = [0, 0, 0]) => {
      doc.setFontSize(fontSize);
      if (isBold) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      doc.setTextColor(color[0], color[1], color[2]);
      
      const lines = doc.splitTextToSize(text, contentWidth);
      lines.forEach((line: string) => {
        if (yPos > pageHeight - 30) {
          doc.addPage();
          yPos = margin;
        }
        doc.text(line, align === 'center' ? pageWidth / 2 : align === 'right' ? pageWidth - margin : margin, yPos, { align });
        yPos += fontSize * 0.5;
      });
    };

    // Helper function to draw a line
    const drawLine = (y: number, color: [number, number, number] = [200, 200, 200]) => {
      doc.setDrawColor(color[0], color[1], color[2]);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
    };

    // Helper function to draw a filled rectangle (for header background)
    const drawRect = (x: number, y: number, width: number, height: number, color: [number, number, number]) => {
      doc.setFillColor(color[0], color[1], color[2]);
      doc.rect(x, y, width, height, 'F');
    };

    // Helper function to check and add new page if needed
    const checkPageBreak = (requiredSpace: number = 30) => {
      if (yPos + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
        return true;
      }
      return false;
    };

    // Header with background
    const headerHeight = 35;
    drawRect(margin, yPos - 5, contentWidth, headerHeight, [37, 99, 235]); // Blue background
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT RECEIPT', pageWidth / 2, yPos + 8, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Hostella Booking System', pageWidth / 2, yPos + 15, { align: 'center' });
    yPos += headerHeight + 10;
    doc.setTextColor(0, 0, 0);

    // Receipt Info Box
    const infoBoxY = yPos;
    doc.setFillColor(249, 250, 251); // Light gray background
    doc.rect(margin, infoBoxY, contentWidth, 25, 'F');
    doc.setDrawColor(229, 231, 235);
    doc.rect(margin, infoBoxY, contentWidth, 25, 'S');
    
    yPos += 8;
    addText(`Receipt Number: ${receiptData.receiptNumber}`, 10, true, 'left', [0, 0, 0]);
    yPos += 5;
    addText(`Date & Time: ${receiptData.dateTime}`, 10, false, 'left', [75, 85, 99]);
    yPos += 12;

    // Customer Information Section
    addText('CUSTOMER INFORMATION', 14, true, 'left', [37, 99, 235]);
    yPos += 3;
    drawLine(yPos, [229, 231, 235]);
    yPos += 8;

    const customerInfo = [
      { label: 'Customer / Tenant Name', value: receiptData.customerName },
      { label: 'Property / Hostel Name', value: receiptData.propertyName },
      { label: 'Payment Reference', value: receiptData.paymentReference },
      { label: 'Payment Method', value: receiptData.paymentMethod },
    ];

    customerInfo.forEach((info, index) => {
      checkPageBreak(10);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128); // Gray
      doc.text(info.label + ':', margin, yPos);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(info.value, margin + 80, yPos);
      yPos += 6;
      if (index < customerInfo.length - 1) {
        drawLine(yPos - 2, [243, 244, 246]);
        yPos += 3;
      }
    });

    yPos += 8;

    // Charge Breakdown Section
    addText('CHARGE BREAKDOWN', 14, true, 'left', [37, 99, 235]);
    yPos += 3;
    drawLine(yPos, [229, 231, 235]);
    yPos += 8;

    // Base Charge
    doc.setFillColor(249, 250, 251);
    doc.rect(margin, yPos - 3, contentWidth, 12, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Base Charge', margin + 5, yPos + 3);
    doc.setFont('helvetica', 'normal');
    doc.text(formatCurrency(receiptData.breakdown.baseAmount), pageWidth - margin - 5, yPos + 3, { align: 'right' });
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text('Actual Rent / Base Service Amount', margin + 5, yPos + 7);
    yPos += 15;

    // Statutory Charges
    doc.setFillColor(239, 246, 255); // Light blue
    doc.rect(margin, yPos - 3, contentWidth, 40, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Statutory Charges', margin + 5, yPos + 3);
    yPos += 8;
    
    const statutoryCharges = [
      { label: 'VAT (15%)', amount: receiptData.breakdown.vat },
      { label: 'Tourism Levy (1%)', amount: receiptData.breakdown.tourismLevy },
      { label: 'Service Fee (2%)', amount: receiptData.breakdown.serviceFee },
    ];

    statutoryCharges.forEach((charge) => {
      checkPageBreak(10);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(charge.label, margin + 10, yPos);
      doc.text(formatCurrency(charge.amount), pageWidth - margin - 5, yPos, { align: 'right' });
      yPos += 6;
    });
    yPos += 5;

    // Fixed Charges
    doc.setFillColor(240, 253, 244); // Light green
    doc.rect(margin, yPos - 3, contentWidth, 40, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Fixed Charges', margin + 5, yPos + 3);
    yPos += 8;

    const fixedCharges = [
      { label: 'Maintenance Fee', amount: receiptData.breakdown.maintenanceFee },
      { label: 'Generator Fee', amount: receiptData.breakdown.generatorFee },
      { label: 'Water Bill', amount: receiptData.breakdown.waterBill },
    ];

    fixedCharges.forEach((charge) => {
      checkPageBreak(10);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(charge.label, margin + 10, yPos);
      doc.text(formatCurrency(charge.amount), pageWidth - margin - 5, yPos, { align: 'right' });
      yPos += 6;
    });
    yPos += 10;

    // Summary Section with highlighted total
    addText('RECEIPT SUMMARY', 14, true, 'left', [37, 99, 235]);
    yPos += 3;
    drawLine(yPos, [229, 231, 235]);
    yPos += 8;

    const summaryItems = [
      { label: 'Subtotal (Base Amount)', amount: receiptData.breakdown.subtotal, bold: false },
      { label: 'Total Taxes & Levies', amount: receiptData.breakdown.totalTaxesAndLevies, bold: false },
      { label: 'Total Fixed Charges', amount: receiptData.breakdown.totalFixedCharges, bold: false },
    ];

    summaryItems.forEach((item) => {
      checkPageBreak(10);
      doc.setFontSize(10);
      doc.setFont('helvetica', item.bold ? 'bold' : 'normal');
      doc.setTextColor(107, 114, 128);
      doc.text(item.label, margin, yPos);
      doc.setTextColor(0, 0, 0);
      doc.text(formatCurrency(item.amount), pageWidth - margin, yPos, { align: 'right' });
      yPos += 6;
    });

    yPos += 3;
    drawLine(yPos, [200, 200, 200]);
    yPos += 5;

    // Check if we need a new page for grand total and footer
    checkPageBreak(60);

    // Grand Total - Highlighted
    doc.setFillColor(37, 99, 235); // Blue background
    doc.rect(margin, yPos - 5, contentWidth, 18, 'F');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('Grand Total Paid (GHS)', margin + 5, yPos + 5);
    doc.text(formatCurrency(receiptData.breakdown.grandTotal), pageWidth - margin - 5, yPos + 5, { align: 'right' });
    yPos += 20;

    // Footer
    yPos += 5;
    
    // Check if we need a new page for footer
    checkPageBreak(40);
    
    drawLine(yPos, [229, 231, 235]);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 197, 94); // Green
    doc.text('Payment Status: PAID', pageWidth / 2, yPos, { align: 'center' });
    yPos += 6;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(107, 114, 128);
    doc.text('This is a system-generated receipt and does not require a signature.', pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
    doc.text('Generated by Hostella Booking System', pageWidth / 2, yPos, { align: 'center' });

    // Download PDF
    doc.save(`Receipt-${receiptData.receiptNumber}.pdf`);
  };

  if (bookingLoading || paymentLoading || !selectedBooking) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <SkeletonCard />
      </div>
    );
  }

  // Check if payment is confirmed
  const isPaymentConfirmed = 
    currentPayment && (
      currentPayment.status === 'CONFIRMED' || 
      currentPayment.status === 'completed' ||
      selectedBooking.status === 'approved' ||
      selectedBooking.status === 'pending approval'
    );

  if (!isPaymentConfirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Receipt Not Available</h2>
          <p className="text-gray-600 mb-6">
            Receipt is only available after payment has been confirmed.
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!receiptData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Actions */}
        <div className="mb-6 flex items-center justify-between">
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>

        {/* Receipt Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 print:shadow-none">
          {/* Receipt Header */}
          <div className="text-center mb-8 border-b pb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">PAYMENT RECEIPT</h1>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Receipt Number:</strong> {receiptData.receiptNumber}</p>
              <p><strong>Date & Time:</strong> {receiptData.dateTime}</p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-8 space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Customer / Tenant Name:</span>
                <p className="font-medium text-gray-900">{receiptData.customerName}</p>
              </div>
              <div>
                <span className="text-gray-600">Property / Hostel Name:</span>
                <p className="font-medium text-gray-900">{receiptData.propertyName}</p>
              </div>
              <div>
                <span className="text-gray-600">Payment Reference / Transaction ID:</span>
                <p className="font-medium text-gray-900">{receiptData.paymentReference}</p>
              </div>
              <div>
                <span className="text-gray-600">Payment Method:</span>
                <p className="font-medium text-gray-900">{receiptData.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Charge Breakdown */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Charge Breakdown</h2>
            
            {/* Base Charge */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Base Charge</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Actual Rent / Base Service Amount</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(receiptData.breakdown.baseAmount)}</span>
                </div>
              </div>
            </div>

            {/* Statutory Charges */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Statutory Charges (Percentage-Based)</h3>
              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">VAT (15%)</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(receiptData.breakdown.vat)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Tourism Levy (1%)</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(receiptData.breakdown.tourismLevy)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Service Fee (2%)</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(receiptData.breakdown.serviceFee)}</span>
                </div>
              </div>
            </div>

            {/* Fixed Charges */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Fixed Charges</h3>
              <div className="bg-green-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Maintenance Fee</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(receiptData.breakdown.maintenanceFee)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Generator Fee</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(receiptData.breakdown.generatorFee)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Water Bill</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(receiptData.breakdown.waterBill)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Receipt Summary */}
          <div className="border-t pt-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Receipt Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Subtotal (Base Amount)</span>
                <span className="font-medium text-gray-900">{formatCurrency(receiptData.breakdown.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Total Taxes & Levies</span>
                <span className="font-medium text-gray-900">{formatCurrency(receiptData.breakdown.totalTaxesAndLevies)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Total Fixed Charges</span>
                <span className="font-medium text-gray-900">{formatCurrency(receiptData.breakdown.totalFixedCharges)}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
                <span className="text-lg font-bold text-gray-900">Grand Total Paid (GHS)</span>
                <span className="text-xl font-bold text-blue-600">{formatCurrency(receiptData.breakdown.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Receipt Footer */}
          <div className="border-t pt-6 text-center text-sm text-gray-600">
            <p className="font-semibold text-green-600 mb-2">Payment Status: PAID</p>
            <p className="italic">
              This is a system-generated receipt and does not require a signature.
            </p>
            <p className="mt-4 text-xs">
              Generated by Hostella Booking System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

