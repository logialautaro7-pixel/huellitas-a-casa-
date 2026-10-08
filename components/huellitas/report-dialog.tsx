'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Camera, LocateFixed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { REPORT_META, type ReportType, type Species } from '@/lib/huellitas'
import { readImageAsDataUrl } from '@/lib/read-image'
import type { useHuellitas } from '@/lib/use-huellitas'

const LocationPicker = dynamic(() => import('./location-picker'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-muted" />,
})

const TITLES: Record<ReportType, { title: string; description: string }> = {
  perdido: { title: 'Perdí a mi mascota', description: 'Contale al barrio cómo es y dónde la viste por última vez.' },
  encontrado: { title: 'Encontré una mascota', description: 'Avisá dónde la encontraste para que su familia la ubique.' },
  adopcion: { title: 'Dar en adopción', description: 'Publicá a la mascota que busca una casa con amor.' },
}

const SPECIES: { value: Species; label: string }[] = [
  { value: 'perro', label: 'Perro' },
  { value: 'gato', label: 'Gato' },
  { value: 'otro', label: 'Otro' },
]

export function ReportDialog({
  type,
  onOpenChange,
  addReport,
}: {
  type: ReportType | null
  onOpenChange: (open: boolean) => void
  addReport: ReturnType<typeof useHuellitas>['addReport']
}) {
  const [species, setSpecies] = useState<Species>('perro')
  const [position, setPosition] = useState<[number, number] | null>(null)
  const [locationError, setLocationError] = useState(false)
  const [photo, setPhoto] = useState<string>()
  const [locating, setLocating] = useState(false)

  const reset = () => {
    setSpecies('perro')
    setPosition(null)
    setLocationError(false)
    setPhoto(undefined)
  }

  const pick = (pos: [number, number]) => {
    setPosition(pos)
    setLocationError(false)
  }

  const locate = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (p) => {
        pick([p.coords.latitude, p.coords.longitude])
        setLocating(false)
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!type) return
    if (!position) {
      setLocationError(true)
      document.getElementById('report-location')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    const form = new FormData(e.currentTarget)
    addReport({
      type,
      species,
      petName: String(form.get('petName') || '').trim().slice(0, 40) || 'Sin nombre',
      description: String(form.get('description') || '').trim().slice(0, 400),
      place: String(form.get('place') || '').trim().slice(0, 80) || 'La Tablada',
      lat: position[0],
      lng: position[1],
      photo,
    })
    reset()
    onOpenChange(false)
  }

  const meta = type ? REPORT_META[type] : null

  return (
    <Dialog
      open={type !== null}
      onOpenChange={(open) => {
        if (!open) reset()
        onOpenChange(open)
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
        {type && meta && (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-xl" style={{ color: meta.color }}>
                {TITLES[type].title}
              </DialogTitle>
              <DialogDescription>{TITLES[type].description}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-sm font-medium">Especie</legend>
                <div className="flex gap-2">
                  {SPECIES.map((s) => (
                    <button
                      type="button"
                      key={s.value}
                      onClick={() => setSpecies(s.value)}
                      aria-pressed={species === s.value}
                      className="flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="flex flex-col gap-2">
                <Label htmlFor="petName">Nombre {type === 'encontrado' && '(si lo sabés)'}</Label>
                <Input id="petName" name="petName" maxLength={40} placeholder="Ej: Toby" required={type !== 'encontrado'} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  maxLength={400}
                  placeholder="Color, tamaño, collar, señas particulares..."
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="place">Calle o referencia</Label>
                <Input id="place" name="place" maxLength={80} placeholder="Ej: Av. Crovara y Venezuela" />
              </div>
              <div id="report-location" className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">
                    Ubicación <span className="text-destructive">*</span>
                  </span>
                  <Button type="button" variant="outline" size="sm" onClick={locate} disabled={locating}>
                    <LocateFixed />
                    {locating ? 'Buscando...' : 'Mi ubicación'}
                  </Button>
                </div>
                <div
                  className={`isolate h-44 overflow-hidden rounded-lg border-2 ${locationError ? 'border-destructive' : position ? 'border-transparent' : 'border-dashed border-primary/50'}`}
                >
                  <LocationPicker position={position} type={type} onPick={pick} />
                </div>
                {locationError ? (
                  <p role="alert" className="text-sm font-semibold text-destructive">
                    Tocá el mapa para poner la ubicación
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {position ? 'Pin puesto. Tocá otro lugar para moverlo.' : 'Tocá el mapa para marcar el lugar.'}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="photo">Foto</Label>
                <label
                  htmlFor="photo"
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed p-3 text-sm text-muted-foreground hover:bg-muted"
                >
                  {photo ? (
                    <img src={photo} alt="Vista previa" className="size-14 rounded-md object-cover" />
                  ) : (
                    <Camera className="size-6 text-secondary" />
                  )}
                  {photo ? 'Cambiar foto' : 'Subir una foto de la mascota'}
                </label>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) setPhoto(await readImageAsDataUrl(file))
                  }}
                />
              </div>
              <Button
                type="submit"
                className="h-11 text-base font-bold text-white"
                style={{ backgroundColor: meta.color }}
              >
                Publicar aviso
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
