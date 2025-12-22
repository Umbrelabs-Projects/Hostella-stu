"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ContactForm } from "./components/ContactForm";
import { ContactCard } from "./components/ContactCard";
import { HealthInfo } from "./components/HealthInfo";
import { EmergencyContact, HealthDetails } from "./components/types";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { SkeletonForm } from "@/components/ui/skeleton";

export const EmergencyDetails = () => {
  const { user, fetchProfile, loading: storeLoading } = useAuthStore();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<EmergencyContact, "id">>({
    name: "",
    relationship: "",
    phone: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [healthDetails, setHealthDetails] = useState<HealthDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

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

  // Initialize health details from user data
  useEffect(() => {
    if (user) {

      // Build health details from user data
      if (user.bloodType || user.allergies || user.healthCondition) {
        setHealthDetails({
          bloodType: user.bloodType || "",
          allergies: user.allergies || "",
          conditions: user.healthCondition || "",
        });
      } else {
        setHealthDetails(null);
      }
    } else {
      setHealthDetails(null);
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

      {/* Health Info */}
      <HealthInfo 
        healthDetails={healthDetails} 
        onUpdate={async (data: HealthDetails) => {
          try {
            setLoading(true);
            const { apiFetch, ApiResponse } = await import('@/lib/api');
            const { user } = useAuthStore.getState();
            
            if (!user?.id) {
              toast.error("User not found. Please refresh the page.");
              return;
            }

            const response = await apiFetch<ApiResponse<typeof user>>("/auth/profile", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                bloodType: data.bloodType?.trim() || null,
                allergies: data.allergies?.trim() || null,
                healthCondition: data.conditions?.trim() || null,
                hasHealthCondition: Boolean(data.conditions?.trim()), // Send as boolean, not string
              }),
            });

            // Update store with new user data
            useAuthStore.setState({ user: response.data });
            setHealthDetails(data);
            toast.success("Health information saved successfully");
          } catch (error) {
            toast.error("Failed to save health information");
            console.error("Error saving health info:", error);
            throw error;
          } finally {
            setLoading(false);
          }
        }} 
      />
    </div>
  );
};
