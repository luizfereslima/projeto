import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface FavoritesState {
  ids: string[]
  add: (id: string) => void
  remove: (id: string) => void
  toggle: (id: string) => void
  clear: () => void
  isFavorite: (id: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id) => set((state) => (state.ids.includes(id) ? state : { ids: [...state.ids, id] })),
      remove: (id) => set((state) => ({ ids: state.ids.filter((favoriteId) => favoriteId !== id) })),
      toggle: (id) => (get().isFavorite(id) ? get().remove(id) : get().add(id)),
      clear: () => set({ ids: [] }),
      isFavorite: (id) => get().ids.includes(id),
    }),
    { name: 'clinica-viva-favorites', storage: createJSONStorage(() => localStorage) },
  ),
)
