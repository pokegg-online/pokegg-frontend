import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import React from 'react'

interface Props {
  abilities: { label: string }[]
  ability: string
  setAbility: (ability: string) => void
  disabled: boolean
}

export const AbilityAutocomplete: React.FC<Props> = ({
  abilities,
  ability,
  setAbility,
  disabled,
}) => {
  return (
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
          helperText={ability || disabled ? '' : '* 올바른 특성을 선택해주세요'}
        />
      )}
      onChange={(e, v) => {
        if (!v) return
        setAbility(v.label)
      }}
    />
  )
}
