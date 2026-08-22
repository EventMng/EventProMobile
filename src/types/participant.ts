export interface Participant {
  id: string;
  fullName: string;
  email: string;
  imageUrl?: string;
}

export interface AssignedEvent {
  id: string;
  name: string;
  location?: string;
  eventDate: string;
  status?: 'LIVE' | 'SCHEDULED' | 'COMPLETED' | string;
  organization?: { name: string };
  startsAt?: string;
}
