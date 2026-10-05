import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  Clock3,
  Heart,
  Search,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react'
import { formatCurrency, formatDate, professionals, specialties } from './data/mockData'
import { useAppointmentsStore } from './stores/appointmentsStore'
import { useFavoritesStore } from './stores/favoritesStore'
import { buildAppointment, isBookingComplete } from './utils/booking'
import type { Professional, Service } from './types'

type Tab = 'discover' | 'favorites' | 'appointments'

const tabs: Array<{ id: Tab; label: string; icon: typeof Search }> = [
  { id: 'discover', label: 'Explorar', icon: Sparkles },
  { id: 'favorites', label: 'Favoritos', icon: Heart },
  { id: 'appointments', label: 'Agenda', icon: CalendarDays },
]

function FavoriteButton({ professionalId }: { professionalId: string }) {
  const isFavorite = useFavoritesStore((state) => state.isFavorite(professionalId))
  const toggle = useFavoritesStore((state) => state.toggle)
  const [isPulsing, setIsPulsing] = useState(false)

  const handleClick = () => {
    toggle(professionalId)
    setIsPulsing(true)
    window.setTimeout(() => setIsPulsing(false), 460)
  }

  return (
    <button
      className={`favorite-button ${isFavorite ? 'is-active' : ''} ${isPulsing ? 'is-pulsing' : ''}`}
      type="button"
      aria-label={isFavorite ? 'Remover profissional dos favoritos' : 'Adicionar profissional aos favoritos'}
      aria-pressed={isFavorite}
      onClick={handleClick}
    >
      <Heart size={19} strokeWidth={1.8} fill={isFavorite ? 'currentColor' : 'none'} />
    </button>
  )
}

function ProfessionalAvatar({ professional, large = false }: { professional: Professional; large?: boolean }) {
  return <div className={`professional-avatar avatar-${professional.accent} ${large ? 'avatar-large' : ''}`}>{professional.initials}</div>
}

