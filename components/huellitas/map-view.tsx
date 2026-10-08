'use client'

import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { LA_TABLADA_CENTER, REPORT_META, reportPosition, whatsappLink, type Report } from '@/lib/huellitas'
import { pinIcon } from './pin-icon'

export default function MapView({ reports, onSelect }: { reports: Report[]; onSelect: (id: string) => void }) {
  return (
    <MapContainer
      center={LA_TABLADA_CENTER}
      zoom={15}
      scrollWheelZoom={false}
      className="h-full w-full"
      aria-label="Mapa de mascotas en La Tablada"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {reports.map((r) => (
        <Marker key={r.id} position={reportPosition(r)} icon={pinIcon(r.type, r.resolved)}>
          <Popup>
            <div className="flex w-52 flex-col gap-2 font-sans">
              {r.photo && (
                <img src={r.photo} alt={r.petName} className="h-28 w-full rounded-md object-cover" />
              )}
              <div>
                <p className="m-0! text-xs font-bold uppercase" style={{ color: REPORT_META[r.type].color }}>
                  {r.resolved ? 'Volvió a casa' : REPORT_META[r.type].label}
                </p>
                <p className="m-0! text-base font-bold text-foreground">{r.petName}</p>
                <p className="m-0! text-xs text-muted-foreground">{r.place}</p>
              </div>
              <button
                type="button"
                onClick={() => onSelect(r.id)}
                className="rounded-md bg-secondary px-3 py-1.5 text-center text-xs font-bold text-secondary-foreground"
              >
                Ver detalle
              </button>
              <a
                href={whatsappLink(`Hola! Te escribo por ${r.petName} (${REPORT_META[r.type].label}) en ${r.place}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-[#25D366] px-3 py-1.5 text-center text-xs font-bold text-white! no-underline"
              >
                Escribir por WhatsApp
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
