'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { BookHeart, Heart, List, Map as MapIcon, MessageCircle, PawPrint } from 'lucide-react'
import { REPORT_META, whatsappLink, type ReportType } from '@/lib/huellitas'
import { useHuellitas } from '@/lib/use-huellitas'
import { ActionButtons } from './action-buttons'
import { InstallButton } from './install-button'
import { NeighborAlbum } from './neighbor-album'
import { ReportDetailDialog } from './report-detail-dialog'
import { ReportDialog } from './report-dialog'
import { ReportList } from './report-list'

const MapView = dynamic(() => import('./map-view'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-muted" />,
})

type Tab = 'mapa' | 'avisos' | 'album'

const TABS: { value: Tab; label: string; Icon: typeof MapIcon }[] = [
  { value: 'mapa', label: 'Mapa', Icon: MapIcon },
  { value: 'avisos', label: 'Avisos', Icon: List },
  { value: 'album', label: 'Álbum', Icon: BookHeart },
]

export function HuellitasApp() {
  const { reports, neighbors, addReport, resolveReport, updateReport, addPet } = useHuellitas()
  const [tab, setTab] = useState<Tab>('mapa')
  const [reporting, setReporting] = useState<ReportType | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = reports.find((r) => r.id === selectedId)

  const active = reports.filter((r) => !r.resolved)

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-20 md:pb-0">
      <header className="bg-gradient-to-r from-primary to-secondary text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <h1 className="flex items-center">
            <img src="/logo.png" alt="Huellitas a Casa" className="size-12 rounded-2xl bg-white p-1 shadow-sm" />
          </h1>
          <div className="flex items-center gap-2">
            <nav aria-label="Secciones" className="hidden gap-1 md:flex">
              {TABS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  aria-current={tab === value ? 'page' : undefined}
                  onClick={() => setTab(value)}
                  className="rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-white/15 aria-[current=page]:bg-white aria-[current=page]:text-secondary"
                >
                  {label}
                </button>
              ))}
            </nav>
            <InstallButton />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-5 px-4 py-5">
        <section aria-label="Publicar aviso" className="flex flex-col gap-3">
          <p className="text-pretty text-sm text-muted-foreground">
            {'Entre vecinos las huellitas vuelven a casa. ¿Qué te pasó?'}
          </p>
          <ActionButtons onSelect={setReporting} />
        </section>

        {tab === 'mapa' && (
          <section aria-labelledby="mapa-title" className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 id="mapa-title" className="font-heading text-2xl font-bold text-secondary">
                Mapa del barrio
              </h2>
              <ul className="flex gap-2" aria-label="Referencias">
                {(Object.keys(REPORT_META) as ReportType[]).map((t) => {
                  const Glyph = t === 'adopcion' ? PawPrint : Heart
                  const count = active.filter((r) => r.type === t).length
                  return (
                    <li
                      key={t}
                      className="flex items-center gap-1.5 rounded-full border bg-card py-1 pr-3 pl-1 shadow-sm"
                      aria-label={`${REPORT_META[t].label}: ${count}`}
                    >
                      <span
                        className={`flex size-7 items-center justify-center rounded-full text-white ${REPORT_META[t].pinClass}`}
                        aria-hidden="true"
                      >
                        <Glyph className="size-4 fill-white" strokeWidth={t === 'adopcion' ? 2 : 0} />
                      </span>
                      <span className="font-heading text-lg font-bold leading-none" style={{ color: REPORT_META[t].color }} aria-hidden="true">
                        {count}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="isolate h-[55dvh] min-h-80 overflow-hidden rounded-2xl border shadow-sm">
              <MapView reports={reports} onSelect={setSelectedId} />
            </div>
          </section>
        )}
        {tab === 'avisos' && (
          <ReportList reports={reports} neighbors={neighbors} onResolve={resolveReport} onSelect={setSelectedId} />
        )}
        {tab === 'album' && <NeighborAlbum neighbors={neighbors} reports={reports} addPet={addPet} />}
      </main>

      <a
        href={whatsappLink('Hola! Te escribo desde Huellitas a Casa - La Tablada.')}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-4 bottom-24 z-[1000] flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 md:bottom-6"
      >
        <MessageCircle className="size-7" aria-hidden="true" />
        <span className="sr-only">Escribir por WhatsApp</span>
      </a>

      <nav
        aria-label="Secciones"
        className="fixed inset-x-0 bottom-0 z-[1000] border-t bg-card pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <ul className="grid grid-cols-3">
          {TABS.map(({ value, label, Icon }) => (
            <li key={value}>
              <button
                type="button"
                aria-current={tab === value ? 'page' : undefined}
                onClick={() => setTab(value)}
                className="flex w-full flex-col items-center gap-0.5 py-2.5 text-xs font-semibold text-muted-foreground aria-[current=page]:text-primary"
              >
                <Icon className="size-5" aria-hidden="true" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <ReportDetailDialog
        report={selected}
        neighbors={neighbors}
        onOpenChange={(o) => !o && setSelectedId(null)}
        updateReport={updateReport}
        resolveReport={resolveReport}
      />
      <ReportDialog type={reporting} onOpenChange={(o) => !o && setReporting(null)} addReport={addReport} />
    </div>
  )
}
