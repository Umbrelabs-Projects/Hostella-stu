"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useBookingStore } from "@/store/useBookingStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Download, ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton";
import { generateRoomDetailsPDF } from "@/utils/roomDetailsPDF";
import { Booking } from "@/types/api";
import { jsPDF } from "jspdf";

export default function RoomDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.id as string;
  const { selectedBooking, loading: bookingLoading, fetchBookingById } = useBookingStore();
  const { user } = useAuthStore();
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (bookingId) {
      fetchBookingById(bookingId);
    }
  }, [bookingId, fetchBookingById]);

  useEffect(() => {
    if (selectedBooking && selectedBooking.status === 'room_allocated') {
      // Generate PDF and convert to data URL for viewing
      try {
        const doc = generateRoomDetailsPDFForView(selectedBooking, user);
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        setPdfDataUrl(url);
      } catch (error) {
        console.error('Failed to generate PDF:', error);
      }
    }
  }, [selectedBooking, user]);

  const handleDownloadPDF = () => {
    if (selectedBooking) {
      generateRoomDetailsPDF(selectedBooking);
    }
  };

  if (bookingLoading || !selectedBooking) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <SkeletonCard />
      </div>
    );
  }

  if (selectedBooking.status !== 'room_allocated') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600">Room not yet allocated for this booking.</p>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
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

        {/* PDF Viewer */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {pdfDataUrl ? (
            <iframe
              src={pdfDataUrl}
              className="w-full h-[calc(100vh-200px)] min-h-[800px] border-0"
              title="Room Details PDF"
            />
          ) : (
            <div className="flex items-center justify-center h-[800px]">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Loading PDF...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to generate PDF for viewing (returns jsPDF instance instead of downloading)
function generateRoomDetailsPDFForView(booking: Booking, user?: { studentRefNumber?: string; studentId?: string } | null) {
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

  // Helper function to check and add new page if needed
  const checkPageBreak = (requiredSpace: number = 30) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  // Helper function to draw a line
  const drawLine = (y: number, color: [number, number, number] = [200, 200, 200]) => {
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
  };

  // Helper function to draw a filled rectangle
  const drawRect = (x: number, y: number, width: number, height: number, color: [number, number, number]) => {
    doc.setFillColor(color[0], color[1], color[2]);
    doc.rect(x, y, width, height, 'F');
  };

  // Header with background
  const headerHeight = 35;
  drawRect(margin, yPos - 5, contentWidth, headerHeight, [37, 99, 235]); // Blue background
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('ROOM ASSIGNMENT DETAILS', pageWidth / 2, yPos + 8, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Hostella Booking System', pageWidth / 2, yPos + 15, { align: 'center' });
  yPos += headerHeight + 10;
  doc.setTextColor(0, 0, 0);

  // Booking Information Section
  addText('BOOKING INFORMATION', 14, true, 'left', [37, 99, 235]);
  yPos += 3;
  drawLine(yPos, [229, 231, 235]);
  yPos += 8;

  // Get student ID from booking or user store (same pattern as other components)
  const studentId = booking.studentId || user?.studentRefNumber || (user as { studentId?: string })?.studentId || 'N/A';

  const bookingInfo = [
    { label: 'Booking ID', value: booking.bookingId || 'N/A' },
    { label: 'Student Name', value: `${booking.firstName || ''} ${booking.lastName || ''}`.trim() || 'N/A' },
    { label: 'Student ID', value: studentId },
    { label: 'Email', value: booking.email || 'N/A' },
    { label: 'Phone', value: booking.phone || 'N/A' },
    { label: 'Booking Date', value: booking.date ? new Date(booking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
  ];

  bookingInfo.forEach((info) => {
    checkPageBreak(10);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(info.label + ':', margin, yPos);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(info.value, margin + 60, yPos);
    yPos += 6;
  });

  yPos += 8;

  // Room Assignment Section
  checkPageBreak(40);
  addText('ROOM ASSIGNMENT', 14, true, 'left', [37, 99, 235]);
  yPos += 3;
  drawLine(yPos, [229, 231, 235]);
  yPos += 8;

  doc.setFillColor(240, 253, 244); // Light green background
  doc.rect(margin, yPos - 3, contentWidth, 50, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.rect(margin, yPos - 3, contentWidth, 50, 'S');

  const roomInfo = [
    { label: 'Room Number', value: booking.allocatedRoomNumber ? String(booking.allocatedRoomNumber) : 'Not assigned' },
    { label: 'Floor', value: booking.floorNumber ? String(booking.floorNumber) : 'N/A' },
    { label: 'Room Type', value: booking.roomTitle || 'N/A' },
    { label: 'Hostel', value: booking.hostelName || 'N/A' },
  ];

  roomInfo.forEach((info, index) => {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(info.label + ':', margin + 5, yPos + 5 + (index * 8));
    doc.setFont('helvetica', 'normal');
    doc.text(info.value, margin + 60, yPos + 5 + (index * 8));
  });

  yPos += 55;

  // Move-in Date
  if (booking.reportingDate) {
    checkPageBreak(15);
    const reportingDate = new Date(booking.reportingDate);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 197, 94); // Green
    doc.text('Move-in Date:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(
      reportingDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      margin + 50,
      yPos
    );
    yPos += 10;
  }

  yPos += 8;

  // Hostel Information Section
  checkPageBreak(50);
  addText('HOSTEL INFORMATION', 14, true, 'left', [37, 99, 235]);
  yPos += 3;
  drawLine(yPos, [229, 231, 235]);
  yPos += 8;

  const hostelInfo = [
    { label: 'Hostel Name', value: booking.hostelName || 'N/A' },
    { label: 'Address', value: booking.hostelLocation || 'Not available' },
    { label: 'Contact', value: booking.hostelPhoneNumber || 'Not available' },
  ];

  hostelInfo.forEach((info) => {
    checkPageBreak(10);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(info.label + ':', margin, yPos);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(info.value, margin + 50, yPos);
    yPos += 6;
  });

  yPos += 8;

  // Footer
  checkPageBreak(20);
  drawLine(yPos, [229, 231, 235]);
  yPos += 8;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(107, 114, 128);
  doc.text('Generated by Hostella Booking System', pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;
  doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: 'center' });

  return doc;
}

