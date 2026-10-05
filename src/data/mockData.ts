import type { AvailabilitySlot, Professional } from '../types'

// Dados de demonstração locais. Nenhum dado real de paciente é usado no MVP.
const slots = (professionalId: string, date: string, times: string[]): AvailabilitySlot[] =>
  times.map((time) => ({ id: `${professionalId}-${date}-${time}`, professionalId, date, time }))

export const professionals: Professional[] = [
  {
    id: 'ana-moura',
    name: 'Dra. Ana Moura',
    role: 'Psicóloga clínica',
    specialty: 'Psicologia',
    bio: 'Acolhimento para mudanças possíveis, com escuta atenta e prática baseada em evidências.',
    initials: 'AM',
    accent: 'sage',
    services: [
      { id: 'ana-terapia', name: 'Terapia individual', description: 'Sessão de escuta e acompanhamento psicológico.', durationMinutes: 50, price: 180 },
      { id: 'ana-inicial', name: 'Primeira conversa', description: 'Encontro inicial para entender sua necessidade.', durationMinutes: 60, price: 210 },
    ],
    availability: [
      ...slots('ana-moura', '2026-10-06', ['09:00', '11:30', '16:00']),
      ...slots('ana-moura', '2026-10-07', ['10:00', '14:30']),
      ...slots('ana-moura', '2026-10-09', ['09:30', '15:00', '17:30']),
    ],
  },
  {
    id: 'caio-ribeiro',
    name: 'Dr. Caio Ribeiro',
    role: 'Fisioterapeuta',
    specialty: 'Fisioterapia',
    bio: 'Movimento sem pressa: avaliação individual e plano de cuidado para voltar à sua rotina.',
    initials: 'CR',
    accent: 'clay',
    services: [
      { id: 'caio-avaliacao', name: 'Avaliação funcional', description: 'Mapeamento de movimentos, dores e objetivos.', durationMinutes: 60, price: 160 },
      { id: 'caio-sessao', name: 'Sessão de fisioterapia', description: 'Prática guiada para recuperar confiança no movimento.', durationMinutes: 50, price: 140 },
    ],
    availability: [
      ...slots('caio-ribeiro', '2026-10-06', ['08:30', '13:00', '17:00']),
      ...slots('caio-ribeiro', '2026-10-08', ['09:00', '11:00', '15:30']),
      ...slots('caio-ribeiro', '2026-10-10', ['10:30', '14:00']),
    ],
  },
  {
    id: 'luiza-prado',
    name: 'Dra. Luiza Prado',
    role: 'Nutricionista',
    specialty: 'Nutrição',
    bio: 'Nutrição possível para a vida real, com planos que respeitam seu tempo e sua história.',
    initials: 'LP',
    accent: 'ochre',
    services: [
      { id: 'luiza-consulta', name: 'Consulta nutricional', description: 'Conversa completa sobre rotina, preferências e objetivos.', durationMinutes: 60, price: 190 },
      { id: 'luiza-retorno', name: 'Retorno nutricional', description: 'Revisão do caminho e ajustes para a próxima etapa.', durationMinutes: 40, price: 130 },
    ],
    availability: [
      ...slots('luiza-prado', '2026-10-07', ['08:00', '12:00', '16:30']),
      ...slots('luiza-prado', '2026-10-09', ['09:00', '13:30']),
      ...slots('luiza-prado', '2026-10-11', ['10:00', '11:30']),
    ],
  },
  {
    id: 'marina-alves',
    name: 'Dra. Marina Alves',
    role: 'Dermatologista',
    specialty: 'Dermatologia',
    bio: 'Cuidado dermatológico atento, com planos claros para a saúde e o conforto da sua pele.',
    initials: 'MA',
    accent: 'sage',
    services: [
      { id: 'marina-consulta', name: 'Consulta dermatológica', description: 'Avaliação clínica e orientação personalizada.', durationMinutes: 45, price: 240 },
    ],
    availability: [
      ...slots('marina-alves', '2026-10-06', ['10:00', '14:00']),
      ...slots('marina-alves', '2026-10-08', ['08:30', '13:00', '16:00']),
      ...slots('marina-alves', '2026-10-10', ['09:00', '11:30']),
    ],
  },
]

export const specialties: Array<'Todas' | Professional['specialty']> = [
  'Todas',
  'Psicologia',
  'Nutrição',
  'Fisioterapia',
  'Dermatologia',
]

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })
    .format(new Date(`${date}T12:00:00`))
    .replace('.', '')

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
