import { describe, expect, it } from 'vitest'
import { professionals } from '../data/mockData'
import { buildAppointment, isBookingComplete } from './booking'

describe('fluxo de agendamento', () => {
  const professional = professionals[0]
  const service = professional.services[0]

  it('exige profissional, serviço, data e horário', () => {
    expect(isBookingComplete(undefined, service, '2026-10-06', '09:00')).toBe(false)
    expect(isBookingComplete(professional, undefined, '2026-10-06', '09:00')).toBe(false)
    expect(isBookingComplete(professional, service, '', '09:00')).toBe(false)
    expect(isBookingComplete(professional, service, '2026-10-06', '')).toBe(false)
    expect(isBookingComplete(professional, service, '2026-10-06', '09:00')).toBe(true)
  })

  it('cria agendamento com dados selecionados', () => {
    const appointment = buildAppointment({ professional, service, date: '2026-10-06', time: '09:00' })

    expect(appointment).toMatchObject({
      professionalId: 'ana-moura',
      serviceId: 'ana-terapia',
      date: '2026-10-06',
      time: '09:00',
      durationMinutes: 50,
    })
  })
})
