"use client";
import React from "react";
import { Calendar, CheckCircle, MapPin, Phone, Building2 } from "lucide-react";
import { Booking } from "@/types/api";

interface RoomAllocationInfoProps {
  booking: Booking;
  showAllocationMessage?: boolean;
}

export default function RoomAllocationInfo({
  booking,
  showAllocationMessage = false,
}: RoomAllocationInfoProps) {
  const isRoomAllocated = booking.status === 'room_allocated';
  
  if (!isRoomAllocated) {
    return null;
  }

  const reportingDate = booking.reportingDate 
    ? new Date(booking.reportingDate) 
    : null;

  return (
    <div className="flex flex-col gap-4 mt-4 p-5 bg-green-50 border border-green-200 rounded-lg">
      {/* Room Assignment Details */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-green-800 flex items-center gap-2">
          <Building2 size={20} className="text-green-600" />
          Room Assignment
        </h3>
        
        {booking.allocatedRoomNumber && (
          <div className="flex items-center gap-2 text-green-800">
            <Calendar size={18} className="text-green-600" />
            <span className="font-semibold">Room Number:</span>
            <span className="text-lg font-bold">{booking.allocatedRoomNumber}</span>
          </div>
        )}

        {booking.floorNumber !== null && booking.floorNumber !== undefined && (
          <div className="flex items-center gap-2 text-gray-700">
            <Building2 size={18} className="text-gray-500" />
            <span className="font-semibold">Floor:</span>
            <span>{booking.floorNumber}</span>
          </div>
        )}

        {booking.roomTitle && (
          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-semibold">Room Type:</span>
            <span>{booking.roomTitle}</span>
          </div>
        )}

        {reportingDate && (
          <div className="flex items-center gap-2 text-blue-700">
            <Calendar size={18} className="text-blue-600" />
            <span className="font-semibold">Move-in Date:</span>
            <span className="font-bold">
              {reportingDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        )}
      </div>

      {/* Hostel Information */}
      {(booking.hostelName || booking.hostelLocation || booking.hostelPhoneNumber) && (
        <div className="pt-3 border-t border-green-300 space-y-3">
          <h3 className="text-lg font-bold text-green-800 flex items-center gap-2">
            <Building2 size={20} className="text-green-600" />
            Hostel Information
          </h3>
          
          {booking.hostelName && (
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-semibold">Hostel:</span>
              <span>{booking.hostelName}</span>
            </div>
          )}

          {booking.hostelLocation && (
            <div className="flex items-start gap-2 text-gray-700">
              <MapPin size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold">Address: </span>
                <span>{booking.hostelLocation}</span>
              </div>
            </div>
          )}

          {booking.hostelPhoneNumber && (
            <div className="flex items-center gap-2 text-gray-700">
              <Phone size={18} className="text-gray-500" />
              <span className="font-semibold">Contact: </span>
              <a 
                href={`tel:${booking.hostelPhoneNumber}`}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {booking.hostelPhoneNumber}
              </a>
            </div>
          )}
        </div>
      )}

      {showAllocationMessage && (
        <p className="text-sm text-green-700 mt-2 flex items-center gap-2 pt-3 border-t border-green-300">
          <CheckCircle size={16} className="text-green-600" />
          Your room has been allocated! Check the move-in instructions below.
        </p>
      )}
    </div>
  );
}

