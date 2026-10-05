import { beforeEach, describe, expect, it } from 'vitest'
import { useFavoritesStore } from './favoritesStore'

describe('useFavoritesStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useFavoritesStore.setState({ ids: [] })
  })

  it('adiciona, remove, alterna e limpa favoritos', () => {
    const store = useFavoritesStore.getState()

    store.add('ana-moura')
    expect(useFavoritesStore.getState().isFavorite('ana-moura')).toBe(true)

    store.toggle('ana-moura')
    expect(useFavoritesStore.getState().isFavorite('ana-moura')).toBe(false)

    store.toggle('caio-ribeiro')
    store.remove('caio-ribeiro')
    store.add('luiza-prado')
    store.clear()
    expect(useFavoritesStore.getState().ids).toEqual([])
  })

  it('restaura favoritos persistidos após reidratação', async () => {
    localStorage.setItem(
      'clinica-viva-favorites',
      JSON.stringify({ state: { ids: ['marina-alves'] }, version: 0 }),
    )

    await useFavoritesStore.persist.rehydrate()
    expect(useFavoritesStore.getState().ids).toEqual(['marina-alves'])
  })
})