function ProfessionalCard({ professional, onDetails, onBook }: { professional: Professional; onDetails: () => void; onBook: () => void }) {
  return (
    <article className="professional-card">
      <div className="card-topline">
        <span className="specialty-tag">{professional.specialty}</span>
        <FavoriteButton professionalId={professional.id} />
      </div>
      <button className="professional-summary" type="button" onClick={onDetails}>
        <ProfessionalAvatar professional={professional} />
        <span className="professional-copy">
          <strong>{professional.name}</strong>
          <span>{professional.role}</span>
        </span>
        <ArrowRight className="card-arrow" size={18} />
      </button>
      <p>{professional.bio}</p>
      <div className="card-footer">
        <span><Clock3 size={15} /> A partir de {professional.services[0].durationMinutes} min</span>
        <button className="text-button" type="button" onClick={onBook}>Agendar <ArrowRight size={15} /></button>
      </div>
    </article>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('discover')
  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState<(typeof specialties)[number]>('Todas')
  const [selectedProfessional, setSelectedProfessional] = useState<Professional>()
  const [bookingProfessional, setBookingProfessional] = useState<Professional>()
  const [bookingServiceId, setBookingServiceId] = useState('')
  const [bookingDate, setBookingDate] = useState('')
  const [bookingTime, setBookingTime] = useState('')
  const [toast, setToast] = useState('')
  const favoriteIds = useFavoritesStore((state) => state.ids)
  const appointments = useAppointmentsStore((state) => state.appointments)
  const addAppointment = useAppointmentsStore((state) => state.addAppointment)

  const visibleProfessionals = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR')
    return professionals.filter((professional) => {
      const matchesSpecialty = specialty === 'Todas' || professional.specialty === specialty
      const matchesSearch = !normalizedSearch || [professional.name, professional.role, professional.specialty]
        .some((value) => value.toLocaleLowerCase('pt-BR').includes(normalizedSearch))
      return matchesSpecialty && matchesSearch
    })
  }, [search, specialty])

  const favoriteProfessionals = professionals.filter((professional) => favoriteIds.includes(professional.id))
  const bookingService = bookingProfessional?.services.find((service) => service.id === bookingServiceId)
  const bookingDates = bookingProfessional
    ? [...new Set(bookingProfessional.availability.map((slot) => slot.date))]
    : []
  const bookingTimes = bookingProfessional?.availability.filter((slot) => slot.date === bookingDate).map((slot) => slot.time) ?? []

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedProfessional(undefined)
        setBookingProfessional(undefined)
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  const openBooking = (professional: Professional, service?: Service) => {
    setSelectedProfessional(undefined)
    setBookingProfessional(professional)
    setBookingServiceId(service?.id ?? professional.services[0].id)
    setBookingDate('')
    setBookingTime('')
  }

  const closeBooking = () => {
    setBookingProfessional(undefined)
    setBookingServiceId('')
    setBookingDate('')
    setBookingTime('')
  }

  const handleConfirmBooking = () => {
    if (!bookingProfessional || !bookingService || !isBookingComplete(bookingProfessional, bookingService, bookingDate, bookingTime)) return
    addAppointment(buildAppointment({ professional: bookingProfessional, service: bookingService, date: bookingDate, time: bookingTime }))
    closeBooking()
    setActiveTab('appointments')
    setToast('Agendamento confirmado e salvo nesta agenda.')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" onClick={() => setActiveTab('discover')} aria-label="Clínica Viva, início">
          <span className="brand-mark"><Heart size={18} fill="currentColor" /></span>
          <span>Clínica <em>Viva</em></span>
        </a>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {tabs.map((tab) => <TabButton key={tab.id} tab={tab} activeTab={activeTab} onSelect={setActiveTab} />)}
        </nav>
        <div className="profile-chip"><span>LF</span><UserRound size={16} /></div>
      </header>

      <main id="top">
        {activeTab === 'discover' && (
          <>
            <section className="hero-section">
              <div className="hero-copy">
                <span className="eyebrow"><span className="eyebrow-dot" /> Seu cuidado começa aqui</span>
                <h1>Um jeito mais <i>leve</i> de cuidar de você.</h1>
                <p>Encontre profissionais que escutam, acolhem e caminham ao seu lado.</p>
              </div>
              <div className="hero-art" aria-hidden="true"><div className="sun-disc" /><div className="leaf leaf-one" /><div className="leaf leaf-two" /><div className="hero-stamp">cuidado<br /><strong>com presença</strong></div></div>
            </section>
            <section className="catalog-section" aria-labelledby="catalog-title">
              <div className="section-heading">
                <div><span className="eyebrow">Para hoje</span><h2 id="catalog-title">Encontre seu cuidado</h2></div>
                <span className="result-count">{visibleProfessionals.length} profissionais</span>
              </div>
              <div className="filters-row">
                <label className="search-field"><Search size={18} /><span className="sr-only">Buscar profissional</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome ou especialidade" /></label>
                <div className="specialty-filters" aria-label="Filtrar por especialidade">
                  {specialties.map((item) => <button key={item} className={specialty === item ? 'is-selected' : ''} type="button" onClick={() => setSpecialty(item)}>{item}</button>)}
                </div>
              </div>
              <div className="professionals-grid">
                {visibleProfessionals.map((professional) => <ProfessionalCard key={professional.id} professional={professional} onDetails={() => setSelectedProfessional(professional)} onBook={() => openBooking(professional)} />)}
              </div>
              {visibleProfessionals.length === 0 && <div className="empty-state"><Search size={30} /><h3>Nenhum profissional encontrado</h3><p>Tente outro nome ou escolha uma especialidade.</p></div>}
            </section>
          </>
        )}

        {activeTab === 'favorites' && <CollectionView title="Seus favoritos" description="Profissionais que você quer ter por perto." professionals={favoriteProfessionals} emptyTitle="Ainda não há favoritos" emptyDescription="Toque no coração de um profissional para guardar aqui." onBack={() => setActiveTab('discover')} onDetails={setSelectedProfessional} onBook={openBooking} />}
        {activeTab === 'appointments' && <AppointmentsView appointments={appointments} onExplore={() => setActiveTab('discover')} />}
      </main>

      <nav className="mobile-nav" aria-label="Navegação mobile">
        {tabs.map((tab) => <TabButton key={tab.id} tab={tab} activeTab={activeTab} onSelect={setActiveTab} />)}
      </nav>

      {selectedProfessional && <ProfessionalModal professional={selectedProfessional} onClose={() => setSelectedProfessional(undefined)} onBook={(service) => openBooking(selectedProfessional, service)} />}
      {bookingProfessional && <BookingModal professional={bookingProfessional} serviceId={bookingServiceId} setServiceId={setBookingServiceId} date={bookingDate} setDate={(date) => { setBookingDate(date); setBookingTime('') }} time={bookingTime} setTime={setBookingTime} dates={bookingDates} times={bookingTimes} onClose={closeBooking} onConfirm={handleConfirmBooking} />}
      {toast && <div className="toast" role="status"><span className="toast-icon"><Check size={16} /></span>{toast}</div>}
    </div>
  )
}

