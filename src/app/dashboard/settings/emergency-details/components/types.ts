export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export interface HealthDetails {
  bloodType?: string;
  allergies?: string;
  conditions?: string;
}
