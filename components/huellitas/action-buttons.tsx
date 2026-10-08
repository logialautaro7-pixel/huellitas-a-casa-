import { HeartCrack, HeartHandshake, PawPrint } from 'lucide-react'
import type { ReportType } from '@/lib/huellitas'

const ACTIONS = [
  { type: 'perdido' as const, label: 'PERDÍ', hint: 'Mi mascota', Icon: HeartCrack, className: 'bg-[#dc2626]' },
  { type: 'encontrado' as const, label: 'ENCONTRÉ', hint: 'Una mascota', Icon: HeartHandshake, className: 'bg-[#16a34a]' },
  { type: 'adopcion' as const, label: 'ADOPCIÓN', hint: 'Dar o adoptar', Icon: PawPrint, className: 'bg-[#7c3aed]' },
]

export function ActionButtons({ onSelect }: { onSelect: (type: ReportType) => void }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {ACTIONS.map(({ type, label, hint, Icon, className }) => (
        <button
          key={type}
          type="button"
          onClick={() => onSelect(type)}
          className={`${className} flex flex-col items-center gap-1 rounded-2xl px-2 py-4 text-white shadow-md transition-transform hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-ring/50 focus-visible:outline-none active:translate-y-0`}
        >
          <Icon className="size-8" aria-hidden="true" />
          <span className="font-heading text-base font-bold tracking-wide sm:text-lg">{label}</span>
          <span className="text-[11px] leading-tight opacity-90">{hint}</span>
        </button>
      ))}
    </div>
  )
}