function TabButton({ tab, activeTab, onSelect }: { tab: typeof tabs[number]; activeTab: Tab; onSelect: (tab: Tab) => void }) {
  const Icon = tab.icon
  return <button className={`nav-button ${activeTab === tab.id ? 'is-active' : ''}`} type="button" onClick={() => onSelect(tab.id)}><Icon size={18} /><span>{tab.label}</span></button>
}

function CollectionView({ title, description, professionals: items, emptyTitle, emptyDescription, onBack, onDetails, onBook }: { title: string; description: string; professionals: Professional[]; emptyTitle: string; emptyDescription: string; onBack: () => void; onDetails: (professional: Professional) => void; onBook: (professional: Professional) => void }) {
  return <section className="collection-section"><button className="back-link" type="button" onClick={onBack}><ChevronLeft size={17} /> Explorar profissionais</button><div className="collection-heading"><div><span className="eyebrow">Sua seleção</span><h1>{title}</h1><p>{description}</p></div><span className="collection-number">{items.length.toString().padStart(2, '0')}</span></div>{items.length ? <div className="professionals-grid">{items.map((professional) => <ProfessionalCard key={professional.id} professional={professional} onDetails={() => onDetails(professional)} onBook={() => onBook(professional)} />)}</div> : <div className="empty-state large"><Heart size={30} /><h3>{emptyTitle}</h3><p>{emptyDescription}</p><button className="primary-button" type="button" onClick={onBack}>Encontrar profissionais <ArrowRight size={16} /></button></div>}</section>
}

function AppointmentsView({ appointments, onExplore }: { appointments: ReturnType<typeof useAppointmentsStore.getState>['appointments']; onExplore: () => void }) {
  return <section className="collection-section"><div className="collection-heading"><div><span className="eyebrow">Seu tempo importa</span><h1>Agenda</h1><p>Seus próximos momentos de cuidado, salvos neste dispositivo.</p></div><span className="collection-number">{appointments.length.toString().padStart(2, '0')}</span></div>{appointments.length ? <div className="appointments-list">{appointments.slice().reverse().map((appointment) => <article className="appointment-card" key={appointment.id}><div className="appointment-date"><span>{formatDate(appointment.date).split(' ')[0]}</span><strong>{new Date(`${appointment.date}T12:00:00`).getDate()}</strong><span>{new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(new Date(`${appointment.date}T12:00:00`)).replace('.', '')}</span></div><div className="appointment-info"><span className="specialty-tag">Confirmado</span><h3>{appointment.serviceName}</h3><p>{appointment.professionalName}</p><span className="appointment-meta"><Clock3 size={15} /> {appointment.time} · {appointment.durationMinutes} min</span></div><span className="appointment-price">{formatCurrency(appointment.price)}</span></article>)}</div> : <div className="empty-state large"><CalendarDays size={30} /><h3>Sua agenda está livre</h3><p>Escolha um profissional para reservar seu próximo cuidado.</p><button className="primary-button" type="button" onClick={onExplore}>Explorar profissionais <ArrowRight size={16} /></button></div>}</section>
}

