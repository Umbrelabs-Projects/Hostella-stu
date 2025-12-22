export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string; // Frontend uses "relationship", backend uses "relation"
  phone: string;
}

export interface HealthDetails {
  bloodType?: string;
  allergies?: string;
  conditions?: string;
}
