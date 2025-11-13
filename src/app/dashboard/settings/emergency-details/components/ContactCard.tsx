"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { EmergencyContact } from "./types";

interface ContactCardProps {
  contact: EmergencyContact;
  onEdit: (contact: EmergencyContact) => void;
  onDelete: (id: string) => void;
}

export const ContactCard = ({
  contact,
  onEdit,
  onDelete,
}: ContactCardProps) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition gap-3">
    {/* Contact Info */}
    <div className="flex-1">
      <p className="font-medium text-gray-900">{contact.name}</p>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-1 text-sm text-gray-600">
        <span>{contact.relationship}</span>
        <span>{contact.phone}</span>
      </div>
    </div>

    {/* Actions */}
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <Button
        onClick={() => onEdit(contact)}
        variant="outline"
        className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto text-sm"
      >
        Edit
      </Button>
      <button
        onClick={() => onDelete(contact.id)}
        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition w-full sm:w-auto flex justify-center"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);
