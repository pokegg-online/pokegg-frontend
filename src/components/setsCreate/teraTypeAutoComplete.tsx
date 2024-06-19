import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import React from 'react'
import { apiUrl } from '~/util'

interface TerastalTypeSelectProps {
  teraTypes: { label: string; type: string }[]
  // eslint-disable-next-line no-unused-vars
  setTerastal: (type: string) => void
}

export const TeraTypeAutoComplete: React.FC<TerastalTypeSelectProps> = ({
  teraTypes,
  setTerastal,
}) => {
  const [teraType, setTeraType] = React.useState<string | null>(null)
  const handleChange = (
    value: {
      label: string
      type: string
    } | null,
  ) => {
    if (!value) {
      setTeraType(null)
    } else {
      setTeraType(value.type)
      setTerastal(value.type)
    }
  }
  return (
    <Autocomplete
      id="teraTypes"
      options={teraTypes}
      sx={{ width: '100%', marginTop: '20px' }}
      renderOption={(props, option) => (
        <Box
          {...props}
          key={option.type}
          component="li"
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
        >
          <img
            crossOrigin="anonymous"
            loading="lazy"
            width="30"
            src={apiUrl(`/v1/sprites/teraTypes/${option.type}.png`)}
          />
          {option.label}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          sx={{ '& > p': { color: 'red' } }}
          label="테라스탈 타입"
          {...params}
          helperText={teraType ? '' : '* 올바른 테라스탈 타입을 선택해주세요'}
        />
      )}
      onChange={(_, v) => handleChange(v)}
    />
  )
}
