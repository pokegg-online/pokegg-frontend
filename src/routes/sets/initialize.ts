export interface Nature {
  label: string
  name: string
  correction: {
    atk: number
    def: number
    spa: number
    spd: number
    spe: number
  }
}

export interface PokemonSetCreateType {
  label: string
  id: number
  stats: {
    hp: number
    atk: number
    def: number
    spa: number
    spd: number
    spe: number
  }
}

export interface Item {
  label: string
  id: number
}

export interface Move {
  label: string
  type: string
}

export interface Ability {
  label: string
  name: string
}

export const movesInit = [{ label: '테라버스트', type: 'Normal' }]

export const itemsInit = [
  {
    label: '',
    id: 9999,
  },
]

export const natureInit = [
  {
    label: '',
    name: '',
    correction: { atk: 1, def: 1, spa: 1, spd: 1, spe: 1 },
  },
]

export const pokemonInit = [
  {
    label: '',
    id: 0,
    stats: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  },
]
