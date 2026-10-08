'use client'

import { useState } from 'react'
import { MapPin, MessageCircle, PartyPopper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CURRENT_NEIGHBOR_ID, REPORT_META, whatsappLink, type Neighbor, type Report, type ReportType } from '@/lib/huellitas'

const FILTERS: { value: ReportType | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'perdido', label: 'Perdidos' },
  { value: 'encontrado', label: 'Encontrados' },
  { value: 'adopcion', label: 'Adopción' },
]

const timeAgo = (iso: string) => {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days <= 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  return `Hace ${days} días`
}

export function ReportList({
  reports,
  neighbors,
  onResolve,
  onSelect,
}: {
  reports: Report[]
  neighbors: Neighbor[]
  onResolve: (id: string) => void
  onSelect: (id: string) => void
}) {
  const [filter, setFilter] = useState<ReportType | 'todos'>('todos')
  const visible = filter === 'todos' ? reports : reports.filter((r) => r.type === filter)

  return (
    <section aria-labelledby="avisos-title" className="flex flex-col gap-4">
      <h2 id="avisos-title" className="font-heading text-2xl font-bold text-secondary">
        Avisos del barrio
      </h2>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Filtrar avisos">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
            className="shrink-0 rounded-full border border-secondary/30 px-4 py-1.5 text-sm font-semibold text-secondary transition-colors aria-pressed:bg-secondary aria-pressed:text-secondary-foreground"
          >
            {f.label}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="rounded-xl bg-muted p-6 text-center text-muted-foreground">No hay avisos en esta categoría.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {visible.map((r) => {
            const meta = REPORT_META[r.type]
            const author = neighbors.find((n) => n.id === r.neighborId)
            const isMine = r.neighborId === CURRENT_NEIGHBOR_ID
            return (
              <li
                key={r.id}
                className="relative flex gap-3 rounded-2xl border bg-card p-3 shadow-sm transition-colors has-[[data-card-trigger]:hover]:border-primary/60 has-[[data-card-trigger]:focus-visible]:ring-2 has-[[data-card-trigger]:focus-visible]:ring-ring"
              >
                <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                  {r.photo ? (
                    <img src={r.photo} alt={r.petName} className="size-full object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center text-xs text-muted-foreground">Sin foto</div>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${r.resolved ? 'bg-muted text-muted-foreground' : meta.badgeClass}`}>
                      {r.resolved ? 'En casa' : meta.label}
                    </span>
                    <span className="text-xs text-muted-foreground">{timeAgo(r.createdAt)}</span>
                  </div>
                  <h3 className="truncate font-heading text-lg font-bold leading-tight">
                    <button
                      type="button"
                      data-card-trigger
                      onClick={() => onSelect(r.id)}
                      className="text-left outline-none after:absolute after:inset-0 after:rounded-2xl after:content-['']"
                    >
                      {r.petName}
                      <span className="sr-only">: ver detalle</span>
                    </button>
                  </h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{r.description}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" aria-hidden="true" />
                    <span className="truncate">{r.place}</span>
                    {author && <span className="truncate">{' · '}{author.name}</span>}
                  </p>
                  <div className="relative z-10 mt-1 flex flex-wrap gap-2">
                    <a
                      href={whatsappLink(`Hola! Te escribo por ${r.petName} (${meta.label}) en ${r.place}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-7 items-center gap-1 rounded-md bg-[#25D366] px-2.5 text-xs font-bold text-white"
                    >
                      <MessageCircle className="size-3.5" aria-hidden="true" />
                      WhatsApp
                    </a>
                    {isMine && !r.resolved && r.type !== 'adopcion' && (
                      <Button size="sm" variant="outline" onClick={() => onResolve(r.id)}>
                        <PartyPopper />
                        ¡Volvió a casa!
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
