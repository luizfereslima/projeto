import type { Appointment, Professional, Service } from '../types'

export const isBookingComplete = (
  professional: Professional | undefined,
  service: Service | undefined,
  date: string,
  time: string,
) => Boolean(professional && service && date && time)

export const buildAppointment = ({
  professional,
  service,
  date,
  time,
}: {
  professional: Professional
  service: Service
  date: string
  time: string
}): Appointment => ({
  id: `${professional.id}-${service.id}-${date}-${time}`,
  professionalId: professional.id,
  professionalName: professional.name,
  serviceId: service.id,
  serviceName: service.name,
  date,
  time,
  durationMinutes: service.durationMinutes,
  price: service.price,
  createdAt: new Date().toISOString(),
})
