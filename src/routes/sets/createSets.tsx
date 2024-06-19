import LoadingButton from '@mui/lab/LoadingButton'
import { Avatar, Grid } from '@mui/material'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { VariantType, useSnackbar } from 'notistack'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getCookie } from 'react-use-cookie'
import { AbilityAutocomplete } from '~/components/setsCreate/AbilityAutocomplete'
import { ItemAutocomplete } from '~/components/setsCreate/ItemAutocomplete'
import { MoveSelector } from '~/components/setsCreate/MoveSelector'
import { NautreAutocomplete } from '~/components/setsCreate/NatureAutocomplete'
import { PokemonAutocomplete } from '~/components/setsCreate/PokemonAutocomplete'
import { StatTable } from '~/components/setsCreate/RealStatsTable'
import { RuleSelector } from '~/components/setsCreate/ruleSelector'
import { StatSlider } from '~/components/setsCreate/StatSlider'
import { TeraTypeAutoComplete } from '~/components/setsCreate/teraTypeAutoComplete'
import { Spinner } from '~/components/Spinner'
import { useMainContext } from '~/context'
import { useAutoCompleteContext } from '~/layouts/sets/context'
import { apiUrl, fetcher, put } from '~/util'
import {
  Item,
  Move,
  Nature,
  PokemonSetCreateType,
  itemsInit,
  movesInit,
  natureInit,
  pokemonInit,
} from './initialize'

interface Stats {
  atk: number
  def: number
  spa: number
  spd: number
  spe: number
}

