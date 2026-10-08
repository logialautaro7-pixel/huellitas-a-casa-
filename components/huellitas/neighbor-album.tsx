'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CURRENT_NEIGHBOR_ID, MEDALS, medalsFor, type Neighbor, type Report } from '@/lib/huellitas'
import { readImageAsDataUrl } from '@/lib/read-image'
import type { useHuellitas } from '@/lib/use-huellitas'
import { MedalBadge } from './medal-badge'

export function NeighborAlbum({
  neighbors,
  reports,
  addPet,
}: {
  neighbors: Neighbor[]
  reports: Report[]
  addPet: ReturnType<typeof useHuellitas>['addPet']
}) {
  const [open, setOpen] = useState(false)
  const [photo, setPhoto] = useState<string>()
  const me = neighbors.find((n) => n.id === CURRENT_NEIGHBOR_ID)
  const myMedals = me ? medalsFor(me, reports) : []

  return (
    <section aria-labelledby="album-title" className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-2">
        <h2 id="album-title" className="font-heading text-2xl font-bold text-secondary">
          Álbum de vecinos
        </h2>
        <Button size="sm" onClick={() => setOpen(true)} className="font-bold">
          <Plus />
          Sumar mi mascota
        </Button>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 p-4">
        <h3 className="mb-3 font-heading text-lg font-bold">Tus medallas</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {MEDALS.map((m) => (
            <MedalBadge key={m.id} id={m.id} earned={myMedals.includes(m.id)} size="lg" />
          ))}
        </div>
      </div>

      <ul className="flex flex-col gap-4">
        {neighbors
          .filter((n) => n.pets.length > 0 || n.id === CURRENT_NEIGHBOR_ID)
          .map((n) => {
            const earned = medalsFor(n, reports)
            return (
              <li key={n.id} className="rounded-2xl border bg-card p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-full bg-secondary font-heading font-bold text-secondary-foreground">
                      {n.name.charAt(0)}
                    </span>
                    <div>
                      <p className="font-heading font-bold leading-tight">{n.name}</p>
                      <p className="text-xs text-muted-foreground">{n.street}</p>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    {MEDALS.filter((m) => earned.includes(m.id)).map((m) => (
                      <MedalBadge key={m.id} id={m.id} earned />
                    ))}
                  </div>
                </div>
                {n.pets.length === 0 ? (
                  <p className="rounded-xl bg-muted p-4 text-center text-sm text-muted-foreground">
                    Todavía no sumaste mascotas a tu álbum.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {n.pets.map((p) => (
                      <figure key={p.id} className="overflow-hidden rounded-xl bg-muted">
                        <img src={p.photo} alt={`${p.name}, ${p.species}`} className="aspect-square w-full object-cover" />
                        <figcaption className="p-2">
                          <span className="block font-heading text-sm font-bold">{p.name}</span>
                          <span className="block text-xs text-muted-foreground">{p.note}</span>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                )}
              </li>
            )
          })}
      </ul>

      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o)
          if (!o) setPhoto(undefined)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-secondary">Sumar mascota al álbum</DialogTitle>
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (!photo) return
              const form = new FormData(e.currentTarget)
              addPet({
                name: String(form.get('name') || '').trim().slice(0, 30) || 'Mi mascota',
                species: 'otro',
                note: String(form.get('note') || '').trim().slice(0, 80),
                photo,
              })
              setPhoto(undefined)
              setOpen(false)
            }}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="pet-name">Nombre</Label>
              <Input id="pet-name" name="name" maxLength={30} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pet-note">Una frase</Label>
              <Input id="pet-note" name="note" maxLength={80} placeholder="Ej: Le encanta la plaza" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pet-photo">Foto</Label>
              <Input
                id="pet-photo"
                type="file"
                accept="image/*"
                required
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) setPhoto(await readImageAsDataUrl(file))
                }}
              />
              {photo && <img src={photo} alt="Vista previa" className="h-32 w-32 rounded-xl object-cover" />}
            </div>
            <Button type="submit" className="h-10 font-bold" disabled={!photo}>
              Guardar en el álbum
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
