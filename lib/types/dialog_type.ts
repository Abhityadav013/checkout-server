export type DialogType = 'contact' | 'address' | 'time' | 'notes' | null;

export interface DialogPayloadMap {
  contact: { name: string; phoneNumber: string };
  address: { buildingNumber: string; street: string; pincode: string; town: string };
  time: { asap: boolean; scheduledTime: string };
  notes: { notes: string };
}

// Types for state updater map
export type StateUpdaterMap = {
  contact: React.Dispatch<React.SetStateAction<{ name: string; phoneNumber: string }>>;
  address: React.Dispatch<React.SetStateAction<{ pincode: string; buildingNumber: string; street: string; town: string }>>;
  time: React.Dispatch<React.SetStateAction<{ asap: boolean; scheduledTime: string } | null>>;
  notes: React.Dispatch<React.SetStateAction<{ notes: string } | null>>;
};
