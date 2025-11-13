"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ContactForm } from "./components/ContactForm";
import { ContactCard } from "./components/ContactCard";
import { HealthInfo } from "./components/HealthInfo";
import { EmergencyContact, HealthDetails } from "./components/types";

interface EmergencyDetailsProps {
  initialHealthDetails?: HealthDetails | null;
}

export const EmergencyDetails = ({
  initialHealthDetails,
}: EmergencyDetailsProps) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: "1",
      name: "Jane Smith",
      relationship: "Mother",
      phone: "+1 (555) 123-4567",
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<EmergencyContact, "id">>({
    name: "",
    relationship: "",
    phone: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [healthDetails, setHealthDetails] = useState<HealthDetails | null>(
    initialHealthDetails || null
  );

  const handleAddOrUpdateContact = () => {
    if (editingId) {
      setContacts(
        contacts.map((c) => (c.id === editingId ? { ...c, ...formData } : c))
      );
      setEditingId(null);
    } else {
      setContacts([...contacts, { id: Date.now().toString(), ...formData }]);
    }
    setFormData({ name: "", relationship: "", phone: "" });
    setShowForm(false);
  };

  const handleEditContact = (contact: EmergencyContact) => {
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
    });
    setEditingId(contact.id);
    setShowForm(true);
  };

  const handleDeleteContact = (id: string) =>
    setContacts(contacts.filter((c) => c.id !== id));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-8 space-y-6">
      {/* Contacts Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Emergency Contacts
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Add trusted contacts to be notified in emergencies
          </p>
        </div>
        {!editingId && (
          <Button
            onClick={() => {
              setShowForm(true);
              setFormData({ name: "", relationship: "", phone: "" });
              setEditingId(null);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" /> Add Contact
          </Button>
        )}
      </div>

      {/* Contact Form */}
      {showForm && (
        <ContactForm
          formData={formData}
          onChange={(field, value) =>
            setFormData((prev) => ({ ...prev, [field]: value }))
          }
          onCancel={() => {
            setShowForm(false);
            setEditingId(null);
            setFormData({ name: "", relationship: "", phone: "" });
          }}
          onSave={handleAddOrUpdateContact}
          editing={!!editingId}
        />
      )}

      {/* Contacts List */}
      {!editingId && (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onEdit={handleEditContact}
              onDelete={handleDeleteContact}
            />
          ))}
          {contacts.length === 0 && !showForm && (
            <div className="text-center py-8 text-gray-500">
              <p>No emergency contacts added yet</p>
            </div>
          )}
        </div>
      )}

      {/* Health Info */}
      <HealthInfo healthDetails={healthDetails} onUpdate={setHealthDetails} />
    </div>
  );
};
