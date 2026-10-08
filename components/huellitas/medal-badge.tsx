import { Eye, HeartHandshake, House } from 'lucide-react'
import { MEDALS, type MedalId } from '@/lib/huellitas'
import { cn } from '@/lib/utils'

const ICONS: Record<MedalId, typeof Eye> = {
  'ojo-de-halcon': Eye,
  'reencuentro-feliz': HeartHandshake,
  'casa-abierta': House,
}

const STYLES: Record<MedalId, string> = {
  'ojo-de-halcon': 'from-amber-400 to-orange-500',
  'reencuentro-feliz': 'from-orange-400 to-rose-500',
  'casa-abierta': 'from-violet-500 to-fuchsia-500',
}

export function MedalBadge({ id, earned, size = 'sm' }: { id: MedalId; earned: boolean; size?: 'sm' | 'lg' }) {
  const medal = MEDALS.find((m) => m.id === id)!
  const Icon = ICONS[id]
  return (
    <div className={cn('flex items-center gap-2', !earned && 'opacity-40 grayscale')} title={medal.description}>
      <span
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white ring-2 ring-white shadow',
          STYLES[id],
          size === 'lg' ? 'size-12' : 'size-8',
        )}
      >
        <Icon className={size === 'lg' ? 'size-6' : 'size-4'} aria-hidden="true" />
      </span>
      {size === 'lg' && (
        <span className="flex flex-col">
          <span className="font-heading text-sm font-bold">{medal.name}</span>
          <span className="text-xs text-muted-foreground">{earned ? medal.description : 'Bloqueada'}</span>
        </span>
      )}
      <span className="sr-only">
        {medal.name} {earned ? '(ganada)' : '(bloqueada)'}
      </span>
    </div>
  )
}
