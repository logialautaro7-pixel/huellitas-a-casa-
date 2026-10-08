'use client'

import useSWR from 'swr'
import {
  CURRENT_NEIGHBOR_ID,
  SEED_NEIGHBORS,
  SEED_REPORTS,
  type Neighbor,
  type Pet,
  type Report,
} from './huellitas'

const STORAGE_KEY = 'huellitas-a-casa:v1'

type State = { reports: Report[]; neighbors: Neighbor[] }

function load(): State {
  if (typeof window === 'undefined') return { reports: SEED_REPORTS, neighbors: SEED_NEIGHBORS }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as State
  } catch {}
  return { reports: SEED_REPORTS, neighbors: SEED_NEIGHBORS }
}

function save(state: State) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

export function useHuellitas() {
  const { data, mutate } = useSWR<State>(STORAGE_KEY, load, {
    fallbackData: { reports: SEED_REPORTS, neighbors: SEED_NEIGHBORS },
    revalidateOnFocus: false,
  })
  const state = data!

  const update = (fn: (s: State) => State) => {
    const next = fn(state)
    save(next)
    mutate(next, { revalidate: false })
  }

  const addReport = (report: Omit<Report, 'id' | 'createdAt' | 'neighborId'>) =>
    update((s) => ({
      ...s,
      reports: [
        {
          ...report,
          id: crypto.randomUUID(),
          neighborId: CURRENT_NEIGHBOR_ID,
          createdAt: new Date().toISOString(),
        },
        ...s.reports,
      ],
    }))

  const resolveReport = (id: string) =>
    update((s) => {
      const report = s.reports.find((r) => r.id === id)
      return {
        reports: s.reports.map((r) => (r.id === id ? { ...r, resolved: true } : r)),
        neighbors: s.neighbors.map((n) =>
          report && n.id === report.neighborId ? { ...n, reunions: n.reunions + 1 } : n,
        ),
      }
    })

  const updateReport = (id: string, patch: Partial<Pick<Report, 'petName' | 'lat' | 'lng'>>) =>
    update((s) => ({
      ...s,
      reports: s.reports.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }))

  const addPet = (pet: Omit<Pet, 'id'>) =>
    update((s) => ({
      ...s,
      neighbors: s.neighbors.map((n) =>
        n.id === CURRENT_NEIGHBOR_ID ? { ...n, pets: [{ ...pet, id: crypto.randomUUID() }, ...n.pets] } : n,
      ),
    }))

  return { ...state, addReport, resolveReport, updateReport, addPet }
}
