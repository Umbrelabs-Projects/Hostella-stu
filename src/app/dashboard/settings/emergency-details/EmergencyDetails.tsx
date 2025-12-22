"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ContactForm } from "./components/ContactForm";
import { ContactCard } from "./components/ContactCard";
import EmergencyContactForm from "../profile-settings/components/EmergencyContactForm";
import { EmergencyContact } from "./components/types";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { SkeletonForm } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api";

export const EmergencyDetails = () => {
  const { user, updateProfile, fetchProfile, loading: storeLoading } = useAuthStore();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<EmergencyContact, "id">>({
    name: "",
    relationship: "",
    phone: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Legacy Emergency Contact (Single Contact)
  const [emergencyContactName, setEmergencyContactName] = useState(user?.emergencyContactName || "");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(user?.emergencyContactPhone || "");
  const [emergencyContactRelation, setEmergencyContactRelation] = useState(user?.emergencyContactRelation || "");

  // Load emergency contacts from API
  const loadEmergencyContacts = async () => {
    try {
      const { emergencyContactsApi } = await import('@/lib/api');
      const response = await emergencyContactsApi.getAll();
      // Map backend response (relation) to frontend format (relationship)
      const mappedContacts: EmergencyContact[] = response.data.map((contact) => ({
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relation,
      }));
      setContacts(mappedContacts);
    } catch (error) {
      console.error("Error loading emergency contacts:", error);
      // Fallback to legacy format if API fails
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.emergencyContactName && currentUser?.emergencyContactPhone) {
        setContacts([{
          id: "1",
          name: currentUser.emergencyContactName,
          relationship: currentUser.emergencyContactRelation || "",
          phone: currentUser.emergencyContactPhone,
        }]);
      }
    }
  };

  // Fetch emergency contacts and user data on mount
  useEffect(() => {
    const loadData = async () => {
      setInitialLoading(true);
      try {
        // Fetch both profile and emergency contacts
        await Promise.all([
          fetchProfile(),
          loadEmergencyContacts(),
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchProfile]);

  // Update legacy contact form when user data changes
  useEffect(() => {
    if (user) {
      setEmergencyContactName(user.emergencyContactName || "");
      setEmergencyContactPhone(user.emergencyContactPhone || "");
      setEmergencyContactRelation(user.emergencyContactRelation || "");
    }
  }, [user]);

  const handleAddOrUpdateContact = async () => {
    // Validate required fields (matching backend validation)
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Phone is required");
      return;
    }
    if (!formData.relationship.trim()) {
      toast.error("Relation is required");
      return;
    }

    try {
      setLoading(true);
      const { emergencyContactsApi } = await import('@/lib/api');
      
      if (editingId) {
        // Update existing contact
        const response = await emergencyContactsApi.update(editingId, {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          relation: formData.relationship.trim(),
        });
        
        // Update local state
        setContacts(contacts.map((c) => 
          c.id === editingId 
            ? { ...c, name: response.data.name, phone: response.data.phone, relationship: response.data.relation }
            : c
        ));
        
        toast.success("Emergency contact updated successfully");
      } else {
        // Create new contact
        const response = await emergencyContactsApi.create({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          relation: formData.relationship.trim(),
        });
        
        // Add to local state
        const newContact: EmergencyContact = {
          id: response.data.id,
          name: response.data.name,
          phone: response.data.phone,
          relationship: response.data.relation,
        };
        setContacts([...contacts, newContact]);
        
        toast.success("Emergency contact added successfully");
      }
      
      setFormData({ name: "", relationship: "", phone: "" });
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      toast.error("Failed to save emergency contact");
      console.error("Error saving emergency contact:", error);
      // Reload contacts on error
      await loadEmergencyContacts();
    } finally {
      setLoading(false);
    }
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

  const handleDeleteContact = async (id: string) => {
    try {
      setLoading(true);
      const { emergencyContactsApi } = await import('@/lib/api');
      
      // Delete from backend
      await emergencyContactsApi.delete(id);
      
      // Update local state
      setContacts(contacts.filter((c) => c.id !== id));
      
      toast.success("Emergency contact deleted successfully");
    } catch (error: unknown) {
      // Extract error message from API response
      let errorMessage = "Failed to delete emergency contact";
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as { message: string }).message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      console.error("Error deleting emergency contact:", error);
      // Reload contacts on error
      await loadEmergencyContacts();
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLegacyContact = async () => {
    try {
      setLoading(true);
      
      // Prepare update data for legacy emergency contact
      const updateData: Record<string, string | null> = {
        emergencyContactName: emergencyContactName.trim() || null,
        emergencyContactPhone: emergencyContactPhone.trim() || null,
        emergencyContactRelation: emergencyContactRelation.trim() || null,
      };

      // Use FormData for updates
      const formData = new FormData();
      
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });
      
      await updateProfile(formData);
      
      // Refresh profile to get all updated data from backend
      await fetchProfile();
      
      toast.success("Emergency contact updated successfully");
    } catch (error: unknown) {
      let errorMessage = "Failed to update emergency contact";
      if (error instanceof ApiError) {
        errorMessage = error.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      toast.error(errorMessage);
      console.error("Error updating emergency contact:", error);
    } finally {
      setLoading(false);
    }
  };

  // Show skeleton while loading
  if (initialLoading || storeLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-8 space-y-6">
        <SkeletonForm fields={3} />
        <div className="mt-6">
          <SkeletonForm fields={3} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Multiple Emergency Contacts Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-8 space-y-6">
        {/* Contacts Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Emergency Contacts
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Add multiple trusted contacts to be notified in emergencies
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
            loading={loading}
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
      </div>

      {/* Legacy Single Emergency Contact Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Legacy Emergency Contact
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Single emergency contact (legacy format). For multiple contacts, use the section above.
          </p>
        </div>

        <EmergencyContactForm
          emergencyContactName={emergencyContactName}
          emergencyContactPhone={emergencyContactPhone}
          emergencyContactRelation={emergencyContactRelation}
          onChange={(field, value) => {
            if (field === "emergencyContactName") setEmergencyContactName(value);
            else if (field === "emergencyContactPhone") setEmergencyContactPhone(value);
            else if (field === "emergencyContactRelation") setEmergencyContactRelation(value);
          }}
        />

        <div className="pt-4">
          <Button
            onClick={handleSaveLegacyContact}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};
