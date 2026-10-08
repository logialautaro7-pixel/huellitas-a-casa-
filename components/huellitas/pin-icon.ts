import L from 'leaflet'
import { REPORT_META, type ReportType } from '@/lib/huellitas'

const HEART =
  '<path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.7 4.5c2.1 0 3.6 1.1 4.3 2.4.7-1.3 2.2-2.4 4.3-2.4 3.7 0 5.8 3.8 4.3 7.2C19.5 16.4 12 21 12 21z" fill="white"/>'
const PAW =
  '<circle cx="6" cy="9" r="2.2" fill="white"/><circle cx="10" cy="5.5" r="2.2" fill="white"/><circle cx="14.5" cy="5.5" r="2.2" fill="white"/><circle cx="18.5" cy="9" r="2.2" fill="white"/><path d="M12.2 11c-3 0-6.2 4.3-6.2 6.6 0 1.6 1.3 2.4 2.8 2.4 1.4 0 2.1-.8 3.4-.8s2 .8 3.4.8c1.5 0 2.8-.8 2.8-2.4 0-2.3-3.2-6.6-6.2-6.6z" fill="white"/>'

export function pinIcon(type: ReportType, resolved = false) {
  const color = resolved ? '#9ca3af' : REPORT_META[type].color
  const glyph = type === 'adopcion' ? PAW : HEART
  return L.divIcon({
    className: 'huellitas-pin',
    iconSize: [36, 44],
    iconAnchor: [18, 42],
    popupAnchor: [0, -38],
    html: `<div style="position:relative;width:36px;height:44px">
      <div style="width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:3px solid white;box-shadow:0 3px 8px rgba(0,0,0,.3)"></div>
      <svg viewBox="0 0 24 24" width="18" height="18" style="position:absolute;top:9px;left:9px">${glyph}</svg>
    </div>`,
  })
}
