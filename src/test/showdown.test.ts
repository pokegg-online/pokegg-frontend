import { describe, expect, it } from 'vitest'
import { getEV, getIV, getShowdownText } from '~/utils/getShowdownText'

describe('ShowDownText Generators', () => {
  it('should replace 31 to V', () => {
    const iv = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 }
    expect(getIV(iv)).toBe('V.V.V.V.V.V')
  })

  it('should replace 30 to U', () => {
    const iv = { hp: 30, atk: 30, def: 30, spa: 30, spd: 30, spe: 30 }
    expect(getIV(iv)).toBe('U.U.U.U.U.U')
  })

  it('should replace 0 to Z', () => {
    const iv = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
    expect(getIV(iv)).toBe('Z.Z.Z.Z.Z.Z')
  })

  it('random IVs', () => {
    const iv = { hp: 31, atk: 30, def: 0, spa: 31, spd: 30, spe: 0 }
    expect(getIV(iv)).toBe('V.U.Z.V.U.Z')
  })

  it('should return 0 EVs', () => {
    const ev = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
    expect(getEV(ev)).toBe('')
  })

  it('should return 252 HP EVs', () => {
    const ev = { hp: 252, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
    expect(getEV(ev)).toBe('H252')
  })

  it('should return 252 HP / 252 Def EVs', () => {
    const ev = { hp: 252, atk: 0, def: 252, spa: 0, spd: 0, spe: 0 }
    expect(getEV(ev)).toBe('HB252')
  })

  it('should return 252 HP / 252 Def / 4 Spe EVs', () => {
    const ev = { hp: 252, atk: 0, def: 252, spa: 0, spd: 0, spe: 4 }
    expect(getEV(ev)).toBe('HB252 S4')
  })

  it('should return Correct Format of Showdown Text', () => {
    const pokemon = {
      pokemon: { name: 'Pikachu' },
      item: { name: 'Light Ball' },
      ability: { name: 'Static' },
      teratype: { name: 'Electric' },
      nature: { name: 'timid' },
      evs: { hp: 252, atk: 0, def: 0, spa: 0, spd: 0, spe: 252 },
      ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
      moves: [
        { name: 'Thunderbolt' },
        { name: 'Volt Switch' },
        { name: 'Nuzzle' },
        { name: 'Protect' },
      ],
    }
    const expected = `Pikachu @ Light Ball\nAbility: Static\nTera Type: Electric \nEVs: 252 hp / 252 spe\nTimid Nature\nIVs: \n- Thunderbolt\n- Volt Switch\n- Nuzzle\n- Protect`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(getShowdownText(pokemon as any)).toBe(expected)
  })
})
