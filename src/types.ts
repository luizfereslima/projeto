export type Specialty = 'Psicologia' | 'Nutrição' | 'Fisioterapia' | 'Dermatologia'

export interface Service {
  id: string
  name: string
  description: string
  durationMinutes: number
  price: number
}

export interface AvailabilitySlot {
  id: string
  professionalId: string
  date: string
  time: string
}

export interface Professional {
  id: string
  name: string
  role: string
  specialty: Specialty
  bio: string
  initials: string
  accent: 'sage' | 'clay' | 'ochre'
  services: Service[]
  availability: AvailabilitySlot[]
}

export interface Appointment {
  id: string
  professionalId: string
  professionalName: string
  serviceId: string
  serviceName: string
  date: string
  time: string
  durationMinutes: number
  price: number
  createdAt: string
}
