import { HeartCrack, HeartHandshake, PawPrint, Gift } from 'lucide-react'
import type { ReportType } from '@/lib/huellitas'

const ACTIONS = [
  { type: 'perdido' as const, label: 'PERDÍ', sublabel: 'Mi mascota', Icon: HeartCrack, className: 'bg-red-500 hover:bg-red-600' },
  { type: 'encontrado' as const, label: 'ENCONTRÉ', sublabel: 'Una mascota', Icon: HeartHandshake, className: 'bg-emerald-500 hover:bg-emerald-600' },
  { type: 'adopcion' as const, label: 'ADOPCIÓN', sublabel: 'Dar en adopción', Icon: PawPrint, className: 'bg-violet-500 hover:bg-violet-600' },
  { type: 'donacion' as const, label: 'DONACIÓN', sublabel: 'Donar / Ayuda', Icon: Gift, className: 'bg-orange-500 hover:bg-orange-600' },
]

export function ActionButtons({ onSelect }: { onSelect: (type: ReportType) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {ACTIONS.map(({ type, label, sublabel, Icon, className }) => (
        <button key={type} type="button" onClick={() => onSelect(type)} className={`${className} flex flex-col items-center justify-center gap-1 rounded-2xl p-4 text-white shadow-md transition-all active:scale-95`}>
          <Icon className="size-8" aria-hidden />
          <span className="font-heading text-sm font-bold tracking-wide">{label}</span>
          <span className="text-[11px] opacity-90">{sublabel}</span>
        </button>
      ))}
    </div>
  )
}
