import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import React from 'react'
import { apiUrl } from '~/util'

interface Props {
  natures: {
    label: string
    name: string
    correction: { [key: string]: number }
  }[]
  setNature: React.Dispatch<React.SetStateAction<string>>
}

export const NautreAutocomplete: React.FC<Props> = ({ natures, setNature }) => {
  const [nature, setLocalNature] = React.useState('')
  const onChange = (v: { label: string; name: string } | null) => {
    if (!v) return
    setNature(v.name)
    setLocalNature(v.name)
  }

  const correctionType = (correction: { [key: string]: number }) => {
    if (correction.atk > 1) return 'atk'
    if (correction.def > 1) return 'def'
    if (correction.spa > 1) return 'spa'
    if (correction.spd > 1) return 'spd'
    if (correction.spe > 1) return 'spe'
    return 'none'
  }

  return (
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
      renderOption={(props, option) => (
        <Box
          {...props}
          key={option.name}
          component="li"
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
        >
          <img
            crossOrigin="anonymous"
            loading="lazy"
            width="30"
            src={apiUrl(
              `/v1/sprites/natures/${correctionType(option.correction)}.webp`,
            )}
          />
          {option.label}
        </Box>
      )}
      onChange={(_, v) => onChange(v)}
    />
  )
}

// https://api.mikmera.net/v1/sprites/natures/atk.webp
