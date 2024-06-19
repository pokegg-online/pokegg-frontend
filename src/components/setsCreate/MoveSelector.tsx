import { Autocomplete, Avatar, Box, Chip, TextField } from '@mui/material'
import React from 'react'
import { wrapError } from '~/components/ErrorBoundary'
import { apiUrl } from '~/util'

interface Props {
  moves: { label: string; type: string }[]
  moveList: { label: string; type: string }[]
  setMove: React.Dispatch<
    React.SetStateAction<{ label: string; type: string }[]>
  >
  disabled: boolean
}

export const MoveSelector: React.FC<Props> = wrapError(
  ({ moves, moveList, setMove, disabled }) => {
    return (
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
          getTagProps,
        ) =>
          value.map(
            (option: { label: string; type: string }, index: number) => (
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
            ),
          )
        }
        onChange={(e, v) => {
          if (!v) return
          setMove(v)
        }}
      />
    )
  },
)
