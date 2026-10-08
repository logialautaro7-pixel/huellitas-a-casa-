'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { LA_TABLADA_CENTER, type ReportType } from '@/lib/huellitas'
import { pinIcon } from './pin-icon'

function ClickHandler({ onPick }: { onPick: (pos: [number, number]) => void }) {
  useMapEvents({ click: (e) => onPick([e.latlng.lat, e.latlng.lng]) })
  return null
}

function Recenter({ position }: { position: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.panTo(position)
  }, [map, position])
  return null
}

export default function LocationPicker({
  position,
  type,
  onPick,
}: {
  position: [number, number] | null
  type: ReportType
  onPick: (pos: [number, number]) => void
}) {
  return (
    <MapContainer
      center={position ?? LA_TABLADA_CENTER}
      zoom={15}
      className="h-full w-full cursor-crosshair"
      aria-label="Elegí la ubicación en el mapa"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {position && (
        <>
          <Marker position={position} icon={pinIcon(type)} />
          <Recenter position={position} />
        </>
      )}
      <ClickHandler onPick={onPick} />
    </MapContainer>
  )
}
