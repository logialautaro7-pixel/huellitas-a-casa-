'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { MapPin, MessageCircle, PartyPopper, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  CURRENT_NEIGHBOR_ID,
  REPORT_META,
  reportPosition,
  whatsappLink,
  type Neighbor,
  type Report,
} from '@/lib/huellitas'
import type { useHuellitas } from '@/lib/use-huellitas'

const LocationPicker = dynamic(() => import('./location-picker'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-muted" />,
})

type Actions = Pick<ReturnType<typeof useHuellitas>, 'updateReport' | 'resolveReport'>

export function ReportDetailDialog({
  report,
  neighbors,
  onOpenChange,
  updateReport,
  resolveReport,
}: {
  report: Report | undefined
  neighbors: Neighbor[]
  onOpenChange: (open: boolean) => void
} & Actions) {
  return (
    <Dialog open={!!report} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
        {report && (
          <DetailContent
            key={report.id}
            report={report}
            author={neighbors.find((n) => n.id === report.neighborId)}
            updateReport={updateReport}
            resolveReport={resolveReport}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function DetailContent({
  report,
  author,
  updateReport,
  resolveReport,
}: { report: Report; author?: Neighbor } & Actions) {
  const meta = REPORT_META[report.type]
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(report.petName)
  const [position, setPosition] = useState<[number, number]>(reportPosition(report))
  const isMine = report.neighborId === CURRENT_NEIGHBOR_ID

  const startEditing = () => {
    setName(report.petName)
    setPosition(reportPosition(report))
    setEditing(true)
  }

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    updateReport(report.id, {
      petName: name.trim().slice(0, 40) || 'Sin nombre',
      lat: position[0],
      lng: position[1],
    })
    setEditing(false)
  }

  if (editing) {
    return (
      <>
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-secondary">Editar aviso</DialogTitle>
          <DialogDescription>Cambiá el nombre o tocá el mapa para mover el pin.</DialogDescription>
        </DialogHeader>
        <form onSubmit={save} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-name">Nombre</Label>
            <Input id="edit-name" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Ubicación</span>
            <div className="isolate h-52 overflow-hidden rounded-lg border">
              <LocationPicker position={position} type={report.type} onPick={setPosition} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 font-bold">
              Guardar
            </Button>
          </div>
        </form>
      </>
    )
  }

  return (
    <>
      <DialogHeader>
        <span
          className={`w-fit rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${report.resolved ? 'bg-muted text-muted-foreground' : meta.badgeClass}`}
        >
          {report.resolved ? 'En casa' : meta.label}
        </span>
        <DialogTitle className="font-heading text-2xl">{report.petName}</DialogTitle>
        <DialogDescription className="flex items-center gap-1">
          <MapPin className="size-3.5" aria-hidden="true" />
          {report.place}
          {author && ` · ${author.name}`}
        </DialogDescription>
      </DialogHeader>
      {report.photo && (
        <img src={report.photo} alt={report.petName} className="aspect-[4/3] w-full rounded-xl object-cover" />
      )}
      <p className="text-pretty text-sm leading-relaxed">{report.description}</p>
      <div className="isolate h-40 overflow-hidden rounded-lg border">
        <LocationPicker position={reportPosition(report)} type={report.type} onPick={() => {}} />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={startEditing} className="flex-1 font-bold">
          <Pencil />
          EDITAR
        </Button>
        <a
          href={whatsappLink(`Hola! Te escribo por ${report.petName} (${meta.label}) en ${report.place}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md bg-[#25D366] px-3 text-sm font-bold text-white"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          WhatsApp
        </a>
        {isMine && !report.resolved && report.type !== 'adopcion' && (
          <Button variant="secondary" className="w-full" onClick={() => resolveReport(report.id)}>
            <PartyPopper />
            ¡Volvió a casa!
          </Button>
        )}
      </div>
    </>
  )
}
