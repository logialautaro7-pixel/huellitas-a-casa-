export const WHATSAPP_NUMBER = '5491100000000'

export const LA_TABLADA_CENTER: [number, number] = [-34.6889, -58.5281]

/** Av. Crovara y Lambaré, La Tablada: fallback for reports saved without coordinates. */
export const DEFAULT_REPORT_POSITION: [number, number] = [-34.693, -58.537]

export function reportPosition(r: Pick<Report, 'lat' | 'lng'>): [number, number] {
  const lat = Number(r.lat)
  const lng = Number(r.lng)
  return r.lat != null && r.lng != null && Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0)
    ? [lat, lng]
    : DEFAULT_REPORT_POSITION
}

export type ReportType = 'perdido' | 'encontrado' | 'adopcion'
export type Species = 'perro' | 'gato' | 'otro'

export type Report = {
  id: string
  type: ReportType
  petName: string
  species: Species
  description: string
  place: string
  lat?: number | null
  lng?: number | null
  neighborId: string
  photo?: string
  resolved?: boolean
  createdAt: string
}

export type Pet = {
  id: string
  name: string
  species: Species
  photo: string
  note: string
}

export type Neighbor = {
  id: string
  name: string
  street: string
  pets: Pet[]
  reunions: number
}

export const REPORT_META: Record<
  ReportType,
  { label: string; action: string; color: string; pinClass: string; badgeClass: string }
> = {
  perdido: {
    label: 'Perdido',
    action: 'PERDÍ',
    color: '#dc2626',
    pinClass: 'bg-[#dc2626]',
    badgeClass: 'bg-red-100 text-red-700',
  },
  encontrado: {
    label: 'Encontrado',
    action: 'ENCONTRÉ',
    color: '#16a34a',
    pinClass: 'bg-[#16a34a]',
    badgeClass: 'bg-green-100 text-green-700',
  },
  adopcion: {
    label: 'En adopción',
    action: 'ADOPCIÓN',
    color: '#7c3aed',
    pinClass: 'bg-[#7c3aed]',
    badgeClass: 'bg-violet-100 text-violet-700',
  },
}

export const CURRENT_NEIGHBOR_ID = 'vos'

export const MEDALS = [
  {
    id: 'ojo-de-halcon',
    name: 'Ojo de Halcón',
    description: 'Avisaste que encontraste una mascota en la calle.',
  },
  {
    id: 'reencuentro-feliz',
    name: 'Reencuentro Feliz',
    description: 'Ayudaste a que una mascota vuelva a su casa.',
  },
  {
    id: 'casa-abierta',
    name: 'Casa Abierta',
    description: 'Publicaste o diste en adopción a una mascota.',
  },
] as const

export type MedalId = (typeof MEDALS)[number]['id']

export function medalsFor(neighbor: Neighbor, reports: Report[]): MedalId[] {
  const mine = reports.filter((r) => r.neighborId === neighbor.id)
  const earned: MedalId[] = []
  if (mine.some((r) => r.type === 'encontrado')) earned.push('ojo-de-halcon')
  if (neighbor.reunions > 0 || mine.some((r) => r.resolved && r.type !== 'adopcion'))
    earned.push('reencuentro-feliz')
  if (mine.some((r) => r.type === 'adopcion')) earned.push('casa-abierta')
  return earned
}

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString()

export const SEED_NEIGHBORS: Neighbor[] = [
  {
    id: CURRENT_NEIGHBOR_ID,
    name: 'Vos',
    street: 'La Tablada',
    pets: [],
    reunions: 0,
  },
  {
    id: 'marta',
    name: 'Marta G.',
    street: 'Av. Crovara',
    reunions: 2,
    pets: [
      { id: 'p1', name: 'Canela', species: 'perro', photo: '/pets/perro-1.png', note: 'Volvió a casa gracias al barrio.' },
      { id: 'p2', name: 'Michi', species: 'gato', photo: '/pets/gato-2.png', note: 'Dueño del sillón.' },
    ],
  },
  {
    id: 'julian',
    name: 'Julián R.',
    street: 'Calle Venezuela',
    reunions: 0,
    pets: [{ id: 'p3', name: 'Simón', species: 'gato', photo: '/pets/gato-1.png', note: 'Adoptado en el barrio.' }],
  },
  {
    id: 'sofia',
    name: 'Sofía L.',
    street: 'Av. San Martín',
    reunions: 1,
    pets: [{ id: 'p4', name: 'Luna', species: 'perro', photo: '/pets/perro-2.png', note: 'Rescatada, busca familia.' }],
  },
]

export const SEED_REPORTS: Report[] = [
  {
    id: 'r1',
    type: 'perdido',
    petName: 'Toby',
    species: 'perro',
    description: 'Caramelo, collar rojo, muy cariñoso. Responde a su nombre.',
    place: 'Av. Crovara y Ruta 4',
    lat: -34.6862,
    lng: -58.5321,
    neighborId: 'marta',
    photo: '/pets/perro-1.png',
    createdAt: daysAgo(1),
  },
  {
    id: 'r2',
    type: 'encontrado',
    petName: 'Sin nombre',
    species: 'gato',
    description: 'Gato naranja atigrado, apareció en la vereda. Está en mi casa a resguardo.',
    place: 'Calle Venezuela al 3200',
    lat: -34.6915,
    lng: -58.5242,
    neighborId: 'julian',
    photo: '/pets/gato-1.png',
    createdAt: daysAgo(2),
  },
  {
    id: 'r3',
    type: 'adopcion',
    petName: 'Luna',
    species: 'perro',
    description: 'Cachorra de 3 meses, vacunada y desparasitada. Busca familia responsable.',
    place: 'Cerca de la estación La Tablada',
    lat: -34.6898,
    lng: -58.5296,
    neighborId: 'sofia',
    photo: '/pets/perro-2.png',
    createdAt: daysAgo(3),
  },
  {
    id: 'r4',
    type: 'perdido',
    petName: 'Nube',
    species: 'gato',
    description: 'Gris y blanca, ojos verdes, salió por la ventana.',
    place: 'Av. San Martín y Crovara',
    lat: -34.6935,
    lng: -58.5335,
    neighborId: 'sofia',
    photo: '/pets/gato-2.png',
    createdAt: daysAgo(4),
  },
]
