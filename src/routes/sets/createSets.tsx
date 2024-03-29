import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import React from 'react'
import {
  Autocomplete,
  Avatar,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Input,
  Paper,
  Radio,
  RadioGroup,
  Slider,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
} from '@mui/material'
import Chip from '@mui/material/Chip'
import LoadingButton from '@mui/lab/LoadingButton'
import { useAutoCompleteContext } from '~/layouts/sets/context'
import { apiUrl, fetcher, put } from '~/util'
import { Spinner } from '~/components/Spinner'
import { VariantType, useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import { useMainContext } from '~/context'
import { getCookie } from 'react-use-cookie'

export const CreateSets: React.FC = () => {
  const navigate = useNavigate()
  const { data } = useAutoCompleteContext()

  const { user } = useMainContext()

  React.useEffect(() => {
    const token = getCookie('Authorization')
    if (!token) {
      navigate('/auth')
    }
  }, [])

  const [pokemons] = React.useState<
    [
      {
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
    ]
  >([
    {
      label: '',
      id: 0,
      stats: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    },
  ])
  const [items] = React.useState<[{ label: string; id: number }]>([
    { label: '', id: 0 },
  ])
  const [natures] = React.useState<
    [
      {
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
    ]
  >([
    {
      label: '',
      name: '',
      correction: { atk: 1, def: 1, spa: 1, spd: 1, spe: 1 },
    },
  ])

  const [moves] = React.useState<[{ label: string; type: string }]>([
    { label: '쪼리핑펀치', type: 'Normal' },
  ])

  const [moveList, setMove] = React.useState<{ label: string; type: string }[]>(
    [{ label: '', type: '' }]
  )
  const [teraTypes] = React.useState<{ label: string; type: string }[]>([
    { label: '노말', type: 'Normal' },
  ])

  const [disabled, setDisabled] = React.useState<boolean>(true)
  const [pokemonDict] = React.useState<string[]>([])
  const [abilities] = React.useState<[{ label: string }]>([{ label: '' }])
  const [pokemon, setPokemon] = React.useState<string>('미싱노')
  const [item, setItem] = React.useState<string>('')
  const [nature, setNature] = React.useState<string>('')
  const [ability, setAbility] = React.useState<string>('')
  const [setsName, setName] = React.useState<string>('')
  const [Effort, setEffort] = React.useState<number[]>([0, 0, 0, 0, 0, 0])
  const [Ivs, setIvs] = React.useState<number[]>([31, 31, 31, 31, 31, 31])
  const [type, setType] = React.useState<'single' | 'double'>('single')
  const [teratype, setTeraType] = React.useState<string>()
  const [waitUpload, setWaitUpload] = React.useState<boolean>(false)
  const [description, setDescription] = React.useState<string>('')

  const [realStats, setRealStats] = React.useState<number[]>([0, 0, 0, 0, 0, 0])
  const [tableRows, setTableRows] = React.useState<
    { label: string; value: number }[]
  >([])

  const statKeys = ['HP', '공격', '방어', '특공', '특방', '스핏']

  const { enqueueSnackbar } = useSnackbar()

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
    event: React.ChangeEvent<HTMLInputElement>
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
    if (
      !pokemon ||
      !item ||
      !nature ||
      !ability ||
      moves[0].label == '쪼리핑펀치' ||
      !teratype
    ) {
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
        apiUrl(`/v1/autocomplete/pokemon/${pokemon}`)
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
    const correction = natures.find((v) => v.label === nature)?.correction || {
      atk: 1,
      def: 1,
      spa: 1,
      spd: 1,
      spe: 1,
    }

    if (!stats) return

    const calculateStat = (
      base: number,
      iv: number,
      effort: number,
      statCorr: number,
      index: number
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
        index
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
        apiUrl(`/v1/autocomplete/abilities/${pokemon}`)
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
            {/*[{(종족값 * 2) + 개체값 + (노력치/4)} * 1/2 ] + 10 + 50(레벨)*/}
            <Typography variant="h5" sx={{ textAlign: 'center' }}>
              샘플 등록하기
            </Typography>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                샘플 유형
              </FormLabel>
              <RadioGroup
                row
                value={type}
                onChange={(e) => {
                  setType(e.target.value as 'single' | 'double')
                }}
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value="single"
                  control={<Radio />}
                  label="싱글"
                />
                <FormControlLabel
                  value="double"
                  control={<Radio />}
                  label="더블"
                />
              </RadioGroup>
            </FormControl>
            <TextField
              id="standard-basic"
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
              variant="square"
              sx={{
                width: 100,
                height: 100,
                margin: 'auto',
                marginTop: '20px',
              }}
              imgProps={{ crossOrigin: 'anonymous' }}
              src={apiUrl(`/v1/sprites/pokemon/${pokemon}`)}
            />
          </Grid>
          <Grid item xs={8}>
            <Autocomplete
              id="pokemons"
              options={pokemons}
              sx={{ width: '100%' }}
              renderInput={(params) => (
                <TextField
                  sx={{ '& > p': { color: 'red' } }}
                  label="포켓몬"
                  {...params}
                  helperText={
                    pokemon !== '미싱노' ? '' : '* 올바른 포켓몬을 선택해주세요'
                  }
                />
              )}
              onChange={(e, v) => {
                if (!v) return
                setPokemon(v.label)
              }}
            />
            <Autocomplete
              id="items"
              options={items}
              sx={{ width: '100%', marginTop: '20px' }}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                  {...props}
                >
                  <img
                    crossOrigin="anonymous"
                    loading="lazy"
                    width="30"
                    src={apiUrl(`/v1/sprites/items/${option.label}`)}
                  />
                  {option.label}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  sx={{ '& > p': { color: 'red' } }}
                  label="지닌물건"
                  {...params}
                  helperText={item ? '' : '* 올바른 지닌물건을 선택해주세요'}
                />
              )}
              onChange={(e, v) => {
                if (!v) return
                setItem(v.label)
              }}
            />
          </Grid>
          <Grid item xs={6} mt={4}>
            <Autocomplete
              id="natures"
              options={natures}
              sx={{ width: '100%' }}
              renderInput={(params) => (
                <TextField
                  sx={{ '& > p': { color: 'red' } }}
                  label="성격"
                  {...params}
                  helperText={nature ? '' : '* 올바른 성격을 선택해주세요'}
                />
              )}
              onChange={(e, v) => {
                if (!v) return
                setNature(v.name)
              }}
            />
          </Grid>
          <Grid item xs={6} mt={4}>
            <Autocomplete
              id="ability"
              disabled={disabled}
              options={abilities}
              value={{ label: ability }}
              sx={{ width: '100%' }}
              renderInput={(params) => (
                <TextField
                  sx={{ '& > p': { color: 'red' } }}
                  label="특성"
                  {...params}
                  helperText={
                    ability || disabled ? '' : '* 올바른 특성을 선택해주세요'
                  }
                />
              )}
              onChange={(e, v) => {
                if (!v) return
                setAbility(v.label)
              }}
            />
          </Grid>
          <Autocomplete
            multiple
            id="moves"
            options={moves}
            value={moveList}
            disabled={disabled}
            sx={{ width: '100%', marginTop: '20px' }}
            getOptionDisabled={() => (moveList.length > 3 ? true : false)}
            renderOption={(props, option) => (
              <Box
                component="li"
                sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                {...props}
              >
                <img
                  crossOrigin="anonymous"
                  loading="lazy"
                  width="25"
                  src={apiUrl(`/v1/sprites/types/${option.type}.svg`)}
                />
                {option.label}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                sx={{ '& > p': { color: 'red' } }}
                label="기술"
                {...params}
                helperText={
                  moves[0].label !== '쪼리핑펀치' || disabled
                    ? ''
                    : '* 올바른 기술을 선택해주세요'
                }
              />
            )}
            renderTags={(
              value: readonly { label: string; type: string }[],
              getTagProps
            ) =>
              value.map(
                (option: { label: string; type: string }, index: number) => (
                  // eslint-disable-next-line react/jsx-key
                  <Chip
                    sx={{
                      marginBottom: '2px',
                      marginLeft: '2px',
                      width: '47%',
                    }}
                    label={option.label}
                    variant="outlined"
                    avatar={
                      <Avatar
                        sx={{ width: 20 }}
                        imgProps={{ crossOrigin: 'anonymous' }}
                        src={apiUrl(`/v1/sprites/types/${option.type}.svg`)}
                      />
                    }
                    {...getTagProps({ index })}
                  />
                )
              )
            }
            onChange={(e, v) => {
              if (!v) return
              setMove(v)
            }}
          />
          <Autocomplete
            id="teraTypes"
            options={teraTypes}
            sx={{ width: '100%', marginTop: '20px' }}
            renderOption={(props, option) => (
              <Box
                component="li"
                sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                {...props}
              >
                <img
                  crossOrigin="anonymous"
                  loading="lazy"
                  width="25"
                  src={apiUrl(`/v1/sprites/types/${option.type}.svg`)}
                />
                {option.label}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                sx={{ '& > p': { color: 'red' } }}
                label="테라스탈 타입"
                {...params}
                helperText={
                  teratype ? '' : '* 올바른 테라스탈 타입을 선택해주세요'
                }
              />
            )}
            onChange={(e, v) => {
              if (!v) return
              setTeraType(v.type)
            }}
          />
          <Grid item xs={12} mt={4}>
            <TextField
              placeholder="샘플 설명을 입력해주세요"
              multiline
              rows={2}
              maxRows={10}
              inputProps={{ maxLength: 256 }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ width: '100%' }}
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
            <React.Fragment key={index}>
              <Grid item xs={1}>
                {stat}
              </Grid>
              <Grid item xs={7} sx={{ paddingLeft: '15px' }}>
                <Slider
                  value={typeof Effort[index] === 'number' ? Effort[index] : 0}
                  onBlur={() => handleStat(index, Effort[index])}
                  onChange={(_, newValue) => handleSlider(index, newValue)}
                  step={4}
                  marks
                  min={0}
                  max={252}
                  aria-labelledby="input-slider"
                />
              </Grid>
              <Grid item xs={3} sx={{ marginLeft: '20px' }}>
                <Input
                  size="small"
                  onBlur={() => handleStat(index, Effort[index])}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(index, event)
                  }
                  value={Effort[index]}
                  inputProps={{
                    step: 4,
                    min: 0,
                    max: 252,
                    type: 'number',
                    'aria-labelledby': 'input-slider',
                  }}
                />
                <Input
                  sx={{ marginLeft: '10px' }}
                  size="small"
                  value={Ivs[index]}
                  onBlur={() => handleIvBlur(index)}
                  onChange={(e) => {
                    const updatedIvs = [...Ivs]
                    updatedIvs[index] = Number(e.target.value)
                    setIvs(updatedIvs)
                  }}
                  inputProps={{
                    step: 1,
                    min: 0,
                    max: 31,
                    type: 'number',
                    'aria-labelledby': 'input-slider',
                  }}
                />
              </Grid>
            </React.Fragment>
          ))}
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table sx={{ width: '100%' }} aria-label="simple table">
                <TableBody>
                  {tableRows.map((row, index) =>
                    index % 2 === 0 ? (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {row.label}
                        </TableCell>
                        <TableCell align="right">{row.value}</TableCell>
                        {index + 1 < tableRows.length && (
                          <React.Fragment>
                            <TableCell component="th" scope="row">
                              {tableRows[index + 1].label}
                            </TableCell>
                            <TableCell align="right">
                              {tableRows[index + 1].value}
                            </TableCell>
                          </React.Fragment>
                        )}
                      </TableRow>
                    ) : null
                  )}
                </TableBody>
              </Table>
            </TableContainer>
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