const statKeys = ['HP', '공격', '방어', '특공', '특방', '스핏']
const statEn: { [key: number]: keyof Stats } = {
  1: 'atk',
  2: 'def',
  3: 'spa',
  4: 'spd',
  5: 'spe',
}
const styles = {
  pokemonAvatar: {
    width: 100,
    height: 100,
    margin: 'auto',
    marginTop: '20px',
  },
}
export const CreateSets: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useMainContext()
  const { data } = useAutoCompleteContext()
  const { enqueueSnackbar } = useSnackbar()

  const [pokemons] = React.useState<PokemonSetCreateType[]>(pokemonInit)
  const [natures] = React.useState<Nature[]>(natureInit)
  const [items] = React.useState<Item[]>(itemsInit)
  const [moves] = React.useState<Move[]>(movesInit)
  const [moveList, setMove] = React.useState<{ label: string; type: string }[]>(
    [{ label: '', type: '' }],
  )
  const [teraTypes] = React.useState<{ label: string; type: string }[]>([
    { label: '노말', type: 'Normal' },
  ])

  const [disabled, setDisabled] = React.useState<boolean>(true)
  const [pokemonDict] = React.useState<string[]>([])
  const [pokemon, setPokemon] = React.useState<string>('미싱노')
  const [item, setItem] = React.useState<string>('')
  const [nature, setNature] = React.useState<string>('')
  const [abilities] = React.useState<[{ label: string }]>([{ label: '' }])
  const [ability, setAbility] = React.useState<string>('')
  const [setsName, setName] = React.useState<string>('')
  const [type, setType] = React.useState<'single' | 'double'>('single')
  const [teratype, setTeraType] = React.useState<string>()

  const [description, setDescription] = React.useState<string>('')
  const [Effort, setEffort] = React.useState<number[]>([0, 0, 0, 0, 0, 0])
  const [Ivs, setIvs] = React.useState<number[]>([31, 31, 31, 31, 31, 31])
  const [realStats, setRealStats] = React.useState<number[]>([0, 0, 0, 0, 0, 0])
  const [waitUpload, setWaitUpload] = React.useState<boolean>(false)
  const [tableRows, setTableRows] = React.useState<
    { label: string; value: number }[]
  >([])

  React.useEffect(() => {
    const token = getCookie('Authorization')
    if (!token) {
      navigate('/auth')
    }
  }, [])

  const handleStat = (index: number, value: number) => {
    if (value > 252) {
      value = 252
    } else if (value < 0) {
      value = 0
    }

    const totalEffort = Effort.reduce((a, b) => a + b)
    if (totalEffort > 508) {
      const over = 508 - totalEffort
      value += over
    }

    setEffort((v) => {
      const updatedEffort = [...v]
      updatedEffort[index] = value
      return updatedEffort
    })
  }

  const handleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = Number(event.target.value)
    handleStat(index, value)
  }

  const handleSlider = (index: number, newValue: number | number[]) => {
    handleStat(index, newValue as number)
  }

  const handleIvBlur = (index: number) => {
    const updatedIvs = [...Ivs]
    if (updatedIvs[index] > 31) {
      updatedIvs[index] = 31
    } else if (updatedIvs[index] < 0) {
      updatedIvs[index] = 0
    }
    setIvs(updatedIvs)
  }

  const handleClickVariant = (variant: VariantType, message: string) => () => {
    enqueueSnackbar(message, { variant })
  }

  const Upload = async () => {
    if (waitUpload) return
    setWaitUpload(true)
    if (!pokemon || !item || !nature || !ability || !teratype) {
      setWaitUpload(false)
      return handleClickVariant('error', '입력되지 않은 항목이 있습니다')()
    }
    if (Effort.reduce((a, b) => a + b) > 508) {
      setWaitUpload(false)
      return handleClickVariant('error', '노력치 총합이 508을 초과합니다')()
    }

    await put(apiUrl('/v1/sets/create'), {
      name: setsName,
      pokemonId: pokemons.find((v) => v.label == pokemon)?.id,
      description: description,
      itemId: items.find((v) => v.label == item)?.id,
      nature: nature,
      ability: ability,
      moves: moveList,
      evs: Effort,
      ivs: Ivs,
      type,
      teratype: teratype,
      author: user?.uid,
    })
      .then(() => {
        handleClickVariant('success', '업로드 완료')()
        navigate('/sample')
      })
      .catch(handleClickVariant('error', '에러가 발생했습니다'))
  }

  React.useEffect(() => {
    if (!data.pokemon) return
    if (pokemons.length > 2) return

    pokemons.pop()
    for (const pokemon of data.pokemon) {
      if (!pokemon.name) continue
      pokemons.push({
        label: pokemon.name,
        id: pokemon.id,
        stats: pokemon.stats,
      })
      pokemonDict.push(pokemon.name)
    }
  }, [data.pokemon])

  React.useEffect(() => {
    if (!data.items) return
    if (items.length > 2) return

    items.pop()
    for (const item of data.items) {
      if (!item.name) continue
      items.push({
        label: item.name,
        id: Number(item.id),
      })
    }
  }, [data.items])

  React.useEffect(() => {
    if (!data.natures) return

    natures.pop()
    for (const nature of data.natures) {
      if (!nature.name) continue
      natures.push({
        label: nature.name,
        name: nature.name,
        correction: nature.correction,
      })
    }
  }, [data.natures])

  React.useEffect(() => {
    if (!data.types) return

    teraTypes.pop()
    for (const type of data.types) {
      if (!type.name) continue
      teraTypes.push({
        label: type.name,
        type: type.en,
      })
    }
  }, [data.types])

  React.useEffect(() => {
    const fetchData = async () => {
      const { pokemon: data } = await fetcher(
        apiUrl(`/v1/autocomplete/pokemon/${pokemon}`),
      )
      if (!data) return

      moves.splice(0, moves.length)
      for (const move of data.moves) {
        if (moves.find((m) => m.label === move.locales.ko)) {
          continue
        } else {
          moves.push({
            label: move.locales.ko,
            type: move.Mtype,
          })
        }
      }
    }
    fetchData().catch(console.error)
  }, [pokemon])

  React.useEffect(() => {
    if (!pokemon || pokemon === '미싱노') return

    const { stats } = pokemons.find((v) => v.label === pokemon) || {}
    const correction =
      natures.find((v) => v.label === nature)?.correction ||
      natureInit[0].correction
    if (!stats) return

    const calculateStat = (
      base: number,
      iv: number,
      effort: number,
      statCorr: number,
      index: number,
    ) => {
      if (index === 0)
        return Math.floor((base * 2 + iv + effort / 4) * 0.5 + 60)
      else
        return Math.floor(((base * 2 + iv + effort / 4) * 0.5 + 5) * statCorr)
    }

    const realStats = Object.keys(stats).map((key, index) => {
      const stat = stats[key as keyof typeof stats]
      if (index === -1) return 0
      return calculateStat(
        stat,
        Ivs[index],
        Effort[index],
        correction[key as keyof typeof correction],
        index,
      )
    })

    setRealStats(realStats)
  }, [pokemon, nature, Ivs, Effort])

  React.useEffect(() => {
    const physicalEndurance =
      item === '진화의휘석'
        ? Math.round((realStats[0] * (realStats[2] * 1.5)) / 0.411)
        : Math.round((realStats[0] * realStats[2]) / 0.411)

    const specialEndurance =
      item === '돌격조끼' || item === '진화의휘석'
        ? Math.round((realStats[0] * (realStats[4] * 1.5)) / 0.411)
        : Math.round((realStats[0] * realStats[4]) / 0.411)

    setTableRows([
      { label: 'hp', value: realStats[0] },
      { label: '공격', value: realStats[1] },
      { label: '방어', value: realStats[2] },
      { label: '특공', value: realStats[3] },
      { label: '특방', value: realStats[4] },
      { label: '스핏', value: realStats[5] },
      { label: '물리내구', value: physicalEndurance },
      { label: '특수내구', value: specialEndurance },
    ])
  }, [realStats, item])

  React.useEffect(() => {
    setDisabled(pokemon === '미싱노' ? true : false)
  }, [pokemon])

  React.useEffect(() => {
    const fetchData = async () => {
      const { abilities: data } = await fetcher(
        apiUrl(`/v1/autocomplete/abilities/${pokemon}`),
      )
      if (!data) return
      abilities.splice(0, abilities.length)
      for (const ability of data) {
        abilities.push({
          label: ability.name,
        })
      }
    }
    if (pokemon === '미싱노') return
    fetchData().catch(console.error)
  }, [pokemon])

  React.useEffect(() => {
    setMove([])
    setAbility('')
  }, [pokemon])

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      {!data.pokemon || !data.items ? (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spinner />
        </Box>
      ) : (
        <Grid container sx={{ width: '450px', m: 3 }}>
          <Grid item xs={12} mb={4}>
            <Typography variant="h5" sx={{ textAlign: 'center' }}>
              샘플 등록하기
            </Typography>
            <RuleSelector type={type} setType={setType} />
            <TextField
              label="샘플 이름"
              value={setsName}
              onChange={(e) => {
                setName(e.target.value)
              }}
              variant="standard"
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={4}>
            <Avatar
              className="pokemonAvatar"
              variant="square"
              sx={styles.pokemonAvatar}
              imgProps={{ crossOrigin: 'anonymous' }}
              src={apiUrl(`/v1/sprites/pokemon/${pokemon}`)}
            />
          </Grid>
          <Grid item xs={8}>
            <PokemonAutocomplete pokemons={pokemons} setPokemon={setPokemon} />
            <ItemAutocomplete items={items} setItem={setItem} />
          </Grid>
          <Grid item xs={6} mt={4}>
            <NautreAutocomplete natures={natures} setNature={setNature} />
          </Grid>
          <Grid item xs={6} mt={4}>
            <AbilityAutocomplete
              abilities={abilities}
              ability={ability}
              setAbility={setAbility}
              disabled={disabled}
            />
          </Grid>
          <MoveSelector
            moves={moves}
            moveList={moveList}
            disabled={disabled}
            setMove={setMove}
          />
          <TeraTypeAutoComplete
            teraTypes={teraTypes}
            setTerastal={setTeraType}
          />
          <Grid item xs={12} mt={4}>
            <TextField
              multiline
              minRows={2}
              maxRows={4}
              value={description}
              sx={{ width: '100%' }}
              inputProps={{ maxLength: 256 }}
              placeholder="샘플 설명을 입력해주세요"
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={2} mt={2} mb={2}>
            항목
          </Grid>
          <Grid item xs={8} sx={{ textAlign: 'center', mt: 2, mb: 2 }}>
            노력치
          </Grid>
          <Grid item xs={2} mt={2} mb={2}>
            개체값
          </Grid>
          {statKeys.map((stat, index) => (
            <StatSlider
              key={index}
              name={stat}
              index={index}
              effort={Effort[index]}
              iv={Ivs[index]}
              onSliderChange={handleSlider}
              onEVInputChange={handleChange}
              onEvBlur={handleStat}
              onIVBlur={handleIvBlur}
              onIVChange={(index, value) => {
                const updatedIvs = [...Ivs]
                updatedIvs[index] = value
                setIvs(updatedIvs)
              }}
              correction={
                natures.find((v) => v.label === nature)?.correction[
                  statEn[index]
                ]
              }
            />
          ))}
          <Grid item xs={12}>
            <StatTable stats={tableRows} />
          </Grid>
          <LoadingButton
            sx={{ mt: 2 }}
            variant="contained"
            onClick={Upload}
            loading={waitUpload}
          >
            샘플 올리기
          </LoadingButton>
        </Grid>
      )}
    </Box>
  )
}
