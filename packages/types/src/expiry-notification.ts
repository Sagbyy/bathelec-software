export interface ExpiryNotification {
  id: number;
  technicianId: number;
  technicianName: string;
  documentKey: string;
  documentLabel: string;
  expiresAt: string;
  threshold: number;
  createdAt: string;
  acknowledged: boolean;
}
