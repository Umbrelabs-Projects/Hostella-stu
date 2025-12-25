"use client";
import React, { useState } from "react";
import { X, Calendar, MapPin, Phone, CheckCircle, FileText, Building2 } from "lucide-react";
import { Booking } from "@/types/api";

interface MoveInInstructionsProps {
  booking: Booking;
}

export default function MoveInInstructions({ booking }: MoveInInstructionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (booking.status !== 'room_allocated') {
    return null;
  }

  const reportingDate = booking.reportingDate 
    ? new Date(booking.reportingDate) 
    : null;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 flex items-center gap-2"
      >
        <FileText size={18} />
        View Move-in Instructions
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg flex items-center justify-between">
          <h2 className="text-2xl font-bold">Move-in Instructions</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Your Room Details */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
              <Building2 size={20} className="text-green-600" />
              Your Room Details
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Room Number:</strong> {booking.allocatedRoomNumber || 'Not assigned'}</span>
              </li>
              {booking.floorNumber !== null && booking.floorNumber !== undefined && (
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Floor:</strong> {booking.floorNumber}</span>
                </li>
              )}
              {booking.roomTitle && (
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Room Type:</strong> {booking.roomTitle}</span>
                </li>
              )}
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Hostel:</strong> {booking.hostelName || 'N/A'}</span>
              </li>
              {booking.hostelLocation && (
                <li className="flex items-start gap-2">
                  <MapPin size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Address:</strong> {booking.hostelLocation}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Reporting Date */}
          {reportingDate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                <Calendar size={20} className="text-blue-600" />
                Reporting Date
              </h3>
              <p className="text-gray-700">
                Please report to the hostel on{' '}
                <strong className="text-blue-700">
                  {reportingDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </strong>
              </p>
            </div>
          )}

          {/* What to Bring */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">What to Bring</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Valid student ID</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Booking confirmation (this page or PDF)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Payment receipt (if applicable)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Personal belongings</span>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          {booking.hostelPhoneNumber && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Phone size={20} className="text-gray-600" />
                Contact Information
              </h3>
              <p className="text-gray-700">
                <strong>Hostel Contact:</strong>{' '}
                <a 
                  href={`tel:${booking.hostelPhoneNumber}`}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {booking.hostelPhoneNumber}
                </a>
              </p>
            </div>
          )}

          {/* Important Notes */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Important Notes</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Arrive during office hours (9 AM - 5 PM)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Bring all required documents</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Contact the hostel if you need to reschedule</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 rounded-b-lg">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