function ModalShell({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose() }}><section className="modal" role="dialog" aria-modal="true" aria-label={title}>{children}</section></div>
}

function ProfessionalModal({ professional, onClose, onBook }: { professional: Professional; onClose: () => void; onBook: (service: Service) => void }) {
  return <ModalShell onClose={onClose} title={`Detalhes de ${professional.name}`}><button className="modal-close" type="button" onClick={onClose} aria-label="Fechar detalhes"><X size={20} /></button><div className="detail-header"><ProfessionalAvatar professional={professional} large /><div><span className="eyebrow">{professional.specialty}</span><h2>{professional.name}</h2><p>{professional.role}</p></div></div><p className="detail-bio">{professional.bio}</p><div className="services-list"><h3>Escolha um cuidado</h3>{professional.services.map((service) => <button className="service-option" type="button" key={service.id} onClick={() => onBook(service)}><span><strong>{service.name}</strong><small>{service.description}</small><small><Clock3 size={14} /> {service.durationMinutes} min</small></span><b>{formatCurrency(service.price)}</b><ArrowRight size={17} /></button>)}</div></ModalShell>
}

function BookingModal({ professional, serviceId, setServiceId, date, setDate, time, setTime, dates, times, onClose, onConfirm }: { professional: Professional; serviceId: string; setServiceId: (id: string) => void; date: string; setDate: (date: string) => void; time: string; setTime: (time: string) => void; dates: string[]; times: string[]; onClose: () => void; onConfirm: () => void }) {
  const selectedService = professional.services.find((service) => service.id === serviceId)
  const complete = isBookingComplete(professional, selectedService, date, time)
  return <ModalShell onClose={onClose} title={`Agendar com ${professional.name}`}><button className="modal-close" type="button" onClick={onClose} aria-label="Fechar agendamento"><X size={20} /></button><div className="booking-heading"><span className="eyebrow">Novo agendamento</span><h2>Reserve seu cuidado</h2><p>Com {professional.name} · {professional.specialty}</p></div><div className="booking-form"><div className="form-block"><label htmlFor="service">1. O que você precisa?</label><select id="service" value={serviceId} onChange={(event) => setServiceId(event.target.value)}>{professional.services.map((service) => <option key={service.id} value={service.id}>{service.name} · {formatCurrency(service.price)}</option>)}</select></div><div className="form-block"><span className="form-label">2. Escolha o dia</span><div className="date-options">{dates.map((item) => <button key={item} type="button" className={date === item ? 'is-selected' : ''} onClick={() => setDate(item)}><strong>{new Date(`${item}T12:00:00`).getDate()}</strong><span>{new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(new Date(`${item}T12:00:00`)).replace('.', '')}</span></button>)}</div></div><div className="form-block"><span className="form-label">3. Escolha o horário</span>{date ? <div className="time-options">{times.map((item) => <button key={item} type="button" className={time === item ? 'is-selected' : ''} onClick={() => setTime(item)}>{item}</button>)}</div> : <p className="field-hint">Selecione um dia para ver os horários disponíveis.</p>}</div></div><div className="booking-summary"><span>{selectedService?.name ?? 'Escolha um serviço'}<small>{date && time ? `${formatDate(date)} · ${time}` : 'Complete as escolhas acima'}</small></span><button className="primary-button" type="button" disabled={!complete} onClick={onConfirm}>Confirmar agendamento <Check size={16} /></button></div></ModalShell>
}

export default App
