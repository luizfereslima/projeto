import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Appointment } from '../types'

interface AppointmentsState {
  appointments: Appointment[]
  addAppointment: (appointment: Appointment) => void
}

export const useAppointmentsStore = create<AppointmentsState>()(
  persist(
    (set) => ({
      appointments: [],
      addAppointment: (appointment) =>
        set((state) => ({ appointments: [...state.appointments, appointment] })),
    }),
    { name: 'clinica-viva-appointments', storage: createJSONStorage(() => localStorage) },
  ),
)
